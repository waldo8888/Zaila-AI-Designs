import * as THREE from "three";
import {
  generateCube,
  generateDust,
  generateHelix,
  generatePlane,
  generateRandoms,
  generateSphere,
  generateTorus,
} from "./particle-shapes";
import { DUST_FRAGMENT, DUST_VERTEX, PARTICLE_FRAGMENT, PARTICLE_VERTEX } from "./particle-shaders";
import type { StageFrame, StageScene, StageSetup, StageSize } from "./stage-scene";

/**
 * Ambient mode: plan 1's like-for-like port of the old sphere background.
 * The sphere morphs through torus, helix, cube and terrain across the page's
 * scroll, turns slowly and moves away from the cursor.
 */
export function createAmbientScene(
  { scene, camera, rng, size }: StageSetup,
  counts: { particles: number; dust: number }
): StageScene {
  const shapes = [
    generateSphere(counts.particles, 2.5, rng),
    generateTorus(counts.particles, 1.8, 0.8, rng),
    generateHelix(counts.particles, 1.5, 4.5, 5, rng),
    generateCube(counts.particles, 3.5, rng),
    generatePlane(counts.particles, 3.0, rng),
  ];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
  geometry.setAttribute("aTarget1", new THREE.BufferAttribute(shapes[1], 3));
  geometry.setAttribute("aTarget2", new THREE.BufferAttribute(shapes[2], 3));
  geometry.setAttribute("aTarget3", new THREE.BufferAttribute(shapes[3], 3));
  geometry.setAttribute("aTarget4", new THREE.BufferAttribute(shapes[4], 3));
  geometry.setAttribute(
    "aRandom",
    new THREE.BufferAttribute(generateRandoms(counts.particles, rng), 1)
  );

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uPixelRatio: { value: size.pixelRatio },
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
    new THREE.BufferAttribute(generateDust(counts.dust, rng), 3)
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

  let maxScroll = 1;
  let startX = 1.5;

  function resize(next: StageSize) {
    material.uniforms.uPixelRatio.value = next.pixelRatio;
    maxScroll = Math.max(document.documentElement.scrollHeight - next.height, 1);
    startX = next.width < 768 ? 0 : 1.5;
  }
  resize(size);

  let baseRotationY = 0;
  let baseTimeX = 0;
  let dustTimeY = 0;

  // Reused vectors for mouse unprojection
  const mouseWorldPos = new THREE.Vector3();
  const mouseLocalPos = new THREE.Vector3();
  const inverseMatrix = new THREE.Matrix4();

  function update({ delta, elapsed, scrollY, mouse, mouseInfluence }: StageFrame) {
    baseRotationY += delta * 0.05;
    baseTimeX += delta * 0.02;
    dustTimeY += delta * 0.02;

    if (mouseInfluence > 0.001) {
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
    material.uniforms.uMouseInfluence.value = mouseInfluence;

    const scrollProgress = scrollY / maxScroll;

    // 5 shapes = 4 transitions; 4.5 lets delayed particles reach the last shape
    material.uniforms.uMorph.value = scrollProgress * 4.5;

    // Slide from right of centre to the middle as you scroll
    particles.position.x = startX - scrollProgress * startX;

    const mouseRotationX = mouse.y * 0.15 * mouseInfluence;
    const mouseRotationY = mouse.x * 0.2 * mouseInfluence;

    particles.rotation.y = baseRotationY + scrollProgress * Math.PI * 2.0 + mouseRotationY;
    particles.rotation.x = Math.sin(baseTimeX) * 0.1 + scrollProgress * 1.55 + mouseRotationX;
    particles.rotation.z = scrollProgress * 0.2;

    // Lift the terrain so it sits behind the footer
    particles.position.y = -(scrollProgress * 1.2);
    particles.position.z = -(scrollProgress * 3.5);

    dust.rotation.y = dustTimeY + scrollProgress * Math.PI;
    dust.position.y = -(scrollProgress * 2.0);
  }

  function dispose() {
    scene.remove(particles, dust);
    geometry.dispose();
    material.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
  }

  return { resize, update, dispose };
}
