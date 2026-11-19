import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { smoothModel } from "../three/smooth.js";

const V = THREE.Vector3;
const boxOf = (o) => new THREE.Box3().setFromObject(o);
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const STYLE = {
  newOutfit: false,
  hat: false,
  bandaids: true,
};

export const SMILE = {
  lift: 0.06,
  widen: 0.38,
  power: 2,
  center: 0.002,
  depth: 0.06,
  thin: -0.1,
  openUpper: 0.01,
  openLower: 0.07,
  teethZ: 0.035,
  teethShare: 0.62,
  rest: 0.75,
  restOpen: 0.55,
  waving: 1,
};

export const ARM = {
  elbowAt: 0.36,
  bendSoftness: 0.12,
  raise: -1.7,
  bend: 1.05,
  waveSwing: 0.38,
};

export const FACE = {
  smile: false,
  happyEyes: false,
  blush: false,
  blink: true,
  blinkEvery: 4.5,
};

export const MOTION = {
  hair: 1,
  legKick: 1,
  legSway: 1,
};

export const HAIR = {
  locs: true,
  colors: ["#170f0b", "#1e140e", "#120b08", "#231610"],
  twist: 105,
  groove: 0.32,
  shine: 0.55,
};

export const OUTFIT = {
  top: "#f3ecdc",
  stripe: "#26406b",
  hem: "#26406b",
  shorts: "#4f78b0",
  socks: "#fbf7ee",
  shoes: "#b9a6ff",
  hat: "#c6f24e",
  hatBand: "#26406b",
  bandaid: "#e7b48b",
  bandaidPad: "#f8e0c6",
};

function solid(color, roughness = 0.75) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
}

function striped(base, stripe) {
  const mat = solid(base, 0.85);
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uStripe = { value: new THREE.Color(stripe) };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aRestY;\nvarying float vRestY;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRestY = aRestY;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uStripe;\nvarying float vRestY;")
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\nfloat band = fract(vRestY * 3.6);\nfloat s = smoothstep(0.0, 0.03, band) * (1.0 - smoothstep(0.34, 0.37, band));\ndiffuseColor.rgb = mix(diffuseColor.rgb, uStripe, s);"
      );
  };
  return mat;
}

function smoothNormals(mesh) {
  let g = mesh.geometry;
  g.deleteAttribute("color");
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  const flat = new THREE.BufferGeometry();
  flat.setAttribute("position", new THREE.BufferAttribute(floatAttr(g.attributes.position), 3));
  if (g.index) flat.setIndex(g.index.clone());
  g = mergeVertices(flat, 1e-4);
  g.computeVertexNormals();
  mesh.geometry = g;
}

function avgColor(mesh) {
  const c = mesh.geometry.attributes.color;
  if (!c) return null;
  let r = 0, g = 0, b = 0;
  const step = Math.max(1, Math.floor(c.count / 400));
  let n = 0;
  for (let i = 0; i < c.count; i += step) {
    r += c.getX(i);
    g += c.getY(i);
    b += c.getZ(i);
    n++;
  }
  return { r: r / n, g: g / n, b: b / n };
}

function addRestY(mesh) {
  const g = mesh.geometry;
  const pos = g.attributes.position;
  const m = mesh.matrixWorld;
  const arr = new Float32Array(pos.count);
  const v = new V();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).applyMatrix4(m);
    arr[i] = v.y;
  }
  g.setAttribute("aRestY", new THREE.BufferAttribute(arr, 1));
}

function floatAttr(attr) {
  const out = new Float32Array(attr.count * 3);
  for (let i = 0; i < attr.count; i++) {
    out[i * 3] = attr.getX(i);
    out[i * 3 + 1] = attr.getY(i);
    out[i * 3 + 2] = attr.getZ(i);
  }
  return out;
}

