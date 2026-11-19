import { asset } from "./site.js";

const files = import.meta.glob("../posts/*.md", { query: "?raw", import: "default", eager: true });

function parseValue(v) {
  const t = v.trim();
  if (t.startsWith("[") && t.endsWith("]")) {
    return t.slice(1, -1).split(",").map((x) => x.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  }
  return t.replace(/^["']|["']$/g, "");
}

function parse(raw, path) {
  const slug = path.split("/").pop().replace(/\.md$/, "");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const meta = {};
  let body = raw;
  if (m) {
    body = m[2];
    m[1].split(/\r?\n/).forEach((line) => {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = parseValue(line.slice(i + 1));
    });
  }
  const words = body.replace(/```[\s\S]*?```/g, "").split(/\s+/).length;
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || "",
    project: meta.project || "",
    tags: meta.tags || [],
    cover: meta.cover || "📝",
    color: meta.color || "#c6f24e",
    image: meta.image ? asset(meta.image) : "",
    summary: meta.summary || "",
    draft: meta.draft === "true",
    readTime: Math.max(1, Math.round(words / 220)),
    body,
  };
}

export const posts = Object.entries(files)
  .map(([path, raw]) => parse(raw, path))
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug) => posts.find((p) => p.slug === slug);

export const formatDate = (d) =>
  d ? new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
