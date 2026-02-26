"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/**
 * HolographicCard — wraps children with an iridescent foil effect.
 *
 * - CSS 3D perspective tilt on mousemove (max ±15°)
 * - WebGL overlay: animated Perlin noise → rainbow hue-shift
 * - Mouse position drives the hue-shift origin
 * - Smooth spring-back on mouse leave
 */

// ─── Simplex-ish 2D noise (compact) ───────────────────────────────
function hash(x: number, y: number): number {
    let h = x * 374761393 + y * 668265263;
    h = ((h ^ (h >> 13)) * 1274126177) | 0;
    return (h ^ (h >> 16)) / 2147483648;
}

// ─── component ─────────────────────────────────────────────────────
interface Props {
    children: React.ReactNode;
    className?: string;
}

export function HolographicCard({ children, className = "" }: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const tiltRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
    const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Tilt targets: map 0..1 → -15..15
        tiltRef.current.tx = (y - 0.5) * -30; // tilt X (rotate around horizontal axis)
        tiltRef.current.ty = (x - 0.5) * 30;  // tilt Y
        mouseRef.current.tx = x;
        mouseRef.current.ty = y;
    }, []);

    const handleMouseLeave = useCallback(() => {
        tiltRef.current.tx = 0;
        tiltRef.current.ty = 0;
        mouseRef.current.tx = 0.5;
        mouseRef.current.ty = 0.5;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        // ─── Three.js mini renderer ─────────────────────────────────
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: false,
            powerPreference: "low-power",
        });
        const dpr = Math.min(window.devicePixelRatio, 2);
        renderer.setPixelRatio(dpr);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
        camera.position.z = 1;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uResolution: { value: new THREE.Vector2(1, 1) },
            },
            vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        varying vec2 vUv;

        // Simple 2D value noise
        float hash2d(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash2d(i);
          float b = hash2d(i + vec2(1.0, 0.0));
          float c = hash2d(i + vec2(0.0, 1.0));
          float d = hash2d(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        vec3 hsl2rgb(float h, float s, float l) {
          vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
        }

        void main() {
          vec2 uv = vUv;

          // Distance from mouse for hue origin offset
          float mouseDist = distance(uv, uMouse);

          // Perlin-driven hue shift
          float n = fbm(uv * 3.0 + uTime * 0.3);
          float hue = fract(n * 0.8 + uTime * 0.05 + mouseDist * 0.3);

          vec3 color = hsl2rgb(hue, 0.7, 0.55);

          // Iridescent sparkle highlights
          float sparkle = pow(noise(uv * 15.0 + uTime * 1.5), 4.0) * 0.5;
          color += sparkle;

          // Fade near edges for organic blend
          float edgeFade = smoothstep(0.0, 0.15, uv.x) *
                           smoothstep(1.0, 0.85, uv.x) *
                           smoothstep(0.0, 0.15, uv.y) *
                           smoothstep(1.0, 0.85, uv.y);

          // Overall alpha — light and translucent
          float alpha = 0.18 * edgeFade;

          // Boost near mouse
          alpha += smoothstep(0.5, 0.0, mouseDist) * 0.12;

          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            depthWrite: false,
        });

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
        scene.add(plane);

        // ─── Sizing ────────────────────────────────────────────────
        function updateSize() {
            const w = wrapper!.clientWidth;
            const h = wrapper!.clientHeight;
            if (w === 0 || h === 0) return;
            renderer.setSize(w, h);
            material.uniforms.uResolution.value.set(w, h);
        }
        updateSize();

        const observer = new ResizeObserver(updateSize);
        observer.observe(wrapper);

        // ─── Animate ───────────────────────────────────────────────
        const clock = new THREE.Clock();
        let animationId: number;

        function animate() {
            animationId = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();
            material.uniforms.uTime.value = elapsed;

            // Smooth lerp tilt
            const t = tiltRef.current;
            t.x += (t.tx - t.x) * 0.08;
            t.y += (t.ty - t.y) * 0.08;

            // Smooth lerp mouse
            const m = mouseRef.current;
            m.x += (m.tx - m.x) * 0.08;
            m.y += (m.ty - m.y) * 0.08;
            material.uniforms.uMouse.value.set(m.x, 1 - m.y); // flip Y for shader

            // Apply CSS transform on wrapper
            if (wrapper) {
                wrapper.style.transform = `perspective(800px) rotateX(${t.x}deg) rotateY(${t.y}deg)`;
            }

            renderer.render(scene, camera);
        }

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            observer.disconnect();
            renderer.dispose();
            material.dispose();
            plane.geometry.dispose();
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.05s linear",
                willChange: "transform",
            }}
        >
            {/* Holographic overlay canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                    mixBlendMode: "screen",
                    zIndex: 1,
                }}
            />
            {/* Card content on top */}
            <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
        </div>
    );
}
