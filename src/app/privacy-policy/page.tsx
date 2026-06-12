import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy-policy" },
  title: "Privacy Policy",
  description:
    "NEJobsPortal.in privacy policy — how we collect, use, store, and protect your personal information when you use our platform.",
  openGraph: {
    title: "Privacy Policy | NEJobsPortal.in",
    description:
      "Learn how NEJobsPortal.in collects, uses, and protects your personal data.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white">
        <div className="container-main py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-green-100">
              How we collect, use, and protect your information when you use NEJobsPortal.in.
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
            {/* 1. Introduction */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                NEJobsPortal.in (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting 
                the personal information you share with us. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website at nejobsportal.in 
                (the &quot;Platform&quot;).
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                By using the Platform, you agree to the collection and use of information in accordance 
                with this policy. If you do not agree with any part of this policy, please discontinue 
                use of our services.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <h3 className="font-semibold text-gray-900 mb-2">2.1 Information You Provide</h3>
              <p className="text-gray-700 leading-relaxed">
                We may collect the following information when you voluntarily provide it:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
                <li><strong>Profile Information:</strong> Educational details, resume, preferences, and other data you choose to add to your profile.</li>
                <li><strong>Communications:</strong> Information you provide when contacting us via email, contact forms, or social media.</li>
                <li><strong>Quiz & Test Responses:</strong> Answers submitted through quizzes and practice tests for performance tracking.</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-6 mb-2">2.2 Information Collected Automatically</h3>
              <p className="text-gray-700 leading-relaxed">
                When you visit our Platform, we may automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device type.</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, links clicked, search queries, and referring URLs.</li>
                <li><strong>Cookies & Similar Technologies:</strong> We use cookies and similar tracking technologies to enhance your experience. See our Cookie Policy below.</li>
              </ul>
            </div>

            {/* 3. How We Use Your Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>To provide, maintain, and improve our Platform and services.</li>
                <li>To send you job alerts, exam notifications, and other content you have subscribed to.</li>
                <li>To personalize your experience and show relevant job listings and study materials.</li>
                <li>To communicate with you about updates, security alerts, and support inquiries.</li>
                <li>To analyze usage patterns and improve our website&apos;s functionality and user experience.</li>
                <li>To detect, prevent, and address technical issues, fraud, or abuse.</li>
                <li>To comply with legal obligations and enforce our Terms of Service.</li>
              </ul>
            </div>

            {/* 4. Cookies Policy */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files stored on your device that help us improve your browsing experience. 
                We use the following types of cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li><strong>Essential Cookies:</strong> Required for the Platform to function properly (e.g., authentication, session management).</li>
                <li><strong>Preference Cookies:</strong> Remember your language preferences, saved filters, and display settings.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the Platform (e.g., Google Analytics).</li>
                <li><strong>Functional Cookies:</strong> Enable enhanced features like saved job searches and bookmarks.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                You can control cookie preferences through your browser settings. Disabling certain cookies 
                may affect the functionality of the Platform.
              </p>
            </div>

            {/* 5. Third-Party Services */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed">
                We may use third-party services to support our Platform, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li><strong>Analytics:</strong> Google Analytics to understand website traffic and user behavior.</li>
                <li><strong>Hosting:</strong> Cloud hosting providers to store and serve our website content.</li>
                <li><strong>Communication:</strong> Email services for sending notifications and newsletters.</li>
                <li><strong>Social Media:</strong> Social media widgets and sharing features.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                These third-party services have their own privacy policies governing the use of your information. 
                We are not responsible for their practices. We encourage you to review their policies.
              </p>
            </div>

            {/* 6. Data Storage & Security */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Storage & Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement reasonable technical and organizational security measures to protect your 
                personal information from unauthorized access, alteration, disclosure, or destruction. 
                These include encryption, secure server infrastructure, and access controls.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                While we strive to protect your data, we cannot guarantee its absolute security.
              </p>
            </div>

            {/* 7. Your Rights */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights & Choices</h2>
              <p className="text-gray-700 leading-relaxed">
                Depending on your jurisdiction, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal obligations.</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
                <li><strong>Cookie Preferences:</strong> Manage cookie settings through your browser.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                To exercise any of these rights, please contact us at <strong>privacy@nejobsportal.in</strong>.
              </p>
            </div>

            {/* 8. Children's Privacy */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our Platform is not directed to children under the age of 13. We do not knowingly collect 
                personal information from children. If we become aware that a child under 13 has provided 
                us with personal data, we will take steps to delete it. If you believe a child has provided 
                us with personal information, please contact us.
              </p>
            </div>

            {/* 9. Changes to Policy */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the &quot;Effective Date&quot; at the top. 
                We encourage you to review this policy periodically.
              </p>
            </div>

            {/* 10. Contact */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>Email: <strong>privacy@nejobsportal.in</strong></li>
                <li>Through our <a href="/contact" className="text-[#1a6b3c] hover:underline">Contact page</a></li>
              </ul>
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
