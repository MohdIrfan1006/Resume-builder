import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Navbar from "./Navbar";
import "./App.css";
import AboutPage from "./AboutPage";
import LandingPage from "./LandingPage";

/* =====================================================
   HELPERS (component ke bahar — har render par dobara nahi bante)
   ===================================================== */

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const blankExperience = () => ({
  id: uid(),
  company: "",
  role: "",
  duration: "",
  description: "",
});
const blankEducation = () => ({ id: uid(), school: "", degree: "", year: "" });
const blankProject = () => ({
  id: uid(),
  title: "",
  description: "",
  link: "",
});

const emptyResume = () => ({
  name: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  github: "",
  objective: "",
  experience: [blankExperience()],
  education: [blankEducation()],
  skills: [],
  projects: [blankProject()],
});

const makeSample = () => ({
  name: "Mohd Irfan",
  email: "mohdirfan@example.com",
  phone: "9876543210",
  address: "Gachibowli, Hyderabad",
  linkedin: "https://linkedin.com/in/mohdirfan",
  github: "https://github.com/mohdirfan",
  objective:
    "Motivated software developer with hands-on experience in building web applications using React and JavaScript. Passionate about writing clean, efficient code and continuously learning new technologies to solve real-world problems.",
  experience: [
    {
      id: uid(),
      company: "TechNova Solutions",
      role: "Frontend Developer Intern",
      duration: "Jan 2025 - Jun 2025",
      description:
        "Built and maintained 5+ React components used across the product\nImproved page load speed by 30% through code optimization and lazy loading",
    },
  ],
  education: [
    {
      id: uid(),
      school: "Osmania University",
      degree: "B.Tech in Computer Science",
      year: "2021 - 2025",
    },
  ],
  skills: ["React", "JavaScript", "HTML/CSS", "Git", "Node.js"],
  projects: [
    {
      id: uid(),
      title: "Resume Builder App",
      description:
        "A React-based resume builder with real-time scoring, ATS-safe formatting, and PDF export functionality.",
      link: "github.com/mohdirfan/resume-builder",
    },
  ],
});

// localStorage kharab ya blocked ho to bhi app crash na ho
const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const str = (v) => (typeof v === "string" ? v : "");

const normalizeList = (list, blank) =>
  Array.isArray(list)
    ? list.map((item) => ({
        ...blank(),
        ...item,
        id: item && item.id ? item.id : uid(),
      }))
    : [blank()];

// Purane saved data (bina id wale) ko bhi sahi format mein convert karta hai
const normalizeResume = (data) => {
  const d = data && typeof data === "object" ? data : {};
  return {
    name: str(d.name),
    email: str(d.email),
    phone: str(d.phone),
    address: str(d.address),
    linkedin: str(d.linkedin),
    github: str(d.github),
    objective: str(d.objective),
    experience: normalizeList(d.experience, blankExperience),
    education: normalizeList(d.education, blankEducation),
    skills: Array.isArray(d.skills)
      ? d.skills.filter((s) => typeof s === "string" && s.trim())
      : [],
    projects: normalizeList(d.projects, blankProject),
  };
};

const loadInitial = () => {
  const saved = safeParse("resumeData", null);
  if (saved && typeof saved === "object") {
    return {
      resume: normalizeResume(saved),
      template: saved.template || "modern",
      darkMode: !!saved.darkMode,
      atsMode: !!saved.atsMode,
      resumeName: saved.currentResumeName || "Untitled Resume",
    };
  }
  return {
    resume: makeSample(),
    template: "modern",
    darkMode: false,
    atsMode: false,
    resumeName: "Example Resume",
  };
};

/* ---------- validators ---------- */
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
// +91 98765 43210, 98765-43210 jaise formats bhi chalenge
const isValidPhone = (v) => /^\+?\d{10,13}$/.test(v.replace(/[\s\-().]/g, ""));
const isValidURL = (v) =>
  /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}(\/\S*)?$/.test(
    v.trim(),
  );
// Kisi bhi language ke naam chalenge, single-word naam bhi
const isRealisticName = (v) => /^[\p{L}\s.'-]{2,}$/u.test(v.trim());

const toHref = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);
const toLines = (text) =>
  text
    .split("\n")
    .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);

/* ---------- score ---------- */
const WEAK_PHRASES = [
  "responsible for",
  "worked on",
  "helped with",
  "duties included",
  "hardworking",
  "team player",
];

