import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "NEJobsPortal.in community guidelines — rules for respectful discussion, comments, and user interactions on our platform.",
  openGraph: {
    title: "Community Guidelines | NEJobsPortal.in",
    description: "Be respectful, be helpful, and help us build a positive community for Northeast India.",
  },
};

export default function CommunityGuidelinesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white">
        <div className="container-main py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Community Guidelines</h1>
            <p className="text-lg text-green-100">
              Be respectful, be helpful, and help us build a positive community for Northeast India.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container-main py-12">
        <div className="max-w-3xl mx-auto prose prose-gray prose-lg">
          <div className="space-y-8">
            {/* Our Goal */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Our Goal</h2>
              <p className="text-gray-700 leading-relaxed">
                NEJobsPortal.in aims to be a helpful, inclusive, and supportive community for job seekers, 
                students, and professionals across Northeast India. Whether you are commenting on a job post, 
                sharing your success story, or participating in discussions — we want everyone to feel welcome.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                These guidelines apply to all user interactions on our Platform, including comments, forum 
                discussions, success stories, interview experiences, and any other user-generated content.
              </p>
            </div>

            {/* Be Respectful */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Be Respectful</h2>
              <p className="text-gray-700 leading-relaxed">
                Treat others with respect and courtesy. Disagreements are fine, but personal attacks, 
                harassment, hate speech, and intimidation are not tolerated. We welcome diverse opinions 
                and perspectives, but discussions must remain constructive.
              </p>
            </div>

            {/* Stay On Topic */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Stay On Topic</h2>
              <p className="text-gray-700 leading-relaxed">
                Keep comments and discussions relevant to the content they are posted under. A job 
                notification for APSC is not the place for general political debate. Off-topic, spammy, 
                or disruptive content may be removed.
              </p>
            </div>

            {/* No Misinformation */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. No Misinformation</h2>
              <p className="text-gray-700 leading-relaxed">
                Do not post false or misleading information about job notifications, exam dates, eligibility 
                criteria, or any other content on the Platform. If you are unsure about something, do not 
                share it as fact. We encourage users to always verify information from official sources.
              </p>
            </div>

            {/* No Spam */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. No Spam or Self-Promotion</h2>
              <p className="text-gray-700 leading-relaxed">
                Do not use the Platform to promote businesses, services, products, or websites without 
                prior authorization. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>Posting irrelevant links or advertisements.</li>
                <li>Promoting paid coaching centers, consultancies, or agencies.</li>
                <li>Sharing referral links or affiliate codes.</li>
                <li>Repeatedly posting the same content.</li>
              </ul>
            </div>

            {/* No Impersonation */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. No Impersonation</h2>
              <p className="text-gray-700 leading-relaxed">
                Do not impersonate NEJobsPortal.in staff, government officials, recruitment board 
                representatives, or other users. Misleading others about your identity is prohibited.
              </p>
            </div>

            {/* Protect Privacy */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Protect Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Do not share personal contact information — including phone numbers, email addresses, 
                or home addresses — in public comments or discussions. This protects both your privacy 
                and the privacy of others.
              </p>
            </div>

            {/* No Fraud */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. No Fraudulent Activity</h2>
              <p className="text-gray-700 leading-relaxed">
                Do not use the Platform to facilitate scams, fraud, or deceptive practices. This includes 
                posting fake job listings, fake scholarship opportunities, or any content designed to 
                deceive other users.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-amber-800 font-medium">
                  ⚠️ Reminder: NEJobsPortal.in will NEVER ask you for money, OTP, or payment for job 
                  listings, applications, or services. If anyone contacts you claiming to represent us 
                  and asks for money, please report it immediately.
                </p>
              </div>
            </div>

            {/* Reporting */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Reporting Violations</h2>
              <p className="text-gray-700 leading-relaxed">
                If you see content that violates these guidelines, please report it to us. You can:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>Use the &quot;Report&quot; feature available on comments and posts.</li>
                <li>Email us at <strong>abuse@nejobsportal.in</strong>.</li>
                <li>Contact us through our <a href="/contact" className="text-[#1a6b3c] hover:underline">Contact page</a>.</li>
              </ul>
            </div>

            {/* Consequences */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Consequences of Violations</h2>
              <p className="text-gray-700 leading-relaxed">
                Violation of these guidelines may result in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>Removal of the offending content.</li>
                <li>Temporary suspension of commenting privileges.</li>
                <li>Permanent account suspension or ban.</li>
                <li>Reporting to appropriate authorities for illegal activities.</li>
              </ul>
            </div>

            {/* Final */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Let&apos;s Build Together</h2>
              <p className="text-gray-700 leading-relaxed">
                Our community is strongest when we help each other. Share your knowledge, encourage fellow 
                job seekers, celebrate successes, and contribute constructively. Together, we can make 
                NEJobsPortal.in the most helpful career platform for Northeast India.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-10">
            <h3 className="font-semibold text-gray-900 mb-2">Have Questions?</h3>
            <p className="text-sm text-gray-600">
              If you have questions about these guidelines, please contact us at{' '}
              <strong>community@nejobsportal.in</strong>.
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-8 text-center">
            Last updated: June 2026
          </p>
        </div>
      </section>
    </div>
  );
}
