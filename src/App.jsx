import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function formatDate(value) {
  if (!value || value === "Unknown") return value || "Unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  });
}

function senderName(sender) {
  if (!sender) return "Unknown sender";
  const match = sender.match(/^"?([^"<]+?)"?\s*</);
  return match ? match[1].trim() : sender;
}

function Stat({ label, value, tone }) {
  return (
    <div className={`stat ${tone || ""}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function JobCard({ job }) {
  const fresher = /fresher|entry|graduate|0\s*(-|to)?\s*1/i.test(job.experience || "");
  const unknown = !job.experience || job.experience === "Unknown";
  return (
    <article className="card job">
      <header>
        <div>
          <h3>{job.role || "Untitled role"}</h3>
          <p className="company">{job.company || "Unknown"}</p>
        </div>
        <span className={`pill ${fresher ? "good" : unknown ? "muted" : ""}`}>
          {unknown ? "Experience n/a" : job.experience}
        </span>
      </header>
      {job.evidence && <blockquote>{job.evidence}</blockquote>}
      <footer>
        <span title={job.sender}>{senderName(job.sender)}</span>
        <span className="dot" />
        <span>{formatDate(job.received_at)}</span>
      </footer>
      {job.source_email && <p className="subject">{job.source_email}</p>}
    </article>
  );
}

function ErrorCard({ item }) {
  const [open, setOpen] = useState(false);
  const hasDetail = item.source_code || item.log_excerpt;
  return (
    <article className="card err">
      <header>
        <div>
          <h3>{item.service || "Unknown service"}</h3>
          <p className="company">{item.error}</p>
        </div>
        <span className="pill bad">{formatDate(item.timestamp)}</span>
      </header>
      <dl>
        <dt>Likely cause</dt>
        <dd>{item.likely_cause || "Unknown"}</dd>
      </dl>
      {hasDetail && (
        <>
          <button className="link" onClick={() => setOpen(o => !o)}>
            {open ? "Hide details" : "Show logs & code"}
          </button>
          {open && (
            <div className="details">
              {item.log_excerpt && (
                <>
                  <span className="mono-label">Log excerpt</span>
                  <pre>{item.log_excerpt}</pre>
                </>
              )}
              {item.source_code && (
                <>
                  <span className="mono-label">Source code</span>
                  <pre>{item.source_code}</pre>
                </>
              )}
            </div>
          )}
        </>
      )}
      <footer>
        <span title={item.sender}>{senderName(item.sender)}</span>
        <span className="dot" />
        <span className="subject-inline">{item.source_email}</span>
      </footer>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="grid">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="card skeleton" />
      ))}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("jobs");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    if (!API_URL) {
      setError("VITE_API_URL is not set. Copy .env.example to .env and add your API Gateway URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        throw new Error(json.error || `Request failed (${res.status})`);
      }
      setData(json);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const jobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = data?.job_openings || [];
    if (!q) return list;
    return list.filter(j =>
      [j.role, j.company, j.experience, j.sender, j.source_email]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [data, query]);

  const errors = data?.reported_errors || [];
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  return (
    <div className="shell">
      <header className="top">
        <div>
          <p className="eyebrow">{today}</p>
          <h1>Inbox Digest</h1>
        </div>
        <button className="refresh" onClick={load} disabled={loading}>
          <span className={loading ? "spin" : ""}>↻</span>
          {loading ? "Reading inbox…" : "Refresh"}
        </button>
      </header>

      {error && (
        <div className="banner" role="alert">
          <strong>Couldn’t load the report.</strong>
          <span>{error}</span>
          <button className="link" onClick={load}>Try again</button>
        </div>
      )}

      {loading && !data && <Skeleton />}

      {data && (
        <>
          <section className="stats">
            <Stat label="Emails read" value={data.counts?.emails ?? 0} />
            <Stat label="Job openings" value={data.counts?.job_openings ?? 0} tone="accent" />
            <Stat
              label="Reported errors"
              value={data.counts?.reported_errors ?? 0}
              tone={errors.length ? "alert" : ""}
            />
          </section>

          <section className="summary">
            <h2>Summary</h2>
            <p>{data.summary}</p>
            <p className="meta">
              Last 24 hours · generated {formatDate(data.generated_at)}
              {data.model_used ? ` · ${data.model_used}` : ""}
            </p>
          </section>

          <nav className="tabs" role="tablist">
            <button
              role="tab"
              aria-selected={tab === "jobs"}
              className={tab === "jobs" ? "on" : ""}
              onClick={() => setTab("jobs")}
            >
              Job openings <span>{data.job_openings.length}</span>
            </button>
            <button
              role="tab"
              aria-selected={tab === "errors"}
              className={tab === "errors" ? "on" : ""}
              onClick={() => setTab("errors")}
            >
              Errors <span>{errors.length}</span>
            </button>
            {tab === "jobs" && (
              <input
                className="search"
                type="search"
                placeholder="Filter roles, companies…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            )}
          </nav>

          {tab === "jobs" &&
            (jobs.length ? (
              <div className="grid">
                {jobs.map((j, i) => (
                  <JobCard key={`${j.company}-${j.role}-${i}`} job={j} />
                ))}
              </div>
            ) : (
              <p className="empty">
                {query ? "No openings match that filter." : "No job openings in the last 24 hours."}
              </p>
            ))}

          {tab === "errors" &&
            (errors.length ? (
              <div className="grid">
                {errors.map((e, i) => (
                  <ErrorCard key={`${e.service}-${i}`} item={e} />
                ))}
              </div>
            ) : (
              <p className="empty">All quiet. No errors reported.</p>
            ))}
        </>
      )}

      <footer className="foot">Powered by Gmail + Gemini via AWS Lambda</footer>
    </div>
  );
}
