import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact Us",
  description:
    "Get in touch with the NEJobsPortal.in team. Send us your feedback, suggestions, or report issues with job listings.",
  openGraph: {
    title: "Contact NEJobsPortal.in",
    description: "We'd love to hear from you. Reach out with feedback, suggestions, or inquiries.",
  },
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white">
        <div className="container-main py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-green-100">
              We value your feedback. Reach out to us with questions, suggestions, or issues.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container-main py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-xl">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      For general inquiries, feedback, or support:
                    </p>
                    <a
                      href={`mailto:hello@nejobsportal.in`}
                      className="text-[#1a6b3c] hover:underline text-sm font-medium"
                    >
                      hello@nejobsportal.in
                    </a>
                  </div>
                </div>

                {/* Report Issues */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-xl">
                    🐛
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Report an Issue</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Found incorrect information or a broken link? Let us know so we can fix it.
                    </p>
                    <a
                      href={`mailto:issues@nejobsportal.in`}
                      className="text-[#1a6b3c] hover:underline text-sm font-medium"
                    >
                      issues@nejobsportal.in
                    </a>
                  </div>
                </div>

                {/* Job Listings */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-xl">
                    🏢
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Employers & Recruiters</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Want to list a job vacancy or recruitment notification on our platform?
                    </p>
                    <a
                      href={`mailto:employers@nejobsportal.in`}
                      className="text-[#1a6b3c] hover:underline text-sm font-medium"
                    >
                      employers@nejobsportal.in
                    </a>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-xl">
                    ⏱️
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Response Time</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We aim to respond to all inquiries within <strong>24–48 hours</strong> on business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social & Other */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h2>
              <p className="text-gray-600 mb-6">
                Stay connected and get instant updates on new job notifications, results, and more.
              </p>

              <div className="space-y-4">
                {[
                  {
                    name: "Telegram",
                    href: siteConfig.links.telegram,
                    icon: "📢",
                    desc: "Instant job alerts & updates",
                    color: "bg-blue-50 hover:bg-blue-100",
                  },
                  {
                    name: "WhatsApp",
                    href: siteConfig.links.whatsapp,
                    icon: "💬",
                    desc: "Quick updates on your phone",
                    color: "bg-green-50 hover:bg-green-100",
                  },
                  {
                    name: "Facebook",
                    href: siteConfig.links.facebook,
                    icon: "👍",
                    desc: "Follow us for daily updates",
                    color: "bg-blue-50 hover:bg-blue-100",
                  },
                  {
                    name: "YouTube",
                    href: siteConfig.links.youtube,
                    icon: "▶️",
                    desc: "Exam tips, tutorials & guides",
                    color: "bg-red-50 hover:bg-red-100",
                  },
                  {
                    name: "Instagram",
                    href: siteConfig.links.instagram,
                    icon: "📸",
                    desc: "Career tips & motivation",
                    color: "bg-pink-50 hover:bg-pink-100",
                  },
                  {
                    name: "Twitter / X",
                    href: siteConfig.links.twitter,
                    icon: "🐦",
                    desc: "Quick news & announcements",
                    color: "bg-gray-50 hover:bg-gray-100",
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 p-4 rounded-xl border border-gray-200 ${social.color} transition-colors no-underline`}
                  >
                    <span className="text-2xl">{social.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{social.name}</h3>
                      <p className="text-xs text-gray-600">{social.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div>
                <h3 className="font-semibold text-amber-800 text-sm">Important Note</h3>
                <p className="text-sm text-amber-700 mt-1">
                  NEJobsPortal.in is a <strong>free job alert portal</strong>. We are NOT a recruitment agency 
                  and do NOT charge any fee for job listings, applications, or services. If anyone contacts you 
                  asking for money in our name, please report it to us immediately.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-8 text-center">
            Last updated: June 2026
          </p>
        </div>
      </section>
    </div>
  );
}
