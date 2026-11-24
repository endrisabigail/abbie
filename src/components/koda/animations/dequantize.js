import * as THREE from "three";

export function dequantize(geometry) {
  const g = geometry.clone();
  Object.keys(g.attributes).forEach((name) => {
    const attr = g.attributes[name];
    if (attr.array instanceof Float32Array && !attr.isInterleavedBufferAttribute) return;
    const n = attr.count;
    const k = attr.itemSize;
    const out = new Float32Array(n * k);
    for (let i = 0; i < n; i++) {
      out[i * k] = attr.getX(i);
      if (k > 1) out[i * k + 1] = attr.getY(i);
      if (k > 2) out[i * k + 2] = attr.getZ(i);
      if (k > 3) out[i * k + 3] = attr.getW(i);
    }
    g.setAttribute(name, new THREE.BufferAttribute(out, k));
  });
  return g;
}
