import { readFile, stat, mkdir, writeFile, chmod } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import os from "node:os";
import fastGlob from "fast-glob";
import matter from "gray-matter";
import Fuse from "fuse.js";
import { config } from "./config.js";

/**
 * In-memory snapshot of the vault, refreshed by git-pulling on a schedule.
 *
 * The snapshot is the source of truth for all tool handlers — they never read
 * from disk on the request path, which keeps tool latency predictable and
 * lets us serve hundreds of concurrent reads without spawning processes.
 *
 * Refresh strategy:
 *   - On startup: git pull, then load.
 *   - Every config.vaultPullIntervalMs (default 5 min): git pull, then reload.
 *   - On webhook (Phase 3+ enhancement): pull + reload immediately.
 *
 * Failure mode: if git pull fails (network down, transient auth issue), keep
 * serving the stale snapshot rather than blanking it out. Operator visibility
 * via /healthz which reports lastPullAt and lastPullError.
 */

export interface VaultPage {
  /** Path relative to vault root, with forward slashes. */
  path: string;
  /** Tier this page belongs to. Determines default scope filter. */
  tier: "curated" | "drafts" | "infra";
  /** Full file contents (UTF-8). */
  contents: string;
  /** Parsed frontmatter (empty object if none). */
  frontmatter: Record<string, unknown>;
  /** Body without frontmatter, for search. */
  body: string;
  /** Title from frontmatter or first H1, falls back to filename. */
  title: string;
  /** Last-modified ms from fs (for ranking ties). */
  mtimeMs: number;
}

export interface VaultSnapshot {
  pages: VaultPage[];
  /** Pre-built Fuse indexes per scope so search is cheap. */
  fuseDev: Fuse<VaultPage>;
  fuseAll: Fuse<VaultPage>;
  /** PRD-only Fuse for find_related_prds, two scopes. */
  fusePrdsDev: Fuse<VaultPage>;
  fusePrdsAll: Fuse<VaultPage>;
  /** When this snapshot was loaded. */
  loadedAt: Date;
  /** Last successful git pull (or null if pull was disabled). */
  lastPullAt: Date | null;
  /** Last git-pull error (null if last attempt succeeded). */
  lastPullError: string | null;
}

let current: VaultSnapshot | null = null;

export function getSnapshot(): VaultSnapshot {
  if (!current) {
    throw new Error("Vault snapshot not loaded yet. Call refreshSnapshot() first.");
  }
  return current;
}

function tierOf(relPath: string): VaultPage["tier"] {
  if (relPath === "index.md" || relPath === "log.md" || relPath === "README.md") {
    return "infra";
  }
  if (relPath.startsWith("drafts/")) {
    if (relPath === "drafts/index.md" || relPath === "drafts/log.md") return "infra";
    return "drafts";
  }
  return "curated";
}

