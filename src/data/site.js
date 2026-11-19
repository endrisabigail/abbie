export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const me = {
  name: "Abigail Endris",
  first: "Abigail",
  title: "UI/UX developer & 3D artist",
  status: "Open to new grad roles · Graduating Dec 2026",
  hometown: "Dallas, TX",
  school: "University of North Texas",
  email: "endrisabigail@gmail.com",
  github: "https://github.com/endrisabigail",
  linkedin: "https://linkedin.com/in/abigail-endris",
  resume: asset("Abigail_Endris_Resume.pdf"),
  song: asset("audio/song.mp3"),
  intro:
    "Bridging the gap between robust network security and creative software engineering, from designing UI/UX to building 3D characters and worlds in Blender and Nomad (with a special love for game development and building things that matter)! ⋆˙⟡",
};

export const nav = [
  { label: "Education", to: "/#education" },
  { label: "Internship", to: "/#internship" },
  { label: "Projects", to: "/#projects" },
  { label: "Process", to: "/process" },
  { label: "Contact", to: "/#contact" },
];

export const marquee = ["UI/UX design", "Full-stack development", "3D character art", "React Three Fiber", "Network security"];
