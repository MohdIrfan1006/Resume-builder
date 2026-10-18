import { useState, useEffect } from "react";
import "./ScoreInsights.css";

/* Print mein A4 ka usable area (15mm margin ke baad):
   chaudai 180mm ≈ 680px, unchai 267mm ≈ 1009px */
const PRINT_WIDTH_PX = 680;
const PRINT_HEIGHT_PX = 1009;

// Aakhri aisa child jo screen par dikhta ho (display:none wale hr ko chhod ke)
const lastVisibleChild = (el) => {
  for (let i = el.children.length - 1; i >= 0; i -= 1) {
    const rect = el.children[i].getBoundingClientRect();
    if (rect.height > 0) return el.children[i];
  }
  return null;
};

/* =====================================================
   PAGE LENGTH — resume kitne page ka banega (andaza)
   ===================================================== */
export function PageLengthNote({ previewRef }) {
  const [pages, setPages] = useState(null);

  const measure = () => {
    const el = previewRef.current;
    if (!el) return;

    const style = window.getComputedStyle(el);
    const innerWidth =
      el.clientWidth -
      (parseFloat(style.paddingLeft) || 0) -
      (parseFloat(style.paddingRight) || 0);
    // Preview chhupa ho (mobile par Edit tab) to measure mat karo
    if (!innerWidth || innerWidth <= 0) return;

    const first = el.firstElementChild;
    const last = lastVisibleChild(el);
    if (!first || !last) return;

    const contentHeight =
      last.getBoundingClientRect().bottom - first.getBoundingClientRect().top;
    if (contentHeight <= 0) return;

    // Print mein chaudai 680px hoti hai, to wrapping ke hisaab se height scale karo
    const printHeight = contentHeight * (innerWidth / PRINT_WIDTH_PX);
    const value = Math.round((printHeight / PRINT_HEIGHT_PX) * 100) / 100;
    setPages((prev) => (prev === value ? prev : value));
  };

  // Har render ke baad naapo (value same ho to state nahi badalti, loop nahi banta)
  useEffect(measure);

  // Window/preview ki chaudai badle tab bhi
  useEffect(() => {
    const el = previewRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewRef]);

  if (pages === null) return null;

  let status = "ok";
  let message;
  if (pages <= 1) {
    message = `Fits on 1 page (about ${Math.max(1, Math.round(pages * 100))}% full)`;
  } else if (pages <= 1.15) {
    status = "warn";
    message = `Just over 1 page (about ${pages.toFixed(1)}). Trim a few lines to fit on one page.`;
  } else if (pages <= 2) {
    status = "warn";
    message = `About ${pages.toFixed(1)} pages. Freshers should aim for 1 page, experienced candidates up to 2.`;
  } else {
    status = "bad";
    message = `About ${pages.toFixed(1)} pages — too long. Shorten descriptions and keep only the most relevant points.`;
  }

  return (
    <div className={`page-note page-note-${status}`} role="status">
      <span className="page-note-icon" aria-hidden="true">
        {status === "ok" ? "✅" : status === "warn" ? "⚠️" : "❗"}
      </span>
      <span>
        {message}
        <span className="page-note-hint"> (estimate)</span>
      </span>
    </div>
  );
}

/* =====================================================
   SCORE BREAKDOWN — section-wise points
   ===================================================== */
export default function ScoreBreakdown({ sections }) {
  const [open, setOpen] = useState(false);

  // Kis section mein sabse zyada points milne ki gunjaish hai
  let focusKey = null;
  let biggestGap = 0;
  sections.forEach((s) => {
    const gap = s.max - s.points;
    if (gap > biggestGap) {
      biggestGap = gap;
      focusKey = s.key;
    }
  });

  return (
    <div className="insights-card">
      <button
        className="insights-header"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="insights-title">📊 Score breakdown</span>
        <span className="insights-chevron">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="insights-body">
          {sections.map((s) => {
            const ratio = s.max > 0 ? s.points / s.max : 0;
            const tone = ratio >= 0.8 ? "good" : ratio >= 0.5 ? "mid" : "low";
            return (
              <div className="insights-row" key={s.key}>
                <div className="insights-row-top">
                  <span className="insights-name">
                    {s.label}
                    {s.key === focusKey && (
                      <em className="insights-focus">most to gain</em>
                    )}
                  </span>
                  <span className={`insights-points tone-${tone}`}>
                    {s.points}/{s.max}
                  </span>
                </div>
                <div className="insights-track">
                  <div
                    className={`insights-fill fill-${tone}`}
                    style={{ width: `${ratio * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          <p className="insights-note">
            Certifications and languages are optional and don't change the
            score.
          </p>
        </div>
      )}
    </div>
  );
}