function deriveTitle(fm: Record<string, unknown>, body: string, filePath: string): string {
  if (typeof fm["title"] === "string" && fm["title"].trim().length > 0) {
    return fm["title"];
  }
  const h1 = body.match(/^#\s+(.+?)$/m);
  if (h1 && h1[1]) return h1[1].trim();
  return path.basename(filePath, ".md");
}

async function loadPages(): Promise<VaultPage[]> {
  const vaultRoot = path.join(config.vaultPath, "vault");
  if (!existsSync(vaultRoot)) {
    throw new Error(
      `Vault directory not found at ${vaultRoot}. Did the git clone succeed?`
    );
  }
  const globs = config.exposeGlob.split(",").map((g) => g.trim()).filter(Boolean);
  const absPaths = await fastGlob(globs, {
    cwd: vaultRoot,
    absolute: true,
    onlyFiles: true,
    dot: false,
  });

  const pages: VaultPage[] = [];
  for (const abs of absPaths) {
    const rel = path.relative(vaultRoot, abs).split(path.sep).join("/");
    let raw: string;
    let mtime: number;
    try {
      raw = await readFile(abs, "utf8");
      const st = await stat(abs);
      mtime = st.mtimeMs;
    } catch {
      // Race with a git-pull; skip this file rather than crashing the load.
      continue;
    }
    const parsed = matter(raw);
    const fm = (parsed.data ?? {}) as Record<string, unknown>;
    pages.push({
      path: rel,
      tier: tierOf(rel),
      contents: raw,
      frontmatter: fm,
      body: parsed.content,
      title: deriveTitle(fm, parsed.content, rel),
      mtimeMs: mtime,
    });
  }
  return pages;
}

function buildFuse(pages: VaultPage[]): Fuse<VaultPage> {
  return new Fuse(pages, {
    keys: [
      { name: "title", weight: 0.4 },
      { name: "path", weight: 0.2 },
      { name: "body", weight: 0.4 },
    ],
    includeMatches: true,
    includeScore: true,
    threshold: 0.4, // moderately strict — prefer relevant over comprehensive
    minMatchCharLength: 3,
    ignoreLocation: true,
  });
}

/**
 * On first start, write VAULT_DEPLOY_KEY_PEM (if provided) to ~/.ssh/deploy_key,
 * configure ~/.ssh/config so git can use it for github.com, and clone the vault
 * repo into VAULT_PATH. Idempotent — no-op if VAULT_PATH already has a .git
 * directory. Idempotent SSH writes — overwrites the key file each time so
 * key rotations apply on next restart.
 */
async function ensureSshAndClone(): Promise<void> {
  if (existsSync(path.join(config.vaultPath, ".git"))) {
    return; // Already cloned; nothing to do.
  }

  // Set up SSH key if provided. Required for private repos; harmless for public.
  if (config.vaultDeployKeyPem.trim().length > 0) {
    const sshDir = path.join(os.homedir(), ".ssh");
    await mkdir(sshDir, { recursive: true, mode: 0o700 });
    const keyPath = path.join(sshDir, "deploy_key");
    // Trim trailing whitespace and ensure exactly one trailing newline (OpenSSH
    // is picky and rejects keys without a final newline).
    const keyBody = config.vaultDeployKeyPem.replace(/\s+$/, "") + "\n";
    await writeFile(keyPath, keyBody, { mode: 0o600 });
    await chmod(keyPath, 0o600);

    const sshConfigPath = path.join(sshDir, "config");
    const sshConfig =
      `Host github.com\n` +
      `  User git\n` +
      `  IdentityFile ${keyPath}\n` +
      `  IdentitiesOnly yes\n` +
      `  StrictHostKeyChecking no\n`;
    await writeFile(sshConfigPath, sshConfig, { mode: 0o600 });
    await chmod(sshConfigPath, 0o600);
  }

  // Make sure the parent directory of VAULT_PATH exists so git clone can land
  // its target directory inside it.
  await mkdir(path.dirname(config.vaultPath), { recursive: true });

  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      "git",
      ["clone", "--depth", "1", config.vaultRepoUrl, config.vaultPath],
      { stdio: "pipe" }
    );
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (e) =>
      reject(new Error(`Initial git clone failed to spawn: ${e.message}`))
    );
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Initial git clone exited ${code}: ${stderr.trim()}\n` +
              `Tried URL: ${config.vaultRepoUrl}\n` +
              `If this is a private repo, set VAULT_DEPLOY_KEY_PEM env var to the deploy key's full PEM.`
          )
        );
      }
    });
  });
}

async function gitPull(): Promise<void> {
  if (config.vaultPullIntervalMs === 0) return; // disabled
  await ensureSshAndClone();
  await new Promise<void>((resolve, reject) => {
    const child = spawn("git", ["-C", config.vaultPath, "pull", "--ff-only"], {
      stdio: "pipe",
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (e) => reject(new Error(`git pull failed to spawn: ${e.message}`)));
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`git pull exited ${code}: ${stderr.trim()}`));
      }
    });
  });
}

export async function refreshSnapshot(): Promise<VaultSnapshot> {
  let lastPullError: string | null = null;
  let lastPullAt: Date | null = null;
  try {
    await gitPull();
    lastPullAt = new Date();
  } catch (e) {
    lastPullError = (e as Error).message;
    // Fall through and reload from whatever's on disk. Operator sees the error
    // via /healthz; we don't blank the snapshot.
  }
  const pages = await loadPages();
  const devPages = pages.filter((p) => p.tier === "curated" || p.tier === "infra");
  const prdPagesDev = pages.filter(
    (p) => p.tier === "curated" && p.path.startsWith("prds/") && p.path.endsWith("/overview.md")
  );
  const prdPagesAll = pages.filter(
    (p) =>
      (p.tier === "curated" && p.path.startsWith("prds/") && p.path.endsWith("/overview.md")) ||
      (p.tier === "drafts" && p.path.startsWith("drafts/raw-prds/"))
  );

  current = {
    pages,
    fuseDev: buildFuse(devPages),
    fuseAll: buildFuse(pages),
    fusePrdsDev: buildFuse(prdPagesDev),
    fusePrdsAll: buildFuse(prdPagesAll),
    loadedAt: new Date(),
    lastPullAt: lastPullAt ?? current?.lastPullAt ?? null,
    lastPullError,
  };
  return current;
}

export function startScheduledRefresh(): NodeJS.Timeout | null {
  if (config.vaultPullIntervalMs === 0) return null;
  return setInterval(() => {
    refreshSnapshot().catch((e) => {
      // Already captured into current.lastPullError; log here too.
      console.error(`[vault-snapshot] scheduled refresh failed: ${(e as Error).message}`);
    });
  }, config.vaultPullIntervalMs);
}
