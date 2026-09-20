import { useState } from "react";

function LandingPage({ onStartBuilding }) {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Is this really free to use?",
      a: "Yes, completely free — no signup, no hidden charges, no watermarks on your downloaded PDF.",
    },
    {
      q: "How does the Resume Score actually work?",
      a: "It checks real formatting rules — valid email and phone format, a meaningful career objective, quantified achievements in your experience, and more — not just whether a field is empty.",
    },
    {
      q: "What is ATS-Safe Mode?",
      a: "Most companies use ATS (Applicant Tracking System) software to filter resumes before a human sees them. ATS-Safe Mode strips out formatting that confuses these systems — like columns and special symbols — so your resume gets through.",
    },
    {
      q: "Is my data saved anywhere online?",
      a: "No — everything is stored locally in your browser. Nothing is sent to a server, so your information stays private to your device.",
    },
    {
      q: "Can I make multiple resumes for different jobs?",
      a: "Yes — you can save as many versions as you want, each with a different name, and switch between them anytime from the navbar.",
    },
  ];

  return (
    <div className="landing-page">
      {/* ---- HERO ---- */}
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

      {/* ---- FEATURES ---- */}
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

      {/* ---- HOW IT WORKS ---- */}
      <div className="landing-how">
        <h2>How it works</h2>
        <div className="how-steps">
          <div className="how-step">
            <div className="how-step-number">1</div>
            <h3>Fill in your details</h3>
            <p>
              Enter your info once — name, experience, education, skills, and
              projects — with live validation guiding you.
            </p>
          </div>
          <div className="how-connector">→</div>
          <div className="how-step">
            <div className="how-step-number">2</div>
            <h3>Get scored & improve</h3>
            <p>
              Watch your Resume Score update in real time, with specific tips on
              exactly what to fix.
            </p>
          </div>
          <div className="how-connector">→</div>
          <div className="how-step">
            <div className="how-step-number">3</div>
            <h3>Download & apply</h3>
            <p>
              Pick a template, toggle ATS-Safe Mode if needed, and download a
              polished, print-ready PDF.
            </p>
          </div>
        </div>
      </div>

      {/* ---- COMPARISON ---- */}
      <div className="landing-comparison">
        <h2>Not your average resume builder</h2>
        <div className="comparison-table">
          <div className="comparison-header">
            <div className="comparison-cell comparison-label-cell"></div>
            <div className="comparison-cell comparison-col-old">
              Traditional Builders
            </div>
            <div className="comparison-cell comparison-col-new">This Tool</div>
          </div>

          {[
            [
              "Feedback on resume quality",
              "None — just a template",
              "Real-time score + tips",
            ],
            [
              "ATS-friendly formatting",
              "Not guaranteed",
              "One-click ATS-Safe Mode",
            ],
            ["Multiple resume versions", "Often paywalled", "Unlimited, free"],
            [
              "Data privacy",
              "Stored on their servers",
              "Stored only in your browser",
            ],
            ["Cost", "Often subscription-based", "100% free"],
          ].map((row, i) => (
            <div className="comparison-row" key={i}>
              <div className="comparison-cell comparison-label-cell">
                {row[0]}
              </div>
              <div className="comparison-cell comparison-col-old">
                ✕ {row[1]}
              </div>
              <div className="comparison-cell comparison-col-new">
                ✓ {row[2]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- FAQ ---- */}
      <div className="landing-faq">
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <div className="faq-item" key={i}>
              <div
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq-icon">{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && <div className="faq-answer">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ---- BOTTOM CTA ---- */}
      <div className="landing-bottom-cta">
        <h2>Ready to build your shortlist-worthy resume?</h2>
        <button className="landing-cta-primary" onClick={onStartBuilding}>
          Start Building — It's Free →
        </button>
      </div>

      {/* ---- FOOTER ---- */}
      <footer className="landing-footer">
        <div className="footer-content">
          <span className="footer-logo">🧾 Resume Builder</span>
          <p className="footer-tagline">
            Built to help you get shortlisted — free, private, and fast.
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Resume Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
