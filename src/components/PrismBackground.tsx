/**
 * True 3D Translucent Crystal Prism + 2D Screen-Safe Cauchy Dispersion Engine.
 * - The 3D prism rotates in perspective so front face, recessed back face,
 *   side walls, and all 9 beveled crystal ridges are clearly visible in 3D.
 * - Back faces render into the HalfFloat scene target first (with depth testing),
 *   and Front faces refract the scene + back faces using screen-space normal
 *   chromatic dispersion (RGB split), Beer-Lambert tint, and studio reflections.
 * - The 40-wavelength Cauchy raytracer runs in 2D screen space on the projected
 *   3D mid-plane vertices, making perspective near-plane ray explosions impossible.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Vec2 = [number, number];

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  energy: number;
  inside: boolean;
  wlIndex: number;
}

interface SpectralSample {
  wl: number;
  n: number;
  vivid: [number, number, number];
  core: [number, number, number];
  weight: number;
}

interface DustMote {
  t: number;
  spread: number;
  speed: number;
  radius: number;
  phase: number;
}

function buildSpectrum(): SpectralSample[] {
  const count = 40;
  const raw: {
    wl: number;
    n: number;
    vivid: [number, number, number];
    core: [number, number, number];
  }[] = [];

  let sumR = 0;
  let sumG = 0;
  let sumB = 0;

  for (let i = 0; i < count; i++) {
    const wl = 410 + (i / (count - 1)) * (695 - 410);
    const um = wl / 1000;
    const n = 1.2 + 0.1 / (um * um);

    let r = 0;
    let g = 0;
    let b = 0;
    if (wl < 440) {
      r = -(wl - 440) / (440 - 380);
      g = 0;
      b = 1;
    } else if (wl < 490) {
      r = 0;
      g = (wl - 440) / (490 - 440);
      b = 1;
    } else if (wl < 510) {
      r = 0;
      g = 1;
      b = -(wl - 510) / (510 - 490);
    } else if (wl < 580) {
      r = (wl - 510) / (580 - 510);
      g = 1;
      b = 0;
    } else if (wl < 645) {
      r = 1;
      g = -(wl - 645) / (645 - 580);
      b = 0;
    } else {
      r = 1;
      g = 0;
      b = 0;
    }

    let factor = 1;
    if (wl < 425) factor = 0.45 + 0.55 * ((wl - 410) / 15);
    else if (wl > 660) factor = 0.45 + 0.55 * ((695 - wl) / 35);

    const vivid: [number, number, number] = [
      Math.round(Math.pow(Math.max(0, r * factor), 0.86) * 255),
      Math.round(Math.pow(Math.max(0, g * factor), 0.86) * 255),
      Math.round(Math.pow(Math.max(0, b * factor), 0.86) * 255),
    ];

    const cr = r * factor;
    const cg = g * factor;
    const cb = b * factor;
    sumR += cr;
    sumG += cg;
    sumB += cb;

    raw.push({ wl, n, vivid, core: [cr, cg, cb] });
  }

  const avg = (sumR + sumG + sumB) / 3;
  const scaleR = avg / Math.max(sumR, 1e-5);
  const scaleG = avg / Math.max(sumG, 1e-5);
  const scaleB = avg / Math.max(sumB, 1e-5);

  return raw.map((s) => {
    const r = Math.min(1, s.core[0] * scaleR);
    const g = Math.min(1, s.core[1] * scaleG);
    const b = Math.min(1, s.core[2] * scaleB);
    return {
      wl: s.wl,
      n: s.n,
      vivid: s.vivid,
      core: [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)],
      weight: 1 / count,
    };
  });
}

// Build 3D equilateral prism mesh with smooth beveled edges and a 4th attribute (bevel mask)
function createPrismGeometry(S: number): {
  geometry: THREE.BufferGeometry;
  depth: number;
  R: number;
} {
  const depth = S * 0.48; // Generous 3D crystal thickness
  const fillet = S * 0.026; // Clean luxury chamfered bevel on all 9 edges
  const cornerSegs = 6;
  const bevelSegs = 6;
  const edgeSegs = 16;

  const R = S / Math.sqrt(3);
  const verts2D: Vec2[] = [
    [0, R], // top
    [-S / 2, -R / 2], // left
    [S / 2, -R / 2], // right
  ];

  const contour: {
    x: number;
    y: number;
    nx: number;
    ny: number;
    isCorner: number;
  }[] = [];
  const rCorner = fillet * 1.2;

  const cornerCenters: Vec2[] = verts2D.map(([vx, vy]) => {
    const len = Math.hypot(vx, vy);
    const ux = -vx / len;
    const uy = -vy / len;
    return [vx + ux * (rCorner * 2), vy + uy * (rCorner * 2)];
  });

  const edgeNormals: Vec2[] = [];
  for (let i = 0; i < 3; i++) {
    const a = verts2D[i];
    const b = verts2D[(i + 1) % 3];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    edgeNormals.push([dy / len, -dx / len]);
  }

  for (let i = 0; i < 3; i++) {
    const prevN = edgeNormals[(i + 2) % 3];
    const currN = edgeNormals[i];
    const [cx, cy] = cornerCenters[i];

    const a0 = Math.atan2(prevN[1], prevN[0]);
    let a1 = Math.atan2(currN[1], currN[0]);
    while (a1 < a0) a1 += Math.PI * 2;

    for (let s = 0; s <= cornerSegs; s++) {
      const u = s / cornerSegs;
      const a = a0 + (a1 - a0) * u;
      const nx = Math.cos(a);
      const ny = Math.sin(a);
      // Peak at middle of the corner bevel ridge
      const cornerFactor = Math.sin(u * Math.PI);
      contour.push({
        x: cx + nx * rCorner,
        y: cy + ny * rCorner,
        nx,
        ny,
        isCorner: cornerFactor,
      });
    }

    const nextIdx = (i + 1) % 3;
    const [ncx, ncy] = cornerCenters[nextIdx];
    const pStart: Vec2 = [cx + currN[0] * rCorner, cy + currN[1] * rCorner];
    const pEnd: Vec2 = [ncx + currN[0] * rCorner, ncy + currN[1] * rCorner];
    for (let e = 1; e < edgeSegs; e++) {
      const t = e / edgeSegs;
      contour.push({
        x: pStart[0] + (pEnd[0] - pStart[0]) * t,
        y: pStart[1] + (pEnd[1] - pStart[1]) * t,
        nx: currN[0],
        ny: currN[1],
        isCorner: 0,
      });
    }
  }

  const ringLen = contour.length;
  const halfD = depth / 2;
  const thetaMax = Math.PI / 2 - 0.04;

  const rings: {
    z: number;
    inset: number;
    nz: number;
    nr: number;
    isBevel: number;
  }[] = [];

  for (let b = bevelSegs; b >= 0; b--) {
    const u = b / bevelSegs;
    const theta = u * thetaMax;
    rings.push({
      z: -halfD + fillet * (1 - Math.sin(theta)),
      inset: fillet * (1 - Math.cos(theta)),
      nz: -Math.sin(theta),
      nr: Math.cos(theta),
      isBevel: Math.sin(u * Math.PI),
    });
  }

  for (let b = 0; b <= bevelSegs; b++) {
    const u = b / bevelSegs;
    const theta = u * thetaMax;
    rings.push({
      z: halfD - fillet * (1 - Math.sin(theta)),
      inset: fillet * (1 - Math.cos(theta)),
      nz: Math.sin(theta),
      nr: Math.cos(theta),
      isBevel: Math.sin(u * Math.PI),
    });
  }

  const positions: number[] = [];
  const normals: number[] = [];
  const bevelMask: number[] = [];
  const indices: number[] = [];

  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r];
    for (let c = 0; c < ringLen; c++) {
      const pt = contour[c];
      positions.push(
        pt.x - pt.nx * ring.inset,
        pt.y - pt.ny * ring.inset,
        ring.z
      );
      normals.push(pt.nx * ring.nr, pt.ny * ring.nr, ring.nz);
      bevelMask.push(Math.max(ring.isBevel, pt.isCorner));
    }
  }

  for (let r = 0; r < rings.length - 1; r++) {
    const row0 = r * ringLen;
    const row1 = (r + 1) * ringLen;
    for (let c = 0; c < ringLen; c++) {
      const next = (c + 1) % ringLen;
      const a = row0 + c;
      const b = row0 + next;
      const d = row1 + c;
      const e = row1 + next;
      indices.push(a, d, b, b, d, e);
    }
  }

  // Back cap (-z)
  const backCenterIdx = positions.length / 3;
  positions.push(0, 0, -halfD);
  normals.push(0, 0, -1);
  bevelMask.push(0);
  const backRingStart = positions.length / 3;
  const firstRing = rings[0];
  for (let c = 0; c < ringLen; c++) {
    const pt = contour[c];
    positions.push(
      pt.x - pt.nx * firstRing.inset,
      pt.y - pt.ny * firstRing.inset,
      -halfD
    );
    normals.push(0, 0, -1);
    bevelMask.push(0.35);
  }
  for (let c = 0; c < ringLen; c++) {
    const next = (c + 1) % ringLen;
    indices.push(backCenterIdx, backRingStart + next, backRingStart + c);
  }

  // Front cap (+z)
  const frontCenterIdx = positions.length / 3;
  positions.push(0, 0, halfD);
  normals.push(0, 0, 1);
  bevelMask.push(0);
  const frontRingStart = positions.length / 3;
  const lastRing = rings[rings.length - 1];
  for (let c = 0; c < ringLen; c++) {
    const pt = contour[c];
    positions.push(
      pt.x - pt.nx * lastRing.inset,
      pt.y - pt.ny * lastRing.inset,
      halfD
    );
    normals.push(0, 0, 1);
    bevelMask.push(0.35);
  }
  for (let c = 0; c < ringLen; c++) {
    const next = (c + 1) % ringLen;
    indices.push(frontCenterIdx, frontRingStart + c, frontRingStart + next);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute(
    'aBevel',
    new THREE.Float32BufferAttribute(bevelMask, 1)
  );
  geometry.setIndex(indices);

  return { geometry, depth, R };
}

const ENV_GLSL = /* glsl */ `
vec3 samplePanel(vec3 dir, vec3 panelDir, vec2 panelSize, float feather, vec3 color, float intensity) {
  float denom = dot(dir, panelDir);
  if (denom <= 0.001) return vec3(0.0);
  vec3 upRef = abs(panelDir.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 right = normalize(cross(upRef, panelDir));
  vec3 up = cross(panelDir, right);
  vec3 hit = dir / denom - panelDir;
  vec2 uv = vec2(dot(hit, right), dot(hit, up));
  vec2 d = abs(uv) - panelSize * 0.5;
  float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  float mask = 1.0 - smoothstep(-feather, feather, dist);
  return color * intensity * mask;
}

vec3 sampleStudio(vec3 dir) {
  vec3 d = normalize(dir);
  float floorAmt = smoothstep(-0.1, -0.85, d.y);
  float backAmt = smoothstep(0.2, -0.8, d.z);
  vec3 room = vec3(0.015, 0.017, 0.022);
  room += vec3(0.02, 0.022, 0.028) * floorAmt;
  room *= (1.0 - 0.45 * backAmt);

  vec3 c = room;
  // Left soft platinum rim light
  c += samplePanel(d, normalize(vec3(-0.75, 0.18, 0.63)), vec2(0.55, 1.4), 0.22, vec3(0.84, 0.90, 1.0), 0.95);
  // Warm lower studio bounce
  c += samplePanel(d, normalize(vec3(0.0, -0.70, 0.71)), vec2(0.55, 0.55), 0.24, vec3(1.0, 0.96, 0.90), 0.32);
  // Top-right soft luxury key light (sculpts the 3D crystal side walls & bevels without harsh glare blob)
  c += samplePanel(d, normalize(vec3(0.72, 0.44, 0.53)), vec2(0.55, 0.32), 0.22, vec3(0.82, 0.92, 1.0), 1.85);
  // Top zenith specular bar
  c += samplePanel(d, normalize(vec3(-0.15, 0.85, 0.50)), vec2(1.1, 0.18), 0.16, vec3(0.92, 0.96, 1.0), 1.35);

  c = c / (1.0 + c);
  c = pow(max(c, vec3(0.0)), vec3(1.0 / 2.2));
  c = pow(c, vec3(2.2)) * 2.3;
  return c;
}

float schlickFresnel(float cosTheta, float f0) {
  return f0 + (1.0 - f0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

vec3 linearToSrgb(vec3 c) {
  return pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2));
}
`;

