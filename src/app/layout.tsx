import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CanonicalLink } from "@/components/CanonicalLink";
import AuthProvider from "@/components/layout/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nejobsportal.in"),
  title: {
    default: "NEJobsPortal.in — Northeast India Jobs & Education Portal",
    template: "%s | NEJobsPortal.in",
  },
  description:
    "Free job alerts, exam results, admissions, scholarships, and study materials for Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura.",
  keywords: [
    "northeast india jobs",
    "assam jobs",
    "assam career",
    "APSC",
    "ADRE",
    "govt jobs assam",
    "northeast education",
  ],
  authors: [{ name: "NEJobsPortal Team" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "NEJobsPortal.in",
    title: "NEJobsPortal.in — Northeast India Jobs & Education Portal",
    description:
      "Free job alerts, exam results, admissions, scholarships, and study materials for Northeast India.",
    url: "https://nejobsportal.in",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEJobsPortal.in — Northeast India Jobs & Education Portal",
      },
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "NEJobsPortal.in — Northeast India Jobs & Education Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEJobsPortal.in — Northeast India Jobs & Education Portal",
    description:
      "Free job alerts, exam results, admissions, scholarships, and study materials for Northeast India.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <AuthProvider>
          <LanguageProvider>
            <CanonicalLink />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
