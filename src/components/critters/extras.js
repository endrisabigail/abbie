import * as THREE from "three";

const EXTRAS = {
  "koda/bunny": {
    hands: { color: [0.46, 0.31, 0.1], radius: 0.072, centerX: 0.384, x: 0.125, y: -0.325, z: 0.13 },
  },
};

export function extrasKey(src) {
  const m = src.match(/models\/([^/]+\/[^/.]+)\.glb/);
  return m ? m[1] : src;
}

export function addExtras(key, root) {
  const cfg = EXTRAS[key];
  if (!cfg) return root;
  if (cfg.hands) {
    const h = cfg.hands;
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0 });
    mat.color.setRGB(h.color[0], h.color[1], h.color[2]);
    const geo = new THREE.SphereGeometry(h.radius, 32, 24);
    [h.x, 2 * h.centerX - h.x].forEach((x) => {
      const hand = new THREE.Mesh(geo, mat);
      hand.position.set(x, h.y, h.z);
      hand.name = "hand";
      root.add(hand);
    });
  }
  return root;
}
