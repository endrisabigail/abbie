import { Link } from "react-router-dom";
import { me } from "../data/site.js";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p className="pixel">© 2026 {me.name}</p>
        <p className="footer-links">
          <a href={me.github} target="_blank" rel="noopener">GitHub</a>
          <a href={me.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <a href={`mailto:${me.email}`}>Email</a>
          <a href={me.resume} download>Resume</a>
          <Link to="/process">Process</Link>
        </p>
      </div>
    </footer>
  );
}
