"use client";

import { useSyncExternalStore } from "react";

const clock = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "2-digit",
});

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

function now() {
  return clock.format(new Date());
}

function onServer() {
  return null;
}

/**
 * Hamilton's local time for the hero's meta row, as " · 9:47 PM". The page
 * is static, so the server renders nothing here and the time appears once
 * the page is running.
 */
export function HamiltonTime() {
  const time = useSyncExternalStore(subscribe, now, onServer);
  return time ? <span className="tabular-nums"> · {time}</span> : null;
}
