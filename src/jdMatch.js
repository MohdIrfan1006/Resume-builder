// ---- Known skills/terms (inhe tum badha sakte ho) ----
const SKILL_TERMS = [
  "javascript",
  "typescript",
  "react",
  "react native",
  "angular",
  "vue",
  "node",
  "html",
  "css",
  "sass",
  "tailwind",
  "bootstrap",
  "redux",
  "next.js",
  "python",
  "java",
  "c++",
  "c#",
  "golang",
  "rust",
  "php",
  "ruby",
  "kotlin",
  "swift",
  "flutter",
  "android",
  "ios",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "redis",
  "firebase",
  "graphql",
  "rest api",
  "api",
  "microservices",
  "django",
  "flask",
  "spring boot",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "git",
  "github",
  "ci/cd",
  "jenkins",
  "linux",
  "devops",
  "agile",
  "scrum",
  "jira",
  "figma",
  "testing",
  "unit testing",
  "jest",
  "selenium",
  "machine learning",
  "deep learning",
  "data analysis",
  "pandas",
  "numpy",
  "tensorflow",
  "pytorch",
  "power bi",
  "tableau",
  "oop",
  "data structures",
  "algorithms",
  "responsive design",
  "seo",
  "communication",
  "leadership",
  "problem solving",
  "teamwork",
];

// Same cheez ke alag naam ek mana jaye (reactjs = react, js = javascript)
const ALIASES = [
  [/\bnode\.?js\b/g, "node"],
  [/\breact\.?js\b/g, "react"],
  [/\bvue\.?js\b/g, "vue"],
  [/\bjs\b/g, "javascript"],
  [/\bts\b/g, "typescript"],
  [/\bhtml5\b/g, "html"],
  [/\bcss3\b/g, "css"],
  [/\brest(ful)? apis?\b/g, "rest api"],
  [/\bmongo\b/g, "mongodb"],
  [/\bpostgres\b/g, "postgresql"],
  [/\bml\b/g, "machine learning"],
];

// Kaam ke nahi words (JD ke fluff)
const IGNORE = new Set(
  (
    "the and for with you your our are will have has this that from they their who can able ability " +
    "experience years year work working team teams role job candidate strong good excellent knowledge " +
    "skills skill required requirements preferred responsibilities including include etc such well new " +
    "join looking company opportunity position must should plus bonus related relevant using use used " +
    "ensure help across within about more other also any all not but per via able being been into over " +
    "need needs needed looking seeking hiring apply based building build develop developing development " +
    "design designing implement implementing maintain collaborate collaborating environment projects project " +
    "business solutions product products customer customers client clients understanding understand " +
    "proficiency proficient familiarity familiar hands degree bachelor master computer science engineering"
  ).split(" "),
);

const DISPLAY = {
  node: "Node.js",
  javascript: "JavaScript",
  typescript: "TypeScript",
  "next.js": "Next.js",
  "ci/cd": "CI/CD",
  mongodb: "MongoDB",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  graphql: "GraphQL",
  github: "GitHub",
  golang: "Go",
  "rest api": "REST API",
  "power bi": "Power BI",
  devops: "DevOps",
  tensorflow: "TensorFlow",
  pytorch: "PyTorch",
  numpy: "NumPy",
  ios: "iOS",
};

const toLabel = (term) => {
  if (DISPLAY[term]) return DISPLAY[term];
  if (term.length <= 3) return term.toUpperCase();
  return term.replace(/\b\w/g, (c) => c.toUpperCase());
};

const canon = (text) => {
  let t = text.toLowerCase();
  ALIASES.forEach(([re, to]) => {
    t = t.replace(re, to);
  });
  return t;
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Word-boundary match (c++, c#, ci/cd jaise terms ke saath bhi chalta hai)
const termRegex = (term, flags = "") =>
  new RegExp(`(^|[^a-z0-9+#])${escapeRegex(term)}(?![a-z0-9+#])`, flags);

const countTerm = (text, term) =>
  (text.match(termRegex(term, "g")) || []).length;

export const resumeToText = (resume) =>
  [
    resume.objective,
    ...resume.experience.flatMap((e) => [e.role, e.company, e.description]),
    ...resume.education.flatMap((e) => [e.degree, e.school]),
    ...resume.skills,
    ...resume.projects.flatMap((p) => [p.title, p.description]),
  ].join(" \n ");

export const analyzeJD = (jdText, resume) => {
  const jd = canon(jdText);
  const resumeText = canon(resumeToText(resume));

  // 1) Known skills jo JD mein hain
  const found = SKILL_TERMS.filter((t) => countTerm(jd, t) > 0);

  // 2) Baaki important words: JD mein kam se kam 2 baar aaye hon
  const covered = new Set(found.flatMap((t) => t.split(/[^a-z0-9+#]+/)));
  const freq = {};
  jd.split(/[^a-z0-9+#]+/).forEach((w) => {
    if (w.length < 3 || !/[a-z]/.test(w) || IGNORE.has(w) || covered.has(w))
      return;
    freq[w] = (freq[w] || 0) + 1;
  });
  const extras = Object.keys(freq)
    .filter((w) => freq[w] >= 2)
    .sort((a, b) => freq[b] - freq[a])
    .slice(0, 12);

  const keywords = [
    ...found.map((term) => ({ term, isSkill: true })),
    ...extras.map((term) => ({ term, isSkill: false })),
  ]
    .slice(0, 30)
    .map((k) => ({
      ...k,
      label: toLabel(k.term),
      found: termRegex(k.term).test(resumeText),
    }));

  if (keywords.length === 0) return null;

  const matched = keywords.filter((k) => k.found).length;
  return {
    keywords,
    matched,
    total: keywords.length,
    percent: Math.round((matched / keywords.length) * 100),
  };
};
