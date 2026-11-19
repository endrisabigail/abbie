import { Link, useParams } from "react-router-dom";
import Markdown from "../components/Markdown.jsx";
import { formatDate, getPost, posts } from "../data/posts.js";
import { projects } from "../data/projects.js";
import NotFound from "./NotFound.jsx";
import useReveal from "../components/useReveal.js";
import "./Post.css";

export default function Post() {
  const { slug } = useParams();
  useReveal();
  const post = getPost(slug);
  if (!post) return <NotFound />;

  const i = posts.indexOf(post);
  const newer = posts[i - 1];
  const older = posts[i + 1];
  const project = projects.find((p) => p.name.toLowerCase() === post.project.toLowerCase());

  return (
    <article className="post">
      <header className="post-head" style={{ "--post-color": post.color }}>
        <div className="wrap post-head-inner">
          <Link to="/process" className="back pixel">◂ Process</Link>
          {post.image ? <img className="post-hero-img" src={post.image} alt="" /> : <span className="post-cover" aria-hidden="true">{post.cover}</span>}
          <p className="post-meta pixel">
            {formatDate(post.date)} · {post.readTime} min read
            {post.project && <> · {post.project}</>}
          </p>
          <h1 className="post-title">{post.title}</h1>
          {post.summary && <p className="post-summary">{post.summary}</p>}
          <div className="chips post-tags">
            {post.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
          </div>
        </div>
      </header>

      <div className="wrap post-body-wrap">
        <div className="post-paper">
          <Markdown body={post.body} />
        </div>


        <nav className="post-nav" aria-label="More posts">
          {older ? (
            <Link to={`/process/${older.slug}`} className="post-nav-card">
              <small>← Previous</small>
              <span>{older.cover} {older.title}</span>
            </Link>
          ) : <span />}
          {project && (
            <Link to={`/projects/${project.id}`} className="btn small lime">View {project.name}</Link>
          )}
          {newer ? (
            <Link to={`/process/${newer.slug}`} className="post-nav-card right">
              <small>Next →</small>
              <span>{newer.cover} {newer.title}</span>
            </Link>
          ) : <span />}
        </nav>
      </div>
    </article>
  );
}