function makeBender(mesh, elbow, axisDir, armLen, sign, at, axis = "z") {
  const g = mesh.geometry;
  const pos0 = floatAttr(g.attributes.position);
  const nor0 = g.attributes.normal ? floatAttr(g.attributes.normal) : null;
  const n = pos0.length / 3;
  const toPivot = mesh.matrix.clone();
  const fromPivot = toPivot.clone().invert();
  const nTo = new THREE.Matrix3().getNormalMatrix(toPivot);
  const nFrom = new THREE.Matrix3().getNormalMatrix(fromPivot);
  const pv = new Float32Array(n * 3);
  const nv = nor0 ? new Float32Array(n * 3) : null;
  const w = new Float32Array(n);
  const v = new V();
  for (let i = 0; i < n; i++) {
    v.set(pos0[i * 3], pos0[i * 3 + 1], pos0[i * 3 + 2]).applyMatrix4(toPivot);
    pv[i * 3] = v.x;
    pv[i * 3 + 1] = v.y;
    pv[i * 3 + 2] = v.z;
    const t = v.dot(axisDir) / armLen;
    w[i] = smooth(at - ARM.bendSoftness, at + ARM.bendSoftness, t);
    if (nv) {
      v.set(nor0[i * 3], nor0[i * 3 + 1], nor0[i * 3 + 2]).applyMatrix3(nTo).normalize();
      nv[i * 3] = v.x;
      nv[i * 3 + 1] = v.y;
      nv[i * 3 + 2] = v.z;
    }
  }
  const posAttr = new THREE.BufferAttribute(new Float32Array(pos0), 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  g.setAttribute("position", posAttr);
  let norAttr = null;
  if (nv) {
    norAttr = new THREE.BufferAttribute(new Float32Array(nor0), 3);
    norAttr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("normal", norAttr);
  }
  mesh.frustumCulled = false;
  let last = null;
  const p = new V();
  return (angle) => {
    const a = angle * sign;
    if (last !== null && Math.abs(a - last) < 1e-4) return;
    last = a;
    for (let i = 0; i < n; i++) {
      const th = a * w[i];
      const c = Math.cos(th);
      const s = Math.sin(th);
      const x = pv[i * 3] - elbow.x;
      const y = pv[i * 3 + 1] - elbow.y;
      const z = pv[i * 3 + 2] - elbow.z;
      if (axis === "x") p.set(pv[i * 3], y * c - z * s + elbow.y, y * s + z * c + elbow.z).applyMatrix4(fromPivot);
      else p.set(x * c - y * s + elbow.x, x * s + y * c + elbow.y, pv[i * 3 + 2]).applyMatrix4(fromPivot);
      posAttr.setXYZ(i, p.x, p.y, p.z);
      if (norAttr) {
        const nx = nv[i * 3];
        const ny = nv[i * 3 + 1];
        const nz = nv[i * 3 + 2];
        if (axis === "x") p.set(nx, ny * c - nz * s, ny * s + nz * c).applyMatrix3(nFrom).normalize();
        else p.set(nx * c - ny * s, nx * s + ny * c, nz).applyMatrix3(nFrom).normalize();
        norAttr.setXYZ(i, p.x, p.y, p.z);
      }
    }
    posAttr.needsUpdate = true;
    if (norAttr) norAttr.needsUpdate = true;
  };
}

function makeSmiler(meshes, mouthBox, faceX) {
  const cx = faceX;
  const cy = (mouthBox.min.y + mouthBox.max.y) / 2;
  const halfL = Math.max(cx - mouthBox.min.x, mouthBox.max.x - cx) * 0.95;
  const halfR = halfL;
  const items = meshes.map((m) => {
    const g = m.geometry;
    const pos0 = floatAttr(g.attributes.position);
    const toRoot = m.matrixWorld.clone();
    const fromRoot = toRoot.clone().invert();
    const n = pos0.length / 3;
    const rp = new Float32Array(n * 3);
    const v = new V();
    let sumY = 0;
    for (let i = 0; i < n; i++) {
      v.set(pos0[i * 3], pos0[i * 3 + 1], pos0[i * 3 + 2]).applyMatrix4(toRoot);
      rp.set([v.x, v.y, v.z], i * 3);
      sumY += v.y;
    }
    const attr = new THREE.BufferAttribute(new Float32Array(pos0), 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("position", attr);
    let mnx = Infinity, mxx = -Infinity;
    for (let i = 0; i < n; i++) {
      mnx = Math.min(mnx, rp[i * 3]);
      mxx = Math.max(mxx, rp[i * 3]);
    }
    return { attr, rp, fromRoot, n, upper: sumY / n > cy, hl: Math.max(1e-4, cx - mnx), hr: Math.max(1e-4, mxx - cx) };
  });
  let upperBottom = Infinity;
  let lowerTop = -Infinity;
  for (const it of items) {
    for (let i = 0; i < it.n; i++) {
      const x = it.rp[i * 3];
      if (Math.abs(x - cx) > Math.min(halfL, halfR) * 0.35) continue;
      const y = it.rp[i * 3 + 1];
      if (it.upper) upperBottom = Math.min(upperBottom, y);
      else lowerTop = Math.max(lowerTop, y);
    }
  }
  const contactY = isFinite(upperBottom) && isFinite(lowerTop) ? (upperBottom + lowerTop) / 2 : cy;
  let lastA = -1;
  let lastO = -1;
  const p = new V();
  const fn = (amount, open = 0) => {
    if (Math.abs(amount - lastA) < 0.002 && Math.abs(open - lastO) < 0.002) return;
    lastA = amount;
    lastO = open;
    for (const it of items) {
      for (let i = 0; i < it.n; i++) {
        const x0 = it.rp[i * 3];
        const dx = x0 < cx ? (x0 - cx) / it.hl : (x0 - cx) / it.hr;
        const x = x0 + (cx + dx * (dx < 0 ? halfL : halfR) - x0) * Math.min(1, amount * 1.2);
        const ax = Math.min(1, Math.abs(dx));
        const k = Math.pow(ax, SMILE.power);
        const y0 = it.rp[i * 3 + 1];
        const yThin = cy + (y0 - cy) * (1 - SMILE.thin * amount * (0.4 + 0.6 * k));
        const gap = it.upper ? open * SMILE.openUpper * (1 - k * 0.7) : -open * SMILE.openLower * (1 - k * 0.85);
        const liftK = it.upper ? 1 : 0.82;
        p.set(
          x + Math.sign(dx) * k * SMILE.widen * (dx < 0 ? halfL : halfR) * amount * (it.upper ? 1 : 0.92),
          yThin + (k * SMILE.lift * liftK - (1 - k) * SMILE.center) * amount + gap,
          it.rp[i * 3 + 2] - k * (SMILE.depth + (it.upper ? 0 : 0.02)) * amount
        ).applyMatrix4(it.fromRoot);
        it.attr.setXYZ(i, p.x, p.y, p.z);
      }
      it.attr.needsUpdate = true;
    }
  };
  fn.contactY = contactY;
  fn.cx = cx;
  fn.halfL = halfL;
  fn.halfR = halfR;
  return fn;
}

function makeMouth(smiler, lipZ) {
  const { cx, halfL, halfR, contactY } = smiler;
  const N = 40;
  const mk = (color, basic) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array((N + 1) * 2 * 3), 3));
    const idx = [];
    for (let i = 0; i < N; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      idx.push(a, b, c, b, d, c);
    }
    g.setIndex(idx);
    const m = basic ? new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }) : new THREE.MeshStandardMaterial({ color, roughness: 0.3, emissive: color, emissiveIntensity: 0.18, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(g, m);
    mesh.frustumCulled = false;
    return mesh;
  };
  const inside = mk("#3a1217", true);
  const teeth = mk("#fbf8f1", false);
  const group = new THREE.Group();
  group.add(inside, teeth);
  const update = (amount, open) => {
    group.visible = open > 0.02;
    if (!group.visible) return;
    const pi = inside.geometry.attributes.position;
    const pt = teeth.geometry.attributes.position;
    for (let i = 0; i <= N; i++) {
      const u = -0.97 + (1.94 * i) / N;
      const au = Math.abs(u);
      const k = Math.pow(au, SMILE.power);
      const half = u < 0 ? halfL : halfR;
      const x = cx + u * half + Math.sign(u) * k * SMILE.widen * half * amount;
      const base = contactY + (k * SMILE.lift - (1 - k) * SMILE.center) * amount;
      const top = base + open * SMILE.openUpper * (1 - k * 0.7) + 0.006;
      const bot = base - open * SMILE.openLower * (1 - k * 0.85) - 0.006;
      const mid = top - (top - bot) * SMILE.teethShare;
      const z = lipZ - u * u * 0.075 - k * SMILE.depth * amount;
      pt.setXYZ(i * 2, x, top, z + 0.002);
      pt.setXYZ(i * 2 + 1, x, mid, z + 0.002);
      pi.setXYZ(i * 2, x, top, z - 0.004);
      pi.setXYZ(i * 2 + 1, x, bot, z - 0.004);
    }
    pi.needsUpdate = true;
    pt.needsUpdate = true;
    teeth.geometry.computeVertexNormals();
  };
  return { group, update };
}