const BG_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const BG_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uLightTex;
varying vec2 vUv;
void main() {
  vec3 bgSrgb = vec3(0.047, 0.047, 0.047); // #0C0C0C
  vec4 light = texture2D(uLightTex, vUv);
  vec3 lightSrgb = light.rgb * light.a;
  vec3 screened = 1.0 - (1.0 - bgSrgb) * (1.0 - clamp(lightSrgb, 0.0, 1.0));
  vec3 lin = pow(max(screened, vec3(0.0)), vec3(2.2));
  gl_FragColor = vec4(lin, 1.0);
}
`;

const COPY_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
varying vec2 vUv;
void main() {
  vec3 lin = texture2D(uTex, vUv).rgb;
  gl_FragColor = vec4(pow(clamp(lin, 0.0, 1.0), vec3(1.0 / 2.2)), 1.0);
}
`;

const GLASS_VERT = /* glsl */ `
attribute float aBevel;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying vec3 vViewNormal;
varying float vBevel;
void main() {
  vBevel = aBevel;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vViewNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

// Back faces of the 3D crystal prism: visible THROUGH the translucent front faces!
const GLASS_BACK_FRAG = /* glsl */ `
precision highp float;
uniform float uF0;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying float vBevel;

${ENV_GLSL}

void main() {
  vec3 V = normalize(vWorldPos - cameraPosition);
  vec3 N = -normalize(vWorldNormal);
  float cosIn = clamp(dot(-V, N), 0.0, 1.0);
  float F = schlickFresnel(cosIn, uF0);

  vec3 rDir = reflect(V, N);
  vec3 env = sampleStudio(rDir);

  // Subtle internal back-bevel crystal ridge highlight visible through the glass
  float bevelGlow = smoothstep(0.15, 0.95, vBevel) * 0.24;
  float rim = pow(1.0 - cosIn, 2.5) * 0.18;
  vec3 backCrystal = env * 1.45 * F + vec3(0.62, 0.76, 0.94) * (bevelGlow + rim);
  float alpha = clamp(F * 0.65 + bevelGlow * 0.75 + 0.08, 0.0, 0.85);

  gl_FragColor = vec4(backCrystal * alpha, alpha);
}
`;

// Front faces of the 3D crystal prism: translucent screen-space chromatic refraction
// of both the rainbow light beam AND the recessed 3D back crystal faces!
const GLASS_FRONT_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uBgTex;
uniform vec2 uResolution;
uniform float uF0;
uniform float uReflectionStrength;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
varying vec3 vViewNormal;
varying float vBevel;

${ENV_GLSL}

vec3 softShoulder(vec3 x) {
  vec3 above = 0.82 + 0.18 * tanh((x - 0.82) / 0.18);
  return vec3(
    x.r > 0.82 ? above.r : x.r,
    x.g > 0.82 ? above.g : x.g,
    x.b > 0.82 ? above.b : x.b
  );
}

void main() {
  vec3 V = normalize(vWorldPos - cameraPosition);
  vec3 N = normalize(vWorldNormal);
  vec3 Nv = normalize(vViewNormal);

  float facing = clamp(dot(-V, N), 0.0, 1.0);
  float F = schlickFresnel(facing, uF0);

  // Studio reflection off the 3D angled crystal facets
  vec3 reflDir = reflect(V, N);
  vec3 envRefl = sampleStudio(reflDir);
  vec3 reflected = envRefl * uReflectionStrength;

  // Screen-space normal-driven chromatic refraction (100% immune to plane-intersection glitches)
  vec2 screenUv = gl_FragCoord.xy / uResolution;
  // Side walls & bevels bend light more strongly than the central flat cap, revealing true 3D thickness
  float sideAngle = 1.0 - abs(Nv.z);
  vec2 refractOffset = Nv.xy * (0.022 + 0.036 * sideAngle);

  vec2 uvR = clamp(screenUv - refractOffset * 0.86, 0.002, 0.998);
  vec2 uvG = clamp(screenUv - refractOffset * 1.00, 0.002, 0.998);
  vec2 uvB = clamp(screenUv - refractOffset * 1.16, 0.002, 0.998);

  float bgR = texture2D(uBgTex, uvR).r;
  float bgG = texture2D(uBgTex, uvG).g;
  float bgB = texture2D(uBgTex, uvB).b;
  vec3 bgLin = vec3(bgR, bgG, bgB);

  // Subtle smoked-crystal optical tint (thicker absorption on 3D side walls)
  vec3 crystalTint = mix(vec3(0.94, 0.96, 1.0), vec3(0.74, 0.84, 0.96), sideAngle * 0.55);
  vec3 transmitted = bgLin * crystalTint;

  // Crisp 3D beveled ridge highlight along all 9 chamfered edges
  float bevelRidge = smoothstep(0.25, 0.95, vBevel);
  vec3 ridgeLight = vec3(0.82, 0.90, 1.0) * bevelRidge * (0.14 + 0.22 * (1.0 - facing));

  // Translucent 3D side-wall sheen (distinguishes the extruded side walls from the front face)
  float sideWallMask = smoothstep(0.2, 0.85, sideAngle) * (1.0 - bevelRidge * 0.5);
  vec3 sideWallSheen = vec3(0.55, 0.68, 0.86) * sideWallMask * 0.075;

  // Specular studio highlight
  float lum = dot(envRefl, vec3(0.2126, 0.7152, 0.0722));
  float hlMask = smoothstep(0.4, 0.82, lum);
  float hlGain = clamp(uReflectionStrength * 0.42, 0.0, 0.78) * (0.6 + 0.4 * pow(1.0 - facing, 1.4));
  vec3 highlight = envRefl * hlMask * hlGain;

  vec3 col = transmitted * (1.0 - F * 0.75) + reflected * F + highlight + ridgeLight + sideWallSheen;
  col = softShoulder(max(col, vec3(0.0)));
  gl_FragColor = vec4(linearToSrgb(col), 1.0);
}
`;

