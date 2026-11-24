---
title: The head pat — animating critters with feelings
date: 2026-11-03
project: Koda
cover: 🫶
color: #ff9ec7
image: img/critters/koda-bunny.webp
tags: [Animation, React Three Fiber, UX]
summary: Squash, stretch, and why an angry fox should refuse your head pat.
---

My favorite tiny feature in Koda: you can **pat your critter on the head.** It sounds simple, but it's where a lot of the personality lives.

## Try it first!

Click the critter to give it a pat, then switch between the moves.

```critter
models: koda/bunny, koda/fox, koda/panda
move: hop
caption: click for head pats ♡
```

## Squash & stretch

All of these moves are done in code. None of them are baked animations from Blender. Every frame (`useFrame`), I change the critter's position, rotation and scale a tiny bit. The secret sauce is **squash and stretch**, one of the classic animation principles:

- when a critter jumps up, it **stretches** a little taller and thinner
- when it lands, it **squashes** shorter and wider
- the total "volume" stays about the same, so it reads as soft and bouncy

```js
const s = Math.sin(landing * Math.PI) * 0.2;
group.scale.set(1 + s * 0.55, 1 - s, 1 + s * 0.55);
```

The head pat is a squash that wobbles back to normal and fades out, plus a little burst of hearts.

## Moods change the reaction

In Koda, a critter's mood comes from the baby's activity logs and care routines, and the pat reacts to it:

- 😊 **happy** → happy squish + hearts
- 😢 **sad** → still accepts the pat, in a sad-but-cute way
- 😠 **angry** → *refuses it!*

```note
That refusal is my favorite detail. A tiny "no" makes the critter feel like it has its own feelings, not just a button you press.
```

## The hand

Each animal has its own pat file and its own hand texture, so a little mama-animal paw comes in for the pat instead of a generic hand. It's a small thing, but it keeps every critter's world consistent.

## What I learned

Small, readable motions beat big flashy ones. At phone size, a 5% squash reads way better than a full backflip.
