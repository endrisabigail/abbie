import { useCallback, useEffect, useState } from "react";
import "./Polaroids.css";

export default function Polaroids({ photos, columns = 4 }) {
  const [open, setOpen] = useState(-1);
  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <>
      <div className="polaroids" style={{ "--cols": columns }}>
        {photos.map((p, i) => (
          <button key={p.src} className="polaroid" onClick={() => setOpen(i)} aria-label={`Open photo: ${p.caption}`}>
            <span className="polaroid-tape" aria-hidden="true" />
            <span className="polaroid-photo">
              <img src={p.src} alt={p.caption} loading="lazy" />
            </span>
            <span className="polaroid-caption hand">{p.caption}</span>
          </button>
        ))}
      </div>

      {open >= 0 && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}>
          <figure className="lightbox-card" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={close} aria-label="Close">✕</button>
            <img src={photos[open].src} alt={photos[open].caption} />
            <figcaption className="hand">{photos[open].caption}</figcaption>
            {photos.length > 1 && (
              <>
                <button className="lightbox-arrow prev" onClick={() => step(-1)} aria-label="Previous photo">‹</button>
                <button className="lightbox-arrow next" onClick={() => step(1)} aria-label="Next photo">›</button>
              </>
            )}
            <span className="lightbox-count">{open + 1} / {photos.length}</span>
          </figure>
        </div>
      )}
    </>
  );
}