function makeBlush(faceMeshes, eyeCenter, side) {
  const ray = new THREE.Raycaster();
  const target = new V(eyeCenter.x * 1.3, eyeCenter.y - 0.14, 5);
  ray.set(target, new V(0, 0, -1));
  const hit = ray.intersectObjects(faceMeshes, false)[0];
  if (!hit) return null;
  const n = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : new V(0, 0, 1);
  const mat = new THREE.MeshBasicMaterial({ color: "#ff6f86", transparent: true, opacity: 0, depthWrite: false });
  const tex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.45, "#9a9a9a");
    g.addColorStop(1, "#000000");
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  mat.alphaMap = tex;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.13), mat);
  m.position.copy(hit.point).addScaledVector(n, 0.006);
  m.lookAt(hit.point.clone().add(n));
  m.rotation.z += side * 0.15;
  m.renderOrder = 2;
  return m;
}

function makeEye(parts) {
  const box = new THREE.Box3();
  parts.forEach((it) => box.union(it.b));
  const c = box.getCenter(new V());
  const sz = box.getSize(new V());
  const group = new THREE.Group();
  group.position.copy(c);
  const lids = new THREE.Group();
  group.add(lids);
  const curve = new THREE.QuadraticBezierCurve3(
    new V(-sz.x * 0.34, -sz.y * 0.1, 0),
    new V(0, sz.y * 0.34, 0.01),
    new V(sz.x * 0.34, -sz.y * 0.1, 0)
  );
  const arc = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, sz.y * 0.045, 8, false), new THREE.MeshStandardMaterial({ color: "#1c120e", roughness: 0.5 }));
  arc.position.set(0, -sz.y * 0.05, box.max.z - c.z - sz.z * 0.08);
  arc.scale.set(1, 0.001, 1);
  arc.visible = false;
  return { group, lids, arc, parts, box };
}