// Sirf asli numbers/metrics ko "quantified" maano (random digit ko nahi)
const QUANT_REGEX =
  /(\d+(\.\d+)?\s*(%|\+|x\b|k\b|m\b|ms\b|users?|clients?|customers?|members?|projects?|components?|apis?|pages?|hours?|days?|lakhs?|crores?))|[₹$€£]\s*\d/i;

const calculateResumeScore = (resume) => {
  const {
    name,
    email,
    phone,
    linkedin,
    github,
    objective,
    experience,
    education,
    skills,
    projects,
  } = resume;
  let score = 0;
  const tips = [];

  // Basic info (20)
  if (isRealisticName(name)) {
    score += 5;
    if (name.trim().split(/\s+/).length < 2) {
      tips.push("Add your first and last name");
    }
  } else if (name.trim()) {
    tips.push("Name should contain only letters");
  } else {
    tips.push("Add your full name");
  }

  if (isValidEmail(email)) score += 5;
  else if (email.trim())
    tips.push("Email format looks incorrect (e.g. name@example.com)");
  else tips.push("Add your email");

  if (isValidPhone(phone)) score += 5;
  else if (phone.trim())
    tips.push(
      "Phone number should have 10 to 13 digits (e.g. +91 98765 43210)",
    );
  else tips.push("Add your phone number");

  const hasValidLink =
    (linkedin.trim() && isValidURL(linkedin)) ||
    (github.trim() && isValidURL(github));
  if (hasValidLink) score += 5;
  else if (linkedin.trim() || github.trim())
    tips.push("LinkedIn/GitHub link format looks incorrect");
  else tips.push("Add a LinkedIn or GitHub link — recruiters often check it");

  // Objective (15)
  const objWords = objective.trim().split(/\s+/).filter(Boolean);
  const objWordCount = objWords.length;
  const uniqueWords = new Set(objWords.map((w) => w.toLowerCase())).size;
  const isMeaningfulObjective =
    objWordCount >= 15 &&
    objWordCount <= 60 &&
    uniqueWords / objWordCount > 0.4;

  if (isMeaningfulObjective) score += 15;
  else if (objWordCount > 0) {
    score += 3;
    tips.push(
      "Career objective should be 15-60 genuine, varied words — avoid repeating the same word",
    );
  } else {
    tips.push(
      "Write a career objective — it's the first thing recruiters read",
    );
  }

  // Experience (25)
  const filledExperience = experience.filter(
    (e) =>
      e.company.trim().length >= 2 &&
      e.role.trim().length >= 2 &&
      e.duration.trim().length >= 3,
  );
  if (filledExperience.length > 0) {
    score += 10;
    const hasQualityDescription = experience.some(
      (e) => e.description.trim().split(/\s+/).filter(Boolean).length >= 8,
    );
    const hasNumbers = experience.some((e) => QUANT_REGEX.test(e.description));

    if (hasQualityDescription && hasNumbers) score += 15;
    else if (hasQualityDescription) {
      score += 8;
      tips.push(
        'Add measurable results to your experience (e.g. "improved load time by 30%")',
      );
    } else {
      score += 3;
      tips.push(
        "Write a proper description (at least 8 words) for your experience",
      );
    }
  } else {
    tips.push(
      "Add work experience with company, role and duration — or an internship/project if you're a fresher",
    );
  }

  // Weak phrases (sirf tip, score par asar nahi)
  const allText = [objective, ...experience.map((e) => e.description)]
    .join(" ")
    .toLowerCase();
  const weak = WEAK_PHRASES.filter((p) => allText.includes(p));
  if (weak.length > 0) {
    tips.push(
      `Replace weak phrases like "${weak[0]}" with action verbs (Built, Led, Reduced, Launched)`,
    );
  }

  // Education (15)
  const filledEducation = education.filter(
    (e) =>
      e.school.trim().length >= 3 &&
      e.degree.trim().length >= 2 &&
      /\d{4}/.test(e.year),
  );
  if (filledEducation.length > 0) score += 15;
  else if (education.some((e) => e.school.trim() || e.degree.trim()))
    tips.push(
      "Fill education properly — school name, degree, and a valid year (e.g. 2021-2025)",
    );
  else tips.push("Add your education details");

  // Skills (15)
  const validSkills = skills.filter(
    (s) => s.trim().length >= 2 && /[a-zA-Z]/.test(s),
  );
  if (validSkills.length >= 5) score += 15;
  else if (validSkills.length > 0) {
    score += 6;
    tips.push(
      `Add more skills — you have ${validSkills.length}, aim for at least 5`,
    );
  } else tips.push("Add your key skills");

  // Projects (10)
  const filledProjects = projects.filter(
    (p) =>
      p.title.trim().length >= 3 &&
      p.description.trim().split(/\s+/).filter(Boolean).length >= 5,
  );
  if (filledProjects.length > 0) score += 10;
  else if (projects.some((p) => p.title.trim()))
    tips.push(
      "Add a proper project description (at least 5 words), not just a title",
    );
  else tips.push("Add at least one project — especially useful for freshers");

  return { score: Math.min(score, 100), tips };
};

