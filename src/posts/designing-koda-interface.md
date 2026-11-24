---
title: Designing Koda's interface
date: 2026-11-19
project: Koda
cover: 📘
color: #f3e7c9
image: img/critters/koda-frog.webp
tags: [UI/UX, Wireframes, React]
summary: From rough wireframes to the baby passport, mood reactions, and the screen between habitats.
---

As the UI/UX developer on Koda, I designed and built the screens parents and caregivers use every day. These are a few of the parts I worked on.

## Wireframes

Before any code, I mapped out the app's flows in rough wireframes: loading and welcome screens, login and password reset, the parent sign-up and baby profile setup, the dashboard, log history, analytics, settings, and the chat room.

![The full app flow](media/koda/screens/18-wireframe-flow.webp#wide)

I then annotated each screen with notes on layout, animations, and behavior, which the team used as a reference while building.

![Annotated wireframes](media/koda/screens/19-wireframe-flow-annotated.webp#wide)

The wireframes also planned out the two roles in the app. Parents and caregivers share most screens, but caregivers join with an invite code and get a reduced set of tabs (parents see five, caregivers see four).

![Wireframe for logging an activity](media/koda/screens/20-wireframe-logging.webp#wide)

![Wireframe for the caregiver screens](media/koda/screens/21-wireframe-caregiver.webp#wide)

## Baby passport

Each child has a passport-style profile with their name, birthday, age, animal, weight, and allergies. Below it, a mood explanation shows how the child was last logged and when. A notes section lets parents add notes by topic (diaper, mood, sleeping, playtime, feeding, allergies) and choose whether caregivers can see each note.

![The baby passport](media/koda/screens/13-baby-passport.webp#tall)

## Moods

The characters react to what gets logged. When a child is logged as mad, their animal reacts too, like the bear here with a "grrr!" speech bubble.

![The bear reacting to an angry mood log](media/koda/screens/14-angry-mood.webp#small)

## Linking caregivers

I designed the screens for bringing a caregiver into a family. A caregiver enters a 6-character link code that the parent shares from their settings, and the parent approves the request. Parents can then control what each caregiver is allowed to do in chat, like sending photos, sending voice messages, or marking messages as urgent. The linking and permission logic behind these screens was built by my teammates.

![Entering a link code](media/koda/screens/15-caregiver-link-code.webp#tall)

![Chat permissions for a caregiver](media/koda/screens/16-caregiver-permissions.webp#small)

## Entering a habitat

When switching to a child's habitat, a short transition plays while the 3D scene loads: a "Koda Air" boarding pass flying from home to the child's habitat.

![The habitat loading screen](media/koda/screens/17-habitat-loading-screen.webp#tall)