function makeBandaid(legMesh, kneeY, tilt) {
  const ray = new THREE.Raycaster();
  const lb = boxOf(legMesh);
  const lc = lb.getCenter(new V());
  const hit = (origin, dir) => {
    ray.set(origin, dir);
    const h = ray.intersectObject(legMesh, false)[0];
    return h ? h.point : null;
  };
  const front = hit(new V(lc.x, kneeY, lb.max.z + 2), new V(0, 0, -1));
  const back = hit(new V(lc.x, kneeY, lb.min.z - 2), new V(0, 0, 1));
  const left = hit(new V(lb.min.x - 2, kneeY, lc.z), new V(1, 0, 0));
  const right = hit(new V(lb.max.x + 2, kneeY, lc.z), new V(-1, 0, 0));
  if (!front || !back || !left || !right) return null;
  const cx = (left.x + right.x) / 2;
  const cz = (front.z + back.z) / 2;
  const r = Math.max((right.x - left.x) / 2, (front.z - back.z) / 2);
  const g = new THREE.Group();
  const strip = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.012, r + 0.012, 0.085, 32, 1, true, -0.75, 1.5), solid(OUTFIT.bandaid, 0.7));
  strip.material.side = THREE.DoubleSide;
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.016, r + 0.016, 0.06, 16, 1, true, -0.24, 0.48), solid(OUTFIT.bandaidPad, 0.85));
  pad.material.side = THREE.DoubleSide;
  g.add(strip, pad);
  g.position.set(cx, kneeY, cz);
  g.rotation.set(0, 0, tilt);
  return g;
}

function locMaterial(color) {
  const mat = new THREE.MeshStandardMaterial({ color, roughness: HAIR.shine, metalness: 0 });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTwist = { value: HAIR.twist };
    shader.uniforms.uGroove = { value: HAIR.groove };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLocPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLocPos = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uTwist;\nuniform float uGroove;\nvarying vec3 vLocPos;")
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\nfloat tw = sin(vLocPos.y * uTwist + (vLocPos.x + vLocPos.z) * uTwist * 0.65);\nfloat tw2 = sin(vLocPos.y * uTwist * 0.5 - (vLocPos.x - vLocPos.z) * uTwist * 0.4);\nfloat groove = smoothstep(0.2, 1.0, tw) * 0.7 + smoothstep(0.5, 1.0, tw2) * 0.3;\ndiffuseColor.rgb *= 1.0 - uGroove * groove;\ndiffuseColor.rgb += vec3(0.018, 0.011, 0.007) * (1.0 - groove);"
      );
  };
  return mat;
}

function makeHat() {
  const pts = [
    [0.0, 0.43],
    [0.2, 0.425],
    [0.34, 0.4],
    [0.41, 0.33],
    [0.44, 0.18],
    [0.46, 0.06],
    [0.52, 0.02],
    [0.6, -0.04],
    [0.66, -0.1],
    [0.68, -0.13],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const geo = new THREE.LatheGeometry(pts, 48);
  const hat = new THREE.Mesh(geo, solid(OUTFIT.hat, 0.9));
  hat.material.side = THREE.DoubleSide;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.444, 0.452, 0.085, 48, 1, true), solid(OUTFIT.hatBand, 0.8));
  band.material.side = THREE.DoubleSide;
  band.position.y = 0.1;
  const g = new THREE.Group();
  g.add(hat, band);
  return g;
}

