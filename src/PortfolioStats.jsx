import { useCallback, useEffect, useState } from "react";

const BASE = (import.meta.env.VITE_PORTFOLIO_API_URL || "").replace(/\/$/, "");
const KEY_STORE = "portfolio-stats-key";

const readKey = () => {
  try { return localStorage.getItem(KEY_STORE) || ""; } catch { return ""; }
};
const saveKey = (k) => {
  try { k ? localStorage.setItem(KEY_STORE, k) : localStorage.removeItem(KEY_STORE); } catch { /* storage unavailable */ }
};

const prettify = (slug) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const when = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "—";

function Tile({ label, value, tone }) {
  return (
    <div className={`stat ${tone || ""}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function Bar({ value, max, tone }) {
  return (
    <span className="bar" aria-hidden="true">
      <span className={`bar-fill ${tone}`} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
    </span>
  );
}

function KeyForm({ onSubmit, invalid }) {
  const [v, setV] = useState("");
  return (
    <form className="summary keyform" onSubmit={(e) => { e.preventDefault(); if (v.trim()) onSubmit(v.trim()); }}>
      <h2>Portfolio stats</h2>
      <p>{invalid ? "That key was not accepted. Try again." : "Enter your stats key to load visitor activity from your portfolio."}</p>
      <div className="keyrow">
        <input className="search" type="password" placeholder="Stats key" value={v} onChange={(e) => setV(e.target.value)} autoComplete="off" />
        <button className="refresh" type="submit">Unlock</button>
      </div>
      <p className="meta">Saved in this browser only, never in the site code.</p>
    </form>
  );
}

export default function PortfolioStats() {
  const [key, setKey] = useState(readKey);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState(false);

  const load = useCallback(async (k) => {
    if (!BASE) {
      setError("VITE_PORTFOLIO_API_URL is not set. Add your portfolio backend URL to .env.");
      return;
    }
    setLoading(true);
    setError("");
    setInvalid(false);
    try {
      const res = await fetch(`${BASE}/api/stats`, { headers: k ? { "x-stats-key": k } : {} });
      if (res.status === 401) {
        saveKey("");
        setKey("");
        setInvalid(true);
        return;
      }
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setData(await res.json());
    } catch (e) {
      setError(e.message === "Failed to fetch"
        ? "Could not reach the portfolio backend. If it was asleep, wait a few seconds and try again."
        : e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(key); }, [load, key]);

  if (invalid || (!key && !data && !loading && !error)) {
    return <KeyForm invalid={invalid} onSubmit={(k) => { saveKey(k); setKey(k); }} />;
  }

  const rows = data
    ? Object.entries(data.projects).map(([slug, p]) => ({ slug, ...p })).sort((a, b) => b.total - a.total)
    : [];
  const max = Math.max(1, ...rows.flatMap((r) => [r.open.count, r.github.count, r.live.count]));
  const t = data?.totals;

  return (
    <>
      {error && (
        <div className="banner" role="alert">
          <strong>Couldn\u2019t load portfolio stats.</strong>
          <span>{error}</span>
          <button className="link" onClick={() => load(key)}>Try again</button>
        </div>
      )}
      {loading && !data && <p className="empty">Waking the portfolio backend…</p>}

      {data && (
        <>
          <section className="stats stats-6">
            <Tile label="Theme switches" value={t.themeSwitches} />
            <Tile label="Switched to dark" value={data.theme.toDark.count} />
            <Tile label="Switched to light" value={data.theme.toLight.count} />
            <Tile label="Project opens" value={t.projectOpens} tone="accent" />
            <Tile label="GitHub clicks" value={t.githubClicks} tone="accent" />
            <Tile label="Live demo clicks" value={t.liveClicks} tone="accent" />
          </section>

          <section className="summary">
            <h2>Clicks by project</h2>
            {rows.length ? (
              <div className="ptable">
                {rows.map((r) => (
                  <div className="prow" key={r.slug}>
                    <div className="pname">
                      <strong>{prettify(r.slug)}</strong>
                      <span className="meta">last activity {when([r.open.lastAt, r.github.lastAt, r.live.lastAt].filter(Boolean).sort().pop())}</span>
                    </div>
                    {[["Opened", r.open, "open"], ["GitHub", r.github, "gh"], ["Live demo", r.live, "live"]].map(([label, c, tone]) => (
                      <div className="pcell" key={label}>
                        <span className="mono-label">{label}</span>
                        <span className="pnum">{c.count}</span>
                        <Bar value={c.count} max={max} tone={tone} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">No project clicks recorded yet.</p>
            )}
            <p className="meta">
              Last theme switch {when([data.theme.toDark.lastAt, data.theme.toLight.lastAt].filter(Boolean).sort().pop())} · updated {when(data.generatedAt)}
            </p>
          </section>

          <button className="link" onClick={() => load(key)} disabled={loading}>{loading ? "Refreshing…" : "Refresh stats"}</button>
          {" · "}
          <button className="link" onClick={() => { saveKey(""); setKey(""); setData(null); }}>Forget key</button>
        </>
      )}
    </>
  );
}
