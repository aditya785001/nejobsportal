"use client";

import type { ResumeData, Education, Experience, Skill, Certification, Language, Project, TemplateId } from "./types";
import { EMPTY_RESUME, SKILL_LEVELS, LANGUAGE_PROFICIENCIES, SKILL_CATEGORIES, TEMPLATES, genId } from "./types";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  templateId: TemplateId;
  onTemplateChange: (id: TemplateId) => void;
  resumeName: string;
  onResumeNameChange: (name: string) => void;
  onSave: () => void;
  saving: boolean;
  savedResumes: { id: string; name: string; template: string }[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

type SectionKeys = "education" | "experience" | "skills" | "certifications" | "languages" | "projects";

function createEmpty(key: SectionKeys): any {
  switch (key) {
    case "education": return { id: genId(), degree: "", institution: "", location: "", startDate: "", endDate: "", grade: "", description: "" };
    case "experience": return { id: genId(), title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" };
    case "skills": return { id: genId(), name: "", level: "intermediate", category: "Technical" };
    case "certifications": return { id: genId(), name: "", issuer: "", date: "", url: "" };
    case "languages": return { id: genId(), name: "", proficiency: "intermediate" };
    case "projects": return { id: genId(), name: "", description: "", technologies: "", url: "" };
  }
}

function updateArray<T extends { id: string }>(arr: T[], id: string, updater: (item: T) => T): T[] {
  return arr.map((item) => (item.id === id ? updater(item) : item));
}

// Helper to create a field updater for a specific item in an array on ResumeData
function fieldUpdater<T extends { id: string }>(
  currentData: ResumeData,
  section: SectionKeys,
  itemId: string,
  field: string
) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    const updated = updateArray(currentData[section] as unknown as T[], itemId, (item) => ({ ...item, [field]: value }));
    onChangeData(currentData, section, updated);
  };
}

function onChangeData(data: ResumeData, section: SectionKeys, updated: any[]) {
  // This is a hack to work around the closure issue - we return a callback
  // that will be called by the parent
  return { ...data, [section]: updated };
}

