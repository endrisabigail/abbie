---
title: Building Hearth, a project manager you walk around in
date: 2026-08-25
project: Hearth
cover: 🐌
color: #ffb38a
image: img/critters/hearth-snail.webp
tags: [MERN, Socket.IO, Three.js, Firebase, AI]
summary: Characters, themed plazas, quests, real-time multiplayer, and an AI companion that helps you get started.
---

**Hearth** is a project management app where your to-do list is a 3D world. Instead of checking boxes, you plant quests in a plaza, walk to them, and watch your world change as you finish them. I built it for people who find standard productivity tools clinical, including me.

## Stack

- **MongoDB, Express, React, and Node** for the core app
- **Three.js** for the 3D plazas
- **Socket.IO** for real-time multiplayer
- **Firebase Authentication** for sign-in and password resets
- **Anthropic API** for the AI companion, called from the backend so the API key never reaches the browser
- Backend on **Render**, frontend on **Vercel**

## Choosing a character

When you start, you pick who you'll be in the plaza. Each character comes with a personality, a home plaza, and a companion. Shelby the Snail, for example, is a "Patient Seeker" whose plaza is the Rain Garden and whose companion is Dewdrop. I sculpted all of the characters and companions in Blender.

![Character select](media/hearth/screens/01-character-select.webp#wide)

## Themed plazas

Every character has a plaza with its own look and atmosphere: Sunset Orchard, Rain Garden, Glowwood, Coral Reef, Lily Pond, and Sunny Farm. The interface colors change with each one, so the whole app matches the world you're in.

```gallery wide
media/hearth/screens/03-sunset-orchard.webp | Sunset Orchard
media/hearth/screens/04-rain-garden.webp | Rain Garden
media/hearth/screens/05-glowwood.webp | Glowwood
media/hearth/screens/08-coral-reef.webp | Coral Reef
media/hearth/screens/09-lily-pond.webp | Lily Pond
media/hearth/screens/10-sunny-farm.webp | Sunny Farm
```

## Quests

Tasks are called quests. When you plant a new quest, you give it a title, description, due date, points, priority, category, and tags, and you can assign it to someone in your party. If you're stuck on the description, "Write it for me" drafts one with AI.

![Planting a new quest](media/hearth/screens/02-new-quest.webp#wide)

Each quest appears in the plaza as an object you can walk to, and the "Up next" card in the corner shows your next quest with a "Walk there" button. Quest objects match the plaza, like an apple basket in the orchard or a glowing mushroom in Glowwood.

## The AI companion

Each character's companion follows you around the plaza and acts as an AI assistant. Opening a quest shows a "Help me start" option, where the companion suggests small first steps for when a quest feels too big. You can also chat with it directly to ask what to do first, get unstuck, or get a pep talk.

```gallery wide
media/hearth/screens/06-quest-details.webp | Quest details
media/hearth/screens/07-spore-chat.webp | Chatting with Spore
```

## Real-time multiplayer

Teammates join your plaza as avatars, and everyone sees each other move in real time. Each client sends small position updates over Socket.IO, and the server relays them to everyone else in the room:

```js
socket.on("avatar:move", (pos) => {
  socket.to(roomId).emit("avatar:moved", { id: socket.id, pos });
});
```

On the client, avatars are interpolated between updates so their movement looks smooth instead of jumping.

![Two players in the Rain Garden](media/hearth/screens/11-multiplayer.webp#wide)

## Messaging

Party members can message each other directly, and messages arrive as notifications.

![Direct messages](media/hearth/screens/12-messages.webp#wide)

```critter
models: hearth/frog, hearth/snail, hearth/apple, hearth/tomato
caption: Some of Hearth's characters, sculpted in Blender
```
