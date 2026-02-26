"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ServicesNetwork — Neural network grid visualization for service cards.
 *
 * Creates an immersive neural network background with:
 * - Subtle grid pattern
 * - Floating neural nodes with connections
 * - Central icon with glow
 * - Animated particles flowing along connections
 */

interface Props {
  activeNodeIndex: number; // 0-3 = service card index
}

// ─── Service Configuration ────────────────────────────────────────────────
const SERVICE_CONFIG = [
  {
    color: new THREE.Color("#c084fc"),
    hex: "#c084fc",
    glowHex: "#e879f9",
    label: "AI-POWERED WEBSITES",
  },
  {
    color: new THREE.Color("#22d3ee"),
    hex: "#22d3ee",
    glowHex: "#67e8f9",
    label: "AI ASSISTANTS",
  },
  {
    color: new THREE.Color("#34d399"),
    hex: "#34d399",
    glowHex: "#6ee7b7",
    label: "BOOKINGS & PAYMENTS",
  },
  {
    color: new THREE.Color("#fb923c"),
    hex: "#fb923c",
    glowHex: "#fdba74",
    label: "GROWTH PLANS",
  },
];

const SERVICE_ICONS = [
  // Website icon - simplified path
  (ctx: CanvasRenderingContext2D, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.04;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const s = size * 0.4;
    const x = size / 2 - s / 2;
    const y = size / 2 - s / 2;
    const r = s * 0.1;
    // Rounded rect
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + s - r, y);
    ctx.quadraticCurveTo(x + s, y, x + s, y + r);
    ctx.lineTo(x + s, y + s - r);
    ctx.quadraticCurveTo(x + s, y + s, x + s - r, y + s);
    ctx.lineTo(x + r, y + s);
    ctx.quadraticCurveTo(x, y + s, x, y + s - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.stroke();
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.33);
    ctx.lineTo(x + s, y + s * 0.33);
    ctx.stroke();
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(x + s * 0.33, y + s * 0.33);
    ctx.lineTo(x + s * 0.33, y + s);
    ctx.stroke();
  },
  // Chat icon
  (ctx: CanvasRenderingContext2D, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.04;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const s = size * 0.4;
    const cx = size / 2;
    const cy = size / 2;
    // Chat bubble
    ctx.beginPath();
    ctx.moveTo(cx - s / 2, cy + s * 0.3);
    ctx.lineTo(cx - s / 2 - s * 0.15, cy + s / 2 + s * 0.1);
    ctx.lineTo(cx - s / 2 + s * 0.15, cy + s * 0.3);
    ctx.lineTo(cx + s / 2 - s * 0.1, cy + s * 0.3);
    ctx.quadraticCurveTo(cx + s / 2, cy + s * 0.3, cx + s / 2, cy + s * 0.2);
    ctx.lineTo(cx + s / 2, cy - s * 0.2);
    ctx.quadraticCurveTo(cx + s / 2, cy - s * 0.3, cx + s / 2 - s * 0.1, cy - s * 0.3);
    ctx.lineTo(cx - s / 2 + s * 0.1, cy - s * 0.3);
    ctx.quadraticCurveTo(cx - s / 2, cy - s * 0.3, cx - s / 2, cy - s * 0.2);
    ctx.lineTo(cx - s / 2, cy + s * 0.3);
    ctx.stroke();
    // Dots
    ctx.fillStyle = color;
    [0.3, 0.5, 0.7].forEach((p) => {
      ctx.beginPath();
      ctx.arc(cx - s / 2 + s * p, cy, s * 0.04, 0, Math.PI * 2);
      ctx.fill();
    });
  },
  // Calendar icon
  (ctx: CanvasRenderingContext2D, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.04;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const s = size * 0.4;
    const x = size / 2 - s / 2;
    const y = size / 2 - s / 2 + s * 0.05;
    const r = s * 0.08;
    // Rounded rect
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + s - r, y);
    ctx.quadraticCurveTo(x + s, y, x + s, y + r);
    ctx.lineTo(x + s, y + s - r);
    ctx.quadraticCurveTo(x + s, y + s, x + s - r, y + s);
    ctx.lineTo(x + r, y + s);
    ctx.quadraticCurveTo(x, y + s, x, y + s - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.stroke();
    // Top hangers
    ctx.beginPath();
    ctx.moveTo(x + s * 0.3, y - s * 0.1);
    ctx.lineTo(x + s * 0.3, y + s * 0.1);
    ctx.moveTo(x + s * 0.7, y - s * 0.1);
    ctx.lineTo(x + s * 0.7, y + s * 0.1);
    ctx.stroke();
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.35);
    ctx.lineTo(x + s, y + s * 0.35);
    ctx.stroke();
  },
  // Growth chart icon
  (ctx: CanvasRenderingContext2D, size: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.04;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const s = size * 0.4;
    const cx = size / 2;
    const cy = size / 2;
    // Chart line
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.4, cy + s * 0.3);
    ctx.lineTo(cx - s * 0.1, cy);
    ctx.lineTo(cx + s * 0.15, cy + s * 0.15);
    ctx.lineTo(cx + s * 0.4, cy - s * 0.3);
    ctx.stroke();
    // Arrow
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.15, cy - s * 0.3);
    ctx.lineTo(cx + s * 0.4, cy - s * 0.3);
    ctx.lineTo(cx + s * 0.4, cy);
    ctx.stroke();
  },
];

