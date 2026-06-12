export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  title: string;
  summary: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "native" | "fluent" | "intermediate" | "basic";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  url: string;
}

export interface ResumeData {
  photo: string; // base64 data URL
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  projects: Project[];
  references: string;
}

export interface SavedResume {
  id: string;
  name: string;
  template: string;
  data: ResumeData;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TemplateId =
  | "govt"
  | "banking"
  | "it"
  | "teaching"
  | "medical"
  | "engineering"
  | "general";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  category: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    bg: string;
    sidebar: string;
  };
}

export const EMPTY_RESUME: ResumeData = {
  photo: "",
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    website: "",
    title: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  certifications: [],
  languages: [],
  projects: [],
  references: "",
};

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "govt",
    name: "Government",
    description: "Formal & professional — ideal for Sarkari Naukri, APSC, SSC, UPSC applications",
    category: "Government Jobs",
    icon: "🏛️",
    colors: {
      primary: "#1a6b3c",
      secondary: "#145230",
      accent: "#e07b00",
      text: "#1f2937",
      bg: "#ffffff",
      sidebar: "#1a6b3c",
    },
  },
  {
    id: "banking",
    name: "Banking & Finance",
    description: "Clean corporate style for IBPS, SBI, RBI, banking sector roles",
    category: "Banking/Finance",
    icon: "🏦",
    colors: {
      primary: "#1e3a5f",
      secondary: "#15294a",
      accent: "#c9a84c",
      text: "#1f2937",
      bg: "#ffffff",
      sidebar: "#1e3a5f",
    },
  },
  {
    id: "it",
    name: "IT & Tech",
    description: "Modern & sleek for software, IT, and technology positions",
    category: "IT/Tech",
    icon: "💻",
    colors: {
      primary: "#2563eb",
      secondary: "#1d4ed8",
      accent: "#06b6d4",
      text: "#1f2937",
      bg: "#f8fafc",
      sidebar: "#2563eb",
    },
  },
  {
    id: "teaching",
    name: "Teaching & Academic",
    description: "Traditional layout ideal for professors, lecturers, education roles",
    category: "Teaching/Education",
    icon: "📚",
    colors: {
      primary: "#7c3aed",
      secondary: "#6d28d9",
      accent: "#f59e0b",
      text: "#1f2937",
      bg: "#ffffff",
      sidebar: "#7c3aed",
    },
  },
  {
    id: "medical",
    name: "Medical & Healthcare",
    description: "Clean & clinical for doctors, nurses, healthcare professionals",
    category: "Medical/Healthcare",
    icon: "⚕️",
    colors: {
      primary: "#0d9488",
      secondary: "#0f766e",
      accent: "#2dd4bf",
      text: "#1f2937",
      bg: "#ffffff",
      sidebar: "#0d9488",
    },
  },
  {
    id: "engineering",
    name: "Engineering & Technical",
    description: "Technical-focused layout for engineers, architects, technical roles",
    category: "Engineering",
    icon: "⚙️",
    colors: {
      primary: "#dc2626",
      secondary: "#b91c1c",
      accent: "#f97316",
      text: "#1f2937",
      bg: "#ffffff",
      sidebar: "#dc2626",
    },
  },
  {
    id: "general",
    name: "Compact Classic",
    description: "Ultra-efficient 1-page format — fits maximum info in minimum space",
    category: "General",
    icon: "📄",
    colors: {
      primary: "#374151",
      secondary: "#1f2937",
      accent: "#059669",
      text: "#1f2937",
      bg: "#ffffff",
      sidebar: "#374151",
    },
  },
];

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
] as const;

export const LANGUAGE_PROFICIENCIES = [
  { value: "native", label: "Native" },
  { value: "fluent", label: "Fluent" },
  { value: "intermediate", label: "Intermediate" },
  { value: "basic", label: "Basic" },
] as const;

export const SKILL_CATEGORIES = [
  "Technical",
  "Management",
  "Language",
  "Software",
  "Soft Skills",
  "Other",
];

let _idCounter = 0;
export function genId(): string {
  return `res_${++_idCounter}_${Date.now()}`;
}
