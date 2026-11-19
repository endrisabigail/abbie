---
title: Sculpting the Koda characters
date: 2026-10-06
project: Koda
cover: 🐻
color: #b9e86a
image: img/critters/koda-bear.webp
tags: [Nomad Sculpt, Blender, Procreate, 3D]
summary: How the six Koda animals went from sketches to models that run in a phone app.
---

Every child profile in Koda is paired with an animal character: a frog, bunny, koala, fox, panda, or bear. I designed and sculpted all six. This is how I approached it.

## Sketching

Each character started as a sketch in **Procreate**. At this stage I was focused on three things:

- A clear silhouette, so each animal is recognizable at a small size
- Faces that can show different moods, since the characters react to the child's activity logs
- Consistent proportions, so the six of them look like a set

## Sculpting in Nomad

I blocked out the shapes in **Nomad Sculpt** on my iPad, starting from simple primitives for the head, body, ears, and paws. I kept the forms soft and rounded so the characters feel like plush toys.

![Sculpting the frog in Nomad](media/koda/sculpts/01-frog-sculpt.mp4)

## Cleanup in Blender

In **Blender** I cleaned up the meshes, set each model's origin at its feet so it sits on the ground correctly, applied the color palette, and exported everything as `.glb` files for React Three Fiber.

## Preparing the models for the web

Sculpted models can be heavy for a browser. For this site I compressed them with `gltf-transform` using meshopt compression, which reduced the file sizes by about 10× (the bunny went from about 15MB to 1.4MB) with no visible difference.

```bash
npx @gltf-transform/cli optimize bunny.glb bunny.min.glb --compress meshopt
```

Nomad exports don't include smooth normals, so the models render with faceted, glossy highlights by default. On this site I recompute smooth normals and use a matte material when the models load, which gives them a softer, clay-like look.

```critter
models: koda/bear, koda/frog, koda/bunny, koda/koala, koda/fox, koda/panda
caption: The six Koda characters
```

## What I'd change

I would build a shared base mesh with the proportions locked in before sculpting the individual animals. I spent a lot of time adjusting heads and ears at the end to make the set consistent.
