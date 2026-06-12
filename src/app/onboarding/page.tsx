"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const EXAMS = [
  "APSC (Assam Public Service Commission)",
  "ADRE (Assam Direct Recruitment Exam)",
  "UPSC Civil Services",
  "SSC CGL / CHSL / MTS",
  "Banking (IBPS, SBI, RBI)",
  "Railway (RRB NTPC, ALP, Group D)",
  "Defense (Army, Navy, Air Force)",
  "Police (Assam Police, SSB, CRPF)",
  "Teaching (TET, CTET, NET)",
  "NEET / Medical",
  "Engineering (JEE, Assam CEE)",
  "State Govt (Other States)",
  "Central Govt (Other Exams)",
  "Not Sure Yet",
  "Other",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [targetExam, setTargetExam] = useState("");
  const [customExam, setCustomExam] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.onboardingDone) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned && cleaned.length !== 10) {
      setPhoneError("Enter a valid 10-digit mobile number");
    } else {
      setPhoneError("");
    }
    return cleaned;
  };

  const handleSubmit = async () => {
    const cleaned = phone.replace(/\D/g, "");
    if (!cleaned || cleaned.length !== 10) {
      setPhoneError("Enter a valid 10-digit mobile number");
      return;
    }
    setPhoneError("");

    setIsSubmitting(true);
    try {
      const exam = targetExam === "Other" ? customExam : targetExam;
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleaned,
          targetExam: exam || undefined,
        }),
      });

      if (res.ok) {
        // Update the session so the JWT reflects onboardingDone = true
        await update();
        router.push("/dashboard");
      } else {
        const data = await res.json();
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#1a6b3c] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👋</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {session?.user?.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-gray-600">
            Just a couple of details to personalize your experience
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? "bg-[#1a6b3c] text-white" : "bg-gray-200 text-gray-500"
            }`}>1</div>
            <div className="w-12 h-0.5 bg-gray-200">
              <div className={`h-full bg-[#1a6b3c] transition-all ${step >= 2 ? "w-full" : "w-0"}`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? "bg-[#1a6b3c] text-white" : "bg-gray-200 text-gray-500"
            }`}>2</div>
          </div>

          {/* Step 1: Target Exam */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Which exam are you preparing for?
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                We&apos;ll send you tailored updates and resources
              </p>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {EXAMS.map((exam) => (
                  <button
                    key={exam}
                    onClick={() => {
                      setTargetExam(exam);
                      if (exam !== "Other") {
                        setStep(2);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                      targetExam === exam
                        ? "border-[#1a6b3c] bg-green-50 text-[#1a6b3c] font-medium"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    {exam}
                  </button>
                ))}
              </div>

              {targetExam === "Other" && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={customExam}
                    onChange={(e) => setCustomExam(e.target.value)}
                    placeholder="Type your exam name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => customExam.trim() && setStep(2)}
                    disabled={!customExam.trim()}
                    className="mt-3 w-full px-4 py-3 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] disabled:opacity-50 transition-colors font-medium text-sm"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Phone Number */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Your mobile number
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Required for WhatsApp & SMS job alerts
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(value);
                      validatePhone(value);
                    }}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] text-sm"
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                )}
                <p className="text-gray-400 text-xs mt-1">
                  We&apos;ll send you WhatsApp job alerts and updates on this number.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] disabled:opacity-50 transition-colors font-medium text-sm"
                >
                  {isSubmitting ? "Saving..." : "Complete Profile →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Phone is required for WhatsApp job alerts */}
      </div>
    </div>
  );
}
