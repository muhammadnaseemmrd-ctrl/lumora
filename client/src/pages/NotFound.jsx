import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section container empty-state">
      <span className="emoji">🧭</span>
      <h1>Page Not Found</h1>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </section>
  );
}
