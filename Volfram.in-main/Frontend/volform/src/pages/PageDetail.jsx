import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:7000";

export default function PageDetail() {
  const { id } = useParams();
  const [page, setPage]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/public-pages`)
      .then(r => r.json())
      .then(data => {
        const found = (data.pages || []).find(p => p._id === id);
        if (found) {
          // fetch full page detail
          return fetch(`${API_URL}/api/public-pages/${id}`)
            .then(r => r.json())
            .then(d => setPage(d.page || found));
        } else {
          setError("Page not found.");
        }
      })
      .catch(() => setError("Failed to load page."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-shell">
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ display: "inline-block", width: 36, height: 36, border: "3px solid #d5dee7", borderTopColor: "#146c8a", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: 16, color: "#70879b", fontFamily: "'Barlow', sans-serif" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="page-shell">
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", color: "#0f2d4d", fontSize: 28, marginBottom: 12 }}>Page Not Found</h2>
          <p style={{ color: "#70879b", fontFamily: "'Barlow', sans-serif", marginBottom: 28 }}>{error || "This page doesn't exist."}</p>
          <Link to="/" style={{ display: "inline-block", padding: "12px 28px", background: "linear-gradient(135deg,#0f2d4d,#146c8a)", color: "#fff", borderRadius: 8, textDecoration: "none", fontFamily: "'Sora', sans-serif", fontWeight: 700 }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container-custom">
          {page.category && (
            <span style={{ display: "inline-block", padding: "4px 14px", background: "rgba(217,115,45,0.25)", color: "#f4a261", borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Barlow', sans-serif" }}>
              {page.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800 }}>{page.title}</h1>
          {page.description && (
            <p className="mt-6 max-w-3xl text-lg text-slate-100" style={{ fontFamily: "'Barlow', sans-serif" }}>{page.description}</p>
          )}
        </div>
      </section>

      {/* Image */}
      {page.imageUrl && (
        <section style={{ background: "#f2f5f8" }}>
          <img
            src={`${API_URL}${page.imageUrl}`}
            alt={page.title}
            style={{ width: "100%", maxHeight: 520, objectFit: "cover", display: "block" }}
          />
        </section>
      )}

      {/* Back link */}
      <section className="section-white py-10">
        <div className="container-custom">
          <Link
            to="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#146c8a", fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
