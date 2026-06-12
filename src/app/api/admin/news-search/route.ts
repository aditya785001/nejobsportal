import { NextRequest, NextResponse } from "next/server";

const MOCK_RESULTS = [
  {
    title: "Assam Police SI Recruitment 2026 — Apply for 850+ Vacancies",
    snippet:
      "Assam Police has released notification for the recruitment of Sub-Inspector (SI) and other posts. Online applications are invited from eligible candidates between 15 June and 15 July 2026.",
    url: "https://assampolice.gov.in/recruitment-2026",
    source: "Assam Police Official",
    date: "2026-06-08",
  },
  {
    title: "APSC CCE Prelims Result 2026 Out — Check Merit List",
    snippet:
      "The Assam Public Service Commission has declared the preliminary examination result for the Combined Competitive Examination 2026. Candidates can download their scorecard from the official website.",
    url: "https://apsc.nic.in/result-cce-2026",
    source: "APSC Official",
    date: "2026-06-07",
  },
  {
    title: "Northeast Frontier Railway Apprentice Recruitment 2026",
    snippet:
      "North East Frontier Railway invites applications for 1,200+ apprentice posts across various trades. Minimum educational qualification is Class 10 pass with ITI certificate. Last date extended to 20 June 2026.",
    url: "https://nfr.indianrailways.gov.in/apprentice-2026",
    source: "NFR Railway",
    date: "2026-06-06",
  },
  {
    title: "Assam TET 2026 Application Form Released — Apply Now",
    snippet:
      "The Elementary Education Department, Assam has released the notification for Assam TET 2026. Eligible candidates can apply online from 5 June to 5 July 2026 for Lower Primary and Upper Primary levels.",
    url: "https://ssa.assam.gov.in/tet-2026",
    source: "SSA Assam",
    date: "2026-06-05",
  },
  {
    title: "SSC CHSL 2026 Notification — 5,000+ Vacancies for 10+2 Pass",
    snippet:
      "Staff Selection Commission has announced Combined Higher Secondary Level Examination 2026 for various posts like LDC, DEO, and PA. Applications open from 10 June to 10 July 2026.",
    url: "https://ssc.nic.in/chsl-2026",
    source: "SSC Official",
    date: "2026-06-04",
  },
  {
    title: "Meghalaya PSC Combined Exam 2026 — Apply for 120 Posts",
    snippet:
      "Meghalaya Public Service Commission invites online applications for the Combined Competitive Examination 2026 for 120 vacancies in Group A and Group B services. Last date: 25 June 2026.",
    url: "https://mpsc.nic.in/cc-2026",
    source: "Meghalaya PSC",
    date: "2026-06-03",
  },
  {
    title: "OIL India Limited Recruitment 2026 — 250+ Executive Posts",
    snippet:
      "Oil India Limited has published recruitment notification for various executive positions including Engineers, Geologists, and Accountants. Apply before 30 June 2026.",
    url: "https://oil-india.com/careers-2026",
    source: "OIL India Careers",
    date: "2026-06-02",
  },
  {
    title: "Assam Govt Jobs June 2026 — 50+ Notifications Active This Week",
    snippet:
      "Roundup of all active government job notifications in Assam as of June 2026. Includes vacancies from Assam Police, APSC, Education Department, Public Health, and more. Check eligibility and apply online.",
    url: "https://nejobsportal.in/assam-govt-jobs-june-2026",
    source: "NEJobsPortal",
    date: "2026-06-01",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  let results = MOCK_RESULTS;
  if (q) {
    results = MOCK_RESULTS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.snippet.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ results });
}
