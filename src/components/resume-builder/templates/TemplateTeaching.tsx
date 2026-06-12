import type { ResumeData, TemplateConfig } from "../types";

interface Props {
  data: ResumeData;
  config: TemplateConfig;
}

export function TemplateTeaching({ data, config }: Props) {
  const { personalInfo: p, education, experience, skills, certifications, languages, projects } = data;
  const c = config.colors;

  return (
    <div className="resume-page" style={{ fontFamily: "'Palatino', 'Georgia', serif" }}>
      {/* Purple Header */}
      <div style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`, padding: "24px 28px 18px", color: "#fff", textAlign: "center" }}>
        {data.photo && (
          <img src={data.photo} alt="" style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid " + c.accent, objectFit: "cover", marginBottom: 8 }} />
        )}
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{p.fullName || "Your Name"}</h1>
        <p style={{ fontSize: 14, margin: "4px 0 0", color: c.accent, fontWeight: 500 }}>{p.title || "Educator / Professor"}</p>
        <div style={{ fontSize: 11, marginTop: 6, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", opacity: 0.85 }}>
          <span>✉ {p.email || "email@example.com"}</span>
          <span>📞 {p.phone || "Phone"}</span>
          {p.address && <span>📍 {p.address}</span>}
        </div>
      </div>

      <div style={{ padding: "18px 28px" }}>
        {/* Summary */}
        {p.summary && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 4, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Academic Profile</h3>
            <p style={{ fontSize: 12, color: c.text, lineHeight: 1.5, margin: 0 }}>{p.summary}</p>
          </div>
        )}

        {/* Education (prominent for teaching) */}
        {education.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 4, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Education & Qualifications</h3>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 8, paddingLeft: 12, borderLeft: `3px solid ${c.accent}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{edu.degree}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{edu.institution}, {edu.location}</div>
                <div style={{ fontSize: 11, color: "#777" }}>
                  {edu.startDate} — {edu.endDate}{edu.grade ? ` | ${edu.grade}` : ""}
                </div>
                {edu.description && <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{edu.description}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 4, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Teaching Experience</h3>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{exp.title}</span>
                  <span style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: c.primary }}>{exp.company}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2, lineHeight: 1.4 }}>{exp.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Skills + Certifications Row */}
        <div style={{ display: "flex", gap: 24 }}>
          {skills.length > 0 && (
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Expertise</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {skills.map((s) => (
                  <span key={s.id} style={{ fontSize: 11, background: "#f3e8ff", color: c.primary, padding: "2px 8px", borderRadius: 12 }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {certifications.length > 0 && (
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Certifications</h3>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ fontSize: 11, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{cert.name}</span> — {cert.issuer}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Languages */}
        {languages.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 3, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Languages</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {languages.map((l) => (
                <span key={l.id} style={{ fontSize: 11, color: "#555" }}>{l.name} <span style={{ color: "#888", textTransform: "capitalize" }}>({l.proficiency})</span></span>
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
