"use client";

import { useEffect, useRef } from "react";

const TILE_SIZE = 128;

export function NoiseOverlay() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    // Off-screen tile canvas — 128×128 instead of full viewport
    const canvas = document.createElement("canvas");
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function drawTile() {
      if (!ctx) return;
      const imageData = ctx.createImageData(TILE_SIZE, TILE_SIZE);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      if (div) {
        div.style.backgroundImage = `url(${canvas.toDataURL()})`;
      }
    }

    // Update at ~10fps — enough to feel like film grain, cheap on CPU
    drawTile();
    const interval = setInterval(drawTile, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={divRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        pointerEvents: "none",
        opacity: 0.04,
        mixBlendMode: "overlay",
        backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
