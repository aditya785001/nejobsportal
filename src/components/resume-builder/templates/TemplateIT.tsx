import type { ResumeData, TemplateConfig } from "../types";

interface Props {
  data: ResumeData;
  config: TemplateConfig;
}

export function TemplateIT({ data, config }: Props) {
  const { personalInfo: p, education, experience, skills, certifications, languages, projects } = data;
  const c = config.colors;

  return (
    <div className="resume-page" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: c.bg }}>
      {/* Top Bar with Accent */}
      <div style={{ background: `linear-gradient(90deg, ${c.primary}, ${c.accent})`, height: 6 }} />

      {/* Header */}
      <div style={{ padding: "20px 28px 14px", display: "flex", alignItems: "center", gap: 20 }}>
        {data.photo && (
          <div style={{ width: 85, height: 85, borderRadius: "50%", border: `3px solid ${c.primary}`, overflow: "hidden", flexShrink: 0 }}>
            <img src={data.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: c.text }}>{p.fullName || "Your Name"}</h1>
          <p style={{ fontSize: 14, margin: "4px 0 0", color: c.primary, fontWeight: 500 }}>{p.title || "Software Engineer"}</p>
          <div style={{ fontSize: 12, marginTop: 6, display: "flex", gap: 14, flexWrap: "wrap", color: "#666" }}>
            <span>✉ {p.email || "email@example.com"}</span>
            <span>📞 {p.phone || "Phone"}</span>
            {p.linkedin && <span>🔗 {p.linkedin}</span>}
            {p.website && <span>🌐 {p.website}</span>}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", padding: "0 28px 16px", gap: 24 }}>
        {/* Left Column - Skills */}
        <div style={{ width: "28%", flexShrink: 0 }}>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Technical Skills</h3>
              {skills.map((s) => (
                <div key={s.id} style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 2 }}>
                    <span style={{ fontWeight: 500 }}>{s.name}</span>
                    <span style={{ fontSize: 10, color: "#888", textTransform: "capitalize" }}>{s.level}</span>
                  </div>
                  <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2 }}>
                    <div style={{ width: `${s.level === "expert" ? 100 : s.level === "advanced" ? 80 : s.level === "intermediate" ? 60 : 40}%`, height: "100%", background: `linear-gradient(90deg, ${c.primary}, ${c.accent})`, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Languages</h3>
              {languages.map((l) => (
                <div key={l.id} style={{ fontSize: 12, marginBottom: 3, display: "flex", justifyContent: "space-between" }}>
                  <span>{l.name}</span>
                  <span style={{ color: "#888", textTransform: "capitalize" }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Certifications</h3>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: 4, fontSize: 12 }}>
                  <div style={{ fontWeight: 600 }}>{cert.name}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{cert.issuer}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ flex: 1 }}>
          {/* Summary */}
          {p.summary && (
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.primary}`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Profile</h3>
              <p style={{ fontSize: 12, color: c.text, lineHeight: 1.5, margin: 0 }}>{p.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.primary}`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Experience</h3>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{exp.title}</span>
                      <span style={{ fontSize: 12, color: c.primary }}> @ {exp.company}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 3, lineHeight: 1.4 }}>{exp.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.primary}`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Education</h3>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{edu.degree}</span>
                    <span style={{ fontSize: 11, color: "#888" }}>{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#555" }}>{edu.institution}{edu.grade ? ` | Grade: ${edu.grade}` : ""}</div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.primary}`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Projects</h3>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{proj.name}</div>
                  <p style={{ fontSize: 11, color: "#555", margin: "2px 0", lineHeight: 1.3 }}>{proj.description}</p>
                  {proj.technologies && <div style={{ fontSize: 10, color: c.primary }}>Stack: {proj.technologies}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 10, color: "#ccc", padding: "6px 0", borderTop: "1px solid #eee" }}>
        NEJobsPortal.in — Resume Builder
      </div>
    </div>
  );
}
