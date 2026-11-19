import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { me, nav } from "../data/site.js";
import "./Nav.css";

function Radio() {
  const audio = useRef(null);
  const [on, setOn] = useState(false);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    a.volume = 0.35;
    const announce = (v) => window.dispatchEvent(new CustomEvent("bgm", { detail: v }));
    if (on) {
      a.pause();
      setOn(false);
      announce(false);
    } else {
      a.play()
        .then(() => {
          setOn(true);
          announce(true);
        })
        .catch(() => setOn(false));
    }
  };

  return (
    <button className={`radio pixel ${on ? "on" : ""}`} onClick={toggle} aria-pressed={on} aria-label={on ? "Pause music" : "Play music"}>
      <span className="eq" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="radio-label">{on ? "music on" : "music off"}</span>
      <audio ref={audio} src={me.song} loop preload="none" />
    </button>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""} ${open ? "open" : ""}`}>
      <div className="nav-inner wrap">
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">ae</span>
          <span className="logo-text pixel">Abigail Endris</span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          {nav.map((n) => (
            <NavLink key={n.label} to={n.to} className="nav-link" onClick={() => setOpen(false)}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-tools">
          <Radio />
          <button className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
