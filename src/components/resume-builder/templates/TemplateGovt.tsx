import type { ResumeData, TemplateConfig } from "../types";

interface Props {
  data: ResumeData;
  config: TemplateConfig;
}

export function TemplateGovt({ data, config }: Props) {
  const { personalInfo: p, education, experience, skills, certifications, languages, projects } = data;
  const c = config.colors;

  return (
    <div className="resume-page" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
      {/* Dark Green Header Bar */}
      <div style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`, padding: "28px 32px 20px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {data.photo && (
            <img
              src={data.photo}
              alt=""
              style={{ width: 90, height: 90, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.6)", objectFit: "cover" }}
            />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: 1 }}>{p.fullName || "Your Name"}</h1>
            <p style={{ fontSize: 14, margin: "4px 0 0", opacity: 0.9 }}>
              {p.title || "Job Title / Designation"}
            </p>
            <div style={{ fontSize: 11, marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap", opacity: 0.85 }}>
              {p.email && <span>✉ {p.email}</span>}
              {p.phone && <span>📞 {p.phone}</span>}
              {p.address && <span>📍 {p.address}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: 500 }}>
        {/* Left Sidebar */}
        <div style={{ width: "32%", background: "#f4f7f4", padding: "20px 16px" }}>
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.primary}`, paddingBottom: 4, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Skills</h3>
              {skills.map((s) => (
                <div key={s.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: c.text, marginBottom: 2 }}>{s.name}</div>
                  <div style={{ height: 5, background: "#ddd", borderRadius: 3 }}>
                    <div style={{ width: `${s.level === "expert" ? 100 : s.level === "advanced" ? 80 : s.level === "intermediate" ? 60 : 40}%`, height: "100%", background: c.primary, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.primary}`, paddingBottom: 4, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Languages</h3>
              {languages.map((l) => (
                <div key={l.id} style={{ fontSize: 12, color: c.text, marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 500 }}>{l.name}</span>
                  <span style={{ textTransform: "capitalize", opacity: 0.7 }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.primary}`, paddingBottom: 4, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Certifications</h3>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{cert.name}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{cert.issuer} — {cert.date}</div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: c.primary, borderBottom: `2px solid ${c.primary}`, paddingBottom: 4, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Projects</h3>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{proj.name}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{proj.description}</div>
                  {proj.technologies && <div style={{ fontSize: 10, color: "#777", marginTop: 2 }}>Tech: {proj.technologies}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Content */}
        <div style={{ flex: 1, padding: "20px 24px" }}>
          {/* Summary */}
          {p.summary && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 4, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Professional Summary</h3>
              <p style={{ fontSize: 12, color: c.text, lineHeight: 1.5, margin: 0 }}>{p.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 4, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Work Experience</h3>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{exp.title}</span>
                      <span style={{ fontSize: 12, color: "#666" }}> at {exp.company}</span>
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
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: c.primary, borderBottom: `1px solid #ddd`, paddingBottom: 4, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Education</h3>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{edu.degree}</span>
                      <span style={{ fontSize: 12, color: "#666" }}> — {edu.institution}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                  {edu.grade && <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Grade: {edu.grade}</div>}
                  {edu.description && <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{edu.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: 10, color: "#999", padding: "6px 0", borderTop: "1px solid #eee" }}>
        NEJobsPortal.in — Resume Builder
      </div>
    </div>
  );
}
