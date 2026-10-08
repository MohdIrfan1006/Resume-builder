const FEATURES = [
  {
    icon: "📊",
    title: "Real-Time Resume Score",
    text: 'Most resume builders just fill a template. This one scores your resume as you type — checking formatting rules (valid email, proper phone number, meaningful objective, measurable results) instead of just "is this field empty." You know what\'s weak before you ever hit download.',
  },
  {
    icon: "🎯",
    title: "ATS-Safe Mode",
    text: "Many companies use ATS software to screen resumes before a person reads them. One toggle strips your resume down to a clean, plain format with standard headings — no tags, no decorative styling that can confuse parsers.",
  },
  {
    icon: "💡",
    title: "Smart Improvement Tips",
    text: 'Instead of guessing what\'s missing, you get specific, actionable suggestions — like adding measurable results ("improved load time by 30%") and replacing weak phrases with action verbs. Concrete numbers usually make experience points much stronger.',
  },
  {
    icon: "🎨",
    title: "Multiple Professional Templates",
    text: "Switch between Modern, Classic, and Minimal layouts instantly — the same content, restyled for different industries and roles, without rebuilding anything from scratch.",
  },
  {
    icon: "💾",
    title: "Multiple Resume Versions",
    text: "Save and switch between different resumes for different roles. Tailoring your resume to each job is widely recommended, and here you can keep as many versions as you need, for free.",
  },
  {
    icon: "📄",
    title: "Clean PDF Export",
    text: "One-click, print-optimized PDF export with proper page breaks — no content getting awkwardly cut off across pages, which is a common and avoidable reason resumes look unpolished.",
  },
];

function AboutPage({ onGetStarted }) {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h1>Build a Resume That Actually Gets You Shortlisted</h1>
        <p className="about-subtitle">
          Not just another resume template — a tool built around what recruiters
          and ATS systems look for, so you don't have to guess what works.
        </p>
        <button className="about-cta" onClick={onGetStarted}>
          Start Building →
        </button>
      </div>

      <div className="about-features">
        <h2>What makes this different</h2>

        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="about-mission">
        <h2>Why this exists</h2>
        <p>
          Many people get passed over not because they're unqualified, but
          because their resume doesn't communicate their value clearly — or gets
          stuck in automated screening before a person reads it. This tool was
          built to close that gap: combining clean formatting standards, widely
          accepted resume best practices, and instant feedback — so your resume
          works as hard as you did to build your experience.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