export function buildRig(scene) {
  const root = scene.clone(true);
  root.traverse((o) => {
    if (o.isMesh) o.geometry = o.geometry.clone();
  });
  smoothModel(root, { roughness: 0.55 });
  root.updateMatrixWorld(true);
  const full = boxOf(root);
  const size = full.getSize(new V());
  const center = full.getCenter(new V());
  const top = full.max.y;

  const info = [];
  root.traverse((o) => {
    if (o.isMesh) {
      const b = boxOf(o);
      info.push({ m: o, b, c: b.getCenter(new V()), s: b.getSize(new V()) });
    }
  });

  const isArm = (it, side) =>
    (side < 0 ? it.c.x < center.x - 0.5 : it.c.x > center.x + 0.5) && it.c.y < top - 1.5 && it.c.y > top - 3.6;
  const armR = info.filter((it) => isArm(it, -1));
  const armL = info.filter((it) => isArm(it, 1));
  const armSet = new Set([...armR, ...armL]);
  const head = info.filter((it) => !armSet.has(it) && it.c.y > top - 1.27);
  const headSet = new Set(head);
  const upper = info.filter((it) => !armSet.has(it) && !headSet.has(it) && it.c.y > top - 3.05);
  const lips = head.filter((it) => Math.abs(it.c.x - center.x) < 0.12 && it.c.z > 0.25 && it.s.x < 0.35 && it.c.y < top - 0.88 && it.c.y > top - 1.2);
  const torso = upper.filter((it) => it.s.x > 1.0);
  if (HAIR.locs) {
    const isDark = (it) => {
      const c = avgColor(it.m);
      if (c) return c.r < 0.16 && c.g < 0.12 && c.b < 0.1;
      const col = it.m.material?.color;
      return col ? col.r < 0.16 && col.g < 0.12 && col.b < 0.1 : false;
    };
    head
      .filter((it) => it.s.y > 0.18 && isDark(it))
      .forEach((it, i) => {
        it.m.material = locMaterial(HAIR.colors[i % HAIR.colors.length].slice(0, 7));
      });
  }
  const shorts = info.filter((it) => it.c.y < top - 3.05 && it.c.y > top - 3.65 && it.s.x > 0.6);
  const legs = info.filter((it) => it.c.y < top - 3.9 && it.c.y > top - 4.9 && it.s.y > 0.9);
  const socks = info.filter((it) => it.c.y < top - 4.8 && it.c.y > top - 5.15 && it.s.y < 0.6);
  const shoes = info.filter((it) => it.c.y < top - 5.15);
  const sleeves = [...armR, ...armL].filter((it) => it.s.y > 1.0);

  if (STYLE.newOutfit) {
    const isGreen = (it) => {
      const c = avgColor(it.m);
      return c && c.g > c.r * 1.15 && c.g > c.b * 1.15;
    };
    const dressed = new Set([...torso, ...sleeves, ...shorts, ...socks, ...shoes]);
    const trims = info.filter((it) => !dressed.has(it) && !headSet.has(it) && it.c.y > top - 3.6 && isGreen(it));
    [...torso, ...sleeves, ...shorts, ...socks, ...shoes, ...trims].forEach((it) => smoothNormals(it.m));
    trims.forEach((it) => (it.m.material = solid(OUTFIT.hem, 0.85)));
    [...torso, ...sleeves].forEach((it) => addRestY(it.m));
    const topMat = striped(OUTFIT.top, OUTFIT.stripe);
    torso.forEach((it) => (it.m.material = it.s.y < 0.5 ? solid(OUTFIT.hem, 0.85) : topMat));
    sleeves.forEach((it) => (it.m.material = topMat));
    shorts.forEach((it) => (it.m.material = solid(OUTFIT.shorts, 0.9)));
    socks.forEach((it) => (it.m.material = solid(OUTFIT.socks, 0.85)));
    shoes.forEach((it) => (it.m.material = solid(OUTFIT.shoes, 0.55)));
  }

  const shortsBox = new THREE.Box3();
  shorts.forEach((it) => shortsBox.union(it.b));
  const kneeY = (shorts.length ? shortsBox.min.y : top - 3.9) - 0.2;
  const bandaids = new Map();
  legs.forEach((it, i) => {
    if (!STYLE.bandaids) return;
    const b = makeBandaid(it.m, kneeY + (i ? 0.02 : -0.03), i ? -0.28 : 0.32);
    if (b) {
      root.add(b);
      bandaids.set(it, b);
    }
  });

  const buildLeg = (side) => {
    const leg = legs.find((it) => Math.sign(it.c.x - center.x) === side);
    if (!leg) return null;
    const below = info.filter((it) => it !== leg && !legs.includes(it) && !shorts.includes(it) && it.c.y < kneeY && Math.sign(it.c.x - center.x) === side && Math.abs(it.c.x - leg.c.x) < 0.45);
    const hip = new THREE.Group();
    hip.position.set(leg.c.x, leg.b.max.y - 0.05, leg.c.z);
    root.add(hip);
    root.updateMatrixWorld(true);
    hip.attach(leg.m);
    const bd = bandaids.get(leg);
    if (bd) hip.attach(bd);
    const legLen = leg.b.max.y - leg.b.min.y;
    const kneePt = new V(0, kneeY - (leg.b.max.y - 0.05), 0.02);
    const knee = new THREE.Group();
    knee.position.copy(kneePt);
    hip.add(knee);
    hip.updateMatrixWorld(true);
    below.forEach((it) => knee.attach(it.m));
    const at = Math.abs(kneePt.y) / (legLen + 0.25);
    const bender = makeBender(leg.m, kneePt, new V(0, -1, 0), legLen + 0.25, 1, Math.min(0.8, at), "x");
    if (bd) {
      root.updateMatrixWorld(true);
      knee.attach(bd);
    }
    return {
      hip,
      bend: (a) => {
        knee.rotation.x = a;
        bender(a);
      },
    };
  };
  const legR = buildLeg(-1);
  const legL = buildLeg(1);

  const waist = new THREE.Group();
  waist.position.set(center.x, top - 3.0, center.z);
  root.add(waist);
  const neck = new THREE.Group();
  neck.position.set(center.x, top - 1.36, center.z - 0.05);
  root.updateMatrixWorld(true);
  waist.attach(neck);

  const mouthBox = new THREE.Box3();
  lips.forEach((it) => mouthBox.union(it.b));
  const smile = FACE.smile && lips.length ? makeSmiler(lips.map((l) => l.m), mouthBox, center.x) : () => {};
  let mouth = null;
  if (FACE.smile && lips.length) {
    const lipZ = lips.reduce((a, it) => a + it.c.z, 0) / lips.length + SMILE.teethZ;
    mouth = makeMouth(smile, lipZ);
    root.add(mouth.group);
  }

  const eyeBand = (it) =>
    it.c.y < top - 0.68 && it.c.y > top - 0.9 && Math.abs(it.c.x - center.x) > 0.06 && Math.abs(it.c.x - center.x) < 0.3 && it.c.z > 0.15 && it.s.x < 0.32 && it.s.y < 0.28;
  const eyeParts = head.filter((it) => !lips.includes(it) && eyeBand(it));
  const eyes = [-1, 1]
    .map((side) => eyeParts.filter((it) => Math.sign(it.c.x - center.x) === side))
    .filter((p) => p.length)
    .map(makeEye);
  root.updateMatrixWorld(true);
  eyes.forEach((e) => {
    root.add(e.group);
    root.updateMatrixWorld(true);
    e.parts.forEach((it) => e.lids.attach(it.m));
    e.group.add(e.arc);
  });

  const buildArm = (parts, side) => {
    if (!parts.length) return null;
    const ab = new THREE.Box3();
    parts.forEach((it) => ab.union(it.b));
    const shoulder = new THREE.Group();
    const sx = side < 0 ? ab.max.x - 0.33 : ab.min.x + 0.33;
    shoulder.position.set(sx, ab.max.y - 0.105, (ab.min.z + ab.max.z) / 2 - 0.06);
    root.add(shoulder);
    root.updateMatrixWorld(true);
    waist.attach(shoulder);
    shoulder.updateMatrixWorld(true);
    parts.forEach((it) => shoulder.attach(it.m));
    shoulder.updateMatrixWorld(true);
    const hands = parts.filter((it) => it.s.y <= 1.0);
    const sl = parts.filter((it) => it.s.y > 1.0);
    const handC = new V();
    if (hands.length) hands[0].b.getCenter(handC);
    else ab.getCenter(handC);
    const handLocal = shoulder.worldToLocal(handC.clone());
    const len = handLocal.length();
    const dir = handLocal.clone().normalize();
    const elbowPt = dir.clone().multiplyScalar(len * ARM.elbowAt);
    const elbow = new THREE.Group();
    elbow.position.copy(elbowPt);
    shoulder.add(elbow);
    shoulder.updateMatrixWorld(true);
    hands.forEach((it) => elbow.attach(it.m));
    const benders = sl.map((it) => makeBender(it.m, elbowPt, dir, len, 1, ARM.elbowAt));
    return {
      shoulder,
      bend: (a) => {
        elbow.rotation.z = a;
        benders.forEach((b) => b(a));
      },
    };
  };

  const right = buildArm(armR, -1);
  const left = buildArm(armL, 1);
  root.updateMatrixWorld(true);
  const faceIds = new Set(head.filter((it) => Math.abs(it.c.x - center.x) < 0.06 && it.s.y > 0.9 && it.s.x < 0.9));
  const hair = [];
  head.forEach((it) => {
    if (eyes.some((e) => e.parts.includes(it))) return;
    const isLock = MOTION.hair > 0 && !faceIds.has(it) && !lips.includes(it) && it.s.y > 0.25;
    if (!isLock) {
      neck.attach(it.m);
      return;
    }
    const piv = new THREE.Group();
    const along = it.c.y - it.b.min.y;
    piv.position.set(it.c.x, it.b.max.y - 0.04, it.c.z);
    root.add(piv);
    root.updateMatrixWorld(true);
    piv.attach(it.m);
    neck.attach(piv);
    hair.push({ piv, phase: (it.c.x * 7.3 + it.c.z * 3.1) % 6.28, len: it.s.y, side: Math.sign(it.c.x - center.x) || 1, along });
  });
  const faceMeshes = head.filter((it) => Math.abs(it.c.x - center.x) < 0.06 && it.s.y > 0.9 && it.s.x < 0.9).map((it) => it.m);
  root.updateMatrixWorld(true);
  const blushes = !FACE.blush ? [] : eyes
    .map((e) => makeBlush(faceMeshes, e.box.getCenter(new V()), Math.sign(e.box.getCenter(new V()).x - center.x)))
    .filter(Boolean);
  blushes.forEach((b) => {
    root.add(b);
    root.updateMatrixWorld(true);
    neck.attach(b);
  });
  eyes.forEach((e) => neck.attach(e.group));
  if (mouth) neck.attach(mouth.group);
  upper.forEach((it) => waist.attach(it.m));

  if (STYLE.hat) {
    const hat = makeHat();
    hat.position.set(center.x, top - 0.33, center.z - 0.06);
    hat.rotation.set(-0.16, 0, 0.05);
    root.add(hat);
    root.updateMatrixWorld(true);
    neck.attach(hat);
  }

  root.position.set(-center.x, -full.min.y, -center.z);
  const holder = new THREE.Group();
  holder.add(root);
  holder.scale.setScalar(3 / size.y);

  const face = (amount, open, closed, blush = 0) => {
    smile(amount, open);
    if (mouth) mouth.update(amount, open);
    blushes.forEach((b) => (b.material.opacity = blush));
    eyes.forEach((e) => {
      const happy = Math.min(1, Math.max(0, (closed - 0.5) * 2));
      e.lids.scale.y = Math.max(0.02, 1 - closed);
      e.arc.visible = FACE.happyEyes && happy > 0.01;
      e.arc.scale.y = Math.max(0.001, happy);
    });
  };

  return { holder, waist, neck, right, left, smile, face, eyes, legR, legL, hair, hairState: { lastT: null, ny: 0, nz: 0, vy: 0, vz: 0 } };
}

