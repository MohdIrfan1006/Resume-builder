import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./App.css";

function App() {
  // Basic Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [objective, setObjective] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [template, setTemplate] = useState("modern");
  const [errors, setErrors] = useState({});
  const [atsMode, setAtsMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [currentResumeName, setCurrentResumeName] = useState("Untitled Resume");

  // Dynamic Sections
  const [experience, setExperience] = useState([
    { company: "", role: "", duration: "", description: "" },
  ]);
  const [education, setEducation] = useState([
    { school: "", degree: "", year: "" },
  ]);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [projects, setProjects] = useState([
    { title: "", description: "", link: "" },
  ]);

  // Load saved data on first render
  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) {
      const data = JSON.parse(saved);
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setLinkedin(data.linkedin || "");
      setGithub(data.github || "");
      setObjective(data.objective || "");
      setTemplate(data.template || "modern");
      setDarkMode(data.darkMode || false);
      setAtsMode(data.atsMode || false);
      setExperience(
        data.experience || [
          { company: "", role: "", duration: "", description: "" },
        ],
      );
      setEducation(data.education || [{ school: "", degree: "", year: "" }]);
      setSkills(data.skills || []);
      setProjects(data.projects || [{ title: "", description: "", link: "" }]);
      setCurrentResumeName(data.currentResumeName || "Untitled Resume");
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const list = localStorage.getItem("savedResumesList");
    if (list) {
      setSavedResumes(JSON.parse(list));
    }
  }, []);

  // Save data whenever anything changes
  useEffect(() => {
    if (!isLoaded) return;
    const resumeData = {
      name,
      email,
      phone,
      address,
      linkedin,
      github,
      objective,
      experience,
      education,
      skills,
      projects,
      template,
      darkMode,
      atsMode,
      currentResumeName,
    };
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  }, [
    isLoaded,
    name,
    email,
    phone,
    address,
    linkedin,
    github,
    objective,
    experience,
    education,
    skills,
    projects,
    template,
    darkMode,
    atsMode,
    currentResumeName,
  ]);

  // ---- Experience handlers ----
  const addExperience = () => {
    setExperience([
      ...experience,
      { company: "", role: "", duration: "", description: "" },
    ]);
  };
  const updateExperience = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };
  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // ---- Education handlers ----
  const addEducation = () => {
    setEducation([...education, { school: "", degree: "", year: "" }]);
  };
  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };
  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // ---- Skills handlers ----
  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };
  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // ---- Projects handlers ----
  const addProject = () => {
    setProjects([...projects, { title: "", description: "", link: "" }]);
  };
  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };
  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };
  const calculateResumeScore = () => {
    let score = 0;
    const tips = [];

    // Basic info (20 points)
    if (name.trim()) score += 5;
    else tips.push("Add your full name");
    if (email.trim()) score += 5;
    else tips.push("Add your email");
    if (phone.trim()) score += 5;
    else tips.push("Add your phone number");
    if (linkedin.trim() || github.trim()) score += 5;
    else
      tips.push("Add a LinkedIn or GitHub link — recruiters check this first");

    // Career objective (15 points)
    const objWords = objective.trim().split(/\s+/).filter(Boolean).length;
    if (objWords >= 15 && objWords <= 50) {
      score += 15;
    } else if (objWords > 0) {
      score += 7;
      tips.push(
        "Career objective should be 15-50 words — not too short, not too long",
      );
    } else {
      tips.push(
        "Write a career objective — it's the first thing recruiters read",
      );
    }

    // Experience (25 points)
    const filledExperience = experience.filter(
      (e) => e.company.trim() && e.role.trim(),
    );
    if (filledExperience.length > 0) {
      score += 10;
      const hasNumbers = experience.some((e) => /\d/.test(e.description));
      if (hasNumbers) {
        score += 15;
      } else {
        score += 5;
        tips.push(
          'Add numbers to your experience (e.g. "increased sales by 20%") — this makes it far stronger',
        );
      }
    } else {
      tips.push("Add at least one work experience or internship");
    }

    // Education (15 points)
    const filledEducation = education.filter(
      (e) => e.school.trim() && e.degree.trim(),
    );
    if (filledEducation.length > 0) score += 15;
    else tips.push("Add your education details");

    // Skills (15 points)
    if (skills.length >= 5) {
      score += 15;
    } else if (skills.length > 0) {
      score += 7;
      tips.push(
        `Add more skills — you have ${skills.length}, aim for at least 5`,
      );
    } else {
      tips.push("Add your key skills");
    }

    // Projects (10 points)
    const filledProjects = projects.filter((p) => p.title.trim());
    if (filledProjects.length > 0) score += 10;
    else tips.push("Add at least one project — especially useful for freshers");

    return { score: Math.min(score, 100), tips };
  };

  const { score: resumeScore, tips: resumeTips } = calculateResumeScore();

  // ---- Multiple Resume Save handlers ----
  const getCurrentResumeData = () => ({
    name,
    email,
    phone,
    address,
    linkedin,
    github,
    objective,
    experience,
    education,
    skills,
    projects,
    template,
    darkMode,
    atsMode,
  });

  const saveResume = () => {
    const resumeName = prompt("Enter resume name:", currentResumeName);
    if (!resumeName || !resumeName.trim()) return;

    const trimmedName = resumeName.trim();
    const data = getCurrentResumeData();

    const list = JSON.parse(localStorage.getItem("savedResumesList") || "[]");

    const existingIndex = list.findIndex((r) => r === trimmedName);
    if (existingIndex === -1) {
      list.push(trimmedName);
    }

    localStorage.setItem("savedResumesList", JSON.stringify(list));
    localStorage.setItem(`resume_${trimmedName}`, JSON.stringify(data));

    setSavedResumes(list);
    setCurrentResumeName(trimmedName);
    alert(`"${trimmedName}" saved successfully!`);
  };

  const loadResume = (resumeName) => {
    const saved = localStorage.getItem(`resume_${resumeName}`);
    if (!saved) return;

    const data = JSON.parse(saved);
    setName(data.name || "");
    setEmail(data.email || "");
    setPhone(data.phone || "");
    setAddress(data.address || "");
    setLinkedin(data.linkedin || "");
    setGithub(data.github || "");
    setObjective(data.objective || "");
    setExperience(
      data.experience || [
        { company: "", role: "", duration: "", description: "" },
      ],
    );
    setEducation(data.education || [{ school: "", degree: "", year: "" }]);
    setSkills(data.skills || []);
    setProjects(data.projects || [{ title: "", description: "", link: "" }]);
    setTemplate(data.template || "modern");
    setDarkMode(data.darkMode || false);
    setAtsMode(data.atsMode || false);
    setCurrentResumeName(resumeName);
  };

  const deleteResume = (resumeName) => {
    const confirmDelete = window.confirm(`Delete "${resumeName}"?`);
    if (!confirmDelete) return;

    localStorage.removeItem(`resume_${resumeName}`);
    const list = JSON.parse(localStorage.getItem("savedResumesList") || "[]");
    const updatedList = list.filter((r) => r !== resumeName);
    localStorage.setItem("savedResumesList", JSON.stringify(updatedList));
    setSavedResumes(updatedList);
  };

  const newResume = () => {
    const confirmNew = window.confirm(
      "Start a new blank resume? (Unsaved changes will be lost)",
    );
    if (!confirmNew) return;

    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setLinkedin("");
    setGithub("");
    setObjective("");
    setExperience([{ company: "", role: "", duration: "", description: "" }]);
    setEducation([{ school: "", degree: "", year: "" }]);
    setSkills([]);
    setProjects([{ title: "", description: "", link: "" }]);
    setCurrentResumeName("Untitled Resume");
  };

  // ---- PDF Export ----
  const resumeRef = useRef();
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${name || "Resume"}`,
  });
  const handleDownloadClick = () => {
    if (validateForm()) {
      handlePrint();
    }
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <h1>Resume Builder</h1>
      <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="resume-container">
        {/* LEFT SIDE - FORM */}
        <div className="form-section">
          {/* ---- RESUME MANAGER ---- */}
          <div className="resume-manager">
            <p className="current-resume-name">📄 {currentResumeName}</p>

            <div className="resume-manager-buttons">
              <button onClick={saveResume}>💾 Save</button>
              <button onClick={newResume}>➕ New</button>
            </div>

            {savedResumes.length > 0 && (
              <div className="saved-resumes-list">
                <label>Saved Resumes:</label>
                {savedResumes.map((r) => (
                  <div className="saved-resume-item" key={r}>
                    <span onClick={() => loadResume(r)}>{r}</span>
                    <button
                      className="delete-resume-btn"
                      onClick={() => deleteResume(r)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h2>Enter Your Details</h2>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <label>Phone</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? "input-error" : ""}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          <label>Address</label>
          <input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label>LinkedIn</label>
          <input
            type="text"
            placeholder="Enter your LinkedIn profile link"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />

          <label>GitHub</label>
          <input
            type="text"
            placeholder="Enter your GitHub profile link"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />

          <label>Career Objective</label>
          <textarea
            placeholder="Write your career objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          ></textarea>

          {/* ---- EXPERIENCE ---- */}
          <h2>Experience</h2>
          {experience.map((exp, index) => (
            <div className="dynamic-block" key={index}>
              <label>Company</label>
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(index, "company", e.target.value)
                }
              />

              <label>Role</label>
              <input
                type="text"
                placeholder="Job Title"
                value={exp.role}
                onChange={(e) =>
                  updateExperience(index, "role", e.target.value)
                }
              />

              <label>Duration</label>
              <input
                type="text"
                placeholder="e.g. Jan 2023 - Present"
                value={exp.duration}
                onChange={(e) =>
                  updateExperience(index, "duration", e.target.value)
                }
              />

              <label>Description</label>
              <textarea
                placeholder="What did you do?"
                value={exp.description}
                onChange={(e) =>
                  updateExperience(index, "description", e.target.value)
                }
              ></textarea>

              {experience.length > 1 && (
                <button
                  className="remove-btn"
                  onClick={() => removeExperience(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button className="add-btn" onClick={addExperience}>
            + Add Experience
          </button>

          {/* ---- EDUCATION ---- */}
          <h2>Education</h2>
          {education.map((edu, index) => (
            <div className="dynamic-block" key={index}>
              <label>School / College</label>
              <input
                type="text"
                placeholder="Institution Name"
                value={edu.school}
                onChange={(e) =>
                  updateEducation(index, "school", e.target.value)
                }
              />

              <label>Degree</label>
              <input
                type="text"
                placeholder="e.g. B.Tech CSE"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
              />

              <label>Year</label>
              <input
                type="text"
                placeholder="e.g. 2021 - 2025"
                value={edu.year}
                onChange={(e) => updateEducation(index, "year", e.target.value)}
              />

              {education.length > 1 && (
                <button
                  className="remove-btn"
                  onClick={() => removeEducation(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button className="add-btn" onClick={addEducation}>
            + Add Education
          </button>

          {/* ---- SKILLS ---- */}
          <h2>Skills</h2>
          <label>Type a skill and press Enter</label>
          <input
            type="text"
            placeholder="e.g. React"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={addSkill}
          />
          <div className="skills-tags">
            {skills.map((skill, index) => (
              <span className="tag" key={index}>
                {skill} <button onClick={() => removeSkill(index)}>x</button>
              </span>
            ))}
          </div>

          {/* ---- PROJECTS ---- */}
          <h2>Projects</h2>
          {projects.map((proj, index) => (
            <div className="dynamic-block" key={index}>
              <label>Project Title</label>
              <input
                type="text"
                placeholder="Project Name"
                value={proj.title}
                onChange={(e) => updateProject(index, "title", e.target.value)}
              />

              <label>Description</label>
              <textarea
                placeholder="What does it do?"
                value={proj.description}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
              ></textarea>

              <label>Link</label>
              <input
                type="text"
                placeholder="GitHub / Live link"
                value={proj.link}
                onChange={(e) => updateProject(index, "link", e.target.value)}
              />

              {projects.length > 1 && (
                <button
                  className="remove-btn"
                  onClick={() => removeProject(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button className="add-btn" onClick={addProject}>
            + Add Project
          </button>
        </div>

        {/* RIGHT SIDE - RESUME PREVIEW */}
        <div className="preview-wrapper">
          <div className="template-switcher">
            <button
              className={template === "modern" ? "active" : ""}
              onClick={() => setTemplate("modern")}
            >
              Modern
            </button>
            <button
              className={template === "classic" ? "active" : ""}
              onClick={() => setTemplate("classic")}
            >
              Classic
            </button>
            <button
              className={template === "minimal" ? "active" : ""}
              onClick={() => setTemplate("minimal")}
            >
              Minimal
            </button>
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
            <h1>{name || "Your Name"}</h1>
            <p className="contact-line">
              {atsMode ? (
                `${email || "your@email.com"}   ${phone || "9876543210"}   ${address || "Your Address"}`
              ) : (
                <>
                  {email || "your@email.com"} | {phone || "9876543210"} |{" "}
                  {address || "Your Address"}
                </>
              )}
            </p>
            <p className="contact-line">
              {linkedin || "LinkedIn"} | {github || "GitHub"}
            </p>

            <hr />

            <h3>Career Objective</h3>
            <p>{objective || "Your career objective will appear here."}</p>

            <hr />

            <h3>Experience</h3>
            {experience.map((exp, index) => (
              <div className="preview-block" key={index}>
                <p className="block-title">
                  {exp.role || "Role"} — {exp.company || "Company"}
                </p>
                <p className="block-sub">{exp.duration || "Duration"}</p>
                <p>{exp.description || ""}</p>
              </div>
            ))}

            <hr />

            <h3>Education</h3>
            {education.map((edu, index) => (
              <div className="preview-block" key={index}>
                <p className="block-title">{edu.degree || "Degree"}</p>
                <p className="block-sub">
                  {edu.school || "School"} | {edu.year || "Year"}
                </p>
              </div>
            ))}

            <hr />

            <h3>Skills</h3>
            <div className="skills-tags preview-skills">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span className="tag preview-tag" key={index}>
                    {skill}
                  </span>
                ))
              ) : (
                <p>Your skills will appear here.</p>
              )}
            </div>

            <hr />

            <h3>Projects</h3>
            {projects.map((proj, index) => (
              <div className="preview-block" key={index}>
                <p className="block-title">{proj.title || "Project Title"}</p>
                <p>{proj.description || ""}</p>
                {proj.link && <p className="block-sub">{proj.link}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
