"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ResumeData, TemplateId, SavedResume } from "@/components/resume-builder/types";
import { EMPTY_RESUME, TEMPLATES } from "@/components/resume-builder/types";
import { ResumePreview, ResumePrintView } from "@/components/resume-builder/ResumePreview";
import { ResumeForm } from "@/components/resume-builder/ResumeForm";
import { TEMPLATE_COMPONENTS } from "@/components/resume-builder/templates";
import { SAMPLE_RESUMES } from "@/components/resume-builder/sample-resumes";

export default function ResumeBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [templateId, setTemplateId] = useState<TemplateId>("govt");
  const [resumeName, setResumeName] = useState("");
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [showPrintView, setShowPrintView] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/resume-builder");
    }
  }, [status, router]);

  // Load saved resumes list
  const loadResumeList = useCallback(async () => {
    try {
      const res = await fetch("/api/resume");
      if (res.ok) {
        const data = await res.json();
        setSavedResumes(data.resumes || []);
      }
    } catch (err) {
      console.error("Failed to load resumes:", err);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadResumeList();
  }, [status, loadResumeList]);

  // Load a specific resume
  const handleLoad = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/resume?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        const resume = data.resume;
        setResumeData(resume.data as ResumeData);
        setTemplateId((resume.template as TemplateId) || "govt");
        setResumeName(resume.name);
      }
    } catch (err) {
      console.error("Failed to load resume:", err);
    }
  }, []);

  // Save current resume
  const handleSave = useCallback(async () => {
    if (!resumeName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resumeName,
          template: templateId,
          data: resumeData,
        }),
      });
      if (res.ok) {
        await loadResumeList();
      }
    } catch (err) {
      console.error("Failed to save resume:", err);
    } finally {
      setSaving(false);
    }
  }, [resumeName, templateId, resumeData, loadResumeList]);

  // Delete a resume
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this resume?")) return;
    try {
      const res = await fetch(`/api/resume?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadResumeList();
        // If we deleted the currently loaded resume, reset
        setResumeData(EMPTY_RESUME);
        setResumeName("");
        setTemplateId("govt");
      }
    } catch (err) {
      console.error("Failed to delete resume:", err);
    }
  }, [loadResumeList]);

  // Print / PDF download
  const handlePrint = useCallback(() => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 100);
  }, []);

  const handleTemplateChange = useCallback((id: string) => {
    setTemplateId(id as TemplateId);
  }, []);

  if (status === "loading") {
    return (
      <div className="container-main py-12">
        <div className="h-8 w-48 skeleton mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[600px] skeleton rounded-xl" />
          <div className="h-[600px] skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const config = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

  return (
    <>
      {/* Print-only full-size view */}
      {showPrintView && (
        <div className="print-only" ref={printRef}>
          <ResumePrintView data={resumeData} templateId={templateId} />
        </div>
      )}

      <div className="hide-on-print">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white">
          <div className="container-main py-6 md:py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Resume Builder</h1>
                <p className="text-sm text-green-100 mt-1">
                  Create professional, ATS-friendly resumes tailored for your target career
                </p>
              </div>
              <button
                onClick={handlePrint}
                disabled={!resumeData.personalInfo.fullName}
                className="px-5 py-2.5 bg-white text-[#1a6b3c] rounded-lg hover:bg-green-50 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                📥 Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Template Selector Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container-main">
            <div className="flex gap-1 overflow-x-auto py-2 items-center">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
                    templateId === t.id
                      ? "bg-[#1a6b3c] text-white shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span className="font-medium">{t.name}</span>
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1 pl-2 border-l border-gray-200">
                <span className="text-xs text-gray-400 hidden sm:inline">Sample:</span>
                <select
                  onChange={(e) => {
                    const sample = SAMPLE_RESUMES.find((s) => s.id === e.target.value);
                    if (sample) {
                      setResumeData(sample.data);
                      setTemplateId(sample.id);
                      setResumeName(sample.label);
                    }
                  }}
                  defaultValue=""
                  className="text-xs border border-gray-300 rounded px-2 py-1.5 bg-white text-gray-700 max-w-[140px]"
                >
                  <option value="" disabled>Load sample...</option>
                  {SAMPLE_RESUMES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tab Toggle */}
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
                activeTab === "form" ? "text-[#1a6b3c] border-b-2 border-[#1a6b3c]" : "text-gray-500"
              }`}
            >
              ✏️ Edit Data
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
                activeTab === "preview" ? "text-[#1a6b3c] border-b-2 border-[#1a6b3c]" : "text-gray-500"
              }`}
            >
              👁️ Preview ({config.name})
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-main py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: "calc(100vh - 300px)" }}>
            {/* Form Panel */}
            <div className={`${activeTab === "form" ? "block" : "hidden"} lg:block h-full`}>
              <div className="bg-white rounded-xl border border-gray-200 h-full" style={{ maxHeight: "calc(100vh - 240px)" }}>
                <ResumeForm
                  data={resumeData}
                  onChange={setResumeData}
                  templateId={templateId}
                  onTemplateChange={handleTemplateChange}
                  resumeName={resumeName}
                  onResumeNameChange={setResumeName}
                  onSave={handleSave}
                  saving={saving}
                  savedResumes={savedResumes}
                  onLoad={handleLoad}
                  onDelete={handleDelete}
                />
              </div>
            </div>

            {/* Preview Panel */}
            <div className={`${activeTab === "preview" ? "block" : "hidden"} lg:block`}>
              <div className="bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden" style={{ minHeight: 500, height: "calc(100vh - 240px)" }}>
                <ResumePreview data={resumeData} templateId={templateId} />
              </div>
              {/* Current template info */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{config.name}</p>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </div>
                </div>
                <button
                  onClick={handlePrint}
                  disabled={!resumeData.personalInfo.fullName}
                  className="px-4 py-2 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📥 PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .hide-on-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          @page { margin: 0; size: A4; }
        }
        @media screen {
          .print-only { display: none; }
        }
        .resume-page {
          line-height: 1.3;
        }
        .resume-page * {
          box-sizing: border-box;
        }
        .skeleton {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