export const WAVE_LEN = 3.4;
export const ELBOW_SIGN = -1;

function glance(t) {
  const c = t % 11;
  const k = smooth(6, 6.6, c) * (1 - smooth(8.2, 8.8, c));
  const side = Math.floor(t / 11) % 2 ? 1 : -1;
  return { x: k * 0.55 * side, y: k * 0.12 };
}

export function poseAt(rig, t, waveT, look = { x: 0, y: 0 }, music = 0) {
  const breathe = Math.sin(t * 1.9);
  const g = glance(t);
  const shift = Math.sin(t * 0.55);
  let shoulderR = Math.sin(t * 1.05) * 0.03;
  let elbowR = 0.12 + Math.sin(t * 1.05 + 0.6) * 0.04;
  let waistZ = shift * 0.03;
  let headZ = Math.sin(t * 0.7 + 1) * 0.035 - shift * 0.02;
  let smileAmt = SMILE.rest;
  let lift = 0;
  let headX = 0;
  let leftZ = 0;
  let teethAmt = 0;
  let joy = 0;

  if (music > 0) {
    const beat = t * Math.PI * 2 * 1.05;
    const bob = Math.abs(Math.sin(beat));
    lift += bob * 0.035 * music;
    headZ += Math.sin(beat) * 0.08 * music;
    headX += bob * 0.07 * music;
    waistZ += Math.sin(beat) * 0.05 * music;
    shoulderR += Math.sin(beat) * 0.12 * music;
    leftZ += Math.sin(beat + Math.PI) * 0.12 * music;
    smileAmt += 0.25 * music;
  }

  if (waveT >= 0 && waveT < WAVE_LEN) {
    const up = ease(waveT / 0.6) * (1 - ease((waveT - (WAVE_LEN - 0.65)) / 0.65));
    const wv = waveT > 0.45 ? Math.sin((waveT - 0.45) * Math.PI * 2 * 1.9) : 0;
    const amp = smooth(0.45, 0.8, waveT) * (1 - smooth(WAVE_LEN - 0.9, WAVE_LEN - 0.55, waveT));
    shoulderR = shoulderR * (1 - up) + up * (ARM.raise + wv * amp * 0.07);
    elbowR = elbowR * (1 - up) + up * (ARM.bend + wv * amp * ARM.waveSwing) * ELBOW_SIGN;
    waistZ += up * 0.045;
    headZ += up * -0.09 + wv * amp * 0.015;
    smileAmt = SMILE.rest + up * (SMILE.waving - SMILE.rest);
    teethAmt = smooth(0.2, 0.7, waveT) * (1 - smooth(WAVE_LEN - 0.8, WAVE_LEN - 0.3, waveT));
    joy = teethAmt;
    lift += Math.sin(Math.min(1, waveT / 0.5) * Math.PI) * 0.03;
  }

  const lx = THREE.MathUtils.clamp(look.x + g.x, -1, 1);
  const ly = look.y + g.y;
  rig.waist.rotation.set(-ly * 0.04, look.x * 0.18, waistZ);
  rig.waist.scale.set(1 - breathe * 0.004, 1 + breathe * 0.008, 1 - breathe * 0.004);
  rig.neck.rotation.set(-ly * 0.12 + Math.sin(t * 0.5) * 0.02 + headX, lx * 0.34, headZ);
  if (rig.right) {
    rig.right.shoulder.rotation.z = shoulderR;
    rig.right.bend(elbowR);
  }
  if (rig.left) {
    rig.left.shoulder.rotation.z = -Math.sin(t * 1.05 + 0.4) * 0.03 + waistZ * -0.6 + leftZ;
    rig.left.bend(-(0.1 + Math.sin(t * 1.05 + 1) * 0.04));
  }
  const bt = (t % FACE.blinkEvery) / FACE.blinkEvery;
  const blink = bt > 0.96 ? Math.sin(((bt - 0.96) / 0.04) * Math.PI) : 0;
  if (FACE.smile) {
    const openAmt = SMILE.restOpen + (1 - SMILE.restOpen) * teethAmt;
    rig.face(smileAmt, openAmt, Math.max(FACE.blink ? blink * 0.98 : 0, FACE.happyEyes ? joy : 0), FACE.blush ? 0.2 + 0.25 * joy : 0);
  } else {
    rig.face(0, 0, FACE.blink ? blink * 0.98 : 0, 0);
  }

  const kick = waveT >= 0 && waveT < WAVE_LEN ? smooth(0.25, 0.8, waveT) * (1 - smooth(WAVE_LEN - 0.9, WAVE_LEN - 0.35, waveT)) * MOTION.legKick : 0;
  const tap = waveT >= 0 ? Math.max(0, Math.sin((waveT - 0.8) * Math.PI * 2 * 1.9)) * kick : 0;
  const idleShift = Math.sin(t * 0.55) * MOTION.legSway;
  if (rig.legL) {
    rig.legL.hip.rotation.x = kick * 0.32 + tap * 0.08;
    rig.legL.hip.rotation.z = idleShift * 0.02 + kick * 0.05;
    rig.legL.bend(kick * 1.15 + tap * 0.25 + (music > 0 ? Math.max(0, Math.sin(t * Math.PI * 2 * 1.05)) * 0.25 * music : 0));
  }
  if (rig.legR) {
    rig.legR.hip.rotation.x = 0;
    rig.legR.hip.rotation.z = idleShift * 0.02;
    rig.legR.bend(0.04 + Math.max(0, -idleShift) * 0.06 + (music > 0 ? Math.max(0, Math.sin(t * Math.PI * 2 * 1.05 + Math.PI)) * 0.25 * music : 0));
  }

  const hs = rig.hairState;
  const dt = hs.lastT === null ? 0.016 : Math.min(0.05, Math.max(0.001, t - hs.lastT));
  hs.lastT = t;
  const ny = rig.neck.rotation.y + rig.waist.rotation.y;
  const nz = rig.neck.rotation.z + rig.waist.rotation.z;
  const velY = (ny - hs.ny) / dt;
  const velZ = (nz - hs.nz) / dt + (rig.holder.position.y - (hs.py ?? rig.holder.position.y)) / dt * 2;
  hs.ny = ny;
  hs.nz = nz;
  hs.py = rig.holder.position.y;
  hs.vy += (-velY * 0.12 - hs.vy) * Math.min(1, dt * 6);
  hs.vz += (-velZ * 0.12 - hs.vz) * Math.min(1, dt * 6);
  for (const h of rig.hair) {
    const sway = Math.sin(t * 1.4 + h.phase) * 0.035 + Math.sin(t * 2.3 + h.phase * 1.7) * 0.015;
    const amt = MOTION.hair * Math.min(1.4, 0.6 + h.len);
    h.piv.rotation.z = (sway + hs.vz * 0.5 + hs.vy * 0.25 * h.side) * amt;
    h.piv.rotation.x = (Math.sin(t * 1.1 + h.phase * 0.7) * 0.03 + Math.abs(hs.vy) * 0.15) * amt;
  }
  rig.holder.position.y = lift;
  rig.holder.position.x = shift * 0.012;
}
