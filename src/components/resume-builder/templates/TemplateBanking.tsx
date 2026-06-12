import type { ResumeData, TemplateConfig } from "../types";

interface Props {
  data: ResumeData;
  config: TemplateConfig;
}

export function TemplateBanking({ data, config }: Props) {
  const { personalInfo: p, education, experience, skills, certifications, languages, projects } = data;
  const c = config.colors;

  return (
    <div className="resume-page" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Gold Accent Header */}
      <div style={{ background: c.primary, padding: "24px 28px 18px", color: "#fff", borderBottom: `4px solid ${c.accent}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {data.photo && (
            <div style={{ width: 80, height: 80, borderRadius: 8, border: "3px solid " + c.accent, overflow: "hidden", flexShrink: 0 }}>
              <img src={data.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: 1 }}>{p.fullName || "Your Name"}</h1>
            <p style={{ fontSize: 14, margin: "4px 0 0", color: c.accent, fontWeight: 500 }}>{p.title || "Banking Professional"}</p>
            <div style={{ fontSize: 11, marginTop: 8, display: "flex", gap: 14, flexWrap: "wrap", opacity: 0.85 }}>
              <span>✉ {p.email || "email@example.com"}</span>
              <span>📞 {p.phone || "Phone"}</span>
              {p.address && <span>📍 {p.address}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: 500 }}>
        {/* Left Sidebar - Dark */}
        <div style={{ width: "30%", background: "#f0f2f5", padding: "18px 14px" }}>
          {/* Core Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Core Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {skills.map((s) => (
                  <span key={s.id} style={{ fontSize: 11, background: "#fff", color: c.text, padding: "3px 8px", borderRadius: 3, border: "1px solid #ddd" }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Languages</h3>
              {languages.map((l) => (
                <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{l.name}</span>
                  <span style={{ textTransform: "capitalize", color: "#666" }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Certifications</h3>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: 6, fontSize: 12 }}>
                  <div style={{ fontWeight: 600 }}>{cert.name}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{cert.issuer}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{cert.date}</div>
                </div>
              ))}
            </div>
          )}

          {/* Personal Details */}
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Details</h3>
            {p.linkedin && <div style={{ fontSize: 11, marginBottom: 3 }}>🔗 {p.linkedin}</div>}
            {p.website && <div style={{ fontSize: 11, marginBottom: 3 }}>🌐 {p.website}</div>}
            {p.address && <div style={{ fontSize: 11 }}>📍 {p.address}</div>}
          </div>
        </div>

        {/* Right Content */}
        <div style={{ flex: 1, padding: "18px 22px" }}>
          {/* Summary */}
          {p.summary && (
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Professional Summary</h3>
              <p style={{ fontSize: 12, color: c.text, lineHeight: 1.5, margin: 0 }}>{p.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Experience</h3>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{exp.title}</span>
                      <span style={{ fontSize: 12, color: c.accent }}> | {exp.company}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 3, lineHeight: 1.4 }}>{exp.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Education</h3>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{edu.degree} — {edu.institution}</span>
                    <span style={{ fontSize: 11, color: "#888" }}>{edu.startDate} — {edu.endDate}</span>
                  </div>
                  {edu.grade && <div style={{ fontSize: 11, color: "#555" }}>Grade: {edu.grade}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Key Projects</h3>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: 6, fontSize: 12 }}>
                  <span style={{ fontWeight: 600 }}>{proj.name}</span>
                  <p style={{ fontSize: 11, color: "#555", margin: "2px 0 0", lineHeight: 1.3 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 10, color: "#999", padding: "6px 0", borderTop: "1px solid #eee" }}>
        NEJobsPortal.in — Resume Builder
      </div>
    </div>
  );
}
