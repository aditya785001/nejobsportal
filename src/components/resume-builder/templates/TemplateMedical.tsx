import type { ResumeData, TemplateConfig } from "../types";

interface Props {
  data: ResumeData;
  config: TemplateConfig;
}

export function TemplateMedical({ data, config }: Props) {
  const { personalInfo: p, education, experience, skills, certifications, languages, projects } = data;
  const c = config.colors;

  return (
    <div className="resume-page" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Teal Header with photo */}
      <div style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`, padding: "22px 28px", color: "#fff", display: "flex", alignItems: "center", gap: 20 }}>
        {data.photo && (
          <div style={{ width: 85, height: 85, borderRadius: 12, border: "3px solid rgba(255,255,255,0.5)", overflow: "hidden", flexShrink: 0 }}>
            <img src={data.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{p.fullName || "Your Name"}</h1>
          <p style={{ fontSize: 14, margin: "4px 0 0", color: c.accent, fontWeight: 500 }}>{p.title || "Medical Professional"}</p>
          <div style={{ fontSize: 11, marginTop: 6, display: "flex", gap: 14, flexWrap: "wrap", opacity: 0.85 }}>
            <span>✉ {p.email || "email@example.com"}</span>
            <span>📞 {p.phone || "Phone"}</span>
            {p.address && <span>📍 {p.address}</span>}
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 28px" }}>
        {/* Summary */}
        {p.summary && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Professional Summary</h3>
            <p style={{ fontSize: 12, color: c.text, lineHeight: 1.5, margin: 0 }}>{p.summary}</p>
          </div>
        )}

        {/* Education (prominent for medical) */}
        {education.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>
              Medical Education & Training
            </h3>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{edu.degree}</span>
                  <span style={{ fontSize: 12, color: "#555" }}> — {edu.institution}</span>
                </div>
                <span style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.accent}`, paddingBottom: 3, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Clinical Experience</h3>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `3px solid ${c.accent}` }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{exp.title}</span>
                  <span style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: c.primary }}>{exp.company} | {exp.location}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2, lineHeight: 1.4 }}>{exp.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Row */}
        <div style={{ display: "flex", gap: 24 }}>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Clinical Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {skills.map((s) => (
                  <span key={s.id} style={{ fontSize: 11, background: "#e6fffa", color: c.primary, padding: "2px 8px", borderRadius: 4, border: `1px solid ${c.accent}33` }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Licenses & Certifications</h3>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ fontSize: 11, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{cert.name}</span>
                  <span style={{ color: "#666" }}> — {cert.issuer}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Languages */}
        {languages.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Languages</h3>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 11 }}>
              {languages.map((l) => (
                <span key={l.id}>{l.name} <span style={{ color: "#888", textTransform: "capitalize" }}>({l.proficiency})</span></span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", fontSize: 10, color: "#999", padding: "6px 0", borderTop: "1px solid #eee" }}>
        NEJobsPortal.in — Resume Builder
      </div>
    </div>
  );
}
