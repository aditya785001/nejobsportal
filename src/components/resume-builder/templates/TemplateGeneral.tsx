import type { ResumeData, TemplateConfig } from "../types";

interface Props {
  data: ResumeData;
  config: TemplateConfig;
}

export function TemplateGeneral({ data, config }: Props) {
  const { personalInfo: p, education, experience, skills, certifications, languages, projects } = data;
  const c = config.colors;

  return (
    <div className="resume-page" style={{ fontFamily: "'Arial', 'Helvetica', sans-serif", fontSize: 11 }}>
      {/* Compact Horizontal Header */}
      <div style={{ background: c.primary, padding: "14px 20px", color: "#fff", display: "flex", alignItems: "center", gap: 14 }}>
        {data.photo && (
          <div style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)", overflow: "hidden", flexShrink: 0 }}>
            <img src={data.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{p.fullName || "Your Name"}</h1>
          <p style={{ fontSize: 12, margin: "2px 0 0", color: c.accent }}>{p.title || "Professional"}</p>
          <div style={{ fontSize: 10, marginTop: 4, display: "flex", gap: 10, flexWrap: "wrap", opacity: 0.85 }}>
            <span>✉ {p.email || "email@example.com"}</span>
            <span>📞 {p.phone || "Phone"}</span>
            {p.address && <span>📍 {p.address}</span>}
            {p.linkedin && <span>🔗 {p.linkedin}</span>}
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 20px 10px" }}>
        {/* Summary - one line */}
        {p.summary && (
          <p style={{ fontSize: 11, color: c.text, lineHeight: 1.4, margin: "0 0 8px", fontStyle: "italic" }}>{p.summary}</p>
        )}

        {/* Section: Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: c.primary, borderBottom: `1px solid ${c.accent}`, paddingBottom: 2, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Experience</h3>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 5 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, color: c.text }}>{exp.title}</span>
                  <span style={{ color: "#888", fontSize: 10, whiteSpace: "nowrap" }}>
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div style={{ color: c.accent, fontSize: 10 }}>{exp.company}</div>
                <div style={{ color: "#555", fontSize: 10, lineHeight: 1.3, marginTop: 1 }}>{exp.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Section: Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: c.primary, borderBottom: `1px solid ${c.accent}`, paddingBottom: 2, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Education</h3>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 11 }}>{edu.degree}</span>
                  <span style={{ color: "#555", fontSize: 10 }}> — {edu.institution}</span>
                </div>
                <span style={{ color: "#888", fontSize: 10, whiteSpace: "nowrap" }}>
                  {edu.startDate} — {edu.endDate}{edu.grade ? ` | ${edu.grade}` : ""}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Skills + Certifications + Projects + Languages in a 2-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
          {skills.length > 0 && (
            <div>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: c.primary, borderBottom: `1px solid ${c.accent}`, paddingBottom: 2, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {skills.map((s) => (
                  <span key={s.id} style={{ fontSize: 10, background: c.accent + "18", color: c.text, padding: "1px 6px", borderRadius: 3 }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: c.primary, borderBottom: `1px solid ${c.accent}`, paddingBottom: 2, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Certifications</h3>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ fontSize: 10, marginBottom: 2 }}>
                  <span style={{ fontWeight: 600 }}>{cert.name}</span> — <span style={{ color: "#666" }}>{cert.issuer}</span>
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: c.primary, borderBottom: `1px solid ${c.accent}`, paddingBottom: 2, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Projects</h3>
              {projects.map((proj) => (
                <div key={proj.id} style={{ fontSize: 10, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{proj.name}</span>
                  <p style={{ margin: "1px 0 0", color: "#555", lineHeight: 1.3 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: c.primary, borderBottom: `1px solid ${c.accent}`, paddingBottom: 2, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Languages</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {languages.map((l) => (
                  <span key={l.id} style={{ fontSize: 10 }}>{l.name} <span style={{ color: "#888", textTransform: "capitalize" }}>({l.proficiency})</span></span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 9, color: "#bbb", padding: "4px 0", borderTop: "1px solid #eee" }}>
        NEJobsPortal.in — Resume Builder
      </div>
    </div>
  );
}