// Wrapper component for section arrays to manage local state
function SectionBlock<T extends { id: string }>({
  title,
  data,
  section,
  setData,
  emptyMsg,
  renderItem,
}: {
  title: string;
  data: ResumeData;
  section: SectionKeys;
  setData: (d: ResumeData) => void;
  emptyMsg?: string;
  renderItem: (item: T, onChange: (field: string, value: any) => void, onRemove: () => void) => React.ReactNode;
}) {
  const items = data[section] as unknown as T[];
  const add = () => {
    setData({ ...data, [section]: [...items, createEmpty(section) as any] });
  };
  const remove = (id: string) => {
    setData({ ...data, [section]: items.filter((i: any) => i.id !== id) });
  };
  const update = (id: string, field: string, value: any) => {
    setData({ ...data, [section]: updateArray(items, id, (item: any) => ({ ...item, [field]: value })) });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title} ({items.length})</h3>
        <button onClick={add} className="px-3 py-1 text-xs bg-[#1a6b3c] text-white rounded hover:bg-[#145230] transition-colors">
          + Add
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 italic">{emptyMsg || "No items yet."}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-gray-500">#</span>
                <button onClick={() => remove(item.id)} className="text-xs text-red-500 hover:text-red-700" title="Remove">✕</button>
              </div>
              {renderItem(item, (field: string, value: any) => update(item.id, field, value), () => remove(item.id))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputClass = "w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1a6b3c]/40 focus:border-[#1a6b3c] bg-white";
const labelClass = "block text-xs font-medium text-gray-600 mb-0.5";
const rowClass = "flex gap-2";

export function ResumeForm({
  data,
  onChange,
  templateId,
  onTemplateChange,
  resumeName,
  onResumeNameChange,
  onSave,
  saving,
  savedResumes,
  onLoad,
  onDelete,
}: Props) {
  const setData = onChange;
  const pi = data.personalInfo;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setData({ ...data, photo: ev.target?.result as string || "" });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Resume Name & Template Selector */}
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <label className={labelClass}>Resume Name</label>
          <input className={inputClass} value={resumeName} onChange={(e) => onResumeNameChange(e.target.value)} placeholder="e.g. My Govt Job Resume" />
        </div>
        <div className="w-40">
          <label className={labelClass}>Template</label>
          <select className={inputClass} value={templateId} onChange={(e) => onTemplateChange(e.target.value as TemplateId)}>
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Save / Load Controls */}
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={onSave} disabled={saving || !resumeName.trim()} className="px-4 py-1.5 text-xs bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] disabled:opacity-50 transition-colors font-medium">
          {saving ? "Saving..." : "💾 Save Resume"}
        </button>
        {savedResumes.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Load:</span>
            <select className="text-xs border border-gray-300 rounded px-2 py-1" onChange={(e) => e.target.value && onLoad(e.target.value)} defaultValue="">
              <option value="" disabled>Select saved resume...</option>
              {savedResumes.map((r) => (
                <option key={r.id} value={r.id}>{r.name} ({r.template})</option>
              ))}
            </select>
            <button
              onClick={() => { setData(EMPTY_RESUME); onResumeNameChange(""); }}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              ✕ New
            </button>
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Photo Upload */}
      <div>
        <label className={labelClass}>Photo (passport size recommended)</label>
        <div className="flex items-center gap-3">
          {data.photo ? (
            <div className="relative">
              <img src={data.photo} alt="Preview" className="w-16 h-16 object-cover rounded border border-gray-200" />
              <button onClick={() => setData({ ...data, photo: "" })} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] leading-none flex items-center justify-center">✕</button>
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">Photo</div>
          )}
          <label className="px-3 py-1.5 text-xs bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition-colors">
            Upload Photo
            <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </label>
        </div>
      </div>

      {/* Personal Info */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Personal Information</h3>
        <div className="space-y-2">
          <div className={rowClass}>
            <div className="flex-1">
              <label className={labelClass}>Full Name *</label>
              <input className={inputClass} value={pi.fullName} onChange={(e) => setData({ ...data, personalInfo: { ...pi, fullName: e.target.value } })} placeholder="John Doe" />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Professional Title *</label>
              <input className={inputClass} value={pi.title} onChange={(e) => setData({ ...data, personalInfo: { ...pi, title: e.target.value } })} placeholder="Software Engineer / IAS Aspirant" />
            </div>
          </div>
          <div className={rowClass}>
            <div className="flex-1">
              <label className={labelClass}>Email *</label>
              <input className={inputClass} type="email" value={pi.email} onChange={(e) => setData({ ...data, personalInfo: { ...pi, email: e.target.value } })} placeholder="john@example.com" />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Phone *</label>
              <input className={inputClass} type="tel" value={pi.phone} onChange={(e) => setData({ ...data, personalInfo: { ...pi, phone: e.target.value } })} placeholder="+91-9876543210" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input className={inputClass} value={pi.address} onChange={(e) => setData({ ...data, personalInfo: { ...pi, address: e.target.value } })} placeholder="Guwahati, Assam" />
          </div>
          <div className={rowClass}>
            <div className="flex-1">
              <label className={labelClass}>LinkedIn</label>
              <input className={inputClass} value={pi.linkedin} onChange={(e) => setData({ ...data, personalInfo: { ...pi, linkedin: e.target.value } })} placeholder="linkedin.com/in/username" />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Website</label>
              <input className={inputClass} value={pi.website} onChange={(e) => setData({ ...data, personalInfo: { ...pi, website: e.target.value } })} placeholder="portfolio.example.com" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Professional Summary</label>
            <textarea className={`${inputClass} min-h-[60px] resize-y`} value={pi.summary} onChange={(e) => setData({ ...data, personalInfo: { ...pi, summary: e.target.value } })} placeholder="Brief summary of your career, skills, and goals..." />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Education */}
      <SectionBlock<Education>
        title="Education"
        section="education"
        data={data}
        setData={setData}
        renderItem={(edu, onChange) => (
          <div className="space-y-1.5">
            <div className={rowClass}>
              <div className="flex-[2]">
                <label className={labelClass}>Degree</label>
                <input className={inputClass} value={edu.degree} onChange={(e) => onChange("degree", e.target.value)} placeholder="B.Sc. / M.A. / B.Tech" />
              </div>
              <div className="flex-[2]">
                <label className={labelClass}>Institution</label>
                <input className={inputClass} value={edu.institution} onChange={(e) => onChange("institution", e.target.value)} placeholder="Gauhati University" />
              </div>
            </div>
            <div className={rowClass}>
              <div className="flex-1">
                <label className={labelClass}>Start</label>
                <input className={inputClass} value={edu.startDate} onChange={(e) => onChange("startDate", e.target.value)} placeholder="2018" />
              </div>
              <div className="flex-1">
                <label className={labelClass}>End</label>
                <input className={inputClass} value={edu.endDate} onChange={(e) => onChange("endDate", e.target.value)} placeholder="2022" />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Grade</label>
                <input className={inputClass} value={edu.grade || ""} onChange={(e) => onChange("grade", e.target.value)} placeholder="8.5 CGPA / 85%" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description (optional)</label>
              <input className={inputClass} value={edu.description || ""} onChange={(e) => onChange("description", e.target.value)} placeholder="Relevant coursework, activities..." />
            </div>
          </div>
        )}
      />

      {/* Experience */}
      <SectionBlock<Experience>
        title="Job Experience"
        section="experience"
        data={data}
        setData={setData}
        renderItem={(exp, onChange, onRemove) => (
          <div className="space-y-1.5">
            <div className={rowClass}>
              <div className="flex-[2]">
                <label className={labelClass}>Job Title</label>
                <input className={inputClass} value={exp.title} onChange={(e) => onChange("title", e.target.value)} placeholder="Assistant Manager" />
              </div>
              <div className="flex-[2]">
                <label className={labelClass}>Company</label>
                <input className={inputClass} value={exp.company} onChange={(e) => onChange("company", e.target.value)} placeholder="SBI / Govt of Assam" />
              </div>
            </div>
            <div className={rowClass}>
              <div className="flex-1">
                <label className={labelClass}>Start</label>
                <input className={inputClass} value={exp.startDate} onChange={(e) => onChange("startDate", e.target.value)} placeholder="Jan 2020" />
              </div>
              <div className="flex-1">
                <label className={labelClass}>End</label>
                <input className={inputClass} value={exp.endDate} onChange={(e) => onChange("endDate", e.target.value)} placeholder="Present" disabled={exp.current} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={exp.current} onChange={(e) => { onChange("current", e.target.checked); if (e.target.checked) onChange("endDate", ""); }} />
                  Current
                </label>
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea className={`${inputClass} min-h-[40px] resize-y`} value={exp.description} onChange={(e) => onChange("description", e.target.value)} placeholder="Describe your responsibilities and achievements..." />
            </div>
          </div>
        )}
      />

      {/* Skills */}
      <SectionBlock<Skill>
        title="Skills"
        section="skills"
        data={data}
        setData={setData}
        renderItem={(skill, onChange) => (
          <div className={rowClass}>
            <div className="flex-[2]">
              <label className={labelClass}>Skill</label>
              <input className={inputClass} value={skill.name} onChange={(e) => onChange("name", e.target.value)} placeholder="MS Excel / Python" />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Level</label>
              <select className={inputClass} value={skill.level} onChange={(e) => onChange("level", e.target.value)}>
                {SKILL_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={skill.category} onChange={(e) => onChange("category", e.target.value)}>
                {SKILL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}
      />

      {/* Certifications */}
      <SectionBlock<Certification>
        title="Certifications"
        section="certifications"
        data={data}
        setData={setData}
        renderItem={(cert, onChange) => (
          <div className="space-y-1.5">
            <div className={rowClass}>
              <div className="flex-[2]">
                <label className={labelClass}>Name</label>
                <input className={inputClass} value={cert.name} onChange={(e) => onChange("name", e.target.value)} placeholder="CA / CFA / PMP" />
              </div>
              <div className="flex-[2]">
                <label className={labelClass}>Issuer</label>
                <input className={inputClass} value={cert.issuer} onChange={(e) => onChange("issuer", e.target.value)} placeholder="ICA / Microsoft" />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Date</label>
                <input className={inputClass} value={cert.date} onChange={(e) => onChange("date", e.target.value)} placeholder="2024" />
              </div>
            </div>
          </div>
        )}
      />

      {/* Languages */}
      <SectionBlock<Language>
        title="Languages"
        section="languages"
        data={data}
        setData={setData}
        renderItem={(lang, onChange) => (
          <div className={rowClass}>
            <div className="flex-1">
              <label className={labelClass}>Language</label>
              <input className={inputClass} value={lang.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Assamese, English, Hindi" />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Proficiency</label>
              <select className={inputClass} value={lang.proficiency} onChange={(e) => onChange("proficiency", e.target.value)}>
                {LANGUAGE_PROFICIENCIES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
        )}
      />

      {/* Projects */}
      <SectionBlock<Project>
        title="Projects"
        section="projects"
        data={data}
        setData={setData}
        renderItem={(proj, onChange) => (
          <div className="space-y-1.5">
            <div className={rowClass}>
              <div className="flex-[2]">
                <label className={labelClass}>Project Name</label>
                <input className={inputClass} value={proj.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Exam Portal" />
              </div>
              <div className="flex-[2]">
                <label className={labelClass}>Technologies</label>
                <input className={inputClass} value={proj.technologies} onChange={(e) => onChange("technologies", e.target.value)} placeholder="React, Node.js, PostgreSQL" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea className={`${inputClass} min-h-[36px] resize-y`} value={proj.description} onChange={(e) => onChange("description", e.target.value)} placeholder="Brief description of the project..." />
            </div>
          </div>
        )}
      />

      <hr className="border-gray-200" />

      {/* Template Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Pick a template that matches your target job category. Each layout is optimized for a specific industry.
        </p>
      </div>
      <p className="text-xs text-gray-400 text-center">
        All data stays in your browser until you save. Saved resumes can be loaded anytime.
      </p>
    </div>
  );
}
