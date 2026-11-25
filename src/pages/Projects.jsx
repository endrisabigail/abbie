import { Link } from "react-router-dom";
import useReveal from "../components/useReveal.js";
import { projects } from "../data/projects.js";
import "./Projects.css";

const GROUPS = [
  ["Academic", "Academic projects"],
  ["Internship", "Internship projects"],
  ["Personal", "Personal projects"],
];

export default function Projects() {
  useReveal();
  return (
    <div className="projects-page">
      <header className="wrap projects-head">
        <p className="kicker">Projects</p>
        <h1 className="section-title">
          All <em>projects</em>
        </h1>
        <p className="projects-sub">Everything I've built, from school and my internship to my own projects. Select one for the full details.</p>
      </header>

      <div className="wrap">
        {GROUPS.map(([cat, title]) => {
          const list = projects.filter((p) => p.category === cat);
          if (!list.length) return null;
          return (
            <section className="proj-group" key={cat}>
              <h2 className="sub">{title}</h2>
              <div className="proj-list">
                {list.map((p) => (
                  <Link key={p.id} to={`/projects/${p.id}`} className="proj-row reveal in" style={{ "--card": p.color }}>
                    <span className="proj-art">
                      {p.cover ? <img src={p.cover} alt="" loading="lazy" /> : <span className="proj-icon" aria-hidden="true">{p.icon}</span>}
                    </span>
                    <span className="proj-info">
                      <span className="proj-meta pixel">{p.role}</span>
                      <span className="proj-name">{p.name}</span>
                      <span className="proj-tag">{p.tagline}</span>
                      <span className="chips">
                        {p.tech.slice(0, 5).map((t) => (
                          <span className="chip" key={t}>{t}</span>
                        ))}
                      </span>
                    </span>
                    <span className="proj-go pixel">View ▸</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
