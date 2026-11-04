#!/usr/bin/env node
// Median Lighthouse metrics across runs, printed as markdown table rows.
// Usage: node scripts/lh-summary.mjs report-1.json report-2.json ...
import { readFileSync } from "node:fs";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: node scripts/lh-summary.mjs <report.json>...");
  process.exit(2);
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const runs = files.map((file) => JSON.parse(readFileSync(file, "utf8")));
const pick = (fn) => median(runs.map(fn));
const metric = (run, id) => run.audits[id]?.numericValue ?? Number.NaN;
const score = (run, id) => Math.round((run.categories[id]?.score ?? Number.NaN) * 100);
const scriptKB = (run) => {
  const items = run.audits["resource-summary"]?.details?.items ?? [];
  const scripts = items.find((item) => item.resourceType === "script");
  return scripts ? scripts.transferSize / 1024 : Number.NaN;
};

const rows = [
  ["Lighthouse version", runs[0].lighthouseVersion],
  ["Runs", String(runs.length)],
  ["Performance", String(pick((r) => score(r, "performance")))],
  ["LCP (s)", (pick((r) => metric(r, "largest-contentful-paint")) / 1000).toFixed(2)],
  ["FCP (s)", (pick((r) => metric(r, "first-contentful-paint")) / 1000).toFixed(2)],
  ["TBT (ms)", pick((r) => metric(r, "total-blocking-time")).toFixed(0)],
  ["CLS", pick((r) => metric(r, "cumulative-layout-shift")).toFixed(3)],
  ["Accessibility", String(pick((r) => score(r, "accessibility")))],
  ["Best practices", String(pick((r) => score(r, "best-practices")))],
  ["SEO", String(pick((r) => score(r, "seo")))],
  ["Script transfer (KB)", pick(scriptKB).toFixed(0)],
];

for (const [name, value] of rows) console.log(`| ${name} | ${value} |`);
