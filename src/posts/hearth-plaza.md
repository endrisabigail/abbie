---
title: Building Hearth's real-time plaza
date: 2026-08-25
project: Hearth
cover: 🐌
color: #ffb38a
image: img/critters/hearth-snail.webp
tags: [MERN, Socket.IO, Three.js, Firebase]
summary: How I built a shared 3D space for a project management app.
---

**Hearth** is a project management app built around a shared 3D plaza. The goal was to make tracking work feel less like filling out a spreadsheet.

## Stack

- **MongoDB, Express, React, and Node** for the core app
- **Socket.IO** for real-time presence
- **Firebase Authentication** for sign-in and password resets
- **Three.js** for the plaza
- Backend hosted on **Render**, frontend on **Vercel**

## Real-time presence

When teammates open Hearth, they appear as avatars in the plaza. Each client keeps a socket connection open and sends small position updates, and the server relays them to everyone else in the room:

```js
socket.on("avatar:move", (pos) => {
  socket.to(roomId).emit("avatar:moved", { id: socket.id, pos });
});
```

On the client, avatars are interpolated between updates so their movement looks smooth.

## Tasks as quests

Tasks appear as quest nodes on a map. Getting the node coordinates to line up with the 3D world at every screen size took a few rounds of fixes.

## AI companion

Hearth includes an AI companion that helps break large tasks into smaller steps. It calls the **Anthropic API** through a backend route, so the API key is never exposed to the browser.

## Visual details

I added a gradient sky, a pond, butterflies, blob shadows under the avatars, and a dirt path to make the plaza feel like a real place. I also built a messaging system and redesigned the settings modal.

```critter
models: hearth/frog, hearth/snail, hearth/apple, hearth/tomato
caption: Hearth characters, sculpted in Blender
```
