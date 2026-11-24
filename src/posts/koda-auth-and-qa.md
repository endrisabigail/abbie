---
title: Securing Koda's login and testing the app
date: 2026-11-23
project: Koda
cover: 🔐
color: #b9e86a
image: img/critters/koda-bear.webp
tags: [JWT, Node.js, Express, QA Testing]
summary: How I built JWT authentication for Koda, and how we tested the app before release.
---

Koda stores information about babies and their families, so login had to be secure from the start. I built the authentication flow on the Express backend, and I was part of the QA testing before release.

## Registration

When someone signs up, the server checks that a username, email, and password were all provided, and that the email and username aren't already taken. The account is created as either a **parent** or a **caregiver**, which decides what they can see and do in the app.

Passwords are never stored as plain text. They're hashed with **bcrypt** before they're saved:

```js
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

## Logging in with JWT

On login, the server compares the entered password against the stored hash with `bcrypt.compare`. If it matches, the server signs a **JSON Web Token** containing the user's ID, which expires after 24 hours:

```js
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "24h",
});
```

The login error is the same ("Invalid credentials") whether the email or the password is wrong, so the form doesn't reveal which accounts exist.

## Protecting routes

The client sends the token with every request in an `x-auth-token` header. A middleware function checks it before any protected route runs:

```js
const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
```

Every route that reads or changes a child's data, like activity logs, notes, and chat, goes through this check.

## Password resets

The forgot-password flow generates a random one-time token, saves it with a one-hour expiration, and emails the user a reset link. The response is the same whether or not an account exists for that email, so the endpoint can't be used to look up users. New passwords must be at least 8 characters and are hashed the same way as at sign-up.

## Testing

Testing happened in three layers:

- **Automated client tests** for the offline storage, syncing, and notification logic: **8 of 8 passed**
- **Acceptance test procedure (ATP)** cases run against the requirements from September 28 to October 4: **7 of 7 passed**
- **User acceptance testing (UAT)** with real scenarios: **9 of 11 passed**, with 2 partial passes

The partial passes were the most useful results. One of them was in my area: when testing avatar selection, the choice saved correctly, but the screen took over 3 seconds to load and flashed white while the large 3D files downloaded. We fixed it by using simpler versions of the avatar and habitat elements on most pages, and keeping the full 3D scenes for the habitat itself.

The other partial pass was notifications: chat worked, but notifications only appeared inside the chat. The notification icon in the header was built in the final sprint and retested.

## What I took away

Testing with real users found problems that the requirements checks didn't, especially around performance. A screen can pass every acceptance case and still feel broken if it takes three seconds to load. Since then, compressing 3D files and planning for load times has been part of how I build from the start.
