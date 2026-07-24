import { spawn } from "node:child_process";
import { watch } from "node:fs";

const projectRoot = process.cwd();
const bun = process.execPath;
const forwardedArgs = process.argv.slice(2);

function run(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: "inherit",
    });
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

const initialBuild = await run(bun, ["run", "build"]);
if (initialBuild !== 0) process.exit(initialBuild);

const wrangler = spawn(
  bun,
  ["x", "wrangler", "pages", "dev", "dist", "--live-reload", ...forwardedArgs],
  {
    cwd: projectRoot,
    stdio: "inherit",
  },
);

let rebuildTimer;
let building = false;
let rebuildQueued = false;
let shuttingDown = false;

async function rebuild() {
  if (building) {
    rebuildQueued = true;
    return;
  }

  building = true;
  rebuildQueued = false;
  console.log("\n偵測到檔案變更，重新建置網站…");
  const code = await run(bun, ["x", "astro", "build"]);
  if (code !== 0) {
    console.error("建置失敗；修正後儲存檔案即可再次嘗試。");
  }
  building = false;

  if (rebuildQueued) scheduleRebuild();
}

function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    void rebuild();
  }, 180);
}

const watchers = [
  watch("src", { recursive: true }, scheduleRebuild),
  watch("public", { recursive: true }, scheduleRebuild),
  watch("astro.config.mjs", scheduleRebuild),
];

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  clearTimeout(rebuildTimer);
  watchers.forEach((watcher) => watcher.close());
  if (!wrangler.killed) wrangler.kill(signal);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

wrangler.once("exit", (code, signal) => {
  watchers.forEach((watcher) => watcher.close());
  if (!shuttingDown) {
    process.exitCode = code ?? (signal ? 1 : 0);
  }
});
