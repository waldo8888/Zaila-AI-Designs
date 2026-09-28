#!/usr/bin/env node
// Load a URL in headless Chrome over the DevTools protocol, wait, run a JS expression
// and optionally save a screenshot. Headless Chrome produces real animation frames,
// unlike a hidden browser pane, so scroll scenes and WebGL behave as they would live.
// Usage: node scripts/cdp.mjs <url> <waitMs> <expression> [screenshot.png] [width] [height]
// Env:
//   MOBILE=1   emulate a phone (touch, device pixel ratio 2) at the given width and height
//   REDUCED=1  emulate prefers-reduced-motion: reduce
//   LOADS=n    load the URL n times in the same tab, so sessionStorage carries over
// Console errors and warnings, and uncaught exceptions, print as they happen.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, waitMs = "5000", expression = "document.title", shotPath, width = "1440", height = "900"] =
  process.argv.slice(2);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), "zaila-cdp-"));

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--remote-allow-origins=*",
  "--no-first-run",
  "--no-default-browser-check",
  "--hide-scrollbars",
  `--user-data-dir=${profile}`,
  `--window-size=${width},${height}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targets() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {}
    await sleep(200);
  }
  throw new Error("Chrome debugging endpoint never came up");
}

function finish(code) {
  try { chrome.kill("SIGKILL"); } catch {}
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
  process.exit(code);
}

try {
  const page = await targets();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let nextId = 1;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method) {
      for (const l of listeners) l(msg);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = nextId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

  listeners.push((m) => {
    if (m.method === "Runtime.consoleAPICalled" && (m.params.type === "error" || m.params.type === "warning")) {
      const text = m.params.args.map((a) => a.value ?? a.description ?? "").join(" ");
      console.log(`console.${m.params.type}: ${text}`);
    } else if (m.method === "Runtime.exceptionThrown") {
      const details = m.params.exceptionDetails;
      console.log(`exception: ${details.exception?.description ?? details.text}`);
    }
  });

  await send("Page.enable");
  await send("Runtime.enable");
  if (process.env.MOBILE === "1") {
    // A real phone viewport (desktop Chrome windows can't go below ~500px wide).
    await send("Emulation.setDeviceMetricsOverride", {
      width: Number(width),
      height: Number(height),
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  }
  if (process.env.REDUCED === "1") {
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
  }
  const loads = Math.max(1, Number(process.env.LOADS ?? 1));
  for (let i = 0; i < loads; i++) {
    const loaded = new Promise((resolve) =>
      listeners.push((m) => { if (m.method === "Page.loadEventFired") resolve(); })
    );
    await send("Page.navigate", { url });
    await Promise.race([loaded, sleep(20000)]);
    await sleep(Number(waitMs));
  }

  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.result?.exceptionDetails) {
    console.log("EXCEPTION:", JSON.stringify(result.result.exceptionDetails.exception?.description ?? result.result.exceptionDetails));
  } else {
    console.log(JSON.stringify(result.result?.result?.value, null, 2));
  }

  if (shotPath) {
    const shot = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(shotPath, Buffer.from(shot.result.data, "base64"));
    console.log("screenshot:", shotPath);
  }
  ws.close();
  finish(0);
} catch (error) {
  console.error(String(error));
  finish(1);
}
