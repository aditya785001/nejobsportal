export const siteConfig = {
  name: "NEJobsPortal",
  fullName: "NEJobsPortal.in",
  tagline: "Your Gateway to Northeast India Jobs & Education",
  description:
    "Free job alerts, exam results, admissions, scholarships, and study materials for Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  keywords: [
    "northeast india jobs",
    "assam jobs",
    "assam career",
    "northeast india education",
    "APSC",
    "ADRE",
    "NE jobs",
    "govt jobs assam",
  ],
  author: "NEJobsPortal Team",
  language: "en",
  locale: "en_IN",
  email: "nejobsportal@gmail.com",
  links: {
    telegram: "https://t.me/nejobsportal",
    whatsapp: "https://whatsapp.com/channel/0029Vb7umaVJf05hiPBALC1x",
    facebook: "https://facebook.com/NEJobsPortal",
    twitter: "https://twitter.com/nejobsportal",
    instagram: "https://instagram.com/NEJobsPortal",
    youtube: "https://youtube.com/@NEJobsPortal",
  },
  features: {
    enableWhatsappSharing: true,
    enableTelegramBot: true,
    enableEmailDigest: false,
    enablePushNotifications: false,
    enableSmsAlerts: false,
    enableAiChatbot: true,
    enableResumeBuilder: true,
    enableDocumentLocker: true,
    enableQuiz: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;
