import { useEffect, useState } from "react";
import "./MediaGallery.css";

export function Screens({ items }) {
  const [open, setOpen] = useState(-1);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(-1);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  if (!items.length) return null;
  return (
    <>
      <div className="screens">
        {items.map((m, i) => (
          <button key={m.url} className="screen" onClick={() => setOpen(i)}>
            <img src={m.url} alt={m.caption} loading="lazy" />
            <span>{m.caption}</span>
          </button>
        ))}
      </div>
      {open >= 0 && (
        <div className="media-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(-1)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={items[open].url} alt={items[open].caption} />
            <figcaption>{items[open].caption}</figcaption>
            <button className="media-close" onClick={() => setOpen(-1)} aria-label="Close">✕</button>
          </figure>
        </div>
      )}
    </>
  );
}

export function Videos({ items }) {
  if (!items.length) return null;
  return (
    <div className="videos">
      {items.map((m) => (
        <figure key={m.url} className="video">
          <video src={m.url} autoPlay muted loop playsInline controls preload="metadata" />
          <figcaption>{m.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
