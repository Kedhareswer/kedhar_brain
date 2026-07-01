#!/usr/bin/env node
/**
 * neo-core PostToolUse hook: typecheck the file Claude just touched.
 *
 * Runs after every Write or Edit. Reads the hook payload from stdin to find
 * the file path, then:
 *   - If the file is a .ts/.tsx in apps/<name>/ or packages/<name>/, locates
 *     the workspace root via pnpm-workspace.yaml, checks whether the
 *     workspace's package.json declares a "typecheck" script, and if so
 *     runs `pnpm --filter ./apps/<name> typecheck` (path-based filter is
 *     unambiguous — works regardless of whether the workspace's package
 *     name is unscoped or scoped like "@workspace/foo").
 *   - Otherwise (markdown, JSON, config, non-TS, .d.ts/specs/build output,
 *     workspace without a typecheck script), exits 0 silently.
 *
 * Exit codes:
 *   0 = OK (no action needed, OR typecheck passed)
 *   2 = block (typecheck failed) — Claude sees the error and can decide
 *       whether to fix the new code or revert
 *   1 = non-blocking error (hook itself misbehaved) — Claude continues
 *
 * Designed to be conservative: it's a guardrail, not a wall. If the hook
 * can't figure out which workspace owns the file OR the workspace has no
 * typecheck script, it exits 0 rather than blocking for the wrong reason.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const stdinChunks = [];
for await (const chunk of process.stdin) stdinChunks.push(chunk);
const raw = Buffer.concat(stdinChunks).toString("utf8");

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  // No JSON on stdin → nothing to do. Exit 0 quietly.
  process.exit(0);
}

const filePath = payload?.tool_input?.file_path;
if (!filePath || typeof filePath !== "string") {
  process.exit(0);
}

// Only TS/TSX files trigger a typecheck.
if (!/\.(ts|tsx)$/.test(filePath)) {
  process.exit(0);
}

// Skip generated / vendored / build output / specs / type-only declarations.
if (
  filePath.includes("node_modules") ||
  filePath.includes("/dist/") ||
  filePath.includes("/.next/") ||
  filePath.includes("/build/") ||
  /\.(d|spec|test)\.tsx?$/.test(filePath)
) {
  process.exit(0);
}

// Find the apps/<name> or packages/<name> workspace this file belongs to.
const matchApps = filePath.match(/[\\/]apps[\\/]([^\\/]+)[\\/]/);
const matchPackages = filePath.match(/[\\/]packages[\\/]([^\\/]+)[\\/]/);

let workspaceRelativePath = null;
if (matchApps) workspaceRelativePath = `apps/${matchApps[1]}`;
else if (matchPackages) workspaceRelativePath = `packages/${matchPackages[1]}`;

if (!workspaceRelativePath) {
  // Couldn't infer the workspace — bail rather than block for the wrong reason.
  process.exit(0);
}

// Resolve monorepo root by walking up from filePath until we find pnpm-workspace.yaml.
let dir = path.dirname(filePath);
let monorepoRoot = null;
while (dir && dir !== path.dirname(dir)) {
  if (existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
    monorepoRoot = dir;
    break;
  }
  dir = path.dirname(dir);
}

if (!monorepoRoot) {
  // Not in a pnpm monorepo — skip silently.
  process.exit(0);
}

// Verify the workspace has a typecheck script. If not, bail silently — many
// packages (e.g. eslint-config, typescript-config) don't have one.
const workspacePackageJson = path.join(monorepoRoot, workspaceRelativePath, "package.json");
if (!existsSync(workspacePackageJson)) {
  process.exit(0);
}

let pkg;
try {
  pkg = JSON.parse(readFileSync(workspacePackageJson, "utf8"));
} catch {
  process.exit(0);
}

if (!pkg?.scripts?.typecheck) {
  // Workspace has no typecheck script — silent skip.
  process.exit(0);
}

// Run scoped typecheck with a path-based filter (works for unscoped AND scoped
// workspace names). Hard timeout below the hook's 60s budget.
const result = spawnSync(
  "pnpm",
  ["--filter", `./${workspaceRelativePath}`, "typecheck"],
  {
    cwd: monorepoRoot,
    encoding: "utf8",
    timeout: 50_000,
    shell: process.platform === "win32",
  }
);

if (result.status === 0) {
  // Pass: silent success. Don't pollute Claude's context.
  process.exit(0);
}

// Fail: surface a concise error to Claude (stderr or stdout, whichever has the diagnostic).
const diag = (result.stderr || result.stdout || "").trim();
const trimmed = diag.length > 4000 ? diag.slice(0, 4000) + "\n…(truncated)" : diag;

process.stderr.write(
  `Typecheck failed for workspace "${workspaceRelativePath}" after editing ${filePath}.\n` +
    `Run \`pnpm --filter ./${workspaceRelativePath} typecheck\` locally to reproduce.\n\n` +
    `${trimmed}\n`
);
process.exit(2); // 2 = block; Claude sees the error and decides next step.
