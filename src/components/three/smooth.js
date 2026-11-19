import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

function toFloat(attr) {
  const n = attr.count;
  const k = attr.itemSize;
  const out = new Float32Array(n * k);
  for (let i = 0; i < n; i++) {
    out[i * k] = attr.getX(i);
    if (k > 1) out[i * k + 1] = attr.getY(i);
    if (k > 2) out[i * k + 2] = attr.getZ(i);
    if (k > 3) out[i * k + 3] = attr.getW(i);
  }
  return new THREE.BufferAttribute(out, k);
}

export function smoothGeometry(geo) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", toFloat(geo.attributes.position));
  if (geo.attributes.color) g.setAttribute("color", toFloat(geo.attributes.color));
  if (geo.index) g.setIndex(geo.index.clone());
  const merged = mergeVertices(g, 1e-4);
  merged.computeVertexNormals();
  return merged;
}

export function smoothModel(root, { roughness = 0.6 } = {}) {
  const cache = new Map();
  root.traverse((o) => {
    if (!o.isMesh) return;
    if (!o.geometry.attributes.normal || o.material?.flatShading) {
      o.geometry = smoothGeometry(o.geometry);
    }
    const src = o.material;
    if (!cache.has(src)) {
      const m = src.clone();
      m.flatShading = false;
      m.roughness = Math.max(m.roughness ?? 0, roughness);
      m.metalness = 0;
      m.needsUpdate = true;
      cache.set(src, m);
    }
    o.material = cache.get(src);
  });
  return root;
}
