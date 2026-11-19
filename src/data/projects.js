import { asset } from "./site.js";
import { mediaFor } from "./media.js";

const koda = (n) => asset(`models/koda/${n}.glb`);
const hearth = (n) => asset(`models/hearth/${n}.glb`);
const thumb = (n) => asset(`img/critters/${n}.webp`);

export const projects = [
  {
    id: "koda",
    number: "01",
    name: "Koda",
    tagline: "A baby-tracking app where each child gets a 3D animal companion",
    role: "UNT sponsored capstone · UI/UX Developer",
    color: "#b9e86a",
    cover: thumb("koda-bear"),
    tech: ["React", "React Three Fiber", "Three.js", "Node.js", "Express", "MongoDB", "JWT Auth", "Nomad Sculpt"],
    summary:
      "Koda is a Tamagotchi-inspired baby tracker. Parents and caregivers log feeds, naps, and moods, and each child is paired with a 3D animal character that reacts to those logs. It also includes offline sync, multi-caregiver access, and an AI summary of recent activity.",
    contributions: [
      "Designed and implemented the app's UI/UX, including the habitat backgrounds, animation code, 3D rendered avatars, and dark mode interface.",
      "Created the wireframes and proposed the tech stack the team built on (React, Node.js, Express, MongoDB).",
      "Built the login and registration flows with JWT-based authentication, form validation, and session handling.",
    ],
    critters: [
      { name: "Bear", src: koda("bear"), img: thumb("koda-bear") },
      { name: "Frog", src: koda("frog"), img: thumb("koda-frog") },
      { name: "Bunny", src: koda("bunny"), img: thumb("koda-bunny") },
      { name: "Koala", src: koda("koala"), img: thumb("koda-koala") },
      { name: "Fox", src: koda("fox"), img: thumb("koda-fox") },
      { name: "Panda", src: koda("panda"), img: thumb("koda-panda") },
    ],
    links: [
      { label: "Live app", href: "https://koda-app-8f5h.onrender.com/" },
      { label: "GitHub", href: "https://github.com/Team8-Bedrock/koda-babytracker" },
    ],
    posts: ["designing-koda-interface", "cozy-habitats-in-r3f", "sculpting-koda-critters"],
    status: "In development",
  },
  {
    id: "hearth",
    number: "02",
    name: "Hearth",
    tagline: "Project management as a shared 3D space",
    role: "Personal project",
    color: "#ffb38a",
    cover: thumb("hearth-frog"),
    tech: ["React", "Three.js", "Node.js", "MongoDB", "Socket.IO", "Firebase Auth", "Anthropic API", "Blender"],
    summary:
      "Hearth turns tasks into quests inside a 3D plaza. Teammates appear as avatars in real time over Socket.IO, an AI companion helps break large tasks into smaller steps, and completing work changes the environment around you.",
    contributions: [
      "Built the MERN stack from scratch, with Firebase Authentication for sign-in and password resets.",
      "Built the real-time multiplayer plaza with avatar presence over Socket.IO.",
      "Added an AI companion backed by a server route to the Anthropic API.",
      "Sculpted the characters and props in Blender.",
    ],
    critters: [
      { name: "Frog", src: hearth("frog"), img: thumb("hearth-frog") },
      { name: "Snail", src: hearth("snail"), img: thumb("hearth-snail") },
      { name: "Apple", src: hearth("apple"), img: thumb("hearth-apple") },
      { name: "Tomato", src: hearth("tomato"), img: thumb("hearth-tomato") },
    ],
    links: [{ label: "Live app", href: "https://hearth-umber-six.vercel.app/" }],
    posts: ["hearth-plaza"],
  },
  {
    id: "firewall",
    number: "03",
    name: "PA-415 Firewall Lab",
    tagline: "Configuring and hardening a Palo Alto firewall",
    role: "Palo Alto Networks internship",
    color: "#6fc3f2",
    tech: ["PAN-OS", "Zero Trust", "NAT / Routing", "Security Policies"],
    summary:
      "Configured a PA-415 to route outbound internet access and verified stateful traffic filtering across Layer 3 interfaces without active cloud registration, using custom NAT rules, routing tables, and inter-zone security policies.",
    contributions: [
      "Enforced network isolation to prevent lateral movement toward internal zones.",
      "Applied a 60-minute DHCP lease limit to reduce dynamic host exposure.",
    ],
    icon: "🛡️",
    links: [],
    posts: [],
  },
  {
    id: "portfolio",
    number: "04",
    name: "This Portfolio",
    tagline: "A portfolio built around a 3D sculpt of me",
    role: "Personal site",
    color: "#ff9ec7",
    cover: asset("img/me.webp"),
    tech: ["React", "Vite", "React Three Fiber", "Nomad Sculpt", "GitHub Actions"],
    summary:
      "The site is built around a 3D model of me that I sculpted in Nomad. The wave is done in code: the arm is pivoted at the shoulder and the sleeve mesh bends at the elbow, so the model didn't need a rig.",
    contributions: [
      "Sculpted the model in Nomad and compressed it from 17MB to under 2MB with meshopt.",
      "Wrote the idle and wave animations in React Three Fiber.",
      "Set up automatic deployment to GitHub Pages with GitHub Actions.",
    ],
    icon: "👋",
    links: [{ label: "Source", href: "https://github.com/endrisabigail/abbie" }],
    posts: ["waving-hello"],
  },
].map((p) => ({ ...p, media: mediaFor(p.id) }));
