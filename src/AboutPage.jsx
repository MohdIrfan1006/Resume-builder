function AboutPage({ onGetStarted }) {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>Build a Resume That Actually Gets You Shortlisted</h1>
        <p className="about-subtitle">
          Not just another resume template — a tool built to think like a
          recruiter and an ATS system, so you don't have to guess what works.
        </p>
        <button className="about-cta" onClick={onGetStarted}>
          Start Building →
        </button>
      </div>

      <div className="about-features">
        <h2>What makes this different</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-Time Resume Score</h3>
            <p>
              Most resume builders just fill a template. This one actively
              scores your resume as you type — checking real formatting rules
              (valid email, proper phone number, meaningful objective,
              quantified achievements) instead of just "is this field empty."
              You know exactly what's weak before you ever hit download.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>ATS-Safe Mode</h3>
            <p>
              Over 75% of resumes are filtered by ATS software before a human
              ever sees them. One toggle strips your resume down to a clean,
              parseable format — no columns, no symbols that confuse parsers —
              so your resume actually reaches a recruiter's inbox.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Smart Improvement Tips</h3>
            <p>
              Instead of guessing what's missing, you get specific, actionable
              suggestions — like adding measurable impact ("increased sales by
              20%") to your experience, which recruiters consistently rank as
              the #1 differentiator between average and standout resumes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Multiple Professional Templates</h3>
            <p>
              Switch between Modern, Classic, and Minimal layouts instantly —
              the same content, restyled for different industries and roles,
              without rebuilding anything from scratch.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Multiple Resume Versions</h3>
            <p>
              Save and switch between different resumes for different roles — a
              tailored resume for every job application is one of the most
              proven ways to improve shortlist rates, and most tools don't let
              you do this for free.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Clean PDF Export</h3>
            <p>
              One-click, print-optimized PDF export with proper page breaks — no
              content getting awkwardly cut off across pages, which is a common
              and avoidable reason resumes look unpolished.
            </p>
          </div>
        </div>
      </div>

      <div className="about-mission">
        <h2>Why this exists</h2>
        <p>
          Most people don't get rejected because they're unqualified — they get
          rejected because their resume doesn't communicate their value clearly,
          or never even reaches a human due to ATS filtering. This tool was
          built to close that gap: combining real formatting standards,
          recruiter-backed best practices, and instant feedback — so your resume
          works as hard as you did to build your experience.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
