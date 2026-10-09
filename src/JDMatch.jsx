import { useState, useEffect, useMemo } from "react";
import { analyzeJD } from "./jdMatch";

function JDMatch({ resume, onAddSkill }) {
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState(() => {
    try {
      return localStorage.getItem("resumeJD") || "";
    } catch {
      return "";
    }
  });

  // JD ko bhi browser mein save rakho (500ms debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem("resumeJD", jd);
      } catch {
        /* ignore */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [jd]);

  const result = useMemo(
    () => (jd.trim().length >= 40 ? analyzeJD(jd, resume) : null),
    [jd, resume],
  );

  const percentClass = result
    ? result.percent >= 70
      ? "score-good"
      : result.percent >= 40
        ? "score-mid"
        : "score-low"
    : "";

  const matched = result ? result.keywords.filter((k) => k.found) : [];
  const missing = result ? result.keywords.filter((k) => !k.found) : [];

  return (
    <div className="jd-card">
      <button
        className="jd-header"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="jd-title">🎯 Job Match</span>
        <span className="jd-header-right">
          {result && (
            <span className={`score-value ${percentClass}`}>
              {result.percent}%
            </span>
          )}
          <span className="jd-chevron">{open ? "▴" : "▾"}</span>
        </span>
      </button>

      {open && (
        <div className="jd-body">
          <label htmlFor="jd-text" className="jd-label">
            Paste the job description
          </label>
          <textarea
            id="jd-text"
            className="jd-textarea"
            placeholder="Paste the full job description here to see which keywords your resume covers..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          ></textarea>

          {jd && (
            <button className="tips-toggle" onClick={() => setJd("")}>
              Clear
            </button>
          )}

          {!result && jd.trim().length < 40 && (
            <p className="jd-hint">
              Paste at least a few lines of the job description to start.
            </p>
          )}
          {!result && jd.trim().length >= 40 && (
            <p className="jd-hint">
              No clear keywords found. Try pasting the requirements section.
            </p>
          )}

          {result && (
            <>
              <div className="score-header" style={{ marginTop: 14 }}>
                <span className="score-label">Keyword match</span>
                <span className="jd-count">
                  {result.matched} of {result.total} found
                </span>
              </div>
              <div className="score-bar-track">
                <div
                  className={`score-bar-fill ${percentClass}`}
                  style={{ width: `${result.percent}%` }}
                ></div>
              </div>

              {missing.length > 0 && (
                <>
                  <p className="jd-section-title">Missing from your resume</p>
                  <div className="jd-chips">
                    {missing.map((k) => (
                      <span className="jd-chip jd-chip-missing" key={k.term}>
                        {k.label}
                        {k.isSkill && (
                          <button
                            aria-label={`Add ${k.label} to skills`}
                            title="Add to Skills (only if you really know it)"
                            onClick={() => onAddSkill(k.label)}
                          >
                            +
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {matched.length > 0 && (
                <>
                  <p className="jd-section-title">Already in your resume</p>
                  <div className="jd-chips">
                    {matched.map((k) => (
                      <span className="jd-chip jd-chip-found" key={k.term}>
                        ✓ {k.label}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <p className="jd-hint">
                This is a keyword check, not a guarantee. Add a missing keyword
                only if it's true for you, and use it in a real sentence in your
                experience or projects.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default JDMatch;
