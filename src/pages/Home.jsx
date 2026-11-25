import { useState } from "react";
import { Link } from "react-router-dom";
import LazyMe from "../components/me/LazyMe.jsx";
import { BrowserShowcase, PhoneShowcase } from "../components/Showcase.jsx";
import Polaroids from "../components/Polaroids.jsx";
import Sparkle from "../components/Sparkle.jsx";
import useReveal from "../components/useReveal.js";
import { marquee, me } from "../data/site.js";
import { projects } from "../data/projects.js";
import { caam, capstone, education, internship } from "../data/experience.js";
import "./Home.css";

const project = (id) => projects.find((p) => p.id === id);

function Letters({ text, start, className = "" }) {
  let i = 0;
  const words = text.split(" ");
  return (
    <span className={className} aria-hidden="true">
      {words.map((w, wi) => (
        <span className="word" key={wi}>
          {[...w].map((ch) => {
            const delay = start + i * 0.055 + wi * 0.16;
            i++;
            return (
              <span className="ch" key={i} style={{ "--d": `${delay.toFixed(3)}s` }}>
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="space"> </span>}
        </span>
      ))}
    </span>
  );
}

function IntroTitle({ name }) {
  const [run, setRun] = useState(0);
  const first = "Hi! I'm";
  const nameStart = 0.35 + first.length * 0.055 + 0.16 + 0.22;
  return (
    <h1 className="hero-title" key={run} aria-label={`Hi! I'm ${name}`}>
      <Letters text={first} start={0.35} />
      <br />
      <button type="button" className="hero-name" onClick={() => setRun((r) => r + 1)} style={{ "--u": `${(nameStart + name.length * 0.055).toFixed(2)}s` }}>
        <Letters text={name} start={nameStart} />
      </button>
      <span className="hero-cursor" aria-hidden="true" style={{ "--c": `${(nameStart - 0.15).toFixed(2)}s` }} />
    </h1>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <svg className="hero-blobs" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path d="M-40 640 L180 520 L300 600 L460 470 L620 610 L620 900 L-40 900 Z" fill="#122b29" />
          <path d="M820 900 L900 640 L1030 700 L1180 560 L1320 650 L1480 540 L1480 900 Z" fill="#122b29" />
          <path d="M-40 760 L120 690 L260 760 L400 700 L560 790 L560 900 L-40 900 Z" fill="#173733" />
          <path d="M900 900 L980 780 L1120 820 L1260 740 L1480 800 L1480 900 Z" fill="#173733" />
        </svg>
        <Sparkle className="sp sp1" />
        <Sparkle className="sp sp2" />
        <Sparkle className="sp sp3" />
        <Sparkle className="sp sp4" />
      </div>

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="hud pixel">CS @ UNT · Dallas, TX</p>
          <IntroTitle name={me.first} />
          <p className="hero-role">
            Full-stack developer <span className="amp">&amp;</span> networks enthusiast
          </p>
          <p className="hero-intro">{me.intro}</p>
          <div className="hero-cta">
            <Link to="/projects" className="btn lime">View projects</Link>
            <a href={me.resume} download className="btn">Resume ↓</a>
          </div>
          <p className="hero-status">
            <span className="dot" />
            {me.status}
          </p>
        </div>

        <div className="hero-stage">
          <div className="hero-bigtext" aria-hidden="true">ABBIE</div>
          <div className="hero-sun" aria-hidden="true" />
          <div className="hero-canvas">
            <LazyMe />
          </div>
          <p className="hero-sig" aria-hidden="true">Sculpted in Nomad</p>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {marquee.map((m) => (
                <span key={m} className="marquee-item">
                  {m} <Sparkle className="marquee-star" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ no, title, accent }) {
  return (
    <div className="section-head reveal">
      <p className="kicker">{no}</p>
      <h2 className="section-title">
        {title} <em>{accent}</em>
      </h2>
    </div>
  );
}

function Bullets({ items }) {
  return (
    <ul className="bullets">
      {items.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  );
}

function Links({ links }) {
  if (!links?.length) return null;
  return (
    <div className="card-links">
      {links.map((l, i) =>
        l.to ? (
          <Link key={l.label} to={l.to} className={`btn small ${i === 0 ? "lime" : ""}`}>{l.label}</Link>
        ) : (
          <a key={l.label} href={l.href} target="_blank" rel="noopener" className={`btn small ${i === 0 ? "lime" : ""}`}>{l.label} ↗</a>
        )
      )}
    </div>
  );
}

function Academic() {
  const koda = project("koda");
  return (
    <section id="education" className="xp-section wrap">
      <SectionHead no="01" title="Academic" accent="Experience" />

      <article className="xp-card reveal">
        <div className="edu-grid">
          <div>
            <p className="card-label pixel">Education</p>
            <h3>{education.school}</h3>
            <p className="card-meta">{education.degree} · {education.when}</p>
            <p className="card-text">{education.where}. Relevant coursework includes:</p>
            <div className="chips">
              {education.coursework.map((c) => <span className="chip" key={c}>{c}</span>)}
            </div>
          </div>
          <div>
            <p className="card-label pixel">Honors &amp; Certifications</p>
            <div className="badge-list">
              {education.badges.map((b) => (
                <div className="badge-row" key={b.name}>
                  <span className="badge-icon" aria-hidden="true">{b.icon}</span>
                  <span>
                    <strong>{b.name}</strong>
                    <small>{b.detail}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <article className="xp-card split reveal">
        <div>
          <p className="card-label pixel">Capstone · {koda.status}</p>
          <h3>{capstone.title}</h3>
          <p className="card-meta">{capstone.role}</p>
          <p className="card-text">{koda.summary}</p>
          <Bullets items={capstone.bullets} />
          <Links links={[...koda.links, { label: "Project details", to: "/projects/koda" }]} />
        </div>
        <div className="card-visual">
          <PhoneShowcase
            tint={koda.color}
            alt="Koda app screens showing animal habitats"
            front={["koda/screens/01-bear-habitat.webp", "koda/screens/02-frog-habitat.webp", "koda/screens/03-bunny-habitat.webp", "koda/screens/04-panda-habitat.webp", "koda/screens/05-koala-habitat.webp", "koda/screens/06-fox-habitat.webp"]}
            back={["koda/screens/09-frog-habitat-night.webp", "koda/screens/10-bunny-habitat-night.webp", "koda/screens/11-panda-habitat-night.webp", "koda/screens/12-koala-habitat-night.webp", "koda/screens/08-fox-habitat-night.webp"]}
            labels={["Bear habitat", "Frog habitat", "Bunny habitat", "Panda habitat", "Koala habitat", "Fox habitat"]}
          />
        </div>
      </article>

      <QuecourtCard />

      <article className="xp-card reveal">
        <p className="card-label pixel">Program</p>
        <h3>{caam.title}</h3>
        <p className="card-meta">{caam.org} · {caam.when}</p>
        <Bullets items={caam.bullets} />
        <Polaroids photos={caam.photos} columns={3} />
      </article>
    </section>
  );
}

function QuecourtCard() {
  const q = project("quecourt");
  return (
    <article className="xp-card reveal">
      <p className="card-label pixel">Academic project</p>
      <h3>{q.name}: {q.tagline}</h3>
      <div className="chips card-chips">
        {q.tech.map((t) => <span className="chip" key={t}>{t}</span>)}
      </div>
      <p className="card-text">{q.summary}</p>
      <Links links={[{ label: "Project details", to: "/projects/quecourt" }]} />
    </article>
  );
}

function Internship() {
  const fw = project("firewall");
  return (
    <section id="internship" className="xp-section wrap">
      <SectionHead no="02" title="Internship" accent="Experience" />

      <article className="xp-card reveal">
        <p className="card-label pixel">Internship</p>
        <h3>{internship.role}</h3>
        <p className="card-meta">{internship.org} · {internship.where} · {internship.when}</p>
        <Bullets items={internship.bullets} />
        <Polaroids photos={internship.photos} />
      </article>

      <article className="xp-card reveal">
        <p className="card-label pixel">Internship project</p>
        <h3>{fw.name}</h3>
        <div className="chips card-chips">
          {fw.tech.map((t) => <span className="chip" key={t}>{t}</span>)}
        </div>
        <p className="card-text">{fw.summary}</p>
        <Bullets items={fw.contributions} />
      </article>
    </section>
  );
}

function Projects() {
  const hearth = project("hearth");
  const site = project("portfolio");
  return (
    <section id="projects" className="xp-section wrap">
      <SectionHead no="03" title="Passion" accent="Projects" />

      <article className="xp-card split reverse reveal">
        <div className="card-visual">
          <BrowserShowcase
            tint={hearth.color}
            url="hearth-umber-six.vercel.app"
            alt="Hearth app screens showing the 3D plazas"
            screens={["hearth/screens/11-multiplayer.webp", "hearth/screens/03-sunset-orchard.webp", "hearth/screens/08-coral-reef.webp", "hearth/screens/05-glowwood.webp", "hearth/screens/09-lily-pond.webp", "hearth/screens/01-character-select.webp"]}
            labels={["Multiplayer plaza", "Sunset orchard", "Coral reef", "Glowwood", "Lily pond", "Character select"]}
          />
        </div>
        <div>
          <p className="card-label pixel">{hearth.role}</p>
          <h3>{hearth.name}: {hearth.tagline}</h3>
          <div className="chips card-chips">
            {hearth.tech.map((t) => <span className="chip" key={t}>{t}</span>)}
          </div>
          <p className="card-text">{hearth.summary}</p>
          <Bullets items={hearth.contributions} />
          <Links links={[...hearth.links, { label: "Project details", to: "/projects/hearth" }]} />
        </div>
      </article>

      <article className="xp-card split reveal">
        <div>
          <p className="card-label pixel">{site.role}</p>
          <h3>{site.name}</h3>
          <div className="chips card-chips">
            {site.tech.map((t) => <span className="chip" key={t}>{t}</span>)}
          </div>
          <p className="card-text">{site.summary}</p>
          <Bullets items={site.contributions} />
          <Links links={[{ label: "How I made it", to: "/process/waving-hello" }, ...site.links]} />
        </div>
        <div className="card-visual site-visual" style={{ "--tint": site.color }}>
          <img src={site.cover} alt="3D sculpt of Abigail" loading="lazy" />
        </div>
      </article>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="wrap contact-inner reveal">
        <Sparkle className="contact-star" />
        <p className="kicker">04</p>
        <h2 className="contact-title">
          Let's
          <br />
          <span>connect</span>
        </h2>
        <p className="contact-sub">I'm looking for new grad roles in software engineering and UI/UX development. Feel free to reach out.</p>
        <a href={`mailto:${me.email}`} className="contact-email">{me.email}</a>
        <div className="contact-links">
          <a href={me.linkedin} target="_blank" rel="noopener" className="btn">LinkedIn ↗</a>
          <a href={me.github} target="_blank" rel="noopener" className="btn">GitHub ↗</a>
          <a href={me.resume} download className="btn lime">Download resume ↓</a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useReveal();
  return (
    <>
      <Hero />
      <Academic />
      <Internship />
      <Projects />
      <Contact />
    </>
  );
}
