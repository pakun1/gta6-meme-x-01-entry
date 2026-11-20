// gta6-meme-x-01 entry: hand the post's address to the grader.
//
// The entry itself is the X post (the meme lives on X, not here). All this
// program has to do is copy POST.json — the file that names the post — from
// this repository into the output directory, so the house can read it and
// fetch the post from X. Standard library only, no network.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const POST_FILE = "POST.json";

// Where the repository lives: the directory holding this file, unless the
// harness says otherwise.
function repoDir(): string {
  const fromEnv = process.env.MAKEFUN_BOT_DIR;
  if (fromEnv && fromEnv.length > 0) {
    return resolve(fromEnv);
  }
  return dirname(fileURLToPath(import.meta.url));
}

// Where the output goes: the harness's output directory, else /output.
function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.length > 0) {
    return resolve(fromEnv);
  }
  return "/output";
}

function main(): void {
  const source = join(repoDir(), POST_FILE);
  if (!existsSync(source)) {
    throw new Error(`cannot find ${POST_FILE} next to this program: ${source}`);
  }
  const targetDir = outputDir();
  mkdirSync(targetDir, { recursive: true });
  const target = join(targetDir, POST_FILE);
  copyFileSync(source, target);
  // Prove the copy is whole: the house reads POST.json from the output,
  // so a short copy would hand it a broken address.
  const written = readFileSync(target);
  const expected = readFileSync(source);
  if (!written.equals(expected)) {
    throw new Error(`copy of ${POST_FILE} came out short: ${target}`);
  }
  console.log(`wrote ${target} (${written.length} bytes, verified)`);
}

main();
