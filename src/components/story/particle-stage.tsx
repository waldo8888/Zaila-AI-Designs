"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";
import {
  generateCube,
  generateDust,
  generateHelix,
  generatePlane,
  generateRandoms,
  generateSphere,
  generateTorus,
  mulberry32,
} from "./particle-shapes";
import {
  DUST_FRAGMENT,
  DUST_VERTEX,
  PARTICLE_FRAGMENT,
  PARTICLE_VERTEX,
} from "./particle-shaders";

/** Fixed seed, so the particle field looks the same on every visit. */
const SEED = 20260927;

/**
 * The single WebGL layer behind the site (spec §8).
 *
 * Plan 1 ports the old sphere-background.tsx like-for-like as "ambient" mode:
 * the sphere morphs through torus, helix, cube and terrain across the page's
 * scroll. The homepage's story beats arrive in plan 2.
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

    const isMobileViewport = window.innerWidth < 768;
    const PARTICLE_COUNT = isHomepage
      ? isMobileViewport
        ? 7000
        : 9000
      : isMobileViewport
        ? 3000
        : 4500;
    const DUST_COUNT = isHomepage ? (isMobileViewport ? 400 : 650) : 300;

    // Track the inner cleanup so it runs even if the timer fires after unmount
    let innerCleanup: (() => void) | null = null;
    let destroyed = false;

    // Defer heavy WebGL set-up so the page can paint first
    const initTimer = setTimeout(() => {
      if (destroyed) return;

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

      const rng = mulberry32(SEED);
      const mouse = { x: 0, y: 0 };
      const targetMouse = { x: 0, y: 0 };

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 4.5;

      const pixelRatioCap = isMobileViewport ? 1 : 1.25;
      const currentPixelRatio = Math.min(window.devicePixelRatio, pixelRatioCap);

      Object.assign(renderer.domElement.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        display: "block",
      });
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.setPixelRatio(currentPixelRatio);
      container.appendChild(renderer.domElement);

      const shapes = [
        generateSphere(PARTICLE_COUNT, 2.5, rng),
        generateTorus(PARTICLE_COUNT, 1.8, 0.8, rng),
        generateHelix(PARTICLE_COUNT, 1.5, 4.5, 5, rng),
        generateCube(PARTICLE_COUNT, 3.5, rng),
        generatePlane(PARTICLE_COUNT, 3.0, rng),
      ];

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
      geometry.setAttribute("aTarget1", new THREE.BufferAttribute(shapes[1], 3));
      geometry.setAttribute("aTarget2", new THREE.BufferAttribute(shapes[2], 3));
      geometry.setAttribute("aTarget3", new THREE.BufferAttribute(shapes[3], 3));
      geometry.setAttribute("aTarget4", new THREE.BufferAttribute(shapes[4], 3));
      geometry.setAttribute(
        "aRandom",
        new THREE.BufferAttribute(generateRandoms(PARTICLE_COUNT, rng), 1)
      );

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uPixelRatio: { value: currentPixelRatio },
          uMouse: { value: new THREE.Vector3(0, 0, 0) },
          uMouseInfluence: { value: 0 },
          uColor1: { value: new THREE.Color("#c084fc") },
          uColor2: { value: new THREE.Color("#e879f9") },
          uColor3: { value: new THREE.Color("#6d28d9") },
        },
        vertexShader: PARTICLE_VERTEX,
        fragmentShader: PARTICLE_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      // Sit right of centre so it balances the text on the left
      particles.position.set(1.5, 0, 0);
      scene.add(particles);

      const dustGeometry = new THREE.BufferGeometry();
      dustGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(generateDust(DUST_COUNT, rng), 3)
      );

      const dustMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: material.uniforms.uTime,
          uPixelRatio: material.uniforms.uPixelRatio,
          uColor: { value: new THREE.Color("#d946ef") },
        },
        vertexShader: DUST_VERTEX,
        fragmentShader: DUST_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const dust = new THREE.Points(dustGeometry, dustMaterial);
      scene.add(dust);

      // Scroll tracking
      let scrollY = 0;
      let targetScroll = 0;
      let maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      let startX = window.innerWidth < 768 ? 0 : 1.5;
      function handleScroll() {
        targetScroll = window.scrollY;
      }
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      // Mouse tracking (window-level, so it never blocks other interactions)
      let mouseActive = false;
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
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        material.uniforms.uPixelRatio.value = Math.min(
          window.devicePixelRatio,
          window.innerWidth < 768 ? 1 : 1.25
        );
        maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        startX = window.innerWidth < 768 ? 0 : 1.5;
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

      let baseRotationY = 0;
      let baseTimeX = 0;
      let dustTimeY = 0;
      let currentMouseInfluence = 0;

      // Reused vectors for mouse unprojection
      const mouseWorldPos = new THREE.Vector3();
      const mouseLocalPos = new THREE.Vector3();
      const inverseMatrix = new THREE.Matrix4();

      function animate() {
        animationId = requestAnimationFrame(animate);
        if (!isDocumentVisible) return;

        const delta = Math.min(clock.getDelta(), 0.033);
        const elapsed = clock.elapsedTime;

        baseRotationY += delta * 0.05;
        baseTimeX += delta * 0.02;
        dustTimeY += delta * 0.02;

        scrollY += (targetScroll - scrollY) * 0.08;
        mouse.x += (targetMouse.x - mouse.x) * 0.08;
        mouse.y += (targetMouse.y - mouse.y) * 0.08;

        const targetInfluence = mouseActive ? 1.0 : 0.0;
        currentMouseInfluence += (targetInfluence - currentMouseInfluence) * 0.05;

        if (currentMouseInfluence > 0.001) {
          // Mouse position in particle space, only while the effect is visible
          const fovRad = (camera.fov * Math.PI) / 180;
          const halfHeight = camera.position.z * Math.tan(fovRad / 2);
          const halfWidth = halfHeight * camera.aspect;
          mouseWorldPos.set(mouse.x * halfWidth, mouse.y * halfHeight, 0);
          particles.updateMatrixWorld();
          inverseMatrix.copy(particles.matrixWorld).invert();
          mouseLocalPos.copy(mouseWorldPos).applyMatrix4(inverseMatrix);
          material.uniforms.uMouse.value.copy(mouseLocalPos);
        }

        material.uniforms.uTime.value = elapsed;
        material.uniforms.uMouseInfluence.value = currentMouseInfluence;

        const scrollProgress = scrollY / maxScroll;

        // 5 shapes = 4 transitions; 4.5 lets delayed particles reach the last shape
        material.uniforms.uMorph.value = scrollProgress * 4.5;

        // Slide from right of centre to the middle as you scroll
        particles.position.x = startX - scrollProgress * startX;

        const mouseRotationX = mouse.y * 0.15 * currentMouseInfluence;
        const mouseRotationY = mouse.x * 0.2 * currentMouseInfluence;

        particles.rotation.y = baseRotationY + scrollProgress * Math.PI * 2.0 + mouseRotationY;
        particles.rotation.x = Math.sin(baseTimeX) * 0.1 + scrollProgress * 1.55 + mouseRotationX;
        particles.rotation.z = scrollProgress * 0.2;

        // Lift the terrain so it sits behind the footer
        particles.position.y = -(scrollProgress * 1.2);
        particles.position.z = -(scrollProgress * 3.5);

        dust.rotation.y = dustTimeY + scrollProgress * Math.PI;
        dust.position.y = -(scrollProgress * 2.0);

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
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        dustGeometry.dispose();
        dustMaterial.dispose();
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
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        // Soften particles so foreground text stays easy to read
        filter: "blur(1px) brightness(0.92)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease-out",
        contain: "layout paint size",
        overflow: "hidden",
      }}
    />
  );
}
