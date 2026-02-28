import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Zaila AI Designs",
  description: "How Zaila AI Designs collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-28 pb-20">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-400">Last updated: February 24, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-[1.8] text-zinc-300">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Introduction</h2>
          <p className="mt-2">
            Zaila AI Designs (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates{" "}
            <Link href="/" className="text-fuchsia-400 hover:underline">zailai.com</Link>.
            We are based in Hamilton, Ontario, Canada and are committed to protecting your
            personal information in accordance with the{" "}
            <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA)
            and applicable Canadian law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Information We Collect</h2>
          <p className="mt-2">We collect only the information you voluntarily provide through our contact forms:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-400">
            <li>Name</li>
            <li>Email address</li>
            <li>Business name</li>
            <li>Project type</li>
            <li>Message content</li>
          </ul>
          <p className="mt-3">
            We do not collect sensitive personal information such as financial data,
            government-issued identifiers, or health information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. How We Use Your Information</h2>
          <p className="mt-2">We use the information you provide to:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-400">
            <li>Respond to your inquiry or project request</li>
            <li>Provide a quote or consultation</li>
            <li>Communicate with you about our services</li>
          </ul>
          <p className="mt-3">
            We will not use your information for any purpose other than what you provided
            it for without your consent.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. How We Share Your Information</h2>
          <p className="mt-2">
            We do not sell, rent, or trade your personal information. We may share your
            information only with the following third-party service providers who assist us
            in operating our business:
          </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-400">
            <li><strong className="text-zinc-300">Resend</strong> — email delivery service used to receive your contact form submissions</li>
            <li><strong className="text-zinc-300">Hosting provider</strong> — website hosting and CDN provider used to deliver the site</li>
          </ul>
          <p className="mt-3">
            These providers are contractually obligated to protect your data and may only
            use it to perform services on our behalf.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Cookies and Analytics</h2>
          <p className="mt-2">
            Our website does not use cookies for tracking purposes. If we implement analytics
            in the future, this policy will be updated accordingly and any analytics tools
            will comply with PIPEDA requirements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Data Storage and Security</h2>
          <p className="mt-2">
            Your information is transmitted securely via HTTPS. Contact form submissions
            are sent directly to our email and are not stored in a database. We take
            reasonable measures to protect your information from unauthorized access,
            disclosure, or misuse.
          </p>
          <p className="mt-3">
            Please note that data processed by our service providers may be stored on
            servers located outside of Canada. By submitting your information, you
            acknowledge this transfer. We ensure that any such providers maintain
            comparable levels of data protection.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">7. Your Rights Under PIPEDA</h2>
          <p className="mt-2">Under PIPEDA, you have the right to:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-400">
            <li>Know what personal information we hold about you</li>
            <li>Request access to your personal information</li>
            <li>Request correction of inaccurate information</li>
            <li>Withdraw your consent for us to use your information</li>
            <li>File a complaint with the Office of the Privacy Commissioner of Canada</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">8. Consent</h2>
          <p className="mt-2">
            By submitting a contact form on our website, you consent to the collection
            and use of your personal information as described in this policy. You may
            withdraw your consent at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">9. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. Changes will be posted on
            this page with an updated &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">10. Contact Us</h2>
          <p className="mt-2">
            If you have questions about this Privacy Policy or wish to exercise your rights,
            contact us at:
          </p>
          <p className="mt-3 text-zinc-400">
            Zaila AI Designs<br />
            Hamilton, Ontario, Canada<br />
            <a href="mailto:zailaaidesigns@gmail.com" className="text-fuchsia-400 hover:underline">
              zailaaidesigns@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
