export const JOB_CATEGORIES = [
  { value: "StateGovt", label: "State Govt", labelAs: "ৰাজ্য চৰকাৰ" },
  { value: "CentralGovt", label: "Central Govt", labelAs: "কেন্দ্ৰীয় চৰকাৰ" },
  { value: "Private", label: "Private", labelAs: "ব্যক্তিগত" },
  { value: "NGO", label: "NGO", labelAs: "এন জি অ' " },
  { value: "PublicSector", label: "Public Sector", labelAs: "ৰাজহুৱা খণ্ড" },
  { value: "Defense", label: "Defense", labelAs: "প্ৰতিৰক্ষা" },
  { value: "Banking", label: "Banking", labelAs: "বেংকিং" },
  { value: "Teaching", label: "Teaching", labelAs: "শিক্ষকতা" },
  { value: "Research", label: "Research", labelAs: "গৱেষণা" },
] as const;

export const SELECTION_TYPES = [
  { value: "WrittenExam", label: "Written Exam", labelAs: "লিখিত পৰীক্ষা" },
  { value: "Interview", label: "Interview", labelAs: "সাক্ষাৎকাৰ" },
  { value: "Merit", label: "Merit", labelAs: "মেৰিট" },
  { value: "WalkInInterview", label: "Walk-in Interview", labelAs: "ৱাক-ইন সাক্ষাৎকাৰ" },
  { value: "PhysicalTest", label: "Physical Test", labelAs: "শাৰীৰিক পৰীক্ষা" },
  { value: "TradeTest", label: "Trade Test", labelAs: "ট্ৰেড টেষ্ট" },
  { value: "SkillTest", label: "Skill Test", labelAs: "দক্ষতা পৰীক্ষা" },
  { value: "DocumentVerification", label: "Document Verification", labelAs: "নথি পৰীক্ষণ" },
  { value: "Combined", label: "Combined", labelAs: "সংযুক্ত" },
] as const;

export const JOB_TYPES = [
  { value: "FullTime", label: "Full Time", labelAs: "পূৰ্ণকালীন" },
  { value: "PartTime", label: "Part Time", labelAs: "অংশকালীন" },
  { value: "Contract", label: "Contract", labelAs: "চুক্তি" },
  { value: "WalkIn", label: "Walk-in", labelAs: "ৱাক-ইন" },
  { value: "Internship", label: "Internship", labelAs: "ইণ্টাৰ্ণশ্বিপ" },
  { value: "Remote", label: "Remote", labelAs: "দূৰৱৰ্তী" },
] as const;

export const PILLAR_LABELS: Record<string, { en: string; as: string }> = {
  JOB: { en: "Jobs", as: "চাকৰি" },
  RESULT: { en: "Results", as: "ফলাফল" },
  ADMISSION: { en: "Admissions", as: "ভৰ্তি" },
  SCHOLARSHIP: { en: "Scholarships", as: "ছাত্ৰবৃত্তি" },
  STUDY_MATERIAL: { en: "Study Materials", as: "অধ্যয়ন সামগ্ৰী" },
  EXAM_PREP: { en: "Exam Prep", as: "পৰীক্ষা প্ৰস্তুতি" },
};
