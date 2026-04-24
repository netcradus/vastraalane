import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-shell py-24 text-center">
      <h1 className="font-display text-6xl">404</h1>
      <p className="mt-4 text-ink/60">This route is ready, but nothing is living here yet.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-white">
        Back home
      </Link>
    </div>
  );
}
