import { useEffect, useState } from "react";
import { mediaUrl } from "../data/media.js";
import "./Showcase.css";

function useCycle(length, delay, paused) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (paused || length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % length), delay);
    return () => clearInterval(t);
  }, [length, delay, paused]);
  return [i, setI];
}

function Slides({ items, index, alt }) {
  return items.map((src, n) => (
    <img
      key={src}
      src={mediaUrl(src)}
      alt={n === index ? alt : ""}
      aria-hidden={n !== index}
      className={n === index ? "on" : ""}
      loading="lazy"
    />
  ));
}

function Dots({ count, index, onPick, labels }) {
  return (
    <div className="sc-dots">
      {Array.from({ length: count }, (_, n) => (
        <button
          key={n}
          className={n === index ? "on" : ""}
          onClick={() => onPick(n)}
          aria-label={labels?.[n] || `Show screen ${n + 1}`}
        />
      ))}
    </div>
  );
}

export function PhoneShowcase({ front, back, tint, labels, alt }) {
  const [paused, setPaused] = useState(false);
  const [i, setI] = useCycle(front.length, 3200, paused);
  const j = back.length ? i % back.length : 0;
  return (
    <div
      className="sc sc-phones"
      style={{ "--tint": tint }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="sc-stage">
        {back.length > 0 && (
          <div className="phone back">
            <div className="phone-screen">
              <Slides items={back} index={j} alt="" />
            </div>
          </div>
        )}
        <div className="phone front">
          <div className="phone-notch" />
          <div className="phone-screen">
            <Slides items={front} index={i} alt={alt} />
          </div>
        </div>
      </div>
      <Dots count={front.length} index={i} onPick={setI} labels={labels} />
    </div>
  );
}

export function BrowserShowcase({ screens, tint, url, labels, alt }) {
  const [paused, setPaused] = useState(false);
  const [i, setI] = useCycle(screens.length, 3400, paused);
  return (
    <div
      className="sc sc-browser"
      style={{ "--tint": tint }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="sc-stage">
        <div className="browser">
          <div className="browser-bar">
            <span /><span /><span />
            <p>{url}</p>
          </div>
          <div className="browser-screen">
            <Slides items={screens} index={i} alt={alt} />
          </div>
        </div>
      </div>
      <Dots count={screens.length} index={i} onPick={setI} labels={labels} />
    </div>
  );
}
