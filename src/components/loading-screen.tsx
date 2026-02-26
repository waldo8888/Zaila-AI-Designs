"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/**
 * Loading Screen — cinematic particle-assembly intro.
 *
 * Phase 1 (0 – 1.8 s):  particles fly from random positions → logo shape
 * Phase 2 (1.8 – 2.8 s): logo holds with subtle shimmer
 * Phase 3 (2.8 – 3.5 s): particles scatter, overlay fades out
 *
 * Uses sessionStorage so it only runs once per browser session.
 */

// ─── helpers ───────────────────────────────────────────────────────
function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

function sampleLogoPixels(
    img: HTMLImageElement,
    maxParticles: number,
    spread: number
): Float32Array {
    const canvas = document.createElement("canvas");
    const size = 256; // sample at 256×256
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    // collect opaque-enough pixels
    const hits: [number, number][] = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            if (data[i + 3] > 100) hits.push([x, y]);
        }
    }

    const positions = new Float32Array(maxParticles * 3);
    for (let i = 0; i < maxParticles; i++) {
        const [px, py] = hits[i % hits.length];
        // centre and scale to NDC-ish coords
        positions[i * 3] = ((px / size) - 0.5) * spread;
        positions[i * 3 + 1] = -((py / size) - 0.5) * spread; // flip Y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return positions;
}

function randomPositions(count: number, radius: number): Float32Array {
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius * (0.5 + Math.random() * 0.5);
        out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        out[i * 3 + 2] = r * Math.cos(phi);
    }
    return out;
}

