import { useState, useEffect, useRef } from "react";

const LINKS = [
  ["landing", "Home"],
  ["builder", "Builder"],
  ["about", "About"],
];

function Navbar({
  currentResumeName,
  savedResumes,
  darkMode,
  onNewResume,
  onSaveResume,
  onLoadResume,
  onDeleteResume,
  onRenameResume,
  onToggleDarkMode,
  currentView,
  onNavigate,
}) {
  const [showSavedDropdown, setShowSavedDropdown] = useState(false);
  const [nameDraft, setNameDraft] = useState(currentResumeName);
  const dropdownRef = useRef(null);

  // Resume load/new hone par naam sync rahe
  useEffect(() => {
    setNameDraft(currentResumeName);
  }, [currentResumeName]);

  // Dropdown ke bahar click karne par band ho jaye
  useEffect(() => {
    if (!showSavedDropdown) return;
    const onMouseDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSavedDropdown(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [showSavedDropdown]);

  const commitName = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      setNameDraft(currentResumeName);
      return;
    }
    if (trimmed !== currentResumeName) onRenameResume(trimmed);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">🧾 Resume Builder</span>
        <div className="navbar-links">
          {LINKS.map(([view, label]) => (
            <button
              key={view}
              className={`navbar-link ${currentView === view ? "navbar-link-active" : ""}`}
              aria-current={currentView === view ? "page" : undefined}
              onClick={() => onNavigate(view)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        {/* Click karke naam badlo */}
        <input
          className="navbar-resume-name"
          type="text"
          aria-label="Resume name"
          title="Click to rename"
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setNameDraft(currentResumeName);
              e.currentTarget.blur();
            }
          }}
        />

        <button className="navbar-btn" onClick={onNewResume}>
          + New
        </button>

        <button
          className="navbar-btn navbar-btn-primary"
          onClick={onSaveResume}
        >
          Save
        </button>

        <div className="navbar-dropdown-wrapper" ref={dropdownRef}>
          <button
            className="navbar-btn"
            aria-expanded={showSavedDropdown}
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
                    <button
                      className="item-name"
                      onClick={() => {
                        onLoadResume(r);
                        setShowSavedDropdown(false);
                      }}
                    >
                      {r}
                    </button>
                    <button
                      className="item-delete"
                      aria-label={`Delete ${r}`}
                      onClick={() => onDeleteResume(r)}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          className="navbar-theme-switch"
          role="switch"
          aria-checked={darkMode}
          aria-label="Dark mode"
          onClick={onToggleDarkMode}
        >
          <span className={`switch-track ${darkMode ? "switch-on" : ""}`}>
            <span className="switch-thumb"></span>
          </span>
          <span className="switch-label">
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
