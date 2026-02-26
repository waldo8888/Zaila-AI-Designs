"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Shape generators — each returns Float32Array of xyz positions
function generateSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

function generateTorus(count: number, R: number, r: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    positions[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    positions[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
    positions[i * 3 + 2] = r * Math.sin(v);
  }
  return positions;
}

function generateHelix(count: number, radius: number, height: number, turns: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 2 * turns;
    const strand = Math.random() > 0.5 ? 1 : -1;
    const r = radius + (Math.random() - 0.5) * 0.15;
    positions[i * 3] = r * Math.cos(angle + strand * 0.8);
    positions[i * 3 + 1] = (t - 0.5) * height;
    positions[i * 3 + 2] = r * Math.sin(angle + strand * 0.8);
  }
  return positions;
}

function generateCube(count: number, size: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const half = size / 2;
  for (let i = 0; i < count; i++) {
    // Distribute on surface of cube
    const face = Math.floor(Math.random() * 6);
    let x = (Math.random() - 0.5) * size;
    let y = (Math.random() - 0.5) * size;
    let z = (Math.random() - 0.5) * size;
    switch (face) {
      case 0: x = half; break;
      case 1: x = -half; break;
      case 2: y = half; break;
      case 3: y = -half; break;
      case 4: z = half; break;
      case 5: z = -half; break;
    }
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

function generatePlane(count: number, size: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Generate on XY plane so an X-rotation lays it flat like a terrain
    // Make the plane massive so it fills the screen horizontally and stretches into the deep distance
    const x = (Math.random() - 0.5) * size * 12.0;    // Huge X width
    const y = (Math.random() - 0.5) * size * 12.0;    // Huge Y height (becomes deep depth)

    // Add wavy terrain displacement on Z
    const z = Math.sin(x * 1.5) * 0.4 + Math.cos(y * 1.5) * 0.4 + (Math.random() - 0.5) * 0.3;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

export function SphereBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Increased particle count for a denser, more massive feel
    const PARTICLE_COUNT = 15000;

    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45, // Slightly lower FOV to look more solid
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Bring camera a bit closer, or scale up shapes. We'll adjust camera and shape scale.
    camera.position.z = 4.5;

    const currentPixelRatio = Math.min(window.devicePixelRatio, 2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance" // Ensure smooth performance with more particles
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(currentPixelRatio); // Bump pixel ratio cap slightly if available
    container.appendChild(renderer.domElement);

    // Make shapes significantly larger
    const shapes = [
      generateSphere(PARTICLE_COUNT, 2.5), // Base sphere is huge
      generateTorus(PARTICLE_COUNT, 1.8, 0.8),
      generateHelix(PARTICLE_COUNT, 1.5, 4.5, 5),
      generateCube(PARTICLE_COUNT, 3.5),
      generatePlane(PARTICLE_COUNT, 3.0),
    ];

    // Create buffer geometry with all shapes as attributes
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0].slice(), 3));
    geometry.setAttribute("aTarget1", new THREE.BufferAttribute(shapes[1], 3));
    geometry.setAttribute("aTarget2", new THREE.BufferAttribute(shapes[2], 3));
    geometry.setAttribute("aTarget3", new THREE.BufferAttribute(shapes[3], 3));
    geometry.setAttribute("aTarget4", new THREE.BufferAttribute(shapes[4], 3));

    // Random values for per-particle variation
    const randoms = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      randoms[i] = Math.random();
    }
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uPixelRatio: { value: currentPixelRatio },
        uMouse: { value: new THREE.Vector3(0, 0, 0) }, // Mouse position in particle local space
        uMouseInfluence: { value: 0 }, // Fades in when mouse is active
        uColor1: { value: new THREE.Color("#c084fc") }, // Lighter purple for core
        uColor2: { value: new THREE.Color("#e879f9") }, // Vibrant fuchsia
        uColor3: { value: new THREE.Color("#6d28d9") }, // Deep violet for contrast
      },
      vertexShader: `
        attribute vec3 aTarget1;
        attribute vec3 aTarget2;
        attribute vec3 aTarget3;
        attribute vec3 aTarget4;
        attribute float aRandom;

        uniform float uTime;
        uniform float uMorph;
        uniform float uPixelRatio;
        uniform vec3 uMouse; // Mouse position in particle local space
        uniform float uMouseInfluence;

        varying float vAlpha;
        varying float vColorMix;
        varying vec3 vPos;
        varying float vMouseProximity;

        // Smooth step between shapes
        vec3 getShapePosition(float morph) {
          vec3 pos;

          if (morph < 1.0) {
            pos = mix(position, aTarget1, smoothstep(0.0, 1.0, morph));
          } else if (morph < 2.0) {
            pos = mix(aTarget1, aTarget2, smoothstep(0.0, 1.0, morph - 1.0));
          } else if (morph < 3.0) {
            pos = mix(aTarget2, aTarget3, smoothstep(0.0, 1.0, morph - 2.0));
          } else {
            pos = mix(aTarget3, aTarget4, smoothstep(0.0, 1.0, morph - 3.0));
          }

          return pos;
        }

        void main() {
          // Add per-particle delay to morphing for organic feel
          float particleDelay = aRandom * 0.4;
          float adjustedMorph = max(uMorph - particleDelay, 0.0);

          vec3 pos = getShapePosition(adjustedMorph);
          vPos = pos;

          // Subtle floating motion, tied slightly to morph progress
          float floatSpeed = 0.5 + aRandom * 0.5;
          pos.x += sin(uTime * floatSpeed + aRandom * 6.28) * 0.05;
          pos.y += cos(uTime * floatSpeed * 0.7 + aRandom * 6.28) * 0.05;
          pos.z += sin(uTime * floatSpeed * 0.5 + aRandom * 3.14) * 0.05;

          // Mouse interaction - repulsion effect
          // uMouse is already in particle local space (calculated in JS)
          vec3 toMouse = pos - uMouse;
          float distToMouse = length(toMouse.xy);

          // Repulsion radius and strength
          float repulsionRadius = 1.5;
          float repulsionStrength = 0.8;

          // Calculate repulsion (particles push away from mouse)
          float repulsion = smoothstep(repulsionRadius, 0.0, distToMouse);
          vec3 repulsionDir = normalize(toMouse + vec3(0.001)); // Prevent division by zero
          pos += repulsionDir * repulsion * repulsionStrength * uMouseInfluence;

          // Add slight z-push for depth effect near mouse
          pos.z += repulsion * 0.5 * uMouseInfluence;

          // Store mouse proximity for fragment shader glow
          vMouseProximity = repulsion * uMouseInfluence;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

          // Size attenuation - increased base size for strong glow
          // Particles near mouse get slightly larger
          float mouseSize = 1.0 + vMouseProximity * 0.5;
          float size = (20.0 + aRandom * 25.0) * uPixelRatio * mouseSize;
          gl_PointSize = size * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          // Alpha based on distance from center (core is bright, edges fade)
          float dist = length(pos);
          vAlpha = 0.5 + 0.5 * (1.0 - smoothstep(0.0, 8.0, dist));
          vAlpha *= 0.6 + aRandom * 0.4;

          // Boost alpha near mouse for glow effect
          vAlpha += vMouseProximity * 0.3;

          // Color variation based on position and randomness
          vColorMix = fract(aRandom + sin(pos.y * 2.0 + uTime) * 0.1);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uTime;
        uniform float uMorph;

        varying float vAlpha;
        varying float vColorMix;
        varying vec3 vPos;
        varying float vMouseProximity;

        void main() {
          // Soft circular particle with a sharper core
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;

          // Create a glow effect (bright center, soft falloff)
          float glow = 1.0 - (d * 2.0);
          float core = pow(glow, 3.0);
          float halo = pow(glow, 1.5) * 0.5;
          float strength = core + halo;

          // Boost glow near mouse
          strength += vMouseProximity * 0.4;

          // Color shifts as shape morphs
          vec3 baseColor = mix(uColor1, uColor2, vColorMix);
          // Add depth color based on local position
          float depthMix = smoothstep(-2.0, 2.0, vPos.z);
          vec3 finalColor = mix(baseColor, uColor3, depthMix * 0.7);

          // Shift toward brighter/whiter color near mouse for energy effect
          vec3 mouseHighlight = vec3(1.0, 0.9, 1.0);
          finalColor = mix(finalColor, mouseHighlight, vMouseProximity * 0.4);

          // Subtle shimmer
          float shimmer = sin(uTime * 3.0 + vColorMix * 20.0) * 0.15 + 0.85;

          gl_FragColor = vec4(finalColor, strength * vAlpha * shimmer);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    // Move it slightly to the right so it balances with text on the left
    particles.position.set(1.5, 0, 0);
    scene.add(particles);

    // Dust layer
    const dustCount = 3000;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 15;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: material.uniforms.uTime,
        uPixelRatio: material.uniforms.uPixelRatio,
        uColor: { value: new THREE.Color("#d946ef") },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        
        varying float vAlpha;
        
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.2 + position.x) * 0.2;
          pos.x += cos(uTime * 0.15 + position.z) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (4.0 + sin(uTime * 2.0 + position.x) * 2.0) * uPixelRatio * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          vAlpha = 0.15 + 0.1 * sin(uTime + position.x * 5.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float strength = pow(1.0 - d * 2.0, 1.5);
          gl_FragColor = vec4(uColor, strength * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // Scroll tracking setup
    let scrollY = 0;
    let targetScroll = 0;
    function handleScroll() {
      targetScroll = window.scrollY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger initial calculation
    handleScroll();

    // Mouse tracking (window-level to not block other interactions)
    let mouseActive = false;
    let mouseTimeout: ReturnType<typeof setTimeout>;

    function handleMouseMove(event: MouseEvent) {
      // Normalize mouse position to -1 to 1
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
      mouseActive = true;

      // Reset timeout for mouse inactivity
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouseActive = false;
      }, 2000);
    }

    function handleMouseLeave() {
      mouseActive = false;
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);

      // On strictly mobile, move sphere to center instead of the right side
      if (window.innerWidth < 768) {
        particles.position.set(0, 0, -1);
      } else {
        particles.position.set(1.5, 0, 0);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial setup

    const clock = new THREE.Clock();
    let animationId: number;

    let baseRotationY = 0;
    let baseTimeX = 0;
    let dustTimeY = 0;
    let currentMouseInfluence = 0;

    // Reusable vectors for mouse unprojection
    const mouseWorldPos = new THREE.Vector3();
    const mouseLocalPos = new THREE.Vector3();
    const inverseMatrix = new THREE.Matrix4();

    function animate() {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      baseRotationY += delta * 0.05;
      baseTimeX += delta * 0.02;
      dustTimeY += delta * 0.02;

      // Slightly faster Lerp for scroll to feel responsive
      scrollY += (targetScroll - scrollY) * 0.08;

      // Smooth mouse position interpolation
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      // Fade mouse influence in/out
      const targetInfluence = mouseActive ? 1.0 : 0.0;
      currentMouseInfluence += (targetInfluence - currentMouseInfluence) * 0.05;

      // Calculate mouse position in particle local space
      // First, unproject from NDC to world space at z=0 plane
      // Using FOV geometry: at camera.position.z with FOV 45deg,
      // the visible half-height at z=0 is camera.position.z * tan(FOV/2)
      const fovRad = (camera.fov * Math.PI) / 180;
      const halfHeight = camera.position.z * Math.tan(fovRad / 2);
      const halfWidth = halfHeight * camera.aspect;

      mouseWorldPos.set(
        mouse.x * halfWidth,
        mouse.y * halfHeight,
        0
      );

      // Transform to particle local space (account for position and rotation)
      particles.updateMatrixWorld();
      inverseMatrix.copy(particles.matrixWorld).invert();
      mouseLocalPos.copy(mouseWorldPos).applyMatrix4(inverseMatrix);

      material.uniforms.uTime.value = elapsed;
      material.uniforms.uMouse.value.copy(mouseLocalPos);
      material.uniforms.uMouseInfluence.value = currentMouseInfluence;

      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const scrollProgress = scrollY / maxScroll;

      // Control how fast it morphs. 5 shapes = 4 transitions.
      // Boost the final value to 4.5 so that even particles with a morph delay reach target4
      material.uniforms.uMorph.value = scrollProgress * 4.5;

      // Shift terrain X position to the absolute center as the user scrolls
      // (It starts offset by 1.5 on desktop, and ends exactly at 0)
      const startX = window.innerWidth < 768 ? 0 : 1.5;
      particles.position.x = startX - (scrollProgress * startX);

      // The key MAZE effect: Highly visible rotation tied to scroll
      // Using delta for frame-rate independence
      // Add mouse-based rotation for interactive tilt
      const mouseRotationX = mouse.y * 0.15 * currentMouseInfluence;
      const mouseRotationY = mouse.x * 0.2 * currentMouseInfluence;

      particles.rotation.y = baseRotationY + scrollProgress * Math.PI * 2.0 + mouseRotationY;
      // Tilt backward to slope away from camera
      particles.rotation.x = Math.sin(baseTimeX) * 0.1 + scrollProgress * 1.55 + mouseRotationX;
      particles.rotation.z = scrollProgress * 0.2;

      // Lift up the terrain so it sits right behind the footer instead of dipping below the screen
      particles.position.y = -(scrollProgress * 1.2);
      particles.position.z = -(scrollProgress * 3.5);

      // Dust also reacts to scroll
      dust.rotation.y = dustTimeY + scrollProgress * Math.PI;
      dust.position.y = -(scrollProgress * 2.0);

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(mouseTimeout);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 bg-black"
      aria-hidden="true"
      style={{
        // Add radial gradient under the canvas to make dark colors pop and hide hard edges
        background: 'radial-gradient(circle at center, #0f0b18 0%, #000000 100%)',
      }}
    />
  );
}

