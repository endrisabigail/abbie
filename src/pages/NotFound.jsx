import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="wrap" style={{ textAlign: "center", padding: "12rem 0 8rem" }}>
      <p className="pixel" style={{ color: "var(--lime)" }}>404</p>
      <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "1rem 0 2rem", textTransform: "uppercase" }}>Page not found</h1>
      <Link to="/" className="btn lime">Back home</Link>
    </div>
  );
}
