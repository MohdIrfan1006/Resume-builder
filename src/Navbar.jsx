import { useState } from "react";

function Navbar({
  currentResumeName,
  savedResumes,
  darkMode,
  onNewResume,
  onSaveResume,
  onLoadResume,
  onDeleteResume,
  onToggleDarkMode,
  currentView,
  onNavigate,
}) {
  const [showSavedDropdown, setShowSavedDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">🧾 Resume Builder</span>
        <div className="navbar-links">
          <span
            className={`navbar-link ${currentView === "home" ? "navbar-link-active" : ""}`}
            onClick={() => onNavigate("home")}
          >
            Home
          </span>
          <span
            className={`navbar-link ${currentView === "about" ? "navbar-link-active" : ""}`}
            onClick={() => onNavigate("about")}
          >
            About
          </span>
        </div>
      </div>
      <div className="navbar-right">
        <span className="navbar-resume-name">{currentResumeName}</span>

        <button className="navbar-btn" onClick={onNewResume}>
          + New
        </button>

        <button
          className="navbar-btn navbar-btn-primary"
          onClick={onSaveResume}
        >
          Save
        </button>

        <div className="navbar-dropdown-wrapper">
          <button
            className="navbar-btn"
            onClick={() => setShowSavedDropdown(!showSavedDropdown)}
          >
            Saved ({savedResumes.length}) ▾
          </button>

          {showSavedDropdown && (
            <div className="navbar-dropdown">
              {savedResumes.length === 0 ? (
                <p className="navbar-dropdown-empty">No saved resumes yet</p>
              ) : (
                savedResumes.map((r) => (
                  <div className="navbar-dropdown-item" key={r}>
                    <span
                      onClick={() => {
                        onLoadResume(r);
                        setShowSavedDropdown(false);
                      }}
                    >
                      {r}
                    </span>
                    <button onClick={() => onDeleteResume(r)}>🗑️</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="navbar-theme-switch" onClick={onToggleDarkMode}>
          <div className={`switch-track ${darkMode ? "switch-on" : ""}`}>
            <div className="switch-thumb"></div>
          </div>
          <span className="switch-label">
            {darkMode ? "Dark Mode" : "Light Mode"}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
