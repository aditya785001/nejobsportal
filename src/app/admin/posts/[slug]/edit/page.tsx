"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING_REVIEW", label: "Pending Review" },
  { value: "ACTIVE", label: "Active" },
  { value: "CANCELLED", label: "Cancelled" },
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

const PILLAR_SLUGS: Record<string, string> = {
  JOB: "jobs",
  ADMISSION: "admissions",
  RESULT: "results",
  SCHOLARSHIP: "scholarships",
  STUDY_MATERIAL: "study-materials",
};

export default function EditPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pillar, setPillar] = useState<string | null>(null);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        // Try all pillar endpoints in parallel, use the first that returns data
        const endpoints = PILLAR_ENDPOINTS;
        const results = await Promise.allSettled(
          Object.entries(endpoints).map(async ([p, endpoint]) => {
            const res = await fetch(`${endpoint}/${slug}`);
            if (!res.ok) throw new Error("Not found");
            const data = await res.json();
            return { pillar: p, data };
          })
        );

        const found = results.find(
          (r) => r.status === "fulfilled"
        ) as PromiseFulfilledResult<{ pillar: string; data: any }> | undefined;

        if (!found) {
          setError("Post not found");
          setLoading(false);
          return;
        }

        const { pillar: foundPillar, data } = found.value;
        const post = data.job || data.admission || data.result || data.scholarship || data.studyMaterial || data;

        setPillar(foundPillar);

        // Build form state based on pillar
        switch (foundPillar) {
          case "JOB": {
            const feeDefault: Record<string, string> = {};
            FEE_CATEGORIES.forEach((c) => {
              feeDefault[c.key] = post.fee?.[c.key]?.toString() || "";
            });
            setForm({
              type: "JOB",
              titleEn: post.titleEn || "",
              titleAs: post.titleAs || "",
              department: post.department || "",
              state: post.state || "Assam",
              category: post.category || "StateGovt",
              jobType: post.jobType || "FullTime",
              selectionType: post.selectionType || "WrittenExam",
              totalVacancies: post.totalVacancies?.toString() || "",
              payScale: post.payScale || "",
              qualification: post.qualification || "",
              ageLimit: post.ageLimit || "",
              status: post.status || "DRAFT",
              lastDate: post.lastDate ? post.lastDate.split("T")[0] : "",
              applicationUrl: post.applicationUrl || "",
              fee: feeDefault,
              howToApplyEn: post.howToApplyEn || "",
              howToApplyAs: post.howToApplyAs || "",
              importantDates: post.importantDates?.length
                ? post.importantDates
                : [{ label: "", date: "" }],
              disclaimer: post.disclaimer || "",
              notificationPdfUrl: post.notificationPdfUrl || "",
              notificationDate: post.notificationDate
                ? post.notificationDate.split("T")[0]
                : "",
              summaryEn: post.summaryEn || "",
              summaryAs: post.summaryAs || "",
              pwdFriendly: post.pwdFriendly || false,
              pwdDetails: post.pwdDetails || "",
              hashtags: post.hashtagList?.map((h: any) => h.name).join(", ") || "",
            });
            break;
          }
          case "ADMISSION": {
            setForm({
              type: "ADMISSION",
              titleEn: post.titleEn || "",
              titleAs: post.titleAs || "",
              institution: post.institution || "",
              course: post.course || "",
              eligibility: post.eligibility || "",
              process: post.process || "",
              importantDates: post.importantDates?.length
                ? post.importantDates
                : [{ label: "", date: "" }],
              portalUrl: post.portalUrl || "",
              state: post.state || "Assam",
              status: post.status || "DRAFT",
              hashtags: post.hashtagList?.map((h: any) => h.name).join(", ") || "",
            });
            break;
          }
          case "RESULT": {
            setForm({
              type: "RESULT",
              titleEn: post.titleEn || "",
              titleAs: post.titleAs || "",
              examName: post.examName || "",
              resultType: post.resultType || "EXAM",
              declaringBody: post.declaringBody || "",
              declarationDate: post.declarationDate
                ? post.declarationDate.split("T")[0]
                : "",
              portalUrl: post.portalUrl || "",
              cutOffMarks: (post.cutOffMarks || []).join(", "),
              summaryEn: post.summaryEn || "",
              summaryAs: post.summaryAs || "",
              state: post.state || "Assam",
              status: post.status || "DRAFT",
              hashtags: post.hashtagList?.map((h: any) => h.name).join(", ") || "",
            });
            break;
          }
          case "SCHOLARSHIP": {
            setForm({
              type: "SCHOLARSHIP",
              titleEn: post.titleEn || "",
              titleAs: post.titleAs || "",
              schemeName: post.schemeName || "",
              provider: post.provider || "",
              amount: post.amount || "",
              eligibility: post.eligibility || "",
              applicationProcess: post.applicationProcess || "",
              importantDates: post.importantDates?.length
                ? post.importantDates
                : [{ label: "", date: "" }],
              portalUrl: post.portalUrl || "",
              state: post.state || "Assam",
              status: post.status || "DRAFT",
              hashtags: post.hashtagList?.map((h: any) => h.name).join(", ") || "",
            });
            break;
          }
          case "STUDY_MATERIAL": {
            setForm({
              type: "STUDY_MATERIAL",
              titleEn: post.titleEn || "",
              titleAs: post.titleAs || "",
              examTag: post.examTag || "",
              subject: post.subject || "",
              resourceType: post.resourceType || "OTHER",
              fileUrl: post.fileUrl || "",
              description: post.description || "",
              state: post.state || "Assam",
              status: post.status || "DRAFT",
              hashtags: post.hashtagList?.map((h: any) => h.name).join(", ") || "",
            });
            break;
          }
        }
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  // Auto-translate English → Assamese after 2s of inactivity (only if Assamese is empty)
  const autoTranslateTitle = useAutoTranslate(form?.titleAs || "", (v) => updateField("titleAs", v));
  const autoTranslateSummary = useAutoTranslate(form?.summaryAs || "", (v) => updateField("summaryAs", v));
  const autoTranslateHowToApply = useAutoTranslate(form?.howToApplyAs || "", (v) => updateField("howToApplyAs", v));

  const updateField = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
    // Trigger auto-translate for English fields
    if (field === "titleEn") autoTranslateTitle(value);
    else if (field === "summaryEn") autoTranslateSummary(value);
    else if (field === "howToApplyEn") autoTranslateHowToApply(value);
  };

  const updateFee = (key: string, value: string) => {
    setForm((prev: any) => ({ ...prev, fee: { ...prev.fee, [key]: value } }));
  };

  const addDateRow = () => {
    setForm((prev: any) => ({
      ...prev,
      importantDates: [...prev.importantDates, { label: "", date: "" }],
    }));
  };

  const updateDateRow = (index: number, field: "label" | "date", value: string) => {
    setForm((prev: any) => {
      const dates = [...prev.importantDates];
      dates[index] = { ...dates[index], [field]: value };
      return { ...prev, importantDates: dates };
    });
  };

  const removeDateRow = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      importantDates: prev.importantDates.filter((_: any, i: number) => i !== index),
    }));
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
    if (!pillar) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const translations = await ensureAssameseTranslation(form);

      const baseEndpoint = PILLAR_ENDPOINTS[pillar];
      const f = form;
      const hashtags = (f.hashtags || "")
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);

      let payload: Record<string, any> = {};

      if (pillar === "JOB") {
        const fee: Record<string, number> = {};
        for (const [key, val] of Object.entries(f.fee)) {
          const num = parseFloat(val as string);
          if (!isNaN(num)) fee[key] = num;
        }
        payload = {
          titleEn: f.titleEn, titleAs: translations.titleAs ?? f.titleAs, department: f.department,
          state: f.state, category: f.category, jobType: f.jobType,
          selectionType: f.selectionType,
          totalVacancies: f.totalVacancies ? parseInt(f.totalVacancies) : null,
          payScale: f.payScale || null, qualification: f.qualification,
          ageLimit: f.ageLimit || null,
          status: f.status,
          lastDate: new Date(f.lastDate).toISOString(),
          applicationUrl: f.applicationUrl, fee,
          howToApplyEn: f.howToApplyEn, howToApplyAs: translations.howToApplyAs ?? f.howToApplyAs,
          importantDates: f.importantDates.filter((d: any) => d.label && d.date),
          disclaimer: f.disclaimer,
          notificationPdfUrl: f.notificationPdfUrl || null,
          notificationDate: f.notificationDate ? new Date(f.notificationDate).toISOString() : null,
          summaryEn: f.summaryEn, summaryAs: translations.summaryAs ?? f.summaryAs,
          pwdFriendly: f.pwdFriendly, pwdDetails: f.pwdDetails || null, hashtags,
        };
      } else if (pillar === "ADMISSION") {
        payload = {
          titleEn: f.titleEn, titleAs: translations.titleAs ?? f.titleAs, institution: f.institution,
          course: f.course, eligibility: f.eligibility, process: f.process || null,
          importantDates: f.importantDates.filter((d: any) => d.label && d.date),
          portalUrl: f.portalUrl || null, state: f.state,
          status: f.status, hashtags,
        };
      } else if (pillar === "RESULT") {
        payload = {
          titleEn: f.titleEn, titleAs: translations.titleAs ?? f.titleAs, examName: f.examName,
          resultType: f.resultType, declaringBody: f.declaringBody, state: f.state,
          declarationDate: new Date(f.declarationDate).toISOString(),
          portalUrl: f.portalUrl || null,
          cutOffMarks: f.cutOffMarks ? f.cutOffMarks.split(",").map((s: string) => s.trim()) : [],
          summaryEn: f.summaryEn || null, summaryAs: translations.summaryAs ?? (f.summaryAs || null),
          status: f.status, hashtags,
        };
      } else if (pillar === "SCHOLARSHIP") {
        payload = {
          titleEn: f.titleEn, titleAs: translations.titleAs ?? f.titleAs, schemeName: f.schemeName,
          provider: f.provider, amount: f.amount, eligibility: f.eligibility,
          applicationProcess: f.applicationProcess || null,
          importantDates: f.importantDates.filter((d: any) => d.label && d.date),
          portalUrl: f.portalUrl || null, state: f.state,
          status: f.status, hashtags,
        };
      } else if (pillar === "STUDY_MATERIAL") {
        payload = {
          titleEn: f.titleEn, titleAs: translations.titleAs ?? f.titleAs, examTag: f.examTag || null,
          subject: f.subject || null, resourceType: f.resourceType,
          fileUrl: f.fileUrl, description: f.description || null,
          state: f.state, status: f.status, hashtags,
        };
      }

      const res = await fetch(`${baseEndpoint}/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess("Post updated successfully!");
        setTimeout(() => router.push("/admin/posts"), 1500);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to update post");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Shared UI helpers
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

  if (loading) {
    return (
      <div className="p-6 max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-96 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="p-6 max-w-5xl">
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚠</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Post not found</h2>
          <Link href="/admin/posts" className="text-[#1a6b3c] hover:underline">
            ← Back to posts
          </Link>
        </div>
      </div>
    );
  }

  const pillarLabel = PILLARS.find((p) => p.value === pillar)?.label || "Unknown";

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-sm text-gray-500 mt-1">
            Editing: <span className="font-medium">{form?.titleEn}</span>
            {pillar && (
              <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                {pillarLabel}
              </span>
            )}
          </p>
        </div>
        {pillar && (
          <Link
            href={`/${PILLAR_SLUGS[pillar]}/${slug}`}
            target="_blank"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 no-underline text-sm"
          >
            Preview ↗
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {success && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>
      )}

      {form && pillar && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Status */}
          <div className={sec}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Post Status</h2>
            <Select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="max-w-xs">
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </div>

          {pillar === "JOB" && (<>
            <div className={sec}>
              {h(1, "Basic Information")}
              <div className={g2}>
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Title (English) {R}</Label>
                    <TranslateButton text={form.titleEn} onTranslated={(v) => updateField("titleAs", v)} />
                  </div>
                  <Input value={form.titleEn} onChange={(e) => updateField("titleEn", e.target.value)} required placeholder="e.g. Assam Police Constable Recruitment 2026" />
                </div>
                <div><Label>Title (Assamese) {R}</Label><Input value={form.titleAs} onChange={(e) => updateField("titleAs", e.target.value)} required placeholder="Assamese title here" /></div>
              </div>
              <div className={g3 + " mt-4"}>
                <div><Label>Department / Board {R}</Label><Input value={form.department} onChange={(e) => updateField("department", e.target.value)} required placeholder="e.g. Assam Public Service Commission" /></div>
                <div><Label>State {R}</Label><Select value={form.state} onChange={(e) => updateField("state", e.target.value)}>{STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select></div>
                <div><Label>Category {R}</Label><Select value={form.category} onChange={(e) => updateField("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</Select></div>
              </div>
            </div>

            <div className={sec}>
              {h(2, "Job Details")}
              <div className={g3}>
                <div><Label>Job Type</Label><Select value={form.jobType} onChange={(e) => updateField("jobType", e.target.value)}>{JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
                <div><Label>Selection Type</Label><Select value={form.selectionType} onChange={(e) => updateField("selectionType", e.target.value)}>{SELECTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
                <div><Label>Total Vacancies</Label><Input value={form.totalVacancies} onChange={(e) => updateField("totalVacancies", e.target.value)} type="number" min="1" placeholder="e.g. 500" /></div>
              </div>
              <div className={g2 + " mt-4"}>
                <div><Label>Pay Scale</Label><Input value={form.payScale} onChange={(e) => updateField("payScale", e.target.value)} placeholder="e.g. Rs 30,000 - Rs 1,20,000" /></div>
                <div><Label>Age Limit</Label><Input value={form.ageLimit} onChange={(e) => updateField("ageLimit", e.target.value)} placeholder="e.g. 18-38 years" /></div>
              </div>
              <div className="mt-4">
                <Label>Qualification {R}</Label>
                <F value={form.qualification} onChange={(v) => updateField("qualification", v)} placeholder="e.g. Graduate in any discipline from a recognized university" minHeight={100} />
              </div>
            </div>

            <div className={sec}>
              {h(3, "Dates & Application")}
              <div className={g2}>
                <div><Label>Last Date to Apply {R}</Label><Input value={form.lastDate} onChange={(e) => updateField("lastDate", e.target.value)} type="date" required /></div>
                <div><Label>Notification Date</Label><Input value={form.notificationDate} onChange={(e) => updateField("notificationDate", e.target.value)} type="date" /></div>
              </div>
              <div className={g2 + " mt-4"}>
                <div><Label>Application URL {R}</Label><Input value={form.applicationUrl} onChange={(e) => updateField("applicationUrl", e.target.value)} type="url" required placeholder="https://official-website.gov.in" /></div>
                <div><Label>Notification PDF URL</Label><Input value={form.notificationPdfUrl} onChange={(e) => updateField("notificationPdfUrl", e.target.value)} type="url" placeholder="https://example.com/notification.pdf" /></div>
              </div>
              <div className="mt-4">
                <Label>Application Fee (Rs)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {FEE_CATEGORIES.map((cat) => (
                    <div key={cat.key}>
                      <label className="block text-xs text-gray-500 mb-1 capitalize">{cat.label}</label>
                      <Input value={form.fee[cat.key]} onChange={(e) => updateFee(cat.key, e.target.value)} type="number" min="0" placeholder="0" />
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
                {form.importantDates.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input value={item.label} onChange={(e) => updateDateRow(index, "label", e.target.value)} placeholder="e.g. Admit Card Release" className="flex-1" />
                    <Input value={item.date} onChange={(e) => updateDateRow(index, "date", e.target.value)} type="date" className="w-44" />
                    {form.importantDates.length > 1 && (
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
                    <TranslateButton text={form.howToApplyEn} onTranslated={(v) => updateField("howToApplyAs", v)} />
                  </div>
                  <F value={form.howToApplyEn} onChange={(v) => updateField("howToApplyEn", v)} placeholder="1. Visit official website&#10;2. Click on Apply Online" minHeight={150} />
                </div>
                <div><Label>How to Apply (Assamese) {R}</Label><F value={form.howToApplyAs} onChange={(v) => updateField("howToApplyAs", v)} placeholder="Assamese translation" minHeight={150} /></div>
              </div>
            </div>

            <div className={sec}>
              {h(6, "Summary & Tags")}
              <div className={g2}>
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Summary (English)</Label>
                    <TranslateButton text={form.summaryEn} onTranslated={(v) => updateField("summaryAs", v)} />
                  </div>
                  <F value={form.summaryEn} onChange={(v) => updateField("summaryEn", v)} placeholder="Brief description" minHeight={100} />
                </div>
                <div><Label>Summary (Assamese)</Label><F value={form.summaryAs} onChange={(v) => updateField("summaryAs", v)} placeholder="Assamese summary" minHeight={100} /></div>
              </div>
              <div className="mt-4">
                <Label>Hashtags / Tags</Label>
                <Input value={form.hashtags} onChange={(e) => updateField("hashtags", e.target.value)} placeholder="e.g. AssamPolice, GovtJobs, APSC (comma-separated)" />
              </div>
            </div>

            <div className={sec}>
              {h(7, "Additional Settings")}
              <div><Label>Disclaimer</Label><F value={form.disclaimer} onChange={(v) => updateField("disclaimer", v)} minHeight={80} /></div>
              <div className="mt-4 flex items-start gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.pwdFriendly} onChange={(e) => updateField("pwdFriendly", e.target.checked)} className="w-4 h-4 text-[#1a6b3c] rounded focus:ring-[#1a6b3c]" />
                  <span className="text-sm font-medium text-gray-700">PWD Friendly</span>
                </label>
                {form.pwdFriendly && (
                  <div className="flex-1"><Input value={form.pwdDetails} onChange={(e) => updateField("pwdDetails", e.target.value)} placeholder="PWD details / accommodations" /></div>
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
                    <TranslateButton text={form.titleEn} onTranslated={(v) => updateField("titleAs", v)} />
                  </div>
                  <Input value={form.titleEn} onChange={(e) => updateField("titleEn", e.target.value)} required placeholder="e.g. Gauhati University B.Ed Admission 2026" />
                </div>
                <div><Label>Title (Assamese) {R}</Label><Input value={form.titleAs} onChange={(e) => updateField("titleAs", e.target.value)} required placeholder="Assamese title" /></div>
              </div>
              <div className={g3 + " mt-4"}>
                <div><Label>Institution {R}</Label><Input value={form.institution} onChange={(e) => updateField("institution", e.target.value)} required placeholder="e.g. Gauhati University" /></div>
                <div><Label>Course {R}</Label><Input value={form.course} onChange={(e) => updateField("course", e.target.value)} required placeholder="e.g. B.Ed" /></div>
                <div><Label>State {R}</Label><Select value={form.state} onChange={(e) => updateField("state", e.target.value)}>{STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select></div>
              </div>
            </div>

            <div className={sec}>
              {h(2, "Admission Details")}
              <div className="mt-4">
                <Label>Eligibility {R}</Label>
                <F value={form.eligibility} onChange={(v) => updateField("eligibility", v)} placeholder="Minimum qualification required for admission" minHeight={120} />
              </div>
              <div className="mt-4">
                <Label>Admission Process</Label>
                <F value={form.process} onChange={(v) => updateField("process", v)} placeholder="Steps for admission process" minHeight={120} />
              </div>
              <div className="mt-4">
                <Label>Portal URL</Label>
                <Input value={form.portalUrl} onChange={(e) => updateField("portalUrl", e.target.value)} type="url" placeholder="https://official-admission-portal.edu.in" />
              </div>
            </div>

            <div className={sec}>
              <div className="flex items-center justify-between mb-4">
                {h(3, "Important Dates (Optional)")}
                <button type="button" onClick={addDateRow} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">+ Add Date</button>
              </div>
              <div className="space-y-3">
                {form.importantDates.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input value={item.label} onChange={(e) => updateDateRow(index, "label", e.target.value)} placeholder="e.g. Application Start" className="flex-1" />
                    <Input value={item.date} onChange={(e) => updateDateRow(index, "date", e.target.value)} type="date" className="w-44" />
                    {form.importantDates.length > 1 && (
                      <button type="button" onClick={() => removeDateRow(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">Remove</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={sec}>
              {h(4, "Hashtags")}
              <Label>Hashtags / Tags</Label>
              <Input value={form.hashtags} onChange={(e) => updateField("hashtags", e.target.value)} placeholder="e.g. Admission, University (comma-separated)" />
            </div>
          </>)}

          {pillar === "RESULT" && (<>
            <div className={sec}>
              {h(1, "Basic Information")}
              <div className={g2}>
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Title (English) {R}</Label>
                    <TranslateButton text={form.titleEn} onTranslated={(v) => updateField("titleAs", v)} />
                  </div>
                  <Input value={form.titleEn} onChange={(e) => updateField("titleEn", e.target.value)} required placeholder="e.g. SSC CGL 2025 Result Declared" />
                </div>
                <div><Label>Title (Assamese) {R}</Label><Input value={form.titleAs} onChange={(e) => updateField("titleAs", e.target.value)} required placeholder="Assamese title" /></div>
              </div>
              <div className={g3 + " mt-4"}>
                <div><Label>Exam Name {R}</Label><Input value={form.examName} onChange={(e) => updateField("examName", e.target.value)} required placeholder="e.g. SSC CGL 2025" /></div>
                <div><Label>Result Type {R}</Label><Select value={form.resultType} onChange={(e) => updateField("resultType", e.target.value)}>{RESULT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
                <div><Label>State {R}</Label><Select value={form.state} onChange={(e) => updateField("state", e.target.value)}>{STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select></div>
              </div>
            </div>

            <div className={sec}>
              {h(2, "Result Details")}
              <div className={g2}>
                <div><Label>Declaring Body {R}</Label><Input value={form.declaringBody} onChange={(e) => updateField("declaringBody", e.target.value)} required placeholder="e.g. Staff Selection Commission" /></div>
                <div><Label>Declaration Date {R}</Label><Input value={form.declarationDate} onChange={(e) => updateField("declarationDate", e.target.value)} type="date" required /></div>
              </div>
              <div className="mt-4">
                <Label>Portal URL</Label>
                <Input value={form.portalUrl} onChange={(e) => updateField("portalUrl", e.target.value)} type="url" placeholder="https://results.gov.in" />
              </div>
              <div className="mt-4">
                <Label>Cutoff Marks (comma separated)</Label>
                <Input value={form.cutOffMarks} onChange={(e) => updateField("cutOffMarks", e.target.value)} placeholder="e.g. General: 120, OBC: 110, SC: 95" />
              </div>
            </div>

            <div className={sec}>
              {h(3, "Summary & Tags")}
              <div className={g2}>
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Summary (English)</Label>
                    <TranslateButton text={form.summaryEn} onTranslated={(v) => updateField("summaryAs", v)} />
                  </div>
                  <F value={form.summaryEn} onChange={(v) => updateField("summaryEn", v)} placeholder="Result summary" minHeight={80} />
                </div>
                <div><Label>Summary (Assamese)</Label><F value={form.summaryAs} onChange={(v) => updateField("summaryAs", v)} placeholder="Assamese summary" minHeight={80} /></div>
              </div>
              <div className="mt-4">
                <Label>Hashtags / Tags</Label>
                <Input value={form.hashtags} onChange={(e) => updateField("hashtags", e.target.value)} placeholder="e.g. SSC, CGL, Result (comma-separated)" />
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
                    <TranslateButton text={form.titleEn} onTranslated={(v) => updateField("titleAs", v)} />
                  </div>
                  <Input value={form.titleEn} onChange={(e) => updateField("titleEn", e.target.value)} required placeholder="e.g. Post Matric Scholarship for SC/ST Students" />
                </div>
                <div><Label>Title (Assamese) {R}</Label><Input value={form.titleAs} onChange={(e) => updateField("titleAs", e.target.value)} required placeholder="Assamese title" /></div>
              </div>
              <div className={g3 + " mt-4"}>
                <div><Label>Scheme Name {R}</Label><Input value={form.schemeName} onChange={(e) => updateField("schemeName", e.target.value)} required placeholder="e.g. Post Matric Scholarship" /></div>
                <div><Label>Provider {R}</Label><Input value={form.provider} onChange={(e) => updateField("provider", e.target.value)} required placeholder="e.g. Government of Assam" /></div>
                <div><Label>State {R}</Label><Select value={form.state} onChange={(e) => updateField("state", e.target.value)}>{STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select></div>
              </div>
            </div>

            <div className={sec}>
              {h(2, "Scholarship Details")}
              <div className={g2}>
                <div><Label>Amount {R}</Label><Input value={form.amount} onChange={(e) => updateField("amount", e.target.value)} required placeholder="e.g. Up to Rs 20,000 per year" /></div>
                <div><Label>Portal URL</Label><Input value={form.portalUrl} onChange={(e) => updateField("portalUrl", e.target.value)} type="url" placeholder="https://scholarships.gov.in" /></div>
              </div>
              <div className="mt-4">
                <Label>Eligibility {R}</Label>
                <F value={form.eligibility} onChange={(v) => updateField("eligibility", v)} placeholder="Eligibility criteria for the scholarship" minHeight={120} />
              </div>
              <div className="mt-4">
                <Label>Application Process</Label>
                <F value={form.applicationProcess} onChange={(v) => updateField("applicationProcess", v)} placeholder="How to apply for this scholarship" minHeight={120} />
              </div>
            </div>

            <div className={sec}>
              <div className="flex items-center justify-between mb-4">
                {h(3, "Important Dates (Optional)")}
                <button type="button" onClick={addDateRow} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">+ Add Date</button>
              </div>
              <div className="space-y-3">
                {form.importantDates.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input value={item.label} onChange={(e) => updateDateRow(index, "label", e.target.value)} placeholder="e.g. Last Date to Apply" className="flex-1" />
                    <Input value={item.date} onChange={(e) => updateDateRow(index, "date", e.target.value)} type="date" className="w-44" />
                    {form.importantDates.length > 1 && (
                      <button type="button" onClick={() => removeDateRow(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">Remove</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={sec}>
              {h(4, "Hashtags")}
              <Label>Hashtags / Tags</Label>
              <Input value={form.hashtags} onChange={(e) => updateField("hashtags", e.target.value)} placeholder="e.g. Scholarship, SC, ST, OBC (comma-separated)" />
            </div>
          </>)}

          {pillar === "STUDY_MATERIAL" && (<>
            <div className={sec}>
              {h(1, "Basic Information")}
              <div className={g2}>
                <div>
                  <div className="flex items-center justify-between">
                    <Label>Title (English) {R}</Label>
                    <TranslateButton text={form.titleEn} onTranslated={(v) => updateField("titleAs", v)} />
                  </div>
                  <Input value={form.titleEn} onChange={(e) => updateField("titleEn", e.target.value)} required placeholder="e.g. SSC CGL 2025 Complete Syllabus" />
                </div>
                <div><Label>Title (Assamese) {R}</Label><Input value={form.titleAs} onChange={(e) => updateField("titleAs", e.target.value)} required placeholder="Assamese title" /></div>
              </div>
              <div className={g3 + " mt-4"}>
                <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => updateField("subject", e.target.value)} placeholder="e.g. Mathematics" /></div>
                <div><Label>Exam Tag</Label><Input value={form.examTag} onChange={(e) => updateField("examTag", e.target.value)} placeholder="e.g. SSC_CGL" /></div>
                <div><Label>Resource Type {R}</Label><Select value={form.resourceType} onChange={(e) => updateField("resourceType", e.target.value)}>{RESOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select></div>
              </div>
            </div>

            <div className={sec}>
              {h(2, "File & Description")}
              <div className="mt-4">
                <Label>File URL {R}</Label>
                <Input value={form.fileUrl} onChange={(e) => updateField("fileUrl", e.target.value)} type="url" required placeholder="https://example.com/syllabus.pdf" />
              </div>
              <div className="mt-4">
                <Label>Description</Label>
                <F value={form.description} onChange={(v) => updateField("description", v)} placeholder="Describe what this study material covers" minHeight={120} />
              </div>
              <div className="mt-4">
                <Label>State {R}</Label>
                <Select value={form.state} onChange={(e) => updateField("state", e.target.value)}>{STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select>
              </div>
            </div>

            <div className={sec}>
              {h(3, "Hashtags")}
              <Label>Hashtags / Tags</Label>
              <Input value={form.hashtags} onChange={(e) => updateField("hashtags", e.target.value)} placeholder="e.g. Syllabus, SSC, CGL (comma-separated)" />
            </div>
          </>)}

          {/* Submit */}
          <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-6">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-[#1a6b3c] text-white font-semibold rounded-lg hover:bg-[#145230] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/posts"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm no-underline"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
