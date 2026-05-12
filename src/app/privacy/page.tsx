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
      <p className="mt-2 text-sm text-zinc-400">Last updated: May 12, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-[1.8] text-zinc-300">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Introduction</h2>
          <p className="mt-2">
            Zaila AI Designs (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates{" "}
            <Link href="/" className="text-fuchsia-400 hover:underline">zailaai.com</Link>.
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
            <li><strong className="text-zinc-300">ZailaOS / InsForge</strong> — internal CRM and database used to manage inquiries and client work</li>
            <li><strong className="text-zinc-300">Hosting provider (Vercel)</strong> — website hosting and CDN provider used to deliver the site, including Vercel Blob for storing post images we publish to Instagram</li>
            <li><strong className="text-zinc-300">Meta Platforms (Facebook, Instagram)</strong> — when you message us on Instagram, we receive and store your message via the Instagram Graph API to respond and manage the conversation. See section 11 for full detail.</li>
            <li><strong className="text-zinc-300">OpenAI and OpenRouter</strong> — language-model providers we use to classify inbound messages, draft suggested replies, and generate marketing content. Submissions sent to these providers are subject to their respective privacy policies.</li>
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
            are sent to our email and stored in our private internal CRM so we can
            respond to your inquiry and manage follow-up. We take reasonable measures
            to protect your information from unauthorized access, disclosure, or misuse.
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
          <h2 className="text-lg font-semibold text-white">10. Instagram and Meta Platform Data</h2>
          <p className="mt-2">
            We operate an Instagram business presence (
            <a
              href="https://www.instagram.com/zailaaidesigns"
              className="text-fuchsia-400 hover:underline"
            >@zailaaidesigns</a>
            ) and use Meta&apos;s Instagram Graph API to publish content,
            read engagement metrics on our own posts, and receive direct messages
            sent to us. When you interact with our Instagram account, the following
            data may be collected and stored in our internal CRM:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-400">
            <li>
              <strong className="text-zinc-300">Direct messages you send us</strong> —
              we store the message text, your Instagram sender ID, your Instagram
              username (if available), and the timestamp, so we can respond and
              continue the conversation. We do not read other Instagram conversations.
            </li>
            <li>
              <strong className="text-zinc-300">Comments you post on our content</strong> —
              if you comment on a post by @zailaaidesigns, we may store the comment
              text and your Instagram username to respond.
            </li>
            <li>
              <strong className="text-zinc-300">Aggregated post metrics</strong> —
              likes, saves, comments, reach, and total interactions on{" "}
              <em>our own</em> posts. We do not track or store metrics for any other
              accounts&apos; content.
            </li>
          </ul>
          <p className="mt-3">
            We do not sell, rent, or share Instagram-derived data with third parties
            other than the service providers listed in section 4. Inbound messages
            and their classifications are accessible only to authorized Zaila AI
            Designs operators.
          </p>
          <p className="mt-3">
            Our use of information received from the Instagram Platform adheres to
            the{" "}
            <a
              href="https://developers.facebook.com/terms/"
              className="text-fuchsia-400 hover:underline"
            >Meta Platform Terms</a>
            {" "}and{" "}
            <a
              href="https://developers.facebook.com/devpolicy/"
              className="text-fuchsia-400 hover:underline"
            >Developer Policies</a>
            . You may revoke our app&apos;s access to your Instagram data at any
            time from your Instagram account settings (Settings → Apps and
            websites).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">11. AI Processing of Your Submissions</h2>
          <p className="mt-2">
            We use third-party language-model providers (OpenAI and OpenRouter) to
            help us run our business — specifically to classify inbound messages,
            draft suggested replies for our team to review, and generate marketing
            content for our own channels. When you send us a message (contact form,
            email reply, or Instagram DM), the message text may be sent to one of
            these providers as part of automated classification.
          </p>
          <p className="mt-3">
            We do not provide more information than is necessary to perform the
            task (we do not, for example, send your CRM history along with a
            reply-classification request). These providers process data on our
            behalf under their respective enterprise terms; we do not authorize
            them to use your submissions for training their models.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">12. Data Retention and Deletion</h2>
          <p className="mt-2">
            We retain personal information only as long as necessary for the
            purposes described above. Inquiry and project records are retained
            while we are doing business with you and for a reasonable period
            afterward for legal and accounting requirements (typically up to seven
            years for financial records, in line with Canadian tax law).
            Instagram message records are retained for as long as you remain in
            active conversation with us; you may request earlier deletion at any
            time.
          </p>
          <p className="mt-3">
            To request deletion of your personal information held by Zaila AI
            Designs, including data we collected via Instagram or Meta&apos;s
            APIs, please visit our{" "}
            <Link href="/data-deletion" className="text-fuchsia-400 hover:underline">
              data deletion request page
            </Link>
            {" "}or email us at the address below. We will confirm receipt within
            48 hours and complete the deletion within 30 days, except where we
            are required by law to retain certain records.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">13. Contact Us</h2>
          <p className="mt-2">
            If you have questions about this Privacy Policy or wish to exercise your rights,
            contact us at:
          </p>
          <p className="mt-3 text-zinc-400">
            Zaila AI Designs<br />
            Hamilton, Ontario, Canada<br />
            <a href="mailto:hello@zailaaidesigns.com" className="text-fuchsia-400 hover:underline">
              hello@zailaaidesigns.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
