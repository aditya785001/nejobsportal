import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Service",
  description:
    "NEJobsPortal.in terms of service — rules and guidelines for using our job alert and education platform.",
  openGraph: {
    title: "Terms of Service | NEJobsPortal.in",
    description: "Please read these terms carefully before using NEJobsPortal.in.",
  },
};

export default function TermsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white">
        <div className="container-main py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-green-100">
              Please read these terms carefully before using NEJobsPortal.in.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container-main py-12">
        <div className="max-w-3xl mx-auto prose prose-gray prose-lg">
          <p className="text-sm text-gray-500 mb-8">
            <strong>Effective Date:</strong> June 1, 2026
          </p>

          <div className="space-y-8">
            {/* 1. Acceptance */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using NEJobsPortal.in (&quot;the Platform&quot;), you agree to be bound by these 
                Terms of Service (&quot;Terms&quot;). If you do not agree with any part of these Terms, you must 
                discontinue use of the Platform immediately.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately 
                upon posting. Your continued use of the Platform after changes constitutes acceptance of the 
                updated Terms.
              </p>
            </div>

            {/* 2. Description of Service */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                NEJobsPortal.in is a free job alert and education information portal serving Northeast India. 
                We aggregate and publish:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>Government job notifications and vacancy announcements</li>
                <li>Exam results, merit lists, and answer keys</li>
                <li>Admission notices for colleges and universities</li>
                <li>Scholarship opportunities and application details</li>
                <li>Study materials, exam preparation resources, and practice quizzes</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                <strong>Important:</strong> We are a <strong>job alert aggregator</strong>, not a recruitment agency. 
                We do not process job applications, conduct exams, or make hiring decisions.
              </p>
            </div>

            {/* 3. User Accounts */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts & Registration</h2>
              <p className="text-gray-700 leading-relaxed">
                Some features of the Platform may require you to create an account. When you register, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>Provide accurate, current, and complete information.</li>
                <li>Maintain the confidentiality of your account credentials.</li>
                <li>Notify us immediately of any unauthorized use of your account.</li>
                <li>Be responsible for all activities that occur under your account.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </div>

            {/* 4. User Conduct */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. User Conduct</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to use the Platform responsibly and not to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>Violate any applicable laws or regulations.</li>
                <li>Impersonate any person or entity or misrepresent your affiliation.</li>
                <li>Upload or distribute viruses, malware, or harmful code.</li>
                <li>Attempt to gain unauthorized access to our systems or user accounts.</li>
                <li>Scrape, crawl, or otherwise systematically extract data from the Platform without our written consent.</li>
                <li>Post spam, advertisements, or promotional content without authorization.</li>
                <li>Harass, abuse, or harm other users.</li>
                <li>Interfere with the proper functioning of the Platform.</li>
              </ul>
            </div>

            {/* 5. Intellectual Property */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The Platform and its original content, features, and functionality are owned by NEJobsPortal.in 
                and are protected by applicable intellectual property laws. You may not reproduce, distribute, 
                modify, or create derivative works without our prior written consent.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Job notifications and government information published on our Platform are sourced from public 
                government websites and are provided for informational purposes only.
              </p>
            </div>

            {/* 6. Third-Party Links */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Third-Party Links</h2>
              <p className="text-gray-700 leading-relaxed">
                Our Platform may contain links to third-party websites (e.g., official government portals, 
                application websites). We are not responsible for the content, privacy practices, or availability 
                of these external sites. Accessing them is at your own risk.
              </p>
            </div>

            {/* 7. Disclaimer */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed">
                THE PLATFORM IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE MAKE NO 
                REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, REGARDING THE ACCURACY, 
                RELIABILITY, OR AVAILABILITY OF THE PLATFORM OR THE INFORMATION CONTAINED THEREIN.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                We do not guarantee that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>The Platform will be uninterrupted, secure, or error-free.</li>
                <li>The information provided is complete, accurate, or up-to-date.</li>
                <li>Defects will be corrected in a timely manner.</li>
              </ul>
            </div>

            {/* 8. Limitation of Liability */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall NEJobsPortal.in, its owners, operators, or affiliates be liable for any 
                indirect, incidental, special, consequential, or punitive damages arising out of your use 
                of the Platform. This includes, but is not limited to, loss of opportunities, data, or profits.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Users are advised to independently verify all job notifications, application details, and 
                deadlines on the respective official government websites before applying.
              </p>
            </div>

            {/* 9. Termination */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your access to the Platform at any time, 
                without notice, for conduct that we believe violates these Terms or is harmful to other 
                users, third parties, or our operations.
              </p>
            </div>

            {/* 10. Governing Law */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India. 
                Any disputes arising under these Terms shall be subject to the exclusive jurisdiction 
                of the courts in Assam, India.
              </p>
            </div>

            {/* 11. Contact */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms, please contact us at <strong>legal@nejobsportal.in</strong> 
                or through our <a href="/contact" className="text-[#1a6b3c] hover:underline">Contact page</a>.
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-12 text-center">
            Last updated: June 2026
          </p>
        </div>
      </section>
    </div>
  );
}
