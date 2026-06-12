import { Metadata } from "next";

async function getScholarship(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/scholarships/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getScholarship(slug);

  if (!data?.scholarship) return {};

  const scholarship = data.scholarship;
  const title = `${scholarship.titleEn} - NEJobsPortal.in`;
  const description =
    scholarship.summaryEn ||
    `Apply for ${scholarship.titleEn} scholarship on NEJobsPortal.in`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ScholarshipDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
