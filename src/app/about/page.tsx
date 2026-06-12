import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Us",
  description:
    "Learn about NEJobsPortal.in — Northeast India's free job alert and education portal. Our mission, vision, and the team behind the platform.",
  openGraph: {
    title: "About NEJobsPortal.in",
    description:
      "Northeast India's free job alert and education portal — connecting job seekers with opportunities across all 8 states.",
  },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white">
        <div className="container-main py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About NEJobsPortal.in</h1>
            <p className="text-lg text-green-100">
              Your trusted gateway to government jobs, exam results, admissions, and educational opportunities across Northeast India.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container-main py-12">
        <div className="max-w-3xl mx-auto prose prose-gray prose-lg">
          {/* Mission */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At <strong>NEJobsPortal.in</strong>, our mission is simple — to bridge the gap between job seekers and 
              employment opportunities in Northeast India. We aggregate and publish verified government job notifications, 
              exam results, admission notices, scholarship information, and study materials from across all eight 
              northeastern states: <strong>Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              We believe that access to timely and accurate career information should be free and available to everyone. 
              Whether you are a fresh graduate looking for your first government job, a student seeking scholarships, 
              or a professional exploring career advancements — we are here to help you stay informed.
            </p>
          </div>

          {/* Vision */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To become the most trusted and comprehensive career platform for Northeast India — empowering every 
              individual in the region with the information, tools, and resources they need to build a successful career.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                {
                  title: "Accurate & Timely",
                  desc: "We verify every notification before publishing and update our database in real time so you never miss a deadline.",
                  icon: "🎯",
                },
                {
                  title: "Free for All",
                  desc: "All our services — job alerts, study materials, exam prep — are completely free. No hidden charges.",
                  icon: "🆓",
                },
                {
                  title: "Northeast Focused",
                  desc: "We cover all 8 states of Northeast India with region-specific content that matters to you.",
                  icon: "📍",
                },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What We Offer */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <div className="space-y-4">
              {[
                {
                  title: "📋 Job Listings",
                  desc: "Curated government job notifications from APSC, SSC, RRB, IBPS, state-level recruitment boards, and more — across all departments and categories.",
                },
                {
                  title: "📊 Exam Results",
                  desc: "Timely updates on exam results, merit lists, answer keys, cut-off marks, and admit cards for competitive exams across the region.",
                },
                {
                  title: "🎓 Admissions & Scholarships",
                  desc: "Comprehensive information on college admissions, university applications, and available scholarships for students in Northeast India.",
                },
                {
                  title: "📚 Study Materials",
                  desc: "Free study resources including previous year question papers, syllabus breakdowns, notes, and preparation guides for competitive exams.",
                },
                {
                  title: "📅 Exam Calendar",
                  desc: "A consolidated calendar of upcoming exams, application deadlines, and important dates to help you plan your preparation.",
                },
                {
                  title: "🧠 Daily Quiz",
                  desc: "Practice with daily quizzes covering general knowledge, current affairs, and exam-specific topics to sharpen your skills.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Trust Us */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Trust Us</h2>
            <p className="text-gray-700 leading-relaxed">
              We take accuracy and reliability seriously. Every job notification we publish is sourced from 
              official government websites, verified newspapers, or direct employer communications. Our team 
              manually reviews each listing to ensure it meets our accuracy standards before it reaches you.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              We are committed to transparency. We clearly mark the source of every notification and always 
              encourage users to verify details on the official portal before applying.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Have Questions?</h2>
            <p className="text-gray-600 mb-4">
              We would love to hear from you. Reach out to us for feedback, suggestions, or inquiries.
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] font-medium transition-colors no-underline"
            >
              Contact Us
            </Link>
          </div>

          {/* Last Updated */}
          <p className="text-xs text-gray-400 mt-8 text-center">
            Last updated: June 2026
          </p>
        </div>
      </section>
    </div>
  );
}