/* ---------- small components ---------- */

// Label ab input se linked hai (htmlFor/id) — click karne par focus aur screen reader dono kaam karte hain
function Field({ id, label, error, multiline, ...props }) {
  const className = error ? "input-error" : "";
  return (
    <>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea id={id} className={className} {...props}></textarea>
      ) : (
        <input id={id} className={className} {...props} />
      )}
      {error && <p className="error-text">{error}</p>}
    </>
  );
}

function Bullets({ text }) {
  const lines = toLines(text);
  if (lines.length === 0) return null;
  return (
    <ul className="preview-bullets">
      {lines.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}

const VIEWS = ["landing", "builder", "about"];
const viewFromHash = () => {
  const h = window.location.hash.replace("#", "");
  return VIEWS.includes(h) ? h : "landing";
};

/* =====================================================
   APP
   ===================================================== */

function App() {
  const [initial] = useState(loadInitial);

  const [resume, setResume] = useState(initial.resume);
  const [template, setTemplate] = useState(initial.template);
  const [atsMode, setAtsMode] = useState(initial.atsMode);
  const [darkMode, setDarkMode] = useState(initial.darkMode);
  const [currentResumeName, setCurrentResumeName] = useState(
    initial.resumeName,
  );
  const [isExample, setIsExample] = useState(
    initial.resumeName === "Example Resume",
  );

  const [savedResumes, setSavedResumes] = useState(() =>
    safeParse("savedResumesList", []),
  );
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [showAllTips, setShowAllTips] = useState(false);
  const [mobileTab, setMobileTab] = useState("form");
  const [currentView, setCurrentView] = useState(viewFromHash);
  const [saveModal, setSaveModal] = useState({ open: false, value: "" });
  const [toast, setToast] = useState("");

  const toastTimer = useRef();
  const resumeRef = useRef();

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // ---- Hash routing: refresh aur Back button ab sahi kaam karenge ----
  useEffect(() => {
    const onHashChange = () => setCurrentView(viewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (view) => {
    window.location.hash = view;
    window.scrollTo(0, 0);
  };

  // ---- Autosave (500ms debounce) ----
  useEffect(() => {
    const t = setTimeout(() => {
      safeSet("resumeData", {
        ...resume,
        template,
        darkMode,
        atsMode,
        currentResumeName,
      });
    }, 500);
    return () => clearTimeout(t);
  }, [resume, template, darkMode, atsMode, currentResumeName]);

  // ---- Edit helpers (immutable updates, id-based) ----
  // Sample resume edit karte hi banner hat jaye aur naam "Untitled Resume" ho jaye
  const touch = () => {
    if (isExample) {
      setIsExample(false);
      setCurrentResumeName("Untitled Resume");
    }
  };

  const setField = (field, value) => {
    touch();
    setResume((prev) => ({ ...prev, [field]: value }));
    // User ne field theek karna shuru kiya to error hata do
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const addItem = (section, blank) => {
    touch();
    setResume((prev) => ({ ...prev, [section]: [...prev[section], blank()] }));
  };
  const updateItem = (section, id, field, value) => {
    touch();
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };
  const removeItem = (section, id) => {
    touch();
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  // ---- Skills ----
  const addSkills = (raw) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    touch();
    setResume((prev) => {
      const seen = new Set(prev.skills.map((s) => s.toLowerCase()));
      const fresh = [];
      parts.forEach((s) => {
        if (!seen.has(s.toLowerCase())) {
          seen.add(s.toLowerCase());
          fresh.push(s);
        }
      });
      return { ...prev, skills: [...prev.skills, ...fresh] };
    });
    setSkillInput("");
  };
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkills(skillInput);
    }
  };
  const removeSkill = (skill) => {
    touch();
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // ---- Score ----
  const { score: resumeScore, tips: resumeTips } = calculateResumeScore(resume);
  const scoreClass =
    resumeScore >= 80
      ? "score-good"
      : resumeScore >= 50
        ? "score-mid"
        : "score-low";
  const visibleTips = showAllTips ? resumeTips : resumeTips.slice(0, 4);

  // ---- Save / Load / Delete / New ----
  const openSaveModal = () =>
    setSaveModal({ open: true, value: currentResumeName });
  const closeSaveModal = () => setSaveModal({ open: false, value: "" });

  const commitSave = () => {
    const trimmed = saveModal.value.trim();
    if (!trimmed) return;

    const exists = savedResumes.includes(trimmed);
    if (
      exists &&
      trimmed !== currentResumeName &&
      !window.confirm(`"${trimmed}" already exists. Overwrite it?`)
    ) {
      return;
    }

    const list = exists ? savedResumes : [...savedResumes, trimmed];
    const ok =
      safeSet(`resume_${trimmed}`, { ...resume, template, atsMode }) &&
      safeSet("savedResumesList", list);

    if (!ok) {
      showToast("Couldn't save — browser storage is full or blocked.");
      return;
    }
    setSavedResumes(list);
    setCurrentResumeName(trimmed);
    setIsExample(false);
    closeSaveModal();
    showToast(`"${trimmed}" saved`);
  };

  const loadResume = (resumeName) => {
    const data = safeParse(`resume_${resumeName}`, null);
    if (!data) {
      showToast("Couldn't open that resume.");
      return;
    }
    setResume(normalizeResume(data));
    setTemplate(data.template || "modern");
    setAtsMode(!!data.atsMode);
    setCurrentResumeName(resumeName);
    setIsExample(false);
    setErrors({});
  };

  const deleteResume = (resumeName) => {
    if (!window.confirm(`Delete "${resumeName}"?`)) return;
    try {
      localStorage.removeItem(`resume_${resumeName}`);
    } catch {
      /* ignore */
    }
    const updated = savedResumes.filter((r) => r !== resumeName);
    safeSet("savedResumesList", updated);
    setSavedResumes(updated);
  };

  const newResume = () => {
    if (
      !window.confirm(
        "Start a new blank resume? (Unsaved changes will be lost)",
      )
    )
      return;
    setResume(emptyResume());
    setCurrentResumeName("Untitled Resume");
    setIsExample(false);
    setSkillInput("");
    setErrors({});
  };

  const renameResume = (newName) => {
    setCurrentResumeName(newName);
    setIsExample(false);
  };

  // ---- PDF ----
  const validateForm = () => {
    const newErrors = {};
    if (!resume.name.trim()) newErrors.name = "Name is required";
    if (!resume.email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(resume.email))
      newErrors.email = "Enter a valid email";
    if (!resume.phone.trim()) newErrors.phone = "Phone is required";
    else if (!isValidPhone(resume.phone))
      newErrors.phone = "Enter a valid phone number (10 to 13 digits)";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) setMobileTab("form");
    return Object.keys(newErrors).length === 0;
  };

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${resume.name || "Resume"}`,
  });
  const handleDownloadClick = () => {
    if (validateForm()) handlePrint();
  };

  // ---- Preview data: sirf bhari hui cheezein dikhao (placeholder PDF mein nahi jayega) ----
  const contactParts = [resume.email, resume.phone, resume.address]
    .map((s) => s.trim())
    .filter(Boolean);
  const linkParts = [resume.linkedin, resume.github]
    .map((s) => s.trim())
    .filter(Boolean);
  const filledExperience = resume.experience.filter(
    (e) => e.company.trim() || e.role.trim() || e.description.trim(),
  );
  const filledEducation = resume.education.filter(
    (e) => e.school.trim() || e.degree.trim(),
  );
  const filledProjects = resume.projects.filter(
    (p) => p.title.trim() || p.description.trim(),
  );
  const hasAnyContent =
    contactParts.length > 0 ||
    linkParts.length > 0 ||
    resume.objective.trim() ||
    filledExperience.length > 0 ||
    filledEducation.length > 0 ||
    resume.skills.length > 0 ||
    filledProjects.length > 0;

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Navbar
        currentResumeName={currentResumeName}
        savedResumes={savedResumes}
        darkMode={darkMode}
        onNewResume={newResume}
        onSaveResume={openSaveModal}
        onLoadResume={loadResume}
        onDeleteResume={deleteResume}
        onRenameResume={renameResume}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        currentView={currentView}
        onNavigate={navigate}
      />

      {currentView === "landing" ? (
        <LandingPage onStartBuilding={() => navigate("builder")} />
      ) : currentView === "about" ? (
        <AboutPage onGetStarted={() => navigate("builder")} />
      ) : (
        <>
          {/* Mobile par Edit / Preview tab */}
          <div className="mobile-tabs">
            <button
              className={mobileTab === "form" ? "active" : ""}
              onClick={() => setMobileTab("form")}
            >
              ✏️ Edit
            </button>
            <button
              className={mobileTab === "preview" ? "active" : ""}
              onClick={() => setMobileTab("preview")}
            >
              👁️ Preview &amp; Score
            </button>
          </div>

          <div className={`resume-container show-${mobileTab}`}>
            {/* LEFT SIDE - FORM */}
            <div className="form-section">
              {isExample && (
                <div className="example-banner">
                  👋 This is a sample resume — edit any field to make it yours,
                  or click <strong>"+ New"</strong> to start fresh.
                </div>
              )}

              <h2>Enter Your Details</h2>

              <Field
                id="f-name"
                label="Full Name"
                type="text"
                placeholder="Enter your name"
                value={resume.name}
                error={errors.name}
                onChange={(e) => setField("name", e.target.value)}
              />
              <Field
                id="f-email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={resume.email}
                error={errors.email}
                onChange={(e) => setField("email", e.target.value)}
              />
              <Field
                id="f-phone"
                label="Phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={resume.phone}
                error={errors.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              <Field
                id="f-address"
                label="Address"
                type="text"
                placeholder="City, State"
                value={resume.address}
                onChange={(e) => setField("address", e.target.value)}
              />
              <Field
                id="f-linkedin"
                label="LinkedIn"
                type="text"
                placeholder="linkedin.com/in/yourname"
                value={resume.linkedin}
                onChange={(e) => setField("linkedin", e.target.value)}
              />
              <Field
                id="f-github"
                label="GitHub"
                type="text"
                placeholder="github.com/yourname"
                value={resume.github}
                onChange={(e) => setField("github", e.target.value)}
              />
              <Field
                id="f-objective"
                label="Career Objective"
                multiline
                placeholder="Write your career objective"
                value={resume.objective}
                onChange={(e) => setField("objective", e.target.value)}
              />

              {/* ---- EXPERIENCE ---- */}
              <h2>Experience</h2>
              {resume.experience.length === 0 && (
                <p className="empty-hint">
                  No experience added. That's fine for freshers — add an
                  internship or project instead.
                </p>
              )}
              {resume.experience.map((exp) => (
                <div className="dynamic-block" key={exp.id}>
                  <Field
                    id={`exp-${exp.id}-company`}
                    label="Company"
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) =>
                      updateItem(
                        "experience",
                        exp.id,
                        "company",
                        e.target.value,
                      )
                    }
                  />
                  <Field
                    id={`exp-${exp.id}-role`}
                    label="Role"
                    type="text"
                    placeholder="Job Title"
                    value={exp.role}
                    onChange={(e) =>
                      updateItem("experience", exp.id, "role", e.target.value)
                    }
                  />
                  <Field
                    id={`exp-${exp.id}-duration`}
                    label="Duration"
                    type="text"
                    placeholder="e.g. Jan 2023 - Present"
                    value={exp.duration}
                    onChange={(e) =>
                      updateItem(
                        "experience",
                        exp.id,
                        "duration",
                        e.target.value,
                      )
                    }
                  />
                  <Field
                    id={`exp-${exp.id}-description`}
                    label="Description (one point per line)"
                    multiline
                    placeholder={
                      "Built a dashboard used by 200+ users\nReduced load time by 30%"
                    }
                    value={exp.description}
                    onChange={(e) =>
                      updateItem(
                        "experience",
                        exp.id,
                        "description",
                        e.target.value,
                      )
                    }
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeItem("experience", exp.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="add-btn"
                onClick={() => addItem("experience", blankExperience)}
              >
                + Add Experience
              </button>

              {/* ---- EDUCATION ---- */}
              <h2>Education</h2>
              {resume.education.length === 0 && (
                <p className="empty-hint">No education added yet.</p>
              )}
              {resume.education.map((edu) => (
                <div className="dynamic-block" key={edu.id}>
                  <Field
                    id={`edu-${edu.id}-school`}
                    label="School / College"
                    type="text"
                    placeholder="Institution Name"
                    value={edu.school}
                    onChange={(e) =>
                      updateItem("education", edu.id, "school", e.target.value)
                    }
                  />
                  <Field
                    id={`edu-${edu.id}-degree`}
                    label="Degree"
                    type="text"
                    placeholder="e.g. B.Tech CSE"
                    value={edu.degree}
                    onChange={(e) =>
                      updateItem("education", edu.id, "degree", e.target.value)
                    }
                  />
                  <Field
                    id={`edu-${edu.id}-year`}
                    label="Year"
                    type="text"
                    placeholder="e.g. 2021 - 2025"
                    value={edu.year}
                    onChange={(e) =>
                      updateItem("education", edu.id, "year", e.target.value)
                    }
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeItem("education", edu.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="add-btn"
                onClick={() => addItem("education", blankEducation)}
              >
                + Add Education
              </button>

              {/* ---- SKILLS ---- */}
              <h2>Skills</h2>
              <label htmlFor="f-skill">
                Type a skill, then press Enter or tap Add
              </label>
              <div className="skill-input-row">
                <input
                  id="f-skill"
                  type="text"
                  placeholder="e.g. React (separate several with commas)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
                <button
                  className="add-btn skill-add-btn"
                  onClick={() => addSkills(skillInput)}
                >
                  Add
                </button>
              </div>
              <div className="skills-tags">
                {resume.skills.map((skill) => (
                  <span className="tag" key={skill}>
                    {skill}
                    <button
                      aria-label={`Remove ${skill}`}
                      onClick={() => removeSkill(skill)}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>

              {/* ---- PROJECTS ---- */}
              <h2>Projects</h2>
              {resume.projects.length === 0 && (
                <p className="empty-hint">No projects added yet.</p>
              )}
              {resume.projects.map((proj) => (
                <div className="dynamic-block" key={proj.id}>
                  <Field
                    id={`proj-${proj.id}-title`}
                    label="Project Title"
                    type="text"
                    placeholder="Project Name"
                    value={proj.title}
                    onChange={(e) =>
                      updateItem("projects", proj.id, "title", e.target.value)
                    }
                  />
                  <Field
                    id={`proj-${proj.id}-description`}
                    label="Description"
                    multiline
                    placeholder="What does it do?"
                    value={proj.description}
                    onChange={(e) =>
                      updateItem(
                        "projects",
                        proj.id,
                        "description",
                        e.target.value,
                      )
                    }
                  />
                  <Field
                    id={`proj-${proj.id}-link`}
                    label="Link"
                    type="text"
                    placeholder="GitHub / Live link"
                    value={proj.link}
                    onChange={(e) =>
                      updateItem("projects", proj.id, "link", e.target.value)
                    }
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeItem("projects", proj.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="add-btn"
                onClick={() => addItem("projects", blankProject)}
              >
                + Add Project
              </button>
            </div>

            {/* RIGHT SIDE - RESUME PREVIEW */}
            <div className="preview-wrapper">
              {/* ---- RESUME SCORE ---- */}
              <div className="score-card">
                <div className="score-header">
                  <span className="score-label">Resume Score</span>
                  <span className={`score-value ${scoreClass}`}>
                    {resumeScore}/100
                  </span>
                </div>
                <div className="score-bar-track">
                  <div
                    className={`score-bar-fill ${scoreClass}`}
                    style={{ width: `${resumeScore}%` }}
                  ></div>
                </div>

                {resumeTips.length > 0 && (
                  <div className="score-tips">
                    <p className="score-tips-title">
                      💡 Suggestions to improve:
                    </p>
                    <ul>
                      {visibleTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                    {resumeTips.length > 4 && (
                      <button
                        className="tips-toggle"
                        onClick={() => setShowAllTips((s) => !s)}
                      >
                        {showAllTips
                          ? "Show fewer"
                          : `Show all ${resumeTips.length} suggestions`}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="template-switcher">
                {["modern", "classic", "minimal"].map((t) => (
                  <button
                    key={t}
                    className={template === t ? "active" : ""}
                    onClick={() => setTemplate(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <label className="ats-toggle">
                <input
                  type="checkbox"
                  checked={atsMode}
                  onChange={(e) => setAtsMode(e.target.checked)}
                />
                ATS-Safe Mode (plain formatting for job portals)
              </label>
              <button className="download-btn" onClick={handleDownloadClick}>
                Download PDF
              </button>

              <div
                className={`preview-section template-${template} ${atsMode ? "ats-mode" : ""}`}
                ref={resumeRef}
              >
                <h1>{resume.name.trim() || "Your Name"}</h1>

                {contactParts.length > 0 && (
                  <p className="contact-line">{contactParts.join(" | ")}</p>
                )}
                {linkParts.length > 0 && (
                  <p className="contact-line">
                    {linkParts.map((link, i) => (
                      <span key={link}>
                        {i > 0 && " | "}
                        <a href={toHref(link)} target="_blank" rel="noreferrer">
                          {link}
                        </a>
                      </span>
                    ))}
                  </p>
                )}

                {!hasAnyContent && (
                  <p className="preview-empty">
                    Fill in the form and your resume will appear here.
                  </p>
                )}

                {resume.objective.trim() && (
                  <>
                    <hr className="section-divider" />
                    <h3>
                      {atsMode ? "Professional Summary" : "Career Objective"}
                    </h3>
                    <p>{resume.objective.trim()}</p>
                  </>
                )}

                {filledExperience.length > 0 && (
                  <>
                    <hr className="section-divider" />
                    <h3>Experience</h3>
                    {filledExperience.map((exp) => (
                      <div className="preview-block" key={exp.id}>
                        <p className="block-title">
                          {[exp.role.trim(), exp.company.trim()]
                            .filter(Boolean)
                            .join(" — ")}
                        </p>
                        {exp.duration.trim() && (
                          <p className="block-sub">{exp.duration.trim()}</p>
                        )}
                        <Bullets text={exp.description} />
                      </div>
                    ))}
                  </>
                )}

                {filledEducation.length > 0 && (
                  <>
                    <hr className="section-divider" />
                    <h3>Education</h3>
                    {filledEducation.map((edu) => (
                      <div className="preview-block" key={edu.id}>
                        {edu.degree.trim() && (
                          <p className="block-title">{edu.degree.trim()}</p>
                        )}
                        <p className="block-sub">
                          {[edu.school.trim(), edu.year.trim()]
                            .filter(Boolean)
                            .join(" | ")}
                        </p>
                      </div>
                    ))}
                  </>
                )}

                {resume.skills.length > 0 && (
                  <>
                    <hr className="section-divider" />
                    <h3>Skills</h3>
                    {atsMode ? (
                      <p>{resume.skills.join(", ")}</p>
                    ) : (
                      <div className="skills-tags preview-skills">
                        {resume.skills.map((skill) => (
                          <span className="tag preview-tag" key={skill}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {filledProjects.length > 0 && (
                  <>
                    <hr className="section-divider" />
                    <h3>Projects</h3>
                    {filledProjects.map((proj) => (
                      <div className="preview-block" key={proj.id}>
                        {proj.title.trim() && (
                          <p className="block-title">{proj.title.trim()}</p>
                        )}
                        <Bullets text={proj.description} />
                        {proj.link.trim() && (
                          <p className="block-sub">
                            <a
                              href={toHref(proj.link.trim())}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {proj.link.trim()}
                            </a>
                          </p>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ---- Save dialog (prompt() ki jagah) ---- */}
      {saveModal.open && (
        <div className="modal-backdrop" onClick={closeSaveModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="save-title">Save resume</h3>
            <label htmlFor="save-name">Resume name</label>
            <input
              id="save-name"
              type="text"
              autoFocus
              value={saveModal.value}
              onChange={(e) =>
                setSaveModal((m) => ({ ...m, value: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") commitSave();
                if (e.key === "Escape") closeSaveModal();
              }}
            />
            <div className="modal-actions">
              <button className="navbar-btn" onClick={closeSaveModal}>
                Cancel
              </button>
              <button
                className="navbar-btn navbar-btn-primary"
                onClick={commitSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Toast (alert() ki jagah) ---- */}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