export function ServicesNetwork({ activeNodeIndex }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let W = el.clientWidth;
    let H = el.clientHeight;
    if (!W || !H) return;

    const config = SERVICE_CONFIG[activeNodeIndex] || SERVICE_CONFIG[0];
    const isMobile = W < 500;

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "default",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    el.insertBefore(renderer.domElement, el.firstChild);

    // ── Scene + Camera ─────────────────────────────────────
    const scene = new THREE.Scene();
    const frustum = 2.0;
    const aspect = W / H;
    const camera = new THREE.OrthographicCamera(
      -frustum * aspect,
      frustum * aspect,
      frustum,
      -frustum,
      0.1,
      10
    );
    camera.position.z = 5;

    // ── Grid Pattern ───────────────────────────────────────
    const gridSize = isMobile ? 12 : 16;
    const gridSpacing = (frustum * 2 * Math.max(aspect, 1)) / gridSize;
    const gridGroup = new THREE.Group();

    // Create grid lines
    const gridMaterial = new THREE.LineBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.06,
    });

    // Vertical lines
    for (let i = -gridSize; i <= gridSize; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * gridSpacing, -frustum * 2, 0),
        new THREE.Vector3(i * gridSpacing, frustum * 2, 0),
      ]);
      gridGroup.add(new THREE.Line(geo, gridMaterial));
    }

    // Horizontal lines
    for (let i = -gridSize; i <= gridSize; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-frustum * 2 * aspect, i * gridSpacing, 0),
        new THREE.Vector3(frustum * 2 * aspect, i * gridSpacing, 0),
      ]);
      gridGroup.add(new THREE.Line(geo, gridMaterial));
    }

    scene.add(gridGroup);

    // ── Neural Network Nodes ───────────────────────────────
    const nodeCount = isMobile ? 20 : 35;
    const nodes: { pos: THREE.Vector3; vel: THREE.Vector3; size: number }[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    const nodeGeometry = new THREE.CircleGeometry(0.02, 16);

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * frustum * 2 * aspect * 0.9,
        (Math.random() - 0.5) * frustum * 2 * 0.9,
        0
      );
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        0
      );
      const size = 0.015 + Math.random() * 0.025;

      nodes.push({ pos, vel, size });

      const nodeMat = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.4,
      });

      const mesh = new THREE.Mesh(nodeGeometry, nodeMat);
      mesh.position.copy(pos);
      mesh.scale.setScalar(size / 0.02);
      scene.add(mesh);
      nodeMeshes.push(mesh);
    }

    // ── Connection Lines ───────────────────────────────────
    const connectionThreshold = isMobile ? 0.8 : 0.6;
    const maxConnections = isMobile ? 30 : 60;
    const connectionGeo = new THREE.BufferGeometry();
    const connectionPositions = new Float32Array(maxConnections * 6);
    connectionGeo.setAttribute("position", new THREE.BufferAttribute(connectionPositions, 3));
    connectionGeo.setDrawRange(0, 0);

    const connectionMat = new THREE.LineBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.12,
    });

    const connections = new THREE.LineSegments(connectionGeo, connectionMat);
    scene.add(connections);

    // ── Central Icon Glow ──────────────────────────────────
    const glowSize = isMobile ? 0.5 : 0.6;
    const glowGeo = new THREE.CircleGeometry(glowSize, 32);
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: config.color },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          float dist = length(vUv - vec2(0.5));
          float pulse = sin(uTime * 2.0) * 0.1 + 0.9;

          // Soft radial gradient
          float alpha = smoothstep(0.5, 0.0, dist) * 0.15 * pulse;

          // Add rings
          float ring1 = smoothstep(0.02, 0.0, abs(dist - 0.35 - sin(uTime) * 0.02));
          float ring2 = smoothstep(0.015, 0.0, abs(dist - 0.25 + cos(uTime * 1.3) * 0.015));

          alpha += ring1 * 0.08 + ring2 * 0.05;

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // ── Central Icon (Canvas Texture) ──────────────────────
    const iconSize = 128;
    const iconCanvas = document.createElement("canvas");
    iconCanvas.width = iconSize;
    iconCanvas.height = iconSize;
    const iconCtx = iconCanvas.getContext("2d")!;

    // Draw icon
    iconCtx.clearRect(0, 0, iconSize, iconSize);
    const drawIcon = SERVICE_ICONS[activeNodeIndex] || SERVICE_ICONS[0];
    drawIcon(iconCtx, iconSize, config.hex);

    const iconTexture = new THREE.CanvasTexture(iconCanvas);
    const iconMat = new THREE.MeshBasicMaterial({
      map: iconTexture,
      transparent: true,
      depthWrite: false,
    });

    const iconPlaneSize = isMobile ? 0.35 : 0.45;
    const iconGeo = new THREE.PlaneGeometry(iconPlaneSize, iconPlaneSize);
    const iconMesh = new THREE.Mesh(iconGeo, iconMat);
    iconMesh.position.z = 0.1;
    scene.add(iconMesh);

    // ── Floating Particles ─────────────────────────────────
    const particleCount = isMobile ? 40 : 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * frustum * 2 * aspect;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * frustum * 2;
      particlePositions[i * 3 + 2] = 0;
      particleSpeeds.push(0.001 + Math.random() * 0.003);
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: config.color,
      size: isMobile ? 0.025 : 0.02,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Animation Loop ─────────────────────────────────────
    const clock = new THREE.Clock();
    let raf: number;
    const bounds = { x: frustum * aspect, y: frustum };

    function tick() {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Update glow
      glowMat.uniforms.uTime.value = t;

      // Subtle icon float
      iconMesh.position.y = Math.sin(t * 1.5) * 0.02;
      iconMesh.rotation.z = Math.sin(t * 0.8) * 0.02;

      // Update nodes
      let connectionIndex = 0;
      const positions = connectionGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move nodes
        node.pos.add(node.vel);

        // Bounce off edges
        if (Math.abs(node.pos.x) > bounds.x * 0.95) node.vel.x *= -1;
        if (Math.abs(node.pos.y) > bounds.y * 0.95) node.vel.y *= -1;

        // Add slight drift
        node.vel.x += (Math.random() - 0.5) * 0.0001;
        node.vel.y += (Math.random() - 0.5) * 0.0001;

        // Clamp velocity
        const maxVel = 0.003;
        node.vel.clampLength(0, maxVel);

        nodeMeshes[i].position.copy(node.pos);

        // Pulse opacity
        const mat = nodeMeshes[i].material as THREE.MeshBasicMaterial;
        mat.opacity = 0.3 + Math.sin(t * 2 + i) * 0.2;

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = node.pos.distanceTo(nodes[j].pos);
          if (dist < connectionThreshold && connectionIndex < maxConnections) {
            const idx = connectionIndex * 6;
            positions[idx] = node.pos.x;
            positions[idx + 1] = node.pos.y;
            positions[idx + 2] = 0;
            positions[idx + 3] = nodes[j].pos.x;
            positions[idx + 4] = nodes[j].pos.y;
            positions[idx + 5] = 0;
            connectionIndex++;
          }
        }
      }

      connectionGeo.attributes.position.needsUpdate = true;
      connectionGeo.setDrawRange(0, connectionIndex * 2);

      // Update particles
      const pPositions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3 + 1] += particleSpeeds[i];

        // Reset when reaching top
        if (pPositions[i * 3 + 1] > bounds.y) {
          pPositions[i * 3 + 1] = -bounds.y;
          pPositions[i * 3] = (Math.random() - 0.5) * frustum * 2 * aspect;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle grid movement
      gridGroup.position.x = Math.sin(t * 0.3) * 0.05;
      gridGroup.position.y = Math.cos(t * 0.25) * 0.05;

      renderer.render(scene, camera);
    }

    tick();

    // ── Resize Observer ────────────────────────────────────
    const ro = new ResizeObserver(() => {
      W = el.clientWidth;
      H = el.clientHeight;
      if (!W || !H) return;
      renderer.setSize(W, H);
      const a = W / H;
      camera.left = -frustum * a;
      camera.right = frustum * a;
      camera.updateProjectionMatrix();
    });
    ro.observe(el);

    // ── Cleanup ────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();

      // Dispose geometries and materials
      nodeGeometry.dispose();
      nodeMeshes.forEach((m) => (m.material as THREE.Material).dispose());
      connectionGeo.dispose();
      connectionMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      iconGeo.dispose();
      iconMat.dispose();
      iconTexture.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      gridGroup.children.forEach((c) => {
        (c as THREE.Line).geometry.dispose();
      });
      gridMaterial.dispose();

      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [activeNodeIndex]);

  const config = SERVICE_CONFIG[activeNodeIndex] || SERVICE_CONFIG[0];

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 200,
      }}
    >
      {/* Label overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: config.hex,
            fontSize: "clamp(9px, 2vw, 11px)",
            fontFamily: "monospace",
            letterSpacing: "0.15em",
            textShadow: `0 0 20px ${config.hex}40`,
            whiteSpace: "nowrap",
          }}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}
