"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import { mulberry32 } from "./particle-shapes";
import { createAmbientScene } from "./stage-ambient";
import type { StageScene, StageSetup, StageSize } from "./stage-scene";

/** Fixed seed, so the particle field looks the same on every visit. */
const SEED = 20260927;

/**
 * The single WebGL layer behind the site (spec §8). This shell owns the
 * renderer, the camera and the inputs (scroll, pointer, resize, tab
 * visibility). A scene owns the particles: every page runs the ambient scene
 * for now, and the homepage gets its story scene next.
 */
export function ParticleStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  // Smaller particle budget on subpages for smooth performance
  const isHomepage = pathname === "/";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Track the inner cleanup so it runs even if the timer fires after unmount
    let innerCleanup: (() => void) | null = null;
    let destroyed = false;

    // Defer heavy WebGL set-up so the page can paint first
    const initTimer = setTimeout(() => {
      if (destroyed) return;

      const isMobileViewport = window.innerWidth < 768;
      const createScene = (setup: StageSetup) =>
        createAmbientScene(
          setup,
          isHomepage
            ? { particles: isMobileViewport ? 7000 : 9000, dust: isMobileViewport ? 400 : 650 }
            : { particles: isMobileViewport ? 3000 : 4500, dust: 300 }
        );

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        // No WebGL (blocklisted GPU, some in-app browsers): the sky alone is fine.
        return;
      }

      const measure = (): StageSize => ({
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1 : 1.25),
      });
      const size = measure();

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000);
      camera.position.z = 4.5;

      Object.assign(renderer.domElement.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        display: "block",
      });
      renderer.setSize(size.width, size.height, false);
      renderer.setPixelRatio(size.pixelRatio);
      container.appendChild(renderer.domElement);

      const stageScene: StageScene = createScene({ scene, camera, rng: mulberry32(SEED), size });

      // Scroll tracking
      let scrollY = 0;
      let targetScroll = 0;
      function handleScroll() {
        targetScroll = window.scrollY;
      }
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      // Mouse tracking (window-level, so it never blocks other interactions)
      const mouse = { x: 0, y: 0 };
      const targetMouse = { x: 0, y: 0 };
      let mouseActive = false;
      let mouseInfluence = 0;
      let mouseTimeout: ReturnType<typeof setTimeout> | undefined;
      const supportsHover = window.matchMedia("(hover: hover)").matches;

      function handleMouseMove(event: MouseEvent) {
        targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
        mouseActive = true;
        if (mouseTimeout) clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
          mouseActive = false;
        }, 2000);
      }

      function handleMouseLeave() {
        mouseActive = false;
      }

      if (supportsHover) {
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        document.addEventListener("mouseleave", handleMouseLeave);
      }

      function handleResize() {
        const next = measure();
        camera.aspect = next.width / next.height;
        camera.updateProjectionMatrix();
        renderer.setSize(next.width, next.height, false);
        stageScene.resize(next);
      }
      window.addEventListener("resize", handleResize);
      handleResize();

      const clock = new THREE.Clock();
      let animationId = 0;
      let isDocumentVisible = document.visibilityState === "visible";

      function handleVisibilityChange() {
        isDocumentVisible = document.visibilityState === "visible";
      }
      document.addEventListener("visibilitychange", handleVisibilityChange);

      function animate() {
        animationId = requestAnimationFrame(animate);
        if (!isDocumentVisible) return;

        const delta = Math.min(clock.getDelta(), 0.033);
        scrollY += (targetScroll - scrollY) * 0.08;
        mouse.x += (targetMouse.x - mouse.x) * 0.08;
        mouse.y += (targetMouse.y - mouse.y) * 0.08;
        mouseInfluence += ((mouseActive ? 1 : 0) - mouseInfluence) * 0.05;

        stageScene.update({ delta, elapsed: clock.elapsedTime, scrollY, mouse, mouseInfluence });
        renderer.render(scene, camera);
      }

      animate();

      // Fade the stage in once it's drawing
      setVisible(true);

      innerCleanup = () => {
        cancelAnimationFrame(animationId);
        if (mouseTimeout) clearTimeout(mouseTimeout);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (supportsHover) {
          window.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
        stageScene.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }, 100);

    return () => {
      destroyed = true;
      clearTimeout(initTimer);
      innerCleanup?.();
      setVisible(false);
    };
  }, [isHomepage]);

  return (
    <div
      ref={containerRef}
      className="particle-stage"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
}
