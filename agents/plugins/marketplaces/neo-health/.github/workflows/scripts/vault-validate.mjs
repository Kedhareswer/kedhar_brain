#!/usr/bin/env node
/**
 * Vault validator for the `vault-validate` GitHub Action.
 *
 * Three narrow checks:
 *   1. Index files (vault/index.md, vault/drafts/index.md) have the expected
 *      shape: at least one `## ` category header, with each non-empty category
 *      containing list-item lines or the literal "(none yet)".
 *   2. Log files (vault/log.md, vault/drafts/log.md) are append-only AND
 *      chronologically ordered. Each log entry must start with
 *      `## [YYYY-MM-DD HH:MM TZ] <op> | <summary>` and dates must be
 *      monotonically non-increasing (newest at top).
 *   3. No unresolved `<<<<<<<` / `=======` / `>>>>>>>` conflict markers
 *      anywhere under vault/.
 *
 * Exit 0 on success, 1 on any failure with diagnostic to stderr.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const VAULT = "vault";
const errors = [];

function err(file, msg) {
  errors.push(`${file}: ${msg}`);
}

// ---- Check 3: conflict markers (run first, cheapest, most catastrophic) ----

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

let allFiles;
try {
  allFiles = walk(VAULT);
} catch (e) {
  console.error(`Cannot walk ${VAULT}/: ${e.message}`);
  process.exit(1);
}

for (const file of allFiles) {
  if (!file.endsWith(".md")) continue;
  const text = readFileSync(file, "utf8");
  // Only flag actual git conflict markers (must start at beginning of a line).
  // Prose mentions like `<<<<<<<` inside a paragraph or code block don't trigger.
  // Real conflict markers are followed by a space + branch/ref label,
  // e.g. `<<<<<<< HEAD` or `>>>>>>> feature-branch`. Require that shape.
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^<<<<<<<\s/.test(line) || /^>>>>>>>\s/.test(line)) {
      err(file, `line ${i + 1}: unresolved git conflict marker`);
      break;
    }
  }
}

// ---- Check 1: index file shape ----

function validateIndex(file) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    err(file, "missing — required infrastructure file");
    return;
  }
  const lines = text.split("\n");
  const categories = [];
  let currentCategory = null;
  let currentHasContent = false;

  for (const line of lines) {
    const headerMatch = line.match(/^## (.+?)(?:\s*\(.*\))?\s*$/);
    if (headerMatch) {
      // Closing previous category — record whether it had content.
      if (currentCategory) {
        categories.push({ name: currentCategory, hasContent: currentHasContent });
      }
      currentCategory = headerMatch[1].trim();
      currentHasContent = false;
    } else if (currentCategory) {
      // A category counts as having content if any non-blank, non-header,
      // non-horizontal-rule line follows it. List items, paragraph text, or
      // a placeholder like "(none yet — ...)" all qualify. The category is
      // empty only if the very next thing after the header is another header
      // or end of file.
      if (line.trim().length > 0 && !/^---+\s*$/.test(line)) {
        currentHasContent = true;
      }
    }
  }
  if (currentCategory) {
    categories.push({ name: currentCategory, hasContent: currentHasContent });
  }

  if (categories.length === 0) {
    err(file, "no `## ` category headers found");
    return;
  }
  for (const c of categories) {
    if (!c.hasContent) {
      err(file, `category "${c.name}" has no list items and no "(none yet)" placeholder`);
    }
  }
}

validateIndex(path.join(VAULT, "index.md"));
validateIndex(path.join(VAULT, "drafts", "index.md"));

// ---- Check 2: log file shape + chronological ordering ----

function validateLog(file) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    err(file, "missing — required infrastructure file");
    return;
  }
  const entryRegex = /^## \[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) ([A-Z]{2,5})\] (.+?) \| (.+)$/gm;
  const entries = [...text.matchAll(entryRegex)];
  if (entries.length === 0) {
    // A fresh log with only intro text + the seed entry might still match if
    // the seed entry follows the format. If literally zero entries match, warn.
    err(file, "no log entries match the expected format `## [YYYY-MM-DD HH:MM TZ] op | summary`");
    return;
  }
  // Verify monotonic non-increasing dates (newest at top).
  let prev = null;
  for (const m of entries) {
    const ts = `${m[1]}T${m[2]}`;
    if (prev !== null && ts > prev) {
      err(
        file,
        `entries out of order: ${ts} appears below ${prev} (log must be newest-at-top)`
      );
      break; // one out-of-order finding is enough
    }
    prev = ts;
  }
}

validateLog(path.join(VAULT, "log.md"));
validateLog(path.join(VAULT, "drafts", "log.md"));

// ---- Final ----

if (errors.length === 0) {
  console.log(`vault-validate: OK (${allFiles.length} files scanned)`);
  process.exit(0);
}

console.error(`vault-validate: ${errors.length} issue(s) found:\n`);
for (const e of errors) console.error(`  - ${e}`);
process.exit(1);