export function PrismBackground() {
  const stageRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const glCanvas = glCanvasRef.current;
    const fxCanvas = fxCanvasRef.current;
    if (!stage || !glCanvas || !fxCanvas) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const spectrum = buildSpectrum();
    const dustMotes: DustMote[] = Array.from({ length: 48 }, () => ({
      t: Math.random(),
      spread: (Math.random() - 0.5) * 2,
      speed: 0.03 + Math.random() * 0.05,
      radius: 0.5 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
    }));

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    const fxCtx = fxCanvas.getContext('2d');
    if (!offCtx || !fxCtx) return;

    const supportsFilter = typeof fxCtx.filter === 'string';
    const blurBufs = !supportsFilter
      ? [
          document.createElement('canvas'),
          document.createElement('canvas'),
          document.createElement('canvas'),
        ]
      : [];

    let renderer: THREE.WebGLRenderer | null = null;
    let sceneBg: THREE.Scene | null = null;
    let scenePrismBack: THREE.Scene | null = null;
    let scenePrismFront: THREE.Scene | null = null;
    let sceneCopy: THREE.Scene | null = null;
    let orthoCam: THREE.OrthographicCamera | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let rt: THREE.WebGLRenderTarget | null = null;
    let lightTex: THREE.CanvasTexture | null = null;
    let prismMeshBack: THREE.Mesh | null = null;
    let prismMeshFront: THREE.Mesh | null = null;
    let backMat: THREE.ShaderMaterial | null = null;
    let frontMat: THREE.ShaderMaterial | null = null;

    const gl2 = glCanvas.getContext('webgl2', {
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    if (gl2) {
      renderer = new THREE.WebGLRenderer({
        canvas: glCanvas,
        context: gl2,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.autoClear = false;
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;

      fxCanvas.style.display = 'none';
      lightTex = new THREE.CanvasTexture(fxCanvas);
      lightTex.minFilter = THREE.LinearFilter;
      lightTex.magFilter = THREE.LinearFilter;
      lightTex.generateMipmaps = false;

      orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const quadGeo = new THREE.PlaneGeometry(2, 2);

      sceneBg = new THREE.Scene();
      sceneBg.add(
        new THREE.Mesh(
          quadGeo,
          new THREE.ShaderMaterial({
            vertexShader: BG_VERT,
            fragmentShader: BG_FRAG,
            uniforms: { uLightTex: { value: lightTex } },
            depthTest: false,
            depthWrite: false,
          })
        )
      );

      sceneCopy = new THREE.Scene();
      sceneCopy.add(
        new THREE.Mesh(
          quadGeo,
          new THREE.ShaderMaterial({
            vertexShader: BG_VERT,
            fragmentShader: COPY_FRAG,
            uniforms: { uTex: { value: null } },
            depthTest: false,
            depthWrite: false,
          })
        )
      );

      const ior = 1.645;
      const f0 = Math.pow((ior - 1) / (ior + 1), 2);

      backMat = new THREE.ShaderMaterial({
        vertexShader: GLASS_VERT,
        fragmentShader: GLASS_BACK_FRAG,
        uniforms: {
          uF0: { value: f0 },
        },
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
        depthTest: true,
        depthWrite: true,
      });

      frontMat = new THREE.ShaderMaterial({
        vertexShader: GLASS_VERT,
        fragmentShader: GLASS_FRONT_FRAG,
        uniforms: {
          uBgTex: { value: null },
          uResolution: { value: new THREE.Vector2(1280, 720) },
          uF0: { value: f0 },
          uReflectionStrength: { value: 2.2 },
        },
        side: THREE.FrontSide,
        depthTest: true,
        depthWrite: true,
      });

      scenePrismBack = new THREE.Scene();
      scenePrismFront = new THREE.Scene();
    } else {
      glCanvas.style.display = 'none';
      fxCanvas.style.display = 'block';
    }

    let W = 1280;
    let H = 720;
    let dpr = 1;
    const lightDpr = 0.55;
    let mobile = false;
    let S = 360;
    let R = 207.8;
    let cx = 640;
    let cy = 380;
    let camDist = 800;

    // 3D local mid-plane vertices (y-up)
    let localVerts3D: [number, number, number][] = [
      [0, 200, 0],
      [180, -100, 0],
      [-180, -100, 0],
    ];

    const rebuildLayout = () => {
      const rect = stage.getBoundingClientRect();
      W = Math.max(320, Math.round(rect.width));
      H = Math.max(480, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      mobile = W < 820;

      if (mobile) {
        S = Math.min(W * 0.56, H * 0.32, 310);
        cx = W * 0.5;
        cy = H * 0.54;
      } else {
        S = Math.min(W * 0.32, H * 0.52);
        cx = W * 0.55;
        cy = H * 0.56;
      }

      R = S / Math.sqrt(3);
      localVerts3D = [
        [0, R, 0], // top
        [S / 2, -R / 2, 0], // right
        [-S / 2, -R / 2, 0], // left
      ];

      offCanvas.width = Math.max(2, Math.round(W * lightDpr));
      offCanvas.height = Math.max(2, Math.round(H * lightDpr));
      fxCanvas.width = Math.max(2, Math.round(W * lightDpr));
      fxCanvas.height = Math.max(2, Math.round(H * lightDpr));

      if (renderer && scenePrismBack && scenePrismFront && backMat && frontMat) {
        renderer.setPixelRatio(dpr);
        renderer.setSize(W, H, false);

        const rtW = Math.round(W * dpr);
        const rtH = Math.round(H * dpr);
        frontMat.uniforms.uResolution.value.set(rtW, rtH);

        if (rt) rt.dispose();
        rt = new THREE.WebGLRenderTarget(rtW, rtH, {
          type: THREE.HalfFloatType,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          depthBuffer: true,
        });

        const copyMesh = sceneCopy?.children[0] as THREE.Mesh;
        (copyMesh.material as THREE.ShaderMaterial).uniforms.uTex.value =
          rt.texture;
        frontMat.uniforms.uBgTex.value = rt.texture;

        camDist = (H / 2) / Math.tan(THREE.MathUtils.degToRad(24));
        camera = new THREE.PerspectiveCamera(48, W / H, camDist * 0.1, camDist * 4);
        camera.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H);

        if (prismMeshBack) {
          scenePrismBack.remove(prismMeshBack);
          prismMeshBack.geometry.dispose();
        }
        if (prismMeshFront) {
          scenePrismFront.remove(prismMeshFront);
        }

        const { geometry } = createPrismGeometry(S);
        prismMeshBack = new THREE.Mesh(geometry, backMat);
        prismMeshFront = new THREE.Mesh(geometry, frontMat);
        scenePrismBack.add(prismMeshBack);
        scenePrismFront.add(prismMeshFront);
      }
    };

    rebuildLayout();

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(rebuildLayout, 80);
    };
    window.addEventListener('resize', onResize, { passive: true });
    document.fonts?.ready.then(rebuildLayout);

    const aimTarget = { x: 0.45, y: 0.42 };
    const aimCurr = { x: 0.45, y: 0.42 };
    const orbitTarget = { x: 0, y: 0 };
    const orbitCurr = { x: 0, y: 0 };
    let lastPointerTime = performance.now() - 7000;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const ny = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      aimTarget.x = nx;
      aimTarget.y = ny;
      if (!mobile) {
        orbitTarget.x = nx * 2 - 1;
        orbitTarget.y = ny * 2 - 1;
      }
      lastPointerTime = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      updatePointer(e.clientX, e.clientY);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      updatePointer(e.clientX, e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onPointerLeave = () => {
      orbitTarget.x = 0;
      orbitTarget.y = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave, { passive: true });

    function intersectEdge(
      ox: number,
      oy: number,
      dx: number,
      dy: number,
      a: Vec2,
      b: Vec2
    ): number {
      const ex = b[0] - a[0];
      const ey = b[1] - a[1];
      const denom = dx * ey - dy * ex;
      if (Math.abs(denom) < 1e-8) return -1;
      const qx = a[0] - ox;
      const qy = a[1] - oy;
      const t = (qx * ey - qy * ex) / denom;
      const u = (qx * dy - qy * dx) / denom;
      if (t > 1e-3 && u >= -1e-4 && u <= 1 + 1e-4) return t;
      return -1;
    }

    function refract2D(
      dx: number,
      dy: number,
      nx: number,
      ny: number,
      eta: number
    ): Vec2 | null {
      const cosI = -(dx * nx + dy * ny);
      const sinT2 = eta * eta * (1 - cosI * cosI);
      if (sinT2 >= 1) return null;
      const cosT = Math.sqrt(1 - sinT2);
      return [
        eta * dx + (eta * cosI - cosT) * nx,
        eta * dy + (eta * cosI - cosT) * ny,
      ];
    }

    function fresnelUnpolarized(
      cosI: number,
      n1: number,
      n2: number
    ): number {
      const sinI2 = Math.max(0, 1 - cosI * cosI);
      const eta = n1 / n2;
      const sinT2 = eta * eta * sinI2;
      if (sinT2 >= 1) return 1;
      const cosT = Math.sqrt(1 - sinT2);
      const rs = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
      const rp = (n1 * cosT - n2 * cosI) / (n1 * cosT + n2 * cosI);
      return 0.5 * (rs * rs + rp * rp);
    }

    const tmpVec3 = new THREE.Vector3();

    // Project a 3D local vertex of the prism to 2D screen coordinates (CSS px).
    // Only called on prism vertices (|z| <= R << camDist), never on far rays!
    const projectLocal3DToScreen = (
      lx: number,
      ly: number,
      lz: number
    ): Vec2 => {
      if (!camera || !prismMeshFront) return [cx + lx, cy - ly];
      tmpVec3.set(lx, ly, lz);
      tmpVec3.applyMatrix4(prismMeshFront.matrixWorld);
      tmpVec3.project(camera);
      return [(tmpVec3.x * 0.5 + 0.5) * W, (-tmpVec3.y * 0.5 + 0.5) * H];
    };

    let rafId = 0;
    let isHeroVisible = true;
    let prevTime = performance.now();

    const frame = (now: number) => {
      if (!isHeroVisible || document.hidden) {
        rafId = 0;
        return;
      }
      rafId = window.requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;
      const tSec = now / 1000;

      const isIdle = mobile || now - lastPointerTime > 6000;
      if (isIdle && !reducedMotion) {
        const angle = (tSec / 18) * Math.PI * 2;
        aimTarget.x = 0.5 + Math.cos(angle) * 0.28;
        aimTarget.y = 0.45 + Math.sin(angle) * 0.25;
        if (!mobile) {
          orbitTarget.x = Math.cos(angle * 0.8) * 0.55;
          orbitTarget.y = Math.sin(angle * 0.8) * 0.45;
        }
      }

      const lampEase = 1 - Math.pow(1 - 0.12, dt * 60);
      const camEase = 1 - Math.pow(1 - 0.08, dt * 60);
      aimCurr.x += (aimTarget.x - aimCurr.x) * lampEase;
      aimCurr.y += (aimTarget.y - aimCurr.y) * lampEase;
      orbitCurr.x += (orbitTarget.x - orbitCurr.x) * camEase;
      orbitCurr.y += (orbitTarget.y - orbitCurr.y) * camEase;

      // Sculptural 3D perspective angle: front triangle, recessed back triangle, and side crystal walls are always visible in 3D
      const rotY = THREE.MathUtils.degToRad(22 + orbitCurr.x * 13);
      const rotX = THREE.MathUtils.degToRad(-11 + orbitCurr.y * 9);
      const rotZ = THREE.MathUtils.degToRad(-3 + orbitCurr.x * -2.5);

      if (prismMeshBack && prismMeshFront) {
        prismMeshBack.rotation.set(rotX, rotY, rotZ);
        prismMeshFront.rotation.set(rotX, rotY, rotZ);
        prismMeshBack.updateMatrixWorld();
        prismMeshFront.updateMatrixWorld();
      }

      if (camera) {
        const yaw = THREE.MathUtils.degToRad(orbitCurr.x * 3.5);
        const pitch = THREE.MathUtils.degToRad(-orbitCurr.y * 3.5);
        camera.position.set(
          Math.sin(yaw) * Math.cos(pitch) * camDist,
          Math.sin(pitch) * camDist,
          Math.cos(yaw) * Math.cos(pitch) * camDist
        );
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();
      }

      // Project the 3D rotated prism's central cross-section triangle to 2D screen space
      const top2D = projectLocal3DToScreen(
        localVerts3D[0][0],
        localVerts3D[0][1],
        localVerts3D[0][2]
      );
      const right2D = projectLocal3DToScreen(
        localVerts3D[1][0],
        localVerts3D[1][1],
        localVerts3D[1][2]
      );
      const left2D = projectLocal3DToScreen(
        localVerts3D[2][0],
        localVerts3D[2][1],
        localVerts3D[2][2]
      );

      const pairs: [Vec2, Vec2][] = [
        [top2D, right2D], // 0: right face
        [right2D, left2D], // 1: base
        [left2D, top2D], // 2: left face
      ];
      const triEdges = pairs.map(([a, b]) => {
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const len = Math.max(1e-4, Math.hypot(dx, dy));
        return { a, b, normal: [dy / len, -dx / len] as Vec2 };
      });

      // Full-range vgpu optical swing: entry point 0.08..0.92, incidence -35° (top) -> 60° (mid) -> 75° (bottom),
      // traced in 2D screen space on the 3D prism cross-section so rays swing freely and never cross the 3D camera near-plane!
      const rightFace = triEdges[0];
      const entryT = 0.08 + aimCurr.x * (0.92 - 0.08);
      const entryX =
        rightFace.a[0] + (rightFace.b[0] - rightFace.a[0]) * entryT;
      const entryY =
        rightFace.a[1] + (rightFace.b[1] - rightFace.a[1]) * entryT;

      let incDeg: number;
      if (aimCurr.y < 0.5) {
        incDeg = -35 + (aimCurr.y / 0.5) * (60 - -35);
      } else {
        incDeg = 60 + ((aimCurr.y - 0.5) / 0.5) * (75 - 60);
      }
      const incRad = THREE.MathUtils.degToRad(incDeg);
      const inNx = -rightFace.normal[0];
      const inNy = -rightFace.normal[1];
      const cosA = Math.cos(incRad);
      const sinA = Math.sin(incRad);
      const beamDx = inNx * cosA - inNy * sinA;
      const beamDy = inNx * sinA + inNy * cosA;

      const far = Math.hypot(W, H) * 1.5;
      const srcX = entryX - beamDx * far;
      const srcY = entryY - beamDy * far;

      const pathGroups = new Map<string, Segment[]>();
      const glints: { face: number; x: number; y: number }[] = [];
      const midWl = Math.floor(spectrum.length / 2);

      const trace = (
        ox: number,
        oy: number,
        dx: number,
        dy: number,
        inside: boolean,
        energy: number,
        depth: number,
        pathKey: string,
        wlIndex: number,
        nGlass: number,
        lastFace: number
      ) => {
        if (depth > 7) return;

        let bestT = Infinity;
        let hitFace = -1;
        for (let f = 0; f < 3; f++) {
          if (f === lastFace) continue;
          const t = intersectEdge(
            ox,
            oy,
            dx,
            dy,
            triEdges[f].a,
            triEdges[f].b
          );
          if (t > 0 && t < bestT) {
            bestT = t;
            hitFace = f;
          }
        }

        if (hitFace === -1) {
          if (!inside) {
            const list = pathGroups.get(pathKey) ?? [];
            list.push({
              x1: ox,
              y1: oy,
              x2: ox + dx * far,
              y2: oy + dy * far,
              energy,
              inside: false,
              wlIndex,
            });
            pathGroups.set(pathKey, list);
          }
          return;
        }

        const hx = ox + dx * bestT;
        const hy = oy + dy * bestT;

        if (depth > 0) {
          const list = pathGroups.get(pathKey) ?? [];
          list.push({
            x1: ox,
            y1: oy,
            x2: hx,
            y2: hy,
            energy,
            inside,
            wlIndex,
          });
          pathGroups.set(pathKey, list);
        }

        if (wlIndex === midWl && energy > 0.18) {
          glints.push({ face: hitFace, x: hx, y: hy });
        }

        const outN = triEdges[hitFace].normal;
        const nx = inside ? -outN[0] : outN[0];
        const ny = inside ? -outN[1] : outN[1];
        const n1 = inside ? nGlass : 1.0;
        const n2 = inside ? 1.0 : nGlass;
        const cosI = Math.max(0, -(dx * nx + dy * ny));
        const R = fresnelUnpolarized(cosI, n1, n2);
        const T = 1 - R;

        const refr = refract2D(dx, dy, nx, ny, n1 / n2);
        if (refr && energy * T > 0.08) {
          trace(
            hx,
            hy,
            refr[0],
            refr[1],
            !inside,
            energy * T,
            depth + 1,
            `${pathKey}T${hitFace}`,
            wlIndex,
            nGlass,
            hitFace
          );
        }

        const reflE = refr ? energy * R : energy;
        if (reflE > 0.12) {
          const dot2 = 2 * (dx * nx + dy * ny);
          const rx = dx - dot2 * nx;
          const ry = dy - dot2 * ny;
          trace(
            hx,
            hy,
            rx,
            ry,
            inside,
            reflE,
            depth + 1,
            `${pathKey}R${hitFace}`,
            wlIndex,
            nGlass,
            hitFace
          );
        }
      };

      for (let i = 0; i < spectrum.length; i++) {
        trace(
          srcX,
          srcY,
          beamDx,
          beamDy,
          false,
          1.0,
          0,
          '',
          i,
          spectrum[i].n,
          -1
        );
      }

      // Draw light directly in 2D screen space (no 3D camera projection on far rays!)
      offCtx.setTransform(lightDpr, 0, 0, lightDpr, 0, 0);
      offCtx.clearRect(0, 0, W, H);
      offCtx.globalCompositeOperation = 'lighter';
      offCtx.lineCap = 'round';

      const beamScale = mobile ? 0.8 : 1;

      offCtx.strokeStyle = 'rgba(255,255,255,0.3)';
      offCtx.lineWidth = 12 * beamScale;
      offCtx.beginPath();
      offCtx.moveTo(srcX, srcY);
      offCtx.lineTo(entryX, entryY);
      offCtx.stroke();

      offCtx.strokeStyle = 'rgba(255,255,255,1)';
      offCtx.lineWidth = 4.5 * beamScale;
      offCtx.beginPath();
      offCtx.moveTo(srcX, srcY);
      offCtx.lineTo(entryX, entryY);
      offCtx.stroke();

      const perpX = -beamDy;
      const perpY = beamDx;
      for (const m of dustMotes) {
        if (!reducedMotion) {
          m.t = (m.t + m.speed * dt) % 1;
        }
        const distFromPrism = (1 - m.t) * Math.min(W, H) * 0.9;
        const spreadPx = (6 + distFromPrism * 0.08) * m.spread;
        const mx = entryX - beamDx * distFromPrism + perpX * spreadPx;
        const my = entryY - beamDy * distFromPrism + perpY * spreadPx;
        const twinkle =
          (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(tSec * 2.5 + m.phase))) * 0.75;
        offCtx.fillStyle = `rgba(255,255,255,${twinkle.toFixed(3)})`;
        offCtx.beginPath();
        offCtx.arc(mx, my, m.radius, 0, Math.PI * 2);
        offCtx.fill();
      }

      pathGroups.forEach((segs) => {
        if (segs.length === 0) return;
        segs.sort((a, b) => a.wlIndex - b.wlIndex);

        for (let i = 0; i < segs.length - 1; i++) {
          const a = segs[i];
          const b = segs[i + 1];
          if (b.wlIndex - a.wlIndex > 2) continue;

          const [vr, vg, vb] = spectrum[a.wlIndex].vivid;
          const alpha = a.energy * (a.inside ? 0.52 : 0.76);

          if (a.inside) {
            offCtx.fillStyle = `rgba(${vr},${vg},${vb},${alpha.toFixed(3)})`;
          } else {
            const grad = offCtx.createLinearGradient(a.x1, a.y1, a.x2, a.y2);
            grad.addColorStop(0, `rgba(${vr},${vg},${vb},${alpha.toFixed(3)})`);
            grad.addColorStop(
              0.3,
              `rgba(${vr},${vg},${vb},${(alpha * 0.75).toFixed(3)})`
            );
            grad.addColorStop(
              0.7,
              `rgba(${vr},${vg},${vb},${(alpha * 0.25).toFixed(3)})`
            );
            grad.addColorStop(1, `rgba(${vr},${vg},${vb},0)`);
            offCtx.fillStyle = grad;
          }

          offCtx.beginPath();
          offCtx.moveTo(a.x1, a.y1);
          offCtx.lineTo(a.x2, a.y2);
          offCtx.lineTo(b.x2, b.y2);
          offCtx.lineTo(b.x1, b.y1);
          offCtx.closePath();
          offCtx.fill();
        }

        for (const seg of segs) {
          const sp = spectrum[seg.wlIndex];
          const alpha = Math.min(1, sp.weight * seg.energy * 2.2);
          offCtx.strokeStyle = `rgba(${sp.core[0]},${sp.core[1]},${sp.core[2]},${alpha.toFixed(3)})`;
          offCtx.lineWidth = seg.inside ? 4 : 3.4;
          offCtx.beginPath();
          offCtx.moveTo(seg.x1, seg.y1);
          offCtx.lineTo(seg.x2, seg.y2);
          offCtx.stroke();
        }
      });

      for (const g of glints) {
        const edge = triEdges[g.face];
        const grad = offCtx.createRadialGradient(
          g.x,
          g.y,
          0,
          g.x,
          g.y,
          0.2 * S
        );
        grad.addColorStop(0, 'rgba(255,255,255,0.95)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        offCtx.strokeStyle = grad;
        offCtx.lineWidth = 2;
        offCtx.beginPath();
        offCtx.moveTo(edge.a[0], edge.a[1]);
        offCtx.lineTo(edge.b[0], edge.b[1]);
        offCtx.stroke();

        offCtx.fillStyle = 'rgba(255,255,255,0.95)';
        offCtx.beginPath();
        offCtx.arc(g.x, g.y, 2.6, 0, Math.PI * 2);
        offCtx.fill();
      }

      // Soft 3-pass bloom on lightweight half-res buffer
      fxCtx.setTransform(1, 0, 0, 1, 0, 0);
      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      fxCtx.globalCompositeOperation = 'lighter';

      if (supportsFilter) {
        const passes: [number, number][] = [
          [34 * lightDpr, 0.6],
          [12 * lightDpr, 0.9],
          [3.2 * lightDpr, 1.0],
        ];
        for (const [radius, alpha] of passes) {
          fxCtx.filter = `blur(${radius.toFixed(1)}px)`;
          fxCtx.globalAlpha = alpha;
          fxCtx.drawImage(offCanvas, 0, 0);
        }
        fxCtx.filter = 'none';
        fxCtx.globalAlpha = 1;
      } else {
        const scales: [number, number][] = [
          [1 / 8, 0.6],
          [1 / 3, 0.9],
          [1 / 1.5, 1.0],
        ];
        scales.forEach(([sc, alpha], idx) => {
          const buf = blurBufs[idx];
          buf.width = Math.max(2, Math.round(fxCanvas.width * sc));
          buf.height = Math.max(2, Math.round(fxCanvas.height * sc));
          const bCtx = buf.getContext('2d');
          if (!bCtx) return;
          bCtx.clearRect(0, 0, buf.width, buf.height);
          bCtx.drawImage(offCanvas, 0, 0, buf.width, buf.height);
          fxCtx.globalAlpha = alpha;
          fxCtx.drawImage(buf, 0, 0, fxCanvas.width, fxCanvas.height);
        });
        fxCtx.globalAlpha = 1;
      }

      if (
        renderer &&
        rt &&
        lightTex &&
        camera &&
        orthoCam &&
        sceneBg &&
        scenePrismBack &&
        scenePrismFront &&
        sceneCopy
      ) {
        lightTex.needsUpdate = true;

        // 1. Render background + rainbow beam + recessed 3D back faces into RT
        renderer.setRenderTarget(rt);
        renderer.clear(true, true, false);
        renderer.render(sceneBg, orthoCam);
        renderer.render(scenePrismBack, camera);

        // 2. Copy RT to screen and render translucent 3D front faces refracting the RT
        renderer.setRenderTarget(null);
        renderer.clear(true, true, false);
        renderer.render(sceneCopy, orthoCam);
        renderer.clearDepth();
        renderer.render(scenePrismFront, camera);
      } else {
        fxCtx.setTransform(lightDpr, 0, 0, lightDpr, 0, 0);
        fxCtx.globalCompositeOperation = 'source-over';
        fxCtx.strokeStyle = 'rgba(215, 226, 234, 0.25)';
        fxCtx.lineWidth = 1.5;
        fxCtx.beginPath();
        fxCtx.moveTo(top2D[0], top2D[1]);
        fxCtx.lineTo(right2D[0], right2D[1]);
        fxCtx.lineTo(left2D[0], left2D[1]);
        fxCtx.closePath();
        fxCtx.stroke();
      }
    };

    const startLoop = () => {
      if (!rafId && isHeroVisible && !document.hidden) {
        prevTime = performance.now();
        rafId = window.requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        isHeroVisible = entries[0]?.isIntersecting ?? true;
        if (isHeroVisible) {
          startLoop();
        } else if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.01 }
    );
    io.observe(stage);

    const onVisibilityChange = () => {
      if (document.hidden && rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    startLoop();

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseleave', onPointerLeave);

      if (rt) rt.dispose();
      if (lightTex) lightTex.dispose();
      if (prismMeshBack) prismMeshBack.geometry.dispose();
      if (backMat) backMat.dispose();
      if (frontMat) frontMat.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    >
      <canvas ref={glCanvasRef} className="block h-full w-full" />
      <canvas
        ref={fxCanvasRef}
        className="absolute inset-0 block h-full w-full"
        style={{ mixBlendMode: 'screen' }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            'linear-gradient(180deg, rgba(12,12,12,0) 0%, rgba(12,12,12,0.88) 75%, #0C0C0C 100%)',
        }}
      />
    </div>
  );
}
