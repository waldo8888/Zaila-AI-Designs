import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Zaila AI Designs",
  description: "Terms and conditions for using Zaila AI Designs services.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-28 pb-20">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-zinc-400">Last updated: February 24, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-[1.8] text-zinc-300">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Overview</h2>
          <p className="mt-2">
            These Terms of Service (&quot;Terms&quot;) govern your use of the website{" "}
            <Link href="/" className="text-fuchsia-400 hover:underline">zailai.com</Link>{" "}
            and any services provided by Zaila AI Designs (&quot;we&quot;, &quot;us&quot;,
            &quot;our&quot;), a web design and AI automation business based in Hamilton,
            Ontario, Canada. By using our website or engaging our services, you agree to
            these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Services</h2>
          <p className="mt-2">
            Zaila AI Designs provides web design, AI chatbot integration, booking system
            setup, automation, and ongoing website maintenance services. Specific
            deliverables, timelines, and pricing are agreed upon between us and the client
            before work begins.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Quotes and Payments</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
            <li>All prices listed on the website are in Canadian dollars (CAD) unless otherwise stated.</li>
            <li>Quotes provided are valid for 30 days from the date issued.</li>
            <li>Payment terms will be outlined in your project agreement. Typically, a deposit is required before work begins.</li>
            <li>Growth Plan (monthly care plan) subscriptions can be cancelled at any time with 30 days&apos; notice.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Project Process</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
            <li>We will provide a clear scope of work before starting any project.</li>
            <li>Revisions within the agreed scope are included. Additional revisions or scope changes may incur extra charges.</li>
            <li>We aim to deliver on estimated timelines but cannot guarantee specific dates, as timelines depend on client responsiveness and project complexity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Client Responsibilities</h2>
          <p className="mt-2">To ensure timely delivery, clients are expected to:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-400">
            <li>Provide content, images, logos, and any required materials in a timely manner</li>
            <li>Review and provide feedback on deliverables within a reasonable timeframe</li>
            <li>Ensure they have the rights to any content they provide to us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Intellectual Property</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
            <li>Upon full payment, you own the final website design and content we create for you.</li>
            <li>We retain the right to showcase completed work in our portfolio unless otherwise agreed in writing.</li>
            <li>Third-party tools, fonts, and libraries used in your project remain subject to their own licences.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">7. Hosting and Third-Party Services</h2>
          <p className="mt-2">
            Websites are typically deployed on Vercel. While we assist with deployment,
            you are responsible for maintaining your own accounts with third-party services
            (hosting, domain registrar, email providers, etc.). We are not liable for
            outages or changes caused by third-party providers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">8. Limitation of Liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, Zaila AI Designs shall not be liable
            for any indirect, incidental, special, or consequential damages arising from
            the use of our website or services. Our total liability for any claim shall not
            exceed the amount paid by you for the specific service giving rise to the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">9. Cancellation and Refunds</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
            <li>If you cancel a project before work begins, any deposit paid will be refunded in full.</li>
            <li>If you cancel after work has started, the deposit is non-refundable but no further charges will apply unless additional work was completed and agreed upon.</li>
            <li>Monthly care plans can be cancelled with 30 days&apos; notice. No refunds for the current billing period.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">10. Use of the Website</h2>
          <p className="mt-2">You agree not to:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-400">
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to interfere with the website&apos;s functionality</li>
            <li>Submit false or misleading information through our contact forms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">11. Governing Law</h2>
          <p className="mt-2">
            These Terms are governed by and construed in accordance with the laws of the
            Province of Ontario and the federal laws of Canada applicable therein. Any
            disputes shall be resolved in the courts of Ontario.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">12. Changes to These Terms</h2>
          <p className="mt-2">
            We reserve the right to update these Terms at any time. Changes will be posted
            on this page with an updated &quot;Last updated&quot; date. Continued use of our
            website or services after changes constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">13. Contact Us</h2>
          <p className="mt-2">
            If you have questions about these Terms, contact us at:
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
