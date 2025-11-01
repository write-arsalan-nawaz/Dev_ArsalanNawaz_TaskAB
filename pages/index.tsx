import React, { useState } from "react";

type Result = { id: string; title: string; snippet: string };

export default function Home() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [summary, setSummary] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  async function onSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setResults(null);
    setSummary(undefined);

    if (!q.trim()) {
      setError("Please enter a query");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q })
      });
      const body = await r.json();
      if (!r.ok) {
        setError(body.error || "Search failed");
      } else {
        setResults(body.results || []);
        setSummary(body.summary);
        if (Array.isArray(body.results) && body.results.length === 0) {
          setError("No matches found.");
        }
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui, Arial" }}>
      <h1>Mini Full-Stack Search</h1>
      <form onSubmit={onSearch} style={{ display: "flex", gap: 8 }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search ..." style={{ flex: 1, padding: 8 }} />
        <button disabled={loading} style={{ padding: "8px 12px" }}>{loading ? "Searching..." : "Search"}</button>
      </form>

      {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}

      {summary && <div style={{ marginTop: 12, background: "#f7f7f7", padding: 10, borderRadius: 6 }}>
        <strong>Summary</strong>
        <p style={{ margin: "6px 0" }}>{summary}</p>
      </div>}

      {results && results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
          {results.map(r => (
            <li key={r.id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
              <div style={{ fontWeight: 600 }}>{r.title}</div>
              <div style={{ color: "#555" }}>{r.snippet}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
