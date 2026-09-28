import * as THREE from "three";
import { LOGO_POINTS } from "./logo-points";
import {
  decodeLogoPoints,
  generateDust,
  generateLeak,
  generateLogo,
  generateRandoms,
  generateScatter,
  generateSphere,
} from "./particle-shapes";
import { DUST_FRAGMENT, DUST_VERTEX, PARTICLE_FRAGMENT, STORY_VERTEX } from "./particle-shaders";
import type { StageFrame, StageScene, StageSetup, StageSize } from "./stage-scene";
import { directStage, introPhase, type IntroPhase } from "./story-director";
import { storyProgress } from "./story-progress";

type IntroWindow = Window & typeof globalThis & { __zailaIntroStarted?: boolean };

/** Share of the orb's particles that leak away in the reality chapter (spec §5). */
const LEAK_FRACTION = 0.45;

/**
 * Story mode, the homepage (spec §8). The intro draws the logo above the
 * curtain and streams it into the orb; the reality chapter then leaks about
 * 45% of the orb off the right edge. The story director turns progress into
 * positions, so scrolling back reverses every scene exactly.
 */
export function createStoryScene({ scene, camera, rng, size }: StageSetup): StageScene {
  const html = document.documentElement;
  const isPhone = size.width < 1024;
  const count = isPhone ? 5000 : 9000;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(generateSphere(count, 2.5, rng), 3));
  geometry.setAttribute("aStart", new THREE.BufferAttribute(generateScatter(count, 4, 8, rng), 3));
  geometry.setAttribute(
    "aLogo",
    new THREE.BufferAttribute(generateLogo(count, decodeLogoPoints(LOGO_POINTS), 1, rng), 3)
  );
  geometry.setAttribute(
    "aLeak",
    new THREE.BufferAttribute(generateLeak(count, LEAK_FRACTION, rng), 4)
  );
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(generateRandoms(count, rng), 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: size.pixelRatio },
      uFly: { value: 1 },
      uStream: { value: 1 },
      uLeak: { value: 0 },
      uExitX: { value: 4 },
      uLogoScale: { value: 2 },
      uMouse: { value: new THREE.Vector3() },
      uMouseInfluence: { value: 0 },
      uColor1: { value: new THREE.Color("#c084fc") },
      uColor2: { value: new THREE.Color("#e879f9") },
      uColor3: { value: new THREE.Color("#6d28d9") },
    },
    vertexShader: STORY_VERTEX,
    fragmentShader: PARTICLE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  // The shader moves particles far from their sphere positions (the logo, the
  // leak), so the sphere's bounds can't be used to cull them.
  particles.frustumCulled = false;
  scene.add(particles);

  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(generateDust(isPhone ? 400 : 650, rng), 3)
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

  // World units covered by the pointer's -1 to 1 at z = 0, and the viewport height
  const reach = { x: 1, y: 1 };
  let viewportHeight = size.height;

  function resize(next: StageSize) {
    const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
    const aspect = next.width / next.height;
    reach.y = camera.position.z * tanHalf;
    reach.x = reach.y * aspect;
    viewportHeight = next.height;
    material.uniforms.uPixelRatio.value = next.pixelRatio;
    // Just past the right edge, even for the deepest exit point (z = -1)
    material.uniforms.uExitX.value = (camera.position.z + 1) * tanHalf * aspect + 0.3;
    // The logo takes 58% of the height, or 72% of the width on narrow screens
    material.uniforms.uLogoScale.value = Math.min(reach.y * 2 * 0.58, reach.x * 2 * 0.72);
    // Right of centre, behind the end of the headline; centred on phones
    particles.position.x = next.width < 1024 ? 0 : 1.5;
  }
  resize(size);

  // The intro gate (intro-gate.ts) decided before first paint whether this visit gets the intro
  let introPending = html.dataset.intro === "play";
  let introStart: number | null = null;
  let phase: IntroPhase | null = null;

  let baseRotationY = 0;
  let baseTimeX = 0;
  let dustTimeY = 0;

  function update({ delta, elapsed, scrollY, mouse, mouseInfluence }: StageFrame) {
    const now = performance.now();
    if (introPending) {
      // The intro starts on the stage's first frame, so the fly-in is seen from its start
      introPending = false;
      introStart = now;
      (window as IntroWindow).__zailaIntroStarted = true;
    }
    // The gate's backstop may have lifted the curtain already: finish at once
    if (introStart !== null && html.dataset.intro === "done") introStart = null;

    const introSeconds = introStart === null ? null : (now - introStart) / 1000;
    if (introSeconds !== null) {
      const next = introPhase(introSeconds);
      if (next !== phase) {
        phase = next;
        html.dataset.intro = next;
      }
      if (next === "done") introStart = null;
    }

    const state = directStage({
      introSeconds,
      heroExit: scrollY / viewportHeight,
      reality: storyProgress.reality,
    });

    if (!still) {
      baseRotationY += delta * 0.05;
      baseTimeX += delta * 0.02;
      dustTimeY += delta * 0.02;
    }
    const influence = still ? 0 : mouseInfluence;

    const uniforms = material.uniforms;
    uniforms.uTime.value = still ? 0 : elapsed;
    uniforms.uFly.value = state.fly;
    uniforms.uStream.value = state.stream;
    uniforms.uLeak.value = state.leak;
    uniforms.uMouseInfluence.value = influence;
    if (influence > 0.001) uniforms.uMouse.value.set(mouse.x * reach.x, mouse.y * reach.y, 0);

    particles.rotation.y = baseRotationY + state.spin + mouse.x * 0.2 * influence;
    particles.rotation.x = Math.sin(baseTimeX) * 0.1 + mouse.y * 0.15 * influence;
    dust.rotation.y = dustTimeY;
  }

  function dispose() {
    // Leaving mid-intro (a route change) must never leave the curtain up
    if (introPending || introStart !== null) html.dataset.intro = "done";
    scene.remove(particles, dust);
    geometry.dispose();
    material.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
  }

  return { resize, update, dispose };
}
