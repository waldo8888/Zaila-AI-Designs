/**
 * GLSL for the particle stage. The ambient shaders moved verbatim from the old
 * sphere-background.tsx; STORY_VERTEX drives the homepage and shares
 * PARTICLE_FRAGMENT with them.
 */

export const PARTICLE_VERTEX = /* glsl */ `
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
    vAlpha = 0.35 + 0.35 * (1.0 - smoothstep(0.0, 8.0, dist));
    vAlpha *= 0.4 + aRandom * 0.3;

    // Boost alpha near mouse for glow effect
    vAlpha += vMouseProximity * 0.2;

    // Color variation based on position and randomness
    vColorMix = fract(aRandom + sin(pos.y * 2.0 + uTime) * 0.1);
  }
`;

export const PARTICLE_FRAGMENT = /* glsl */ `
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

    // Dim overall output so text in the foreground stays readable
    gl_FragColor = vec4(finalColor * 0.9, strength * vAlpha * shimmer * 0.9);
  }
`;

export const DUST_VERTEX = /* glsl */ `
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

    vAlpha = 0.08 + 0.06 * sin(uTime + position.x * 5.0);
  }
`;

export const DUST_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float strength = pow(1.0 - d * 2.0, 1.5);
    gl_FragColor = vec4(uColor, strength * vAlpha);
  }
`;

/**
 * The homepage story (stage-story.ts). Positions are worked out in world space
 * so the logo faces the camera and the leak heads for the screen's right edge
 * while the orb itself turns. Every term is a function of the uniforms, so
 * scrolling back reverses each scene exactly.
 */
export const STORY_VERTEX = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aLogo;
  attribute vec4 aLeak;
  attribute float aRandom;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uFly;
  uniform float uStream;
  uniform float uLeak;
  uniform float uExitX;
  uniform float uLogoScale;
  uniform vec3 uMouse;
  uniform float uMouseInfluence;

  varying float vAlpha;
  varying float vColorMix;
  varying vec3 vPos;
  varying float vMouseProximity;

  void main() {
    // The orb: the sphere in position, turned and placed by the model matrix
    vec3 orbLocal = position;
    float floatSpeed = 0.5 + aRandom * 0.5;
    orbLocal.x += sin(uTime * floatSpeed + aRandom * 6.28) * 0.05;
    orbLocal.y += cos(uTime * floatSpeed * 0.7 + aRandom * 6.28) * 0.05;
    orbLocal.z += sin(uTime * floatSpeed * 0.5 + aRandom * 3.14) * 0.05;
    vec3 orb = (modelMatrix * vec4(orbLocal, 1.0)).xyz;

    // Intro: fly from the scatter into the logo, which shimmers while it holds...
    float delay = aRandom * 0.35;
    float fly = clamp((uFly - delay) / (1.0 - delay), 0.0, 1.0);
    fly = 1.0 - pow(1.0 - fly, 3.0);
    vec3 logo = aLogo * uLogoScale;
    logo.x += sin(uTime * 3.0 + aRandom * 6.28) * 0.006;
    logo.y += cos(uTime * 2.5 + aRandom * 3.14) * 0.006;
    vec3 intro = mix(aStart, logo, fly);
    float spiral = (1.0 - fly) * 6.28318 * aRandom;
    intro.xy += vec2(cos(spiral), sin(spiral)) * (1.0 - fly) * 0.3;

    // ...then stream into the orb
    float stream = clamp((uStream - delay) / (1.0 - delay), 0.0, 1.0);
    stream = stream * stream * (3.0 - 2.0 * stream);
    vec3 world = mix(intro, orb, stream);

    // The leak: once in the orb, some particles peel away past the right edge
    float leak = smoothstep(aLeak.x, aLeak.x + 0.25, uLeak) * stream;
    world = mix(world, vec3(uExitX + aLeak.w, aLeak.y, aLeak.z), leak);
    world.y += sin(leak * 3.14159) * 0.3 * sign(aLeak.y);

    // Particles near the cursor push away (the orb's, not the logo's)
    vec3 toMouse = world - uMouse;
    float repulsion = smoothstep(1.5, 0.0, length(toMouse.xy)) * uMouseInfluence * stream;
    world += normalize(toMouse + vec3(0.001)) * repulsion * 0.8;
    world.z += repulsion * 0.5;
    vMouseProximity = repulsion;

    vec4 mvPosition = viewMatrix * vec4(world, 1.0);

    // Finer points while they draw the logo, the orb's soft glow once they arrive
    float size = mix(14.0 + aRandom * 14.0, 20.0 + aRandom * 25.0, stream);
    size *= uPixelRatio * (1.0 + vMouseProximity * 0.5);
    gl_PointSize = size * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    float orbAlpha = (0.35 + 0.35 * (1.0 - smoothstep(0.0, 8.0, length(orbLocal)))) * (0.4 + aRandom * 0.3);
    float logoAlpha = 0.75 + aRandom * 0.25;
    vAlpha = mix(logoAlpha, orbAlpha, stream) + vMouseProximity * 0.2;

    // The orb's depth tint; the logo keeps its light lilac and pink
    vPos = mix(vec3(0.0, 0.0, -2.0), orbLocal, stream);
    vColorMix = fract(aRandom + sin(orbLocal.y * 2.0 + uTime) * 0.1);
  }
`;
