// Resume ko Word (.docx) file mein badalta hai.
// "docx" package button dabane par hi load hota hai (dynamic import), isliye app slow nahi hota.

const FONT_NAMES = {
  georgia: "Georgia",
  arial: "Arial",
  calibri: "Calibri",
  times: "Times New Roman",
  verdana: "Verdana",
};

const toLines = (text) =>
  String(text || "")
    .split("\n")
    .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);

const toHref = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const toHex = (color) => color.replace("#", "").toUpperCase();

const safeFileName = (name) =>
  (
    String(name || "Resume").replace(/[^\p{L}\p{N}_-]+/gu, "_") || "Resume"
  ).slice(0, 60);

const triggerDownload = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export async function buildResumeDocx(
  resume,
  {
    template = "modern",
    atsMode = false,
    accent = "",
    fontKey = "default",
  } = {},
) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    BorderStyle,
    ExternalHyperlink,
  } = await import("docx");

  /* ---------- style choices (preview jaisa hi) ---------- */
  const useAccent = !atsMode && !!accent;
  const accentHex = useAccent ? toHex(accent) : null;
  const customFont =
    !atsMode && fontKey !== "default" ? FONT_NAMES[fontKey] || null : null;

  const bodyFont = customFont || "Arial";
  const nameFont =
    customFont ||
    (atsMode
      ? "Arial"
      : template === "classic"
        ? "Times New Roman"
        : template === "minimal"
          ? "Arial"
          : "Georgia");

  const centered = !atsMode && template === "modern";
  const align = centered ? AlignmentType.CENTER : AlignmentType.LEFT;
  const upperName = !atsMode && template === "classic";
  const headingBorder = !atsMode && template !== "minimal";
  const headingCaps = !atsMode && template !== "minimal";

  const headingColor = atsMode
    ? "000000"
    : accentHex ||
      (template === "modern"
        ? "1E3A8A"
        : template === "classic"
          ? "000000"
          : "444444");
  const nameColor = atsMode
    ? "000000"
    : accentHex && template !== "classic"
      ? accentHex
      : template === "minimal"
        ? "222222"
        : "111111";
  const subColor = "666666";

  /* ---------- small builders ---------- */
  const run = (text, extra = {}) =>
    new TextRun({ text, font: bodyFont, size: 21, ...extra });

  const linkRun = (text) =>
    new ExternalHyperlink({
      link: toHref(text),
      children: [run(text, { color: atsMode ? "000000" : "444444", size: 20 })],
    });

  const heading = (text) =>
    new Paragraph({
      keepNext: true,
      spacing: { before: 260, after: 100 },
      border: headingBorder
        ? {
            bottom: {
              style: BorderStyle.SINGLE,
              size: template === "modern" ? 12 : 6,
              color: headingColor,
              space: 2,
            },
          }
        : undefined,
      children: [
        new TextRun({
          text: headingCaps ? text.toUpperCase() : text,
          bold: true,
          font: bodyFont,
          size: 23,
          color: headingColor,
        }),
      ],
    });

  const bullet = (text) =>
    new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 30 },
      children: [run(text)],
    });

  /* ---------- data (sirf bhari hui cheezein) ---------- */
  const name = (resume.name || "").trim() || "Your Name";
  const contactParts = [resume.email, resume.phone, resume.address]
    .map((s) => (s || "").trim())
    .filter(Boolean);
  const linkParts = [resume.linkedin, resume.github]
    .map((s) => (s || "").trim())
    .filter(Boolean);
  const experience = (resume.experience || []).filter(
    (e) => e.company.trim() || e.role.trim() || e.description.trim(),
  );
  const education = (resume.education || []).filter(
    (e) => e.school.trim() || e.degree.trim(),
  );
  const projects = (resume.projects || []).filter(
    (p) => p.title.trim() || p.description.trim(),
  );
  const certifications = (resume.certifications || []).filter(
    (c) => c.name.trim() || c.issuer.trim(),
  );
  const languages = (resume.languages || []).filter((l) => l.name.trim());
  const skills = resume.skills || [];

  /* ---------- document ---------- */
  const children = [];

  children.push(
    new Paragraph({
      alignment: align,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: upperName ? name.toUpperCase() : name,
          bold: !(template === "minimal" && !atsMode),
          font: nameFont,
          size: 40,
          color: nameColor,
        }),
      ],
    }),
  );

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: align,
        spacing: { after: 20 },
        children: [
          run(contactParts.join(" | "), { color: "444444", size: 20 }),
        ],
      }),
    );
  }

  if (linkParts.length > 0) {
    const linkChildren = [];
    linkParts.forEach((l, i) => {
      if (i > 0) linkChildren.push(run(" | ", { color: "444444", size: 20 }));
      linkChildren.push(linkRun(l));
    });
    children.push(new Paragraph({ alignment: align, children: linkChildren }));
  }

  if ((resume.objective || "").trim()) {
    children.push(
      heading(atsMode ? "Professional Summary" : "Career Objective"),
    );
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [run(resume.objective.trim())],
      }),
    );
  }

  if (experience.length > 0) {
    children.push(heading("Experience"));
    experience.forEach((exp) => {
      const title = [exp.role.trim(), exp.company.trim()]
        .filter(Boolean)
        .join(" — ");
      const lines = toLines(exp.description);
      children.push(
        new Paragraph({
          keepNext: true,
          spacing: { before: 100, after: 0 },
          children: [run(title, { bold: true })],
        }),
      );
      if (exp.duration.trim()) {
        children.push(
          new Paragraph({
            keepNext: lines.length > 0,
            spacing: { after: 40 },
            children: [run(exp.duration.trim(), { color: subColor, size: 19 })],
          }),
        );
      }
      lines.forEach((line) => children.push(bullet(line)));
    });
  }

  if (education.length > 0) {
    children.push(heading("Education"));
    education.forEach((edu) => {
      const sub = [edu.school.trim(), edu.year.trim()]
        .filter(Boolean)
        .join(" | ");
      if (edu.degree.trim()) {
        children.push(
          new Paragraph({
            keepNext: true,
            spacing: { before: 100, after: 0 },
            children: [run(edu.degree.trim(), { bold: true })],
          }),
        );
      }
      if (sub) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [run(sub, { color: subColor, size: 19 })],
          }),
        );
      }
    });
  }

  if (skills.length > 0) {
    children.push(heading("Skills"));
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [run(skills.join(", "))],
      }),
    );
  }

  if (projects.length > 0) {
    children.push(heading("Projects"));
    projects.forEach((proj) => {
      const lines = toLines(proj.description);
      if (proj.title.trim()) {
        children.push(
          new Paragraph({
            keepNext: true,
            spacing: { before: 100, after: 0 },
            children: [run(proj.title.trim(), { bold: true })],
          }),
        );
      }
      lines.forEach((line) => children.push(bullet(line)));
      if (proj.link.trim()) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [linkRun(proj.link.trim())],
          }),
        );
      }
    });
  }

  if (certifications.length > 0) {
    children.push(heading("Certifications"));
    certifications.forEach((cert) => {
      const sub = [cert.issuer.trim(), cert.year.trim()]
        .filter(Boolean)
        .join(" | ");
      if (cert.name.trim()) {
        children.push(
          new Paragraph({
            keepNext: !!sub,
            spacing: { before: 100, after: 0 },
            children: [run(cert.name.trim(), { bold: true })],
          }),
        );
      }
      if (sub) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [run(sub, { color: subColor, size: 19 })],
          }),
        );
      }
    });
  }

  if (languages.length > 0) {
    children.push(heading("Languages"));
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          run(
            languages
              .map((l) =>
                l.level.trim()
                  ? `${l.name.trim()} (${l.level.trim()})`
                  : l.name.trim(),
              )
              .join(", "),
          ),
        ],
      }),
    );
  }

  const doc = new Document({
    creator: "Resume Builder",
    title: `${name} - Resume`,
    styles: { default: { document: { run: { font: bodyFont, size: 21 } } } },
    sections: [
      {
        properties: {
          page: { margin: { top: 850, right: 850, bottom: 850, left: 850 } },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export async function downloadResumeDocx(resume, options = {}) {
  const blob = await buildResumeDocx(resume, options);
  triggerDownload(
    blob,
    `${safeFileName(options.fileName || resume.name)}.docx`,
  );
}
