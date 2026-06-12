import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/disclaimer" },
  title: "Disclaimer",
  description:
    "NEJobsPortal.in disclaimer — important information about the accuracy, use, and limitations of the job information provided on our platform.",
  openGraph: {
    title: "Disclaimer | NEJobsPortal.in",
    description: "Please read our disclaimer regarding the use of information on this platform.",
  },
};

export default function DisclaimerPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white">
        <div className="container-main py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Disclaimer</h1>
            <p className="text-lg text-green-100">
              Important information about the accuracy and use of content on NEJobsPortal.in.
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
            {/* General */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">General Information</h2>
              <p className="text-gray-700 leading-relaxed">
                The information provided on NEJobsPortal.in (&quot;the Platform&quot;) is for general informational 
                purposes only. While we strive to keep the information accurate and up-to-date, we make no 
                representations or warranties of any kind, express or implied, about the completeness, accuracy, 
                reliability, suitability, or availability of the information, jobs, products, services, or 
                related graphics on the Platform for any purpose.
              </p>
            </div>

            {/* No Guarantee */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">No Guarantee of Accuracy</h2>
              <p className="text-gray-700 leading-relaxed">
                Job notifications, exam results, admission notices, and scholarship information published on 
                this Platform are collected from various sources, including official government websites, 
                newspapers, and partner portals. We do not guarantee that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>All listings are complete, accurate, or current.</li>
                <li>Application deadlines, exam dates, or other time-sensitive information have not changed.</li>
                <li>Links to external websites are functional or lead to the correct page.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                <strong>Users are strongly advised to verify all information</strong> — including eligibility 
                criteria, application procedures, deadlines, and fees — directly from the official notification 
                or the respective government department&apos;s website before applying.
              </p>
            </div>

            {/* No Employment Guarantee */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">No Employment Guarantee</h2>
              <p className="text-gray-700 leading-relaxed">
                NEJobsPortal.in is a <strong>job alert aggregator</strong>. We do not offer employment, 
                guarantee job placement, or process job applications. We are not a recruitment agency, 
                consultancies, or placement service. We do not charge job seekers any fee for accessing 
                job listings or using our platform.
              </p>
            </div>

            {/* Not Affiliated */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">No Affiliation</h2>
              <p className="text-gray-700 leading-relaxed">
                NEJobsPortal.in is <strong>not affiliated</strong> with any government department, 
                recruitment board, examination authority, university, or educational institution unless 
                explicitly stated. All logos, trademarks, and official names belong to their respective owners.
              </p>
            </div>

            {/* External Links */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">External Links Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed">
                The Platform may contain links to external websites that are not provided or maintained 
                by us. We do not control the content, privacy practices, or availability of those sites. 
                The inclusion of any link does not imply endorsement by NEJobsPortal.in.
              </p>
            </div>

            {/* Copyright */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Copyright & Content Use</h2>
              <p className="text-gray-700 leading-relaxed">
                The content on this Platform — including text, graphics, logos, and layouts — is the property 
                of NEJobsPortal.in unless otherwise attributed. Government job notifications republished here 
                are in the public interest and sourced from publicly available official documents.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Unauthorized reproduction, redistribution, or commercial use of our content is prohibited 
                without prior written consent.
              </p>
            </div>

            {/* Limitation */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall NEJobsPortal.in be liable for any loss or damage, including without 
                limitation, indirect or consequential loss or damage, arising out of or in connection with 
                the use of this Platform or the information provided herein.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Any reliance you place on the information from this Platform is strictly at your own risk.
              </p>
            </div>

            {/* Changes */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to This Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Disclaimer from time to time. Changes will be posted on this page with 
                an updated effective date. We encourage you to review this page periodically.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Disclaimer, please contact us at <strong>legal@nejobsportal.in</strong> 
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
