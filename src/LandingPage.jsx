function LandingPage({ onStartBuilding }) {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <span className="landing-badge">✨ Built to get you shortlisted</span>
        <h1>
          Build a Resume That{" "}
          <span className="landing-highlight">Recruiters</span> Actually Notice
        </h1>
        <p className="landing-subtitle">
          Real-time scoring, ATS-safe formatting, and recruiter-backed feedback
          — not just another template. Know exactly what to fix before you hit
          download.
        </p>
        <div className="landing-cta-group">
          <button className="landing-cta-primary" onClick={onStartBuilding}>
            Start Building — It's Free →
          </button>
        </div>

        <div className="landing-stats">
          <div className="landing-stat">
            <span className="landing-stat-number">75%</span>
            <span className="landing-stat-label">
              of resumes get filtered by ATS before a human sees them
            </span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-number">3</span>
            <span className="landing-stat-label">
              professional templates to choose from
            </span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-number">100%</span>
            <span className="landing-stat-label">free, no signup required</span>
          </div>
        </div>
      </div>

      <div className="landing-preview-mockup">
        <div className="mockup-card">
          <div className="mockup-score">
            <span>Resume Score</span>
            <span className="mockup-score-value">92/100</span>
          </div>
          <div className="mockup-bar">
            <div className="mockup-bar-fill"></div>
          </div>
          <p className="mockup-line mockup-line-title"></p>
          <p className="mockup-line"></p>
          <p className="mockup-line short"></p>
        </div>
      </div>

      <div className="landing-features">
        <h2>Why job seekers choose this tool</h2>
        <div className="landing-feature-row">
          <div className="landing-feature">
            <div className="landing-feature-icon">📊</div>
            <h3>Live Resume Score</h3>
            <p>
              Real formatting checks, not just empty-field checks — know your
              weak spots instantly.
            </p>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon">🎯</div>
            <h3>ATS-Safe Mode</h3>
            <p>
              One toggle strips your resume to a clean, parseable format that
              passes filters.
            </p>
          </div>
          <div className="landing-feature">
            <div className="landing-feature-icon">💡</div>
            <h3>Smart Suggestions</h3>
            <p>
              Specific tips — like adding measurable impact — that actually move
              the needle.
            </p>
          </div>
        </div>
      </div>

      <div className="landing-bottom-cta">
        <h2>Ready to build your shortlist-worthy resume?</h2>
        <button className="landing-cta-primary" onClick={onStartBuilding}>
          Start Building — It's Free →
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
