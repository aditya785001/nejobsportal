"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { TranslateButton } from "@/components/TranslateButton";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

const PILLARS = [
  { value: "JOB", label: "Job" },
  { value: "ADMISSION", label: "Admission" },
  { value: "RESULT", label: "Result" },
  { value: "SCHOLARSHIP", label: "Scholarship" },
  { value: "STUDY_MATERIAL", label: "Study Material" },
];

const STATES = [
  { value: "Assam", label: "Assam" },
  { value: "ArunachalPradesh", label: "Arunachal Pradesh" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tripura", label: "Tripura" },
  { value: "AllIndia", label: "All India" },
];
const CATEGORIES = [
  { value: "StateGovt", label: "State Govt" },
  { value: "CentralGovt", label: "Central Govt" },
  { value: "PublicSector", label: "Public Sector" },
  { value: "Defense", label: "Defense" },
  { value: "Banking", label: "Banking" },
  { value: "Teaching", label: "Teaching" },
  { value: "Research", label: "Research" },
];

const JOB_TYPES = [
  { value: "FullTime", label: "Full Time" },
  { value: "PartTime", label: "Part Time" },
  { value: "Contract", label: "Contract" },
  { value: "WalkIn", label: "Walk-In" },
  { value: "Internship", label: "Internship" },
  { value: "Remote", label: "Remote" },
];

const SELECTION_TYPES = [
  { value: "WrittenExam", label: "Written Exam" },
  { value: "Interview", label: "Interview" },
  { value: "Merit", label: "Merit Based" },
  { value: "WalkInInterview", label: "Walk-In Interview" },
  { value: "PhysicalTest", label: "Physical Test" },
  { value: "TradeTest", label: "Trade Test" },
  { value: "SkillTest", label: "Skill Test" },
  { value: "DocumentVerification", label: "Document Verification" },
  { value: "Combined", label: "Combined Process" },
];

const RESULT_TYPES = [
  { value: "EXAM", label: "Exam Result" },
  { value: "RECRUITMENT", label: "Recruitment Result" },
  { value: "ADMIT_CARD", label: "Admit Card" },
  { value: "ANSWER_KEY", label: "Answer Key" },
  { value: "CUTOFF", label: "Cutoff Marks" },
  { value: "MERIT_LIST", label: "Merit List" },
];

const RESOURCE_TYPES = [
  { value: "QUESTION_PAPER", label: "Question Paper" },
  { value: "SYLLABUS", label: "Syllabus" },
  { value: "NOTES", label: "Notes" },
  { value: "MOCK_TEST", label: "Mock Test" },
  { value: "BOOK", label: "Book" },
  { value: "VIDEO", label: "Video" },
  { value: "OTHER", label: "Other" },
];

const FEE_CATEGORIES = [
  { key: "general", label: "General" },
  { key: "obc", label: "OBC" },
  { key: "sc", label: "SC" },
  { key: "st", label: "ST" },
  { key: "pwd", label: "PwD" },
  { key: "female", label: "Female" },
];

const PILLAR_ENDPOINTS: Record<string, string> = {
  JOB: "/api/jobs",
  ADMISSION: "/api/admissions",
  RESULT: "/api/results",
  SCHOLARSHIP: "/api/scholarships",
  STUDY_MATERIAL: "/api/study-materials",
};
interface JobForm {
  type: "JOB"; titleEn: string; titleAs: string; department: string;
  state: string; category: string; jobType: string; selectionType: string;
  totalVacancies: string; payScale: string; qualification: string;
  ageLimit: string; lastDate: string; applicationUrl: string;
  fee: Record<string, string>; howToApplyEn: string; howToApplyAs: string;
  importantDates: { label: string; date: string }[]; disclaimer: string;
  notificationPdfUrl: string; notificationDate: string;
  summaryEn: string; summaryAs: string; pwdFriendly: boolean;
  pwdDetails: string; hashtags: string;
}

interface AdmissionForm {
  type: "ADMISSION"; titleEn: string; titleAs: string;
  institution: string; course: string; eligibility: string;
  process: string; importantDates: { label: string; date: string }[];
  portalUrl: string; state: string; hashtags: string;
}

interface ResultForm {
  type: "RESULT"; titleEn: string; titleAs: string; examName: string;
  resultType: string; declaringBody: string; declarationDate: string;
  portalUrl: string; cutOffMarks: string; summaryEn: string;
  summaryAs: string; state: string; hashtags: string;
}

interface ScholarshipForm {
  type: "SCHOLARSHIP"; titleEn: string; titleAs: string;
  schemeName: string; provider: string; amount: string;
  eligibility: string; applicationProcess: string;
  importantDates: { label: string; date: string }[];
  portalUrl: string; state: string; hashtags: string;
}

interface StudyMaterialForm {
  type: "STUDY_MATERIAL"; titleEn: string; titleAs: string;
  examTag: string; subject: string; resourceType: string;
  fileUrl: string; description: string; state: string; hashtags: string;
}

type AnyForm = JobForm | AdmissionForm | ResultForm | ScholarshipForm | StudyMaterialForm;

function emptyForm(type: string): AnyForm {
  switch (type) {
    case "JOB":
      return {
        type: "JOB", titleEn: "", titleAs: "", department: "", state: "Assam",
        category: "StateGovt", jobType: "FullTime", selectionType: "WrittenExam",
        totalVacancies: "", payScale: "", qualification: "", ageLimit: "",
        lastDate: "", applicationUrl: "",
        fee: Object.fromEntries(FEE_CATEGORIES.map((c) => [c.key, ""])),
        howToApplyEn: "", howToApplyAs: "",
        importantDates: [{ label: "", date: "" }],
        disclaimer: "All details are sourced from the official notification. Candidates must verify all details on the official department website before applying.",
        notificationPdfUrl: "", notificationDate: "", summaryEn: "", summaryAs: "",
        pwdFriendly: false, pwdDetails: "", hashtags: "",
      };
    case "ADMISSION":
      return {
        type: "ADMISSION", titleEn: "", titleAs: "", institution: "", course: "",
        eligibility: "", process: "", importantDates: [{ label: "", date: "" }],
        portalUrl: "", state: "Assam", hashtags: "",
      };
    case "RESULT":
      return {
        type: "RESULT", titleEn: "", titleAs: "", examName: "", resultType: "EXAM",
        declaringBody: "", declarationDate: "", portalUrl: "", cutOffMarks: "",
        summaryEn: "", summaryAs: "", state: "Assam", hashtags: "",
      };
    case "SCHOLARSHIP":
      return {
        type: "SCHOLARSHIP", titleEn: "", titleAs: "", schemeName: "",
        provider: "", amount: "", eligibility: "", applicationProcess: "",
        importantDates: [{ label: "", date: "" }], portalUrl: "",
        state: "Assam", hashtags: "",
      };
    case "STUDY_MATERIAL":
      return {
        type: "STUDY_MATERIAL", titleEn: "", titleAs: "", examTag: "",
        subject: "", resourceType: "OTHER", fileUrl: "", description: "",
        state: "Assam", hashtags: "",
      };
    default: return emptyForm("JOB");
  }
}
export default function NewPostPage() {
  const router = useRouter();
  const [pillar, setPillar] = useState<string>("JOB");
  const [form, setForm] = useState<AnyForm>(emptyForm("JOB"));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Auto-translate English → Assamese after 2s of inactivity (only if Assamese is empty)
  const autoTranslateTitle = useAutoTranslate((form as any).titleAs, (v) => update("titleAs", v));
  const autoTranslateSummary = useAutoTranslate((form as any).summaryAs, (v) => update("summaryAs", v));
  const autoTranslateHowToApply = useAutoTranslate((form as any).howToApplyAs, (v) => update("howToApplyAs", v));

  const update = (field: any, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    // Trigger auto-translate for English fields
    if (field === "titleEn") autoTranslateTitle(value);
    else if (field === "summaryEn") autoTranslateSummary(value);
    else if (field === "howToApplyEn") autoTranslateHowToApply(value);
  };

  const updateFee = (key: string, value: string) => {
    if (form.type === "JOB") {
      setForm((prev: any) => ({
        ...prev, fee: { ...prev.fee, [key]: value },
      }));
    }
  };

  const addDateRow = () => {
    setForm((prev: any) => ({
      ...prev,
      importantDates: [...(prev.importantDates || []), { label: "", date: "" }],
    }));
  };

  const updateDateRow = (index: number, field: "label" | "date", value: string) => {
    setForm((prev: any) => {
      const dates = [...(prev.importantDates || [])];
      dates[index] = { ...dates[index], [field]: value };
      return { ...prev, importantDates: dates };
    });
  };

  const removeDateRow = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      importantDates: (prev.importantDates || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const switchPillar = (newPillar: string) => {
    setPillar(newPillar);
    setForm(emptyForm(newPillar));
    setError("");
  };

  /** Translate any remaining empty Assamese fields before submit. Returns a map of translations. */
  const ensureAssameseTranslation = useCallback(async (currentForm: any): Promise<Record<string, string>> => {
    const toTranslate: { field: string; enField: string }[] = [];
    if (currentForm.titleEn?.trim() && !currentForm.titleAs?.trim())
      toTranslate.push({ field: "titleAs", enField: "titleEn" });
    if (currentForm.summaryEn?.trim() && !currentForm.summaryAs?.trim())
      toTranslate.push({ field: "summaryAs", enField: "summaryEn" });
    if (currentForm.howToApplyEn?.trim() && !currentForm.howToApplyAs?.trim())
      toTranslate.push({ field: "howToApplyAs", enField: "howToApplyEn" });

    if (toTranslate.length === 0) return {};

    const results = await Promise.all(
      toTranslate.map(async ({ field, enField }) => {
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: currentForm[enField].slice(0, 1500) }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.translation) return { field, translation: data.translation };
          }
        } catch { /* ignore */ }
        return null;
      }),
    );

    const updates: Record<string, string> = {};
    for (const r of results) {
      if (r) updates[r.field] = r.translation;
    }
    if (Object.keys(updates).length > 0) {
      setForm((prev: any) => ({ ...prev, ...updates }));
    }
    return updates;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const translations = await ensureAssameseTranslation(form as any);

      const endpoint = PILLAR_ENDPOINTS[pillar];
      let payload: Record<string, any> = {};
      const hashtags = ((form as any).hashtags || "")
        .split(",").map((t: string) => t.trim()).filter(Boolean);

      if (pillar === "JOB") {
        const f = form as JobForm;
        const fee: Record<string, number> = {};
        for (const [key, val] of Object.entries(f.fee)) {
          const num = parseFloat(val);
          if (!isNaN(num)) fee[key] = num;
        }
        payload = {
          titleEn: f.titleEn, titleAs: translations.titleAs ?? f.titleAs, department: f.department,
          state: f.state, category: f.category, jobType: f.jobType,
          selectionType: f.selectionType,
          totalVacancies: f.totalVacancies ? parseInt(f.totalVacancies) : null,
          payScale: f.payScale || null, qualification: f.qualification,
          ageLimit: f.ageLimit || null,
          lastDate: new Date(f.lastDate).toISOString(),
          applicationUrl: f.applicationUrl, fee,
          howToApplyEn: f.howToApplyEn, howToApplyAs: translations.howToApplyAs ?? f.howToApplyAs,
          importantDates: f.importantDates.filter((d) => d.label && d.date),
          disclaimer: f.disclaimer,
          notificationPdfUrl: f.notificationPdfUrl || null,
          notificationDate: f.notificationDate ? new Date(f.notificationDate).toISOString() : null,
          summaryEn: f.summaryEn, summaryAs: translations.summaryAs ?? f.summaryAs,
          pwdFriendly: f.pwdFriendly, pwdDetails: f.pwdDetails || null, hashtags,
        };
      } else if (pillar === "ADMISSION") {
        const f = form as AdmissionForm;
        payload = {
          titleEn: f.titleEn, titleAs: translations.titleAs ?? f.titleAs, institution: f.institution,
          course: f.course, eligibility: f.eligibility, process: f.process || null,
          importantDates: f.importantDates.filter((d) => d.label && d.date),
          portalUrl: f.portalUrl || null, state: f.state, hashtags,
        };
      } else if (pillar === "RESULT") {
        const f = form as ResultForm;
        payload = {
          titleEn: f.titleEn, titleAs: translations.titleAs ?? f.titleAs, examName: f.examName,
          resultType: f.resultType, declaringBody: f.declaringBody, state: f.state,
          declarationDate: new Date(f.declarationDate).toISOString(),
          portalUrl: f.portalUrl || null,
          cutOffMarks: f.cutOffMarks ? f.cutOffMarks.split(",").map((s: string) => s.trim()) : [],
          summaryEn: f.summaryEn || null, summaryAs: translations.summaryAs ?? f.summaryAs, hashtags,
        };
      } else if (pillar === "SCHOLARSHIP") {
        const f = form as ScholarshipForm;
        payload = {
          titleEn: f.titleEn, titleAs: translations.titleAs ?? f.titleAs, schemeName: f.schemeName,
          provider: f.provider, amount: f.amount, eligibility: f.eligibility,
          applicationProcess: f.applicationProcess || null,
          importantDates: f.importantDates.filter((d) => d.label && d.date),
          portalUrl: f.portalUrl || null, state: f.state, hashtags,
        };
      } else if (pillar === "STUDY_MATERIAL") {
        const f = form as StudyMaterialForm;
        payload = {
          titleEn: f.titleEn, titleAs: translations.titleAs ?? f.titleAs, examTag: f.examTag || null,
          subject: f.subject || null, resourceType: f.resourceType,
          fileUrl: f.fileUrl, description: f.description || null,
          state: f.state, hashtags,
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const slugRoutes: Record<string, string> = {
          JOB: "/jobs/", ADMISSION: "/admissions/", RESULT: "/results/",
          SCHOLARSHIP: "/scholarships/", STUDY_MATERIAL: "/study-materials/",
        };
        router.push(slugRoutes[pillar] + data.slug);
      } else {
        const err = await res.json();
        setError(err.error || err.details?.[0]?.message || "Failed to create post");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const sec = "bg-white rounded-xl border border-gray-200 p-6";
  const h = (n: number, t: string) => (
    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span className="w-8 h-8 rounded-full bg-[#1a6b3c] text-white flex items-center justify-center text-sm shrink-0">{n}</span>
      {t}
    </h2>
  );
  const inp = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-transparent";
  const lbl = "block text-sm font-medium text-gray-700 mb-1";
  const R = <span className="text-red-500">*</span>;
  const g2 = "grid grid-cols-1 md:grid-cols-2 gap-4";
  const g3 = "grid grid-cols-1 md:grid-cols-3 gap-4";

  const F = (props: { value: string; onChange: (v: string) => void; placeholder?: string; minHeight?: number }) => (
    <RichTextEditor value={props.value} onChange={props.onChange} placeholder={props.placeholder} minHeight={props.minHeight ?? 120} />
  );
  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={inp + " " + (props.className || "")} />;
  const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} className={inp + " " + (props.className || "")} />;
  const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => <label className={lbl + " " + (props.className || "")}>{props.children}</label>;
  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-sm text-gray-500 mt-1">Select a post type and fill in the details. Fields marked {R} are required.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <Label className="mb-3">Post Type {R}</Label>
        <div className="flex flex-wrap gap-2">
          {PILLARS.map((p) => (
            <button key={p.value} type="button" onClick={() => switchPillar(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pillar === p.value ? "bg-[#1a6b3c] text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >{p.label}</button>
          ))}
        </div>
      </div>

      {error && <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {pillar === "JOB" && (<>
          <div className={sec}>
            {h(1, "Basic Information")}
            <div className={g2}>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Title (English) {R}</Label>
                  <TranslateButton text={(form as any).titleEn} onTranslated={(v) => update("titleAs", v)} />
                </div>
                <Input value={(form as any).titleEn} onChange={(e) => update("titleEn", e.target.value)} required placeholder="e.g. Assam Police Constable Recruitment 2026" />
              </div>
              <div><Label>Title (Assamese) {R}</Label><Input value={(form as any).titleAs} onChange={(e) => update("titleAs", e.target.value)} required placeholder="Assamese title here" /></div>
            </div>
            <div className={g3 + " mt-4"}>
              <div><Label>Department / Board {R}</Label><Input value={(form as any).department} onChange={(e) => update("department", e.target.value)} required placeholder="e.g. Assam Public Service Commission" /></div>
              <div><Label>State {R}</Label><Select value={(form as any).state} onChange={(e) => update("state", e.target.value)}>{STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select></div>
              <div><Label>Category {R}</Label><Select value={(form as any).category} onChange={(e) => update("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</Select></div>
            </div>
          </div>

          <div className={sec}>
            {h(2, "Job Details")}
            <div className={g3}>
              <div><Label>Job Type</Label><Select value={(form as any).jobType} onChange={(e) => update("jobType", e.target.value)}>{JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
              <div><Label>Selection Type</Label><Select value={(form as any).selectionType} onChange={(e) => update("selectionType", e.target.value)}>{SELECTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
              <div><Label>Total Vacancies</Label><Input value={(form as any).totalVacancies} onChange={(e) => update("totalVacancies", e.target.value)} type="number" min="1" placeholder="e.g. 500" /></div>
            </div>
            <div className={g2 + " mt-4"}>
              <div><Label>Pay Scale</Label><Input value={(form as any).payScale} onChange={(e) => update("payScale", e.target.value)} placeholder="e.g. Rs 30,000 - Rs 1,20,000" /></div>
              <div><Label>Age Limit</Label><Input value={(form as any).ageLimit} onChange={(e) => update("ageLimit", e.target.value)} placeholder="e.g. 18-38 years" /></div>
            </div>
            <div className="mt-4">
              <Label>Qualification {R}</Label>
              <F value={(form as any).qualification} onChange={(v) => update("qualification", v)} placeholder="e.g. Graduate in any discipline from a recognized university" minHeight={100} />
            </div>
          </div>

          <div className={sec}>
            {h(3, "Dates & Application")}
            <div className={g2}>
              <div><Label>Last Date to Apply {R}</Label><Input value={(form as any).lastDate} onChange={(e) => update("lastDate", e.target.value)} type="date" required /></div>
              <div><Label>Notification Date</Label><Input value={(form as any).notificationDate} onChange={(e) => update("notificationDate", e.target.value)} type="date" /></div>
            </div>
            <div className={g2 + " mt-4"}>
              <div><Label>Application URL {R}</Label><Input value={(form as any).applicationUrl} onChange={(e) => update("applicationUrl", e.target.value)} type="url" required placeholder="https://official-website.gov.in" /></div>
              <div><Label>Notification PDF URL</Label><Input value={(form as any).notificationPdfUrl} onChange={(e) => update("notificationPdfUrl", e.target.value)} type="url" placeholder="https://example.com/notification.pdf" /></div>
            </div>
            <div className="mt-4">
              <Label>Application Fee (Rs)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {FEE_CATEGORIES.map((cat) => (
                  <div key={cat.key}>
                    <label className="block text-xs text-gray-500 mb-1 capitalize">{cat.label}</label>
                    <Input value={(form as any).fee[cat.key]} onChange={(e) => updateFee(cat.key, e.target.value)} type="number" min="0" placeholder="0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={sec}>
            <div className="flex items-center justify-between mb-4">
              {h(4, "Important Dates (Optional)")}
              <button type="button" onClick={addDateRow} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">+ Add Date</button>
            </div>
            <div className="space-y-3">
              {(form as any).importantDates.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <Input value={item.label} onChange={(e) => updateDateRow(index, "label", e.target.value)} placeholder="e.g. Admit Card Release" className="flex-1" />
                  <Input value={item.date} onChange={(e) => updateDateRow(index, "date", e.target.value)} type="date" className="w-44" />
                  {(form as any).importantDates.length > 1 && (
                    <button type="button" onClick={() => removeDateRow(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">Remove</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={sec}>
            {h(5, "How to Apply")}
            <div className={g2}>
              <div>
                <div className="flex items-center justify-between">
                  <Label>How to Apply (English) {R}</Label>
                  <TranslateButton text={(form as any).howToApplyEn} onTranslated={(v) => update("howToApplyAs", v)} />
                </div>
                <F value={(form as any).howToApplyEn} onChange={(v) => update("howToApplyEn", v)} placeholder="1. Visit official website&#10;2. Click on Apply Online" minHeight={150} />
              </div>
              <div><Label>How to Apply (Assamese) {R}</Label><F value={(form as any).howToApplyAs} onChange={(v) => update("howToApplyAs", v)} placeholder="Assamese translation" minHeight={150} /></div>
            </div>
          </div>

          <div className={sec}>
            {h(6, "Summary & Tags")}
            <div className={g2}>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Summary (English)</Label>
                  <TranslateButton text={(form as any).summaryEn} onTranslated={(v) => update("summaryAs", v)} />
                </div>
                <F value={(form as any).summaryEn} onChange={(v) => update("summaryEn", v)} placeholder="Brief description" minHeight={100} />
              </div>
              <div><Label>Summary (Assamese)</Label><F value={(form as any).summaryAs} onChange={(v) => update("summaryAs", v)} placeholder="Assamese summary" minHeight={100} /></div>
            </div>
            <div className="mt-4">
              <Label>Hashtags / Tags</Label>
              <Input value={(form as any).hashtags} onChange={(e) => update("hashtags", e.target.value)} placeholder="e.g. AssamPolice, GovtJobs, APSC (comma-separated)" />
            </div>
          </div>

          <div className={sec}>
            {h(7, "Additional Settings")}
            <div><Label>Disclaimer</Label><F value={(form as any).disclaimer} onChange={(v) => update("disclaimer", v)} minHeight={80} /></div>
            <div className="mt-4 flex items-start gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={(form as any).pwdFriendly} onChange={(e) => update("pwdFriendly", e.target.checked)} className="w-4 h-4 text-[#1a6b3c] rounded focus:ring-[#1a6b3c]" />
                <span className="text-sm font-medium text-gray-700">PWD Friendly</span>
              </label>
              {(form as any).pwdFriendly && (
                <div className="flex-1"><Input value={(form as any).pwdDetails} onChange={(e) => update("pwdDetails", e.target.value)} placeholder="PWD details / accommodations" /></div>
              )}
            </div>
          </div>
        </>)}
        {pillar === "ADMISSION" && (<>
          <div className={sec}>
            {h(1, "Basic Information")}
            <div className={g2}>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Title (English) {R}</Label>
                  <TranslateButton text={(form as any).titleEn} onTranslated={(v) => update("titleAs", v)} />
                </div>
                <Input value={(form as any).titleEn} onChange={(e) => update("titleEn", e.target.value)} required placeholder="e.g. Gauhati University B.Ed Admission 2026" />
              </div>
              <div><Label>Title (Assamese) {R}</Label><Input value={(form as any).titleAs} onChange={(e) => update("titleAs", e.target.value)} required placeholder="Assamese title" /></div>
            </div>
            <div className={g3 + " mt-4"}>
              <div><Label>Institution {R}</Label><Input value={(form as any).institution} onChange={(e) => update("institution", e.target.value)} required placeholder="e.g. Gauhati University" /></div>
              <div><Label>Course {R}</Label><Input value={(form as any).course} onChange={(e) => update("course", e.target.value)} required placeholder="e.g. B.Ed" /></div>
              <div><Label>State {R}</Label><Select value={(form as any).state} onChange={(e) => update("state", e.target.value)}>{STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select></div>
            </div>
          </div>

          <div className={sec}>
            {h(2, "Admission Details")}
            <div className="mt-4">
              <Label>Eligibility {R}</Label>
              <F value={(form as any).eligibility} onChange={(v) => update("eligibility", v)} placeholder="Minimum qualification required for admission" minHeight={120} />
            </div>
            <div className="mt-4">
              <Label>Admission Process</Label>
              <F value={(form as any).process} onChange={(v) => update("process", v)} placeholder="Steps for admission process" minHeight={120} />
            </div>
            <div className="mt-4">
              <Label>Portal URL</Label>
              <Input value={(form as any).portalUrl} onChange={(e) => update("portalUrl", e.target.value)} type="url" placeholder="https://official-admission-portal.edu.in" />
            </div>
          </div>

          <div className={sec}>
            <div className="flex items-center justify-between mb-4">
              {h(3, "Important Dates (Optional)")}
              <button type="button" onClick={addDateRow} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">+ Add Date</button>
            </div>
            <div className="space-y-3">
              {(form as any).importantDates.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <Input value={item.label} onChange={(e) => updateDateRow(index, "label", e.target.value)} placeholder="e.g. Application Start" className="flex-1" />
                  <Input value={item.date} onChange={(e) => updateDateRow(index, "date", e.target.value)} type="date" className="w-44" />
                  {(form as any).importantDates.length > 1 && (
                    <button type="button" onClick={() => removeDateRow(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">Remove</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={sec}>
            {h(4, "Hashtags")}
            <Label>Hashtags / Tags</Label>
            <Input value={(form as any).hashtags} onChange={(e) => update("hashtags", e.target.value)} placeholder="e.g. Admission, University (comma-separated)" />
          </div>
        </>)}
        {pillar === "RESULT" && (<>
          <div className={sec}>
            {h(1, "Basic Information")}
            <div className={g2}>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Title (English) {R}</Label>
                  <TranslateButton text={(form as any).titleEn} onTranslated={(v) => update("titleAs", v)} />
                </div>
                <Input value={(form as any).titleEn} onChange={(e) => update("titleEn", e.target.value)} required placeholder="e.g. SSC CGL 2025 Result Declared" />
              </div>
              <div><Label>Title (Assamese) {R}</Label><Input value={(form as any).titleAs} onChange={(e) => update("titleAs", e.target.value)} required placeholder="Assamese title" /></div>
            </div>
            <div className={g3 + " mt-4"}>
              <div><Label>Exam Name {R}</Label><Input value={(form as any).examName} onChange={(e) => update("examName", e.target.value)} required placeholder="e.g. SSC CGL 2025" /></div>
              <div><Label>Result Type {R}</Label><Select value={(form as any).resultType} onChange={(e) => update("resultType", e.target.value)}>{RESULT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
              <div><Label>State {R}</Label><Select value={(form as any).state} onChange={(e) => update("state", e.target.value)}>{STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select></div>
            </div>
          </div>

          <div className={sec}>
            {h(2, "Result Details")}
            <div className={g2}>
              <div><Label>Declaring Body {R}</Label><Input value={(form as any).declaringBody} onChange={(e) => update("declaringBody", e.target.value)} required placeholder="e.g. Staff Selection Commission" /></div>
              <div><Label>Declaration Date {R}</Label><Input value={(form as any).declarationDate} onChange={(e) => update("declarationDate", e.target.value)} type="date" required /></div>
            </div>
            <div className="mt-4">
              <Label>Portal URL</Label>
              <Input value={(form as any).portalUrl} onChange={(e) => update("portalUrl", e.target.value)} type="url" placeholder="https://results.gov.in" />
            </div>
            <div className="mt-4">
              <Label>Cutoff Marks (comma separated)</Label>
              <Input value={(form as any).cutOffMarks} onChange={(e) => update("cutOffMarks", e.target.value)} placeholder="e.g. General: 120, OBC: 110, SC: 95" />
            </div>
          </div>

          <div className={sec}>
            {h(3, "Summary & Tags")}
            <div className={g2}>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Summary (English)</Label>
                  <TranslateButton text={(form as any).summaryEn} onTranslated={(v) => update("summaryAs", v)} />
                </div>
                <F value={(form as any).summaryEn} onChange={(v) => update("summaryEn", v)} placeholder="Result summary" minHeight={80} />
              </div>
              <div><Label>Summary (Assamese)</Label><F value={(form as any).summaryAs} onChange={(v) => update("summaryAs", v)} placeholder="Assamese summary" minHeight={80} /></div>
            </div>
            <div className="mt-4">
              <Label>Hashtags / Tags</Label>
              <Input value={(form as any).hashtags} onChange={(e) => update("hashtags", e.target.value)} placeholder="e.g. SSC, CGL, Result (comma-separated)" />
            </div>
          </div>
        </>)}

        {pillar === "SCHOLARSHIP" && (<>
          <div className={sec}>
            {h(1, "Basic Information")}
            <div className={g2}>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Title (English) {R}</Label>
                  <TranslateButton text={(form as any).titleEn} onTranslated={(v) => update("titleAs", v)} />
                </div>
                <Input value={(form as any).titleEn} onChange={(e) => update("titleEn", e.target.value)} required placeholder="e.g. Post Matric Scholarship for SC/ST Students" />
              </div>
              <div><Label>Title (Assamese) {R}</Label><Input value={(form as any).titleAs} onChange={(e) => update("titleAs", e.target.value)} required placeholder="Assamese title" /></div>
            </div>
            <div className={g3 + " mt-4"}>
              <div><Label>Scheme Name {R}</Label><Input value={(form as any).schemeName} onChange={(e) => update("schemeName", e.target.value)} required placeholder="e.g. Post Matric Scholarship" /></div>
              <div><Label>Provider {R}</Label><Input value={(form as any).provider} onChange={(e) => update("provider", e.target.value)} required placeholder="e.g. Government of Assam" /></div>
              <div><Label>State {R}</Label><Select value={(form as any).state} onChange={(e) => update("state", e.target.value)}>{STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select></div>
            </div>
          </div>

          <div className={sec}>
            {h(2, "Scholarship Details")}
            <div className={g2}>
              <div><Label>Amount {R}</Label><Input value={(form as any).amount} onChange={(e) => update("amount", e.target.value)} required placeholder="e.g. Up to Rs 20,000 per year" /></div>
              <div><Label>Portal URL</Label><Input value={(form as any).portalUrl} onChange={(e) => update("portalUrl", e.target.value)} type="url" placeholder="https://scholarships.gov.in" /></div>
            </div>
            <div className="mt-4">
              <Label>Eligibility {R}</Label>
              <F value={(form as any).eligibility} onChange={(v) => update("eligibility", v)} placeholder="Eligibility criteria for the scholarship" minHeight={120} />
            </div>
            <div className="mt-4">
              <Label>Application Process</Label>
              <F value={(form as any).applicationProcess} onChange={(v) => update("applicationProcess", v)} placeholder="How to apply for this scholarship" minHeight={120} />
            </div>
          </div>

          <div className={sec}>
            <div className="flex items-center justify-between mb-4">
              {h(3, "Important Dates (Optional)")}
              <button type="button" onClick={addDateRow} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">+ Add Date</button>
            </div>
            <div className="space-y-3">
              {(form as any).importantDates.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <Input value={item.label} onChange={(e) => updateDateRow(index, "label", e.target.value)} placeholder="e.g. Last Date to Apply" className="flex-1" />
                  <Input value={item.date} onChange={(e) => updateDateRow(index, "date", e.target.value)} type="date" className="w-44" />
                  {(form as any).importantDates.length > 1 && (
                    <button type="button" onClick={() => removeDateRow(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">Remove</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={sec}>
            {h(4, "Hashtags")}
            <Label>Hashtags / Tags</Label>
            <Input value={(form as any).hashtags} onChange={(e) => update("hashtags", e.target.value)} placeholder="e.g. Scholarship, SC, ST, OBC (comma-separated)" />
          </div>
        </>)}

        {pillar === "STUDY_MATERIAL" && (<>
          <div className={sec}>
            {h(1, "Basic Information")}
            <div className={g2}>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Title (English) {R}</Label>
                  <TranslateButton text={(form as any).titleEn} onTranslated={(v) => update("titleAs", v)} />
                </div>
                <Input value={(form as any).titleEn} onChange={(e) => update("titleEn", e.target.value)} required placeholder="e.g. SSC CGL 2025 Complete Syllabus" />
              </div>
              <div><Label>Title (Assamese) {R}</Label><Input value={(form as any).titleAs} onChange={(e) => update("titleAs", e.target.value)} required placeholder="Assamese title" /></div>
            </div>
            <div className={g3 + " mt-4"}>
              <div><Label>Subject</Label><Input value={(form as any).subject} onChange={(e) => update("subject", e.target.value)} placeholder="e.g. Mathematics" /></div>
              <div><Label>Exam Tag</Label><Input value={(form as any).examTag} onChange={(e) => update("examTag", e.target.value)} placeholder="e.g. SSC_CGL" /></div>
              <div><Label>Resource Type {R}</Label><Select value={(form as any).resourceType} onChange={(e) => update("resourceType", e.target.value)}>{RESOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
            </div>
          </div>

          <div className={sec}>
            {h(2, "File & Description")}
            <div className="mt-4">
              <Label>File URL {R}</Label>
              <Input value={(form as any).fileUrl} onChange={(e) => update("fileUrl", e.target.value)} type="url" required placeholder="https://example.com/syllabus.pdf" />
            </div>
            <div className="mt-4">
              <Label>Description</Label>
              <F value={(form as any).description} onChange={(v) => update("description", v)} placeholder="Describe what this study material covers" minHeight={120} />
            </div>
            <div className="mt-4">
              <Label>State {R}</Label>
              <Select value={(form as any).state} onChange={(e) => update("state", e.target.value)}>{STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select>
            </div>
          </div>

          <div className={sec}>
            {h(3, "Hashtags")}
            <Label>Hashtags / Tags</Label>
            <Input value={(form as any).hashtags} onChange={(e) => update("hashtags", e.target.value)} placeholder="e.g. Syllabus, SSC, CGL (comma-separated)" />
          </div>
        </>)}
        <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-6">
          <button type="submit" disabled={submitting}
            className="px-8 py-3 bg-[#1a6b3c] text-white font-semibold rounded-lg hover:bg-[#145230] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {submitting ? "Publishing..." : "Publish Post"}
          </button>
          <button type="button" onClick={() => router.push("/admin/posts")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >Cancel</button>
        </div>
      </form>
    </div>
  );
}
