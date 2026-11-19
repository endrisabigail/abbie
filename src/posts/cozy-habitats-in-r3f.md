---
title: Building the Koda habitats in React Three Fiber
date: 2026-10-20
project: Koda
cover: 🏡
color: #ffd28a
image: img/critters/koda-fox.webp
tags: [React Three Fiber, Three.js, React]
summary: The camera setup, model grounding, and placement techniques behind Koda's 3D habitat scenes.
---

Each Koda character has its own habitat scene that sits behind the app's home screen. I built them in **React Three Fiber**, and these are the techniques that made them work.

```gallery
media/koda/screens/01-bear-habitat.webp | Bear: cottage and garden
media/koda/screens/02-frog-habitat.webp | Frog: pond
media/koda/screens/03-bunny-habitat.webp | Bunny: spring garden
media/koda/screens/04-panda-habitat.webp | Panda: bamboo forest
media/koda/screens/05-koala-habitat.webp | Koala: treehouse
media/koda/screens/06-fox-habitat.webp | Fox: autumn hill
```

## Isometric camera

The scenes use an **orthographic** camera at an isometric angle:

```js
const ISO_DISTANCE = 7.8;
const elevation = Math.atan(1 / Math.sqrt(2)) + 0.08;
```

`Math.atan(1 / Math.sqrt(2))` is the true isometric angle, about 35.26°. The extra `0.08` tilts the view slightly further down, which shows more of the ground.

## Grounding models

Exported models don't always sit exactly at y = 0, so characters would float or sink into the ground. The `useGroundedOffset` hook measures each model's bounding box and shifts it so its base sits on the ground plane:

```js
function useGroundedOffset(scene) {
  return useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    return -box.min.y;
  }, [scene]);
}
```

## Consistent prop placement

Trees, flowers, and rocks are scattered around each habitat. With `Math.random()` the layout would change on every render, so I use a seeded random function instead. The same seed always produces the same layout.

```js
function seededRand(seed) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
```

## Canvas ground textures

Instead of loading large image files, the ground textures are drawn on an HTML canvas and converted to Three.js textures. They're created inside `useMemo`, so each one is only drawn once.

## Sculpting the props

The larger props were sculpted in Nomad and exported as `.glb` files, like the cottage in the bear's habitat:

![Sculpting the cottage in Nomad](media/koda/sculpts/02-cottage-sculpt.mp4)

## Scale and error handling

The characters and environment models (`trees.glb`, `house.glb`) were sculpted at different scales, so an `ENV_SCALE` constant normalizes them. Every model loads inside `Suspense` with a fallback and an error boundary, so a model that fails to load doesn't break the rest of the screen.

## Dark mode

Koda supports dark mode for accessibility, so I created a nighttime version of every habitat. That way the app stays comfortable for parents to use at night while still fitting Koda's look and theme.

```gallery
media/koda/screens/07-night-mode.webp | Bear
media/koda/screens/09-frog-habitat-night.webp | Frog
media/koda/screens/10-bunny-habitat-night.webp | Bunny
media/koda/screens/11-panda-habitat-night.webp | Panda
media/koda/screens/12-koala-habitat-night.webp | Koala
media/koda/screens/08-fox-habitat-night.webp | Fox
```

## Status

All six habitats are built: the bear's cottage, the frog's pond, the bunny's spring garden, the panda's bamboo forest, the koala's treehouse, and the fox's autumn hill.
