/**
 * The contract between the particle stage (particle-stage.tsx) and its scenes.
 * The stage owns the renderer, the camera and the inputs; a scene owns the
 * particles and decides what they do each frame.
 */
import type * as THREE from "three";
import type { Rng } from "./particle-shapes";

export type StageSize = { width: number; height: number; pixelRatio: number };

export type StageSetup = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  rng: Rng;
  size: StageSize;
};

/** One frame's inputs. Scroll and pointer arrive already eased by the stage. */
export type StageFrame = {
  /** Seconds since the last frame, capped at 0.033. */
  delta: number;
  /** Seconds since the stage started. */
  elapsed: number;
  /** window.scrollY, eased. */
  scrollY: number;
  /** Pointer position, eased: -1 to 1 on each axis, y up. */
  mouse: { x: number; y: number };
  /** 0 → 1 while the pointer moves, easing back to 0 when it rests. */
  mouseInfluence: number;
};

export type StageScene = {
  resize(size: StageSize): void;
  /** Return false to skip drawing this frame (the story sleeps through the day). */
  update(frame: StageFrame): boolean | void;
  dispose(): void;
};
