import { useMemo } from "react";
import { Marked } from "marked";
import LazyCritter from "./critters/LazyCritter.jsx";
import { asset } from "../data/site.js";
import { mediaUrl } from "../data/media.js";
import { Screens } from "./MediaGallery.jsx";

const resolve = (src) => {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  if (/^\/?(src\/)?media\//.test(src)) return mediaUrl(src) || "";
  return asset(src);
};

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const md = new Marked({
  gfm: true,
  renderer: {
    image({ href, title, text }) {
      const cap = title || "";
      const url = resolve(href);
      if (!url) return "";
      if (/\.(mp4|webm)$/i.test(href)) {
        return `<figure class="md-figure"><video src="${url}" autoplay muted loop playsinline controls></video>${cap || text ? `<figcaption>${escape(cap || text)}</figcaption>` : ""}</figure>`;
      }
      return `<figure class="md-figure"><img src="${url}" alt="${escape(text || "")}" loading="lazy" />${cap ? `<figcaption>${escape(cap)}</figcaption>` : ""}</figure>`;
    },
    code({ text, lang }) {
      if (lang === "note") return `<aside class="md-note"><span class="md-note-tape"></span>${md.parse(text)}</aside>`;
      const label = lang ? `<span class="md-code-lang">${escape(lang)}</span>` : "";
      return `<div class="md-code">${label}<pre><code>${escape(text)}</code></pre></div>`;
    },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      const ext = /^https?:/.test(href);
      return `<a href="${href}"${title ? ` title="${escape(title)}"` : ""}${ext ? ' target="_blank" rel="noopener"' : ""}>${inner}</a>`;
    },
  },
});

function parseProps(text) {
  const props = {};
  text.split(/\r?\n/).forEach((line) => {
    const i = line.indexOf(":");
    if (i > 0) props[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return props;
}

const EMBED = /```(critter|video|gallery)\r?\n([\s\S]*?)```/g;

function split(body) {
  const parts = [];
  let last = 0;
  for (const m of body.matchAll(EMBED)) {
    if (m.index > last) parts.push({ type: "md", text: body.slice(last, m.index) });
    parts.push(m[1] === "gallery" ? { type: "gallery", lines: m[2].split(/\r?\n/).map((l) => l.trim()).filter(Boolean) } : { type: m[1], props: parseProps(m[2]) });
    last = m.index + m[0].length;
  }
  if (last < body.length) parts.push({ type: "md", text: body.slice(last) });
  return parts;
}

function CritterEmbed({ props }) {
  const critters = (props.models || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((path) => {
      const name = path.split("/").pop();
      return { name: name[0].toUpperCase() + name.slice(1), src: asset(`models/${path}.glb`) };
    });
  if (!critters.length) return null;
  return (
    <figure className="md-embed">
      <LazyCritter critters={critters} />
      {props.caption && <figcaption>{props.caption}</figcaption>}
    </figure>
  );
}

function GalleryEmbed({ lines }) {
  const items = lines
    .map((line) => {
      const m = line.match(/^(\S+)\s*(?:\|\s*(.*))?$/);
      if (!m) return null;
      const url = resolve(m[1]);
      return url ? { url, caption: m[2] || "" } : null;
    })
    .filter(Boolean);
  if (!items.length) return null;
  return (
    <div className="md-gallery">
      <Screens items={items} />
    </div>
  );
}

function VideoEmbed({ props }) {
  const src = resolve(props.src || "");
  if (!src) return null;
  return (
    <figure className="md-figure">
      <video src={src} poster={props.poster ? resolve(props.poster) : undefined} autoPlay muted loop playsInline controls />
      {props.caption && <figcaption>{props.caption}</figcaption>}
    </figure>
  );
}

export default function Markdown({ body }) {
  const parts = useMemo(() => split(body), [body]);
  return (
    <div className="md">
      {parts.map((p, i) => {
        if (p.type === "critter") return <CritterEmbed key={i} props={p.props} />;
        if (p.type === "video") return <VideoEmbed key={i} props={p.props} />;
        if (p.type === "gallery") return <GalleryEmbed key={i} lines={p.lines} />;
        return <div key={i} dangerouslySetInnerHTML={{ __html: md.parse(p.text) }} />;
      })}
    </div>
  );
}
