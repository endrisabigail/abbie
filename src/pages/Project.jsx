import { Link, useParams, useSearchParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import LazyCritter from "../components/critters/LazyCritter.jsx";

const KodaMoods = lazy(() => import("../components/koda/KodaMoods.jsx"));
import { Screens, Videos } from "../components/MediaGallery.jsx";
import useReveal from "../components/useReveal.js";
import { projects } from "../data/projects.js";
import { getPost } from "../data/posts.js";
import NotFound from "./NotFound.jsx";
import "./Project.css";

export default function Project() {
  const { id } = useParams();
  const [params] = useSearchParams();
  useReveal();
  const i = projects.findIndex((p) => p.id === id);
  if (i < 0) return <NotFound />;
  const p = projects[i];
  const related = (p.posts || []).map(getPost).filter(Boolean);
  const initial = p.critters ? p.critters.findIndex((c) => c.name === params.get("c")) : 0;
  const next = projects[(i + 1) % projects.length];

  return (
    <article className="project" style={{ "--card": p.color }}>
      <header className="project-banner">
        <div className="wrap project-banner-inner">
          <Link to="/projects" className="back pixel">◂ All projects</Link>
          <p className="project-no pixel">Project {p.number}</p>
          <h1 className="project-title">{p.name}</h1>
          <p className="project-tagline">{p.tagline}</p>
          {p.critters && (
            <div className="banner-strip" aria-hidden="true">
              {p.critters.map((c) => (
                <span key={c.name} className="strip-tile"><img src={c.img} alt="" /></span>
              ))}
            </div>
          )}
        </div>
        {p.cover && <img className="banner-art" src={p.cover} alt="" aria-hidden="true" />}
      </header>
      <div className="slash" />

      <div className="wrap project-grid">
        <div className="project-info reveal">
          <h2>{p.name}</h2>
          <p className="project-role">{p.role}</p>
          <p className="project-summary">{p.summary}</p>

          {p.contributions?.length > 0 && (
            <>
              <h3 className="sub pixel">What I did</h3>
              <ul className="contrib">
                {p.contributions.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </>
          )}

          <h3 className="sub pixel">Built with</h3>
          <div className="chips">
            {p.tech.map((t) => <span className="chip" key={t}>{t}</span>)}
          </div>

          {p.links.length > 0 && (
            <div className="project-links">
              {p.links.map((l, k) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" className={`btn small ${k === 0 ? "lime" : ""}`}>{l.label} ↗</a>
              ))}
            </div>
          )}

          {related.length > 0 && (
            <>
              <h3 className="sub pixel">Process</h3>
              <div className="howto">
                {related.map((post) => (
                  <Link key={post.slug} to={`/process/${post.slug}`} className="howto-link">
                    <span className="howto-icon" aria-hidden="true">{post.cover}</span>
                    <span>
                      <strong>{post.title}</strong>
                      <small>{post.readTime} min read</small>
                    </span>
                    <span className="howto-arrow">▸</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="project-visual reveal">
          {p.id === "koda" ? (
            <Suspense fallback={<div className="critter-stage-placeholder"><span>Loading…</span></div>}>
              <KodaMoods tint={p.color} initialAnimal={(params.get("c") || "bear").toLowerCase()} />
            </Suspense>
          ) : p.critters?.length ? (
            <LazyCritter key={p.id} critters={p.critters} tint={p.color} initial={initial} />
          ) : (
            <div className="project-icon"><span aria-hidden="true">{p.icon}</span></div>
          )}
        </div>
      </div>

      {(p.media.screens.length > 0 || p.media.videos.length > 0 || p.media.sculpts.length > 0) && (
        <section className="wrap project-media">
          {p.media.screens.length > 0 && (
            <div className="media-block tall reveal">
              <h3 className="sub pixel">Screenshots</h3>
              <Screens items={p.media.screens} />
            </div>
          )}
          {p.media.videos.length > 0 && (
            <div className="media-block reveal">
              <h3 className="sub pixel">In action</h3>
              <Videos items={p.media.videos} />
            </div>
          )}
          {p.media.sculpts.length > 0 && (
            <div className="media-block reveal">
              <h3 className="sub pixel">Sculpting in Nomad</h3>
              <Videos items={p.media.sculpts} />
            </div>
          )}
        </section>
      )}

      <div className="wrap next-project">
        <Link to={`/projects/${next.id}`} className="next-link">
          <span className="pixel">Next project ▸</span>
          <strong>{next.name}</strong>
        </Link>
      </div>
    </article>
  );
}
