import { spawn } from "node:child_process";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const baseUrl = `http://${host}:${port}`;

const checks = [
  { label: "home page", path: "/", text: "app-shell" },
  { label: "CSS bundle", path: "/_next/static/css/app/layout.css", text: ".app-shell" },
  { label: "brand logo", path: "/brand/my-shloka-ritual-logo.png", contentType: "image/png" },
  { label: "Shiva line image", path: "/deities/line/shiva.png", contentType: "image/png" },
  { label: "hero video", path: "/media/sloka-hero.mp4", contentType: "video/mp4" },
];

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const command = process.platform === "win32" ? "cmd.exe" : npmCommand;
const args =
  process.platform === "win32"
    ? ["/d", "/s", "/c", `npm.cmd run dev -- --hostname ${host} --port ${port}`]
    : ["run", "dev", "--", "--hostname", host, "--port", String(port)];

const server = spawn(command, args, {
  stdio: ["ignore", "pipe", "pipe"],
  shell: false,
});

let serverOutput = "";

server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 30000) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      await delay(500);
    }
  }

  throw new Error(`Dev server did not respond at ${baseUrl}.\n\n${serverOutput}`);
}

async function runChecks() {
  await waitForServer();

  for (const check of checks) {
    const response = await fetch(`${baseUrl}${check.path}`);
    if (!response.ok) {
      throw new Error(`${check.label} failed: ${response.status} ${response.statusText} at ${check.path}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (check.contentType && !contentType.includes(check.contentType)) {
      throw new Error(`${check.label} returned ${contentType || "no content-type"}, expected ${check.contentType}.`);
    }

    if (check.text) {
      const body = await response.text();
      if (!body.includes(check.text)) {
        throw new Error(`${check.label} loaded, but did not contain "${check.text}".`);
      }
    }
  }
}

try {
  await runChecks();
  console.log(`Sloka Sabha app check passed at ${baseUrl}`);
  console.log("CSS, images, and video are being served correctly.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  server.kill();
}
