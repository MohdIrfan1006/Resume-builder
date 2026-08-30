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
      setExperience(
        data.experience || [
          { company: "", role: "", duration: "", description: "" },
        ],
      );
      setEducation(data.education || [{ school: "", degree: "", year: "" }]);
      setSkills(data.skills || []);
      setProjects(data.projects || [{ title: "", description: "", link: "" }]);
    }
    setIsLoaded(true);
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

  // ---- PDF Export ----
  const resumeRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${name || "Resume"}`,
  });

  return (
    <div className="app">
      <h1>Resume Builder</h1>

      <div className="resume-container">
        {/* LEFT SIDE - FORM */}
        <div className="form-section">
          <h2>Enter Your Details</h2>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Phone</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

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
          <button className="download-btn" onClick={handlePrint}>
            Download PDF
          </button>

          <div className="preview-section" ref={resumeRef}>
            <h1>{name || "Your Name"}</h1>
            <p className="contact-line">
              {email || "your@email.com"} | {phone || "9876543210"} |{" "}
              {address || "Your Address"}
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