// ─── component ─────────────────────────────────────────────────────
export function LoadingScreen() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);
    const [fading, setFading] = useState(false);

    const startFadeOut = useCallback(() => {
        setFading(true);
        setTimeout(() => {
            setVisible(false);
        }, 700); // match CSS transition
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // ─── Mobile detection & responsive settings ──────────────────
        const isMobile = window.innerWidth < 768;
        const isSmallMobile = window.innerWidth < 400;

        // Reduce particles on mobile for performance
        const PARTICLE_COUNT = isSmallMobile ? 2500 : isMobile ? 4000 : 6000;
        // SPREAD = physical size of the logo in 3D space.
        // Must be small enough that the entire logo (icon + text)
        // fits within the camera frustum on narrow mobile screens.
        const SPREAD = isSmallMobile ? 1.0 : isMobile ? 1.2 : 2.8;

        // ─── Three.js setup ──────────────────────────────────────────
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        // Push camera back on mobile so the smaller logo has breathing room
        camera.position.z = isMobile ? 3.5 : 3.5;

        // Lower DPR cap on mobile for performance
        const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
        const renderer = new THREE.WebGLRenderer({
            antialias: !isSmallMobile, // Skip AA on very small screens
            alpha: true,
            powerPreference: isMobile ? "low-power" : "high-performance",
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(dpr);
        container.appendChild(renderer.domElement);

        // ─── Load logo and build particles ──────────────────────────
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = "/logo.png";

        let animationId: number;
        let clock: THREE.Clock;

        img.onload = () => {
            const targets = sampleLogoPixels(img, PARTICLE_COUNT, SPREAD);
            const starts = randomPositions(PARTICLE_COUNT, 8);

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.BufferAttribute(starts.slice(), 3));
            geometry.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
            geometry.setAttribute("aStart", new THREE.BufferAttribute(starts, 3));

            // per-particle random for staggering
            const rands = new Float32Array(PARTICLE_COUNT);
            for (let i = 0; i < PARTICLE_COUNT; i++) rands[i] = Math.random();
            geometry.setAttribute("aRandom", new THREE.BufferAttribute(rands, 1));

            // Particle size adjustments for mobile
            const baseSize = isMobile ? 10.0 : 12.0;
            const sizeVariation = isMobile ? 14.0 : 18.0;

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uProgress: { value: 0 },
                    uTime: { value: 0 },
                    uPhase: { value: 0 }, // 0=fly-in, 1=hold, 2=dissolve
                    uPixelRatio: { value: dpr },
                    uBaseSize: { value: baseSize },
                    uSizeVariation: { value: sizeVariation },
                    uColor1: { value: new THREE.Color("#c084fc") },
                    uColor2: { value: new THREE.Color("#e879f9") },
                    uColor3: { value: new THREE.Color("#a855f7") }, // Additional purple for depth
                },
                vertexShader: /* glsl */ `
          attribute vec3 aTarget;
          attribute vec3 aStart;
          attribute float aRandom;

          uniform float uProgress;
          uniform float uTime;
          uniform float uPhase;
          uniform float uPixelRatio;
          uniform float uBaseSize;
          uniform float uSizeVariation;

          varying float vAlpha;
          varying float vColorMix;
          varying float vDepth;

          void main() {
            float delay = aRandom * 0.35;
            vec3 pos;

            if (uPhase < 1.0) {
              // Fly-in: lerp start → target with per-particle stagger
              float p = clamp((uProgress - delay) / (1.0 - delay), 0.0, 1.0);
              // smooth cubic ease-out
              p = 1.0 - pow(1.0 - p, 3.0);
              pos = mix(aStart, aTarget, p);

              // Add spiral motion during fly-in for more dynamic effect
              float spiralAngle = (1.0 - p) * 3.14159 * 2.0 * aRandom;
              float spiralRadius = (1.0 - p) * 0.3;
              pos.x += cos(spiralAngle) * spiralRadius;
              pos.y += sin(spiralAngle) * spiralRadius;
            } else if (uPhase < 2.0) {
              // Hold with subtle shimmer and breathing
              pos = aTarget;
              float breathe = sin(uTime * 2.0) * 0.02;
              pos.x += sin(uTime * 3.0 + aRandom * 6.28) * 0.02 + pos.x * breathe;
              pos.y += cos(uTime * 2.5 + aRandom * 3.14) * 0.02 + pos.y * breathe;
              pos.z += sin(uTime * 1.5 + aRandom * 4.0) * 0.03;
            } else {
              // Dissolve: scatter outward with rotation
              float dissolveT = clamp((uProgress - delay) / (1.0 - delay), 0.0, 1.0);
              dissolveT = dissolveT * dissolveT; // ease in
              vec3 scatterDir = normalize(aTarget + vec3(sin(aRandom*62.8), cos(aRandom*31.4), sin(aRandom*94.2)));
              pos = aTarget + scatterDir * dissolveT * 8.0;
              // Add rotation during dissolve
              float angle = dissolveT * 3.14159 * aRandom;
              float cosA = cos(angle);
              float sinA = sin(angle);
              vec3 rotated = vec3(pos.x * cosA - pos.y * sinA, pos.x * sinA + pos.y * cosA, pos.z);
              pos = mix(pos, rotated, dissolveT * 0.5);
            }

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            float size = (uBaseSize + aRandom * uSizeVariation) * uPixelRatio;

            // Slightly larger particles during hold phase for more presence
            if (uPhase >= 1.0 && uPhase < 2.0) {
              size *= 1.0 + sin(uTime * 2.0 + aRandom * 6.28) * 0.15;
            }

            gl_PointSize = size * (1.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;

            vAlpha = uPhase < 2.0 ? 0.75 + aRandom * 0.25 : max(0.0, 1.0 - uProgress * 1.5);
            vColorMix = aRandom;
            vDepth = pos.z;
          }
        `,
                fragmentShader: /* glsl */ `
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          uniform float uTime;
          uniform float uPhase;

          varying float vAlpha;
          varying float vColorMix;
          varying float vDepth;

          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;

            float glow = 1.0 - d * 2.0;
            float core = pow(glow, 3.0);
            float halo = pow(glow, 1.5) * 0.5;
            float strength = core + halo;

            // Enhanced color mixing with depth
            vec3 baseColor = mix(uColor1, uColor2, vColorMix);
            float depthMix = smoothstep(-0.5, 0.5, vDepth);
            vec3 color = mix(baseColor, uColor3, depthMix * 0.3);

            // Pulsing shimmer during hold phase
            float shimmerSpeed = uPhase >= 1.0 && uPhase < 2.0 ? 5.0 : 4.0;
            float shimmer = sin(uTime * shimmerSpeed + vColorMix * 20.0) * 0.12 + 0.88;

            // Add subtle color shift over time
            color += vec3(sin(uTime * 0.5) * 0.05, 0.0, cos(uTime * 0.5) * 0.05);

            gl_FragColor = vec4(color, strength * vAlpha * shimmer);
          }
        `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });

            const points = new THREE.Points(geometry, material);
            scene.add(points);

            clock = new THREE.Clock();

            // Phase timings (seconds) - slightly faster on mobile
            const FLY_END = isMobile ? 2.0 : 2.5;
            const HOLD_END = isMobile ? 3.2 : 4.0;
            const DISSOLVE_END = isMobile ? 4.0 : 5.0;

            function animate() {
                animationId = requestAnimationFrame(animate);
                const elapsed = clock.getElapsedTime();
                material.uniforms.uTime.value = elapsed;

                if (elapsed < FLY_END) {
                    // Phase 0 — fly in
                    material.uniforms.uPhase.value = 0;
                    material.uniforms.uProgress.value = easeOutCubic(
                        Math.min(elapsed / FLY_END, 1)
                    );
                } else if (elapsed < HOLD_END) {
                    // Phase 1 — hold
                    material.uniforms.uPhase.value = 1;
                    material.uniforms.uProgress.value = 1;
                } else if (elapsed < DISSOLVE_END) {
                    // Phase 2 — dissolve
                    material.uniforms.uPhase.value = 2;
                    material.uniforms.uProgress.value =
                        (elapsed - HOLD_END) / (DISSOLVE_END - HOLD_END);
                } else {
                    // Done — tear down
                    cancelAnimationFrame(animationId);
                    startFadeOut();
                    return;
                }

                renderer.render(scene, camera);
            }

            animate();

            // Resize handler
            const onResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
            };
            window.addEventListener("resize", onResize);

            // Cleanup stored in ref via IIFE closure
            (container as any).__loadingCleanup = () => {
                window.removeEventListener("resize", onResize);
            };
        };

        return () => {
            cancelAnimationFrame(animationId);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            (container as any).__loadingCleanup?.();
        };
    }, [startFadeOut]);

    if (!visible) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "radial-gradient(circle at center, #0a0612 0%, #000000 100%)",
                opacity: fading ? 0 : 1,
                transition: "opacity 0.7s ease-out",
                pointerEvents: fading ? "none" : "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
            aria-hidden="true"
        >
            {/* Subtle loading indicator at bottom */}
            <div
                style={{
                    marginBottom: "clamp(24px, 8vh, 60px)",
                    opacity: fading ? 0 : 0.6,
                    transition: "opacity 0.5s ease-out",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                    }}
                >
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #c084fc, #e879f9)",
                                animation: `loadingPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                            }}
                        />
                    ))}
                </div>
                <style>{`
                    @keyframes loadingPulse {
                        0%, 80%, 100% {
                            transform: scale(0.8);
                            opacity: 0.4;
                        }
                        40% {
                            transform: scale(1.2);
                            opacity: 1;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}
