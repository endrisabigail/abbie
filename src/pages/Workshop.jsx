import { useMemo, useState } from "react";
import PostCard from "../components/PostCard.jsx";
import useReveal from "../components/useReveal.js";
import { posts } from "../data/posts.js";
import "./Workshop.css";

export default function Workshop() {
  useReveal();
  const projects = useMemo(() => ["All", ...new Set(posts.map((p) => p.project).filter(Boolean))], []);
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? posts : posts.filter((p) => p.project === filter);

  return (
    <div className="workshop">
      <header className="workshop-banner">
        <div className="wrap">
          <p className="kicker">Process</p>
          <h1 className="section-title">
            How I <em>build</em>
          </h1>
          <p className="workshop-sub">Write-ups on how I designed, sculpted, and coded my projects.</p>
          <div className="filter-row" role="tablist" aria-label="Filter by project">
            {projects.map((p) => (
              <button key={p} role="tab" aria-selected={filter === p} className={`filter-btn ${filter === p ? "active" : ""}`} onClick={() => setFilter(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="wrap">
        <div className="post-grid workshop-grid">
          {shown.map((p) => (
            <div className="reveal in" key={p.slug}>
              <PostCard post={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
