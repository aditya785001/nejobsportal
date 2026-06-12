import type { ResumeData, TemplateConfig } from "../types";

interface Props {
  data: ResumeData;
  config: TemplateConfig;
}

export function TemplateEngineering({ data, config }: Props) {
  const { personalInfo: p, education, experience, skills, certifications, languages, projects } = data;
  const c = config.colors;

  return (
    <div className="resume-page" style={{ fontFamily: "'Roboto', 'Segoe UI', sans-serif" }}>
      {/* Red Header Bar */}
      <div style={{ background: c.primary, height: 8 }} />
      <div style={{ background: "#fafafa", padding: "20px 28px 14px", borderBottom: `3px solid ${c.primary}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {data.photo && (
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: `3px solid ${c.primary}`, overflow: "hidden", flexShrink: 0 }}>
              <img src={data.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: c.text }}>{p.fullName || "Your Name"}</h1>
            <p style={{ fontSize: 14, margin: "4px 0 0", color: c.primary, fontWeight: 600 }}>{p.title || "Engineer"}</p>
            <div style={{ fontSize: 11, marginTop: 6, display: "flex", gap: 14, flexWrap: "wrap", color: "#666" }}>
              <span>✉ {p.email || "email@example.com"}</span>
              <span>📞 {p.phone || "Phone"}</span>
              {p.linkedin && <span>🔗 {p.linkedin}</span>}
              {p.address && <span>📍 {p.address}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: 500 }}>
        {/* Left Sidebar */}
        <div style={{ width: "28%", background: "#fafafa", padding: "16px 14px", borderRight: `1px solid #e5e7eb` }}>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Technical Skills</h3>
              {skills.map((s) => (
                <div key={s.id} style={{ marginBottom: 5 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 1 }}>{s.name}</div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ width: 14, height: 6, borderRadius: 3, background: i <= (s.level === "expert" ? 4 : s.level === "advanced" ? 3 : s.level === "intermediate" ? 2 : 1) ? c.primary : "#ddd" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Certifications</h3>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: 5, fontSize: 11 }}>
                  <div style={{ fontWeight: 600 }}>{cert.name}</div>
                  <div style={{ color: "#666" }}>{cert.issuer}</div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Languages</h3>
              {languages.map((l) => (
                <div key={l.id} style={{ fontSize: 11, marginBottom: 2 }}>
                  <span style={{ fontWeight: 500 }}>{l.name}</span> — <span style={{ color: "#666", textTransform: "capitalize" }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}

          {/* Links */}
          {(p.linkedin || p.website) && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Links</h3>
              {p.linkedin && <div style={{ fontSize: 11, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis" }}>🔗 {p.linkedin}</div>}
              {p.website && <div style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis" }}>🌐 {p.website}</div>}
            </div>
          )}
        </div>

        {/* Right Content */}
        <div style={{ flex: 1, padding: "16px 22px" }}>
          {/* Summary */}
          {p.summary && (
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Professional Profile</h3>
              <p style={{ fontSize: 12, color: c.text, lineHeight: 1.5, margin: 0 }}>{p.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Experience</h3>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{exp.title}</span>
                    <span style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: c.accent }}>{exp.company}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2, lineHeight: 1.4 }}>{exp.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Projects</h3>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{proj.name}</div>
                  <p style={{ fontSize: 11, color: "#555", margin: "2px 0", lineHeight: 1.3 }}>{proj.description}</p>
                  {proj.technologies && <div style={{ fontSize: 10, color: c.primary }}>Technologies: {proj.technologies}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Education</h3>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{edu.degree}</span>
                    <span style={{ fontSize: 11, color: "#888" }}>{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#555" }}>{edu.institution}{edu.grade ? ` | ${edu.grade}` : ""}</div>
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
