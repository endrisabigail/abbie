import { Link } from "react-router-dom";
import { formatDate } from "../data/posts.js";
import "./PostCard.css";

export default function PostCard({ post }) {
  return (
    <Link to={`/process/${post.slug}`} className="post-card">
      <div className="post-card-cover" style={{ "--pc": post.color }}>
        {post.image ? <img src={post.image} alt="" loading="lazy" /> : <span aria-hidden="true">{post.cover}</span>}
      </div>
      <div className="post-card-body">
        <p className="post-card-meta pixel">
          {formatDate(post.date)} · {post.readTime} min read
        </p>
        <h3>{post.title}</h3>
        <p className="post-card-summary">{post.summary}</p>
        <div className="chips">
          {post.tags.slice(0, 3).map((t) => (
            <span className="chip" key={t}>{t}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
