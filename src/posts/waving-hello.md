---
title: Animating a wave without a rig
date: 2026-11-19
project: This Portfolio
cover: 👋
color: #3ee6d4
image: img/me.webp
tags: [Nomad Sculpt, React Three Fiber, Animation]
summary: How the 3D model on my homepage waves, smiles, and moves without a skeleton.
---

The model on my homepage is a sculpt of me that I made in Nomad. It waves, smiles, follows your cursor, and moves along when the music is on, but it has no rig.

## Why no rig

Normally a character is animated by adding an armature in Blender, painting weights, and keyframing the motion. My sculpt is built from separate primitives (tubes, spheres, and lathes), so each body part is its own mesh in the exported `.glb`. That made it possible to create the joints in code instead.

## Shoulder

To rotate the arm from the shoulder, I create an empty group at the shoulder position and attach the sleeve and hand to it. `attach()` keeps each mesh's world position when it's re-parented, so the arm doesn't move until the group rotates.

```js
const shoulder = new THREE.Group();
shoulder.position.copy(shoulderPoint);
body.add(shoulder);
armMeshes.forEach((mesh) => shoulder.attach(mesh));
```

## Elbow

The sleeve is a single tube, so the elbow can't be a rigid joint. Instead, each vertex of the sleeve gets a weight based on how far it is along the arm: 0 near the shoulder, 1 past the elbow, and a smooth blend in between. When the elbow bends, each vertex rotates around the elbow point by the bend angle times its weight, which gives a rounded bend instead of a hard crease. The hand follows the same rotation.

## Face and body

The smile is also a vertex deformation. The lip vertices near the corners of the mouth are raised, more strongly the closer they are to the edge. On top of the wave, the head tilts, the upper body shifts its weight, and the model breathes slightly. Every so often it glances to the side.

## File size

The raw export was 17MB. Compressing it with `gltf-transform` and meshopt brought it under 2MB. I turned off mesh joining so the arms stayed separate from the body:

```bash
npx @gltf-transform/cli optimize me.glb me.min.glb --compress meshopt --join false --flatten false
```
