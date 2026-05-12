import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Deletion Request — Zaila AI Designs",
  description:
    "Request deletion of personal data Zaila AI Designs holds about you, including data collected through Instagram or Meta's APIs.",
};

export default function DataDeletionPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-28 pb-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Data Deletion Request
      </h1>
      <p className="mt-2 text-sm text-zinc-400">Last updated: May 12, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-[1.8] text-zinc-300">
        <section>
          <p>
            Zaila AI Designs respects your right to control your personal
            information. You can request deletion of the data we hold about
            you — including information collected through our Instagram
            business presence (@zailaaidesigns) via Meta&apos;s Instagram Graph
            API — by following the steps below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">
            How to request deletion
          </h2>
          <p className="mt-2">
            Send an email to{" "}
            <a
              href="mailto:hello@zailaaidesigns.com?subject=Data%20Deletion%20Request"
              className="text-fuchsia-400 hover:underline"
            >
              hello@zailaaidesigns.com
            </a>{" "}
            with the subject line <strong className="text-zinc-300">Data Deletion Request</strong>.
            Include the following information so we can locate your records:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-400">
            <li>Your name or business name</li>
            <li>Email address you used to contact us, if applicable</li>
            <li>
              Your Instagram username, if you ever messaged us on{" "}
              <a
                href="https://www.instagram.com/zailaaidesigns"
                className="text-fuchsia-400 hover:underline"
              >
                @zailaaidesigns
              </a>
            </li>
            <li>
              Brief description of the data you want deleted (all of it, or a
              specific message, or a specific project)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">What happens next</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
            <li>
              <strong className="text-zinc-300">Within 48 hours</strong> — we
              acknowledge receipt of your request.
            </li>
            <li>
              <strong className="text-zinc-300">Within 30 days</strong> — we
              delete the requested data from our active systems (CRM,
              database, backups within their natural rotation cycle).
            </li>
            <li>
              <strong className="text-zinc-300">Confirmation</strong> — we send
              you a confirmation email once deletion is complete.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">What we keep</h2>
          <p className="mt-2">
            Certain records may be retained where required by Canadian law —
            primarily financial records and signed contracts, which the Canada
            Revenue Agency requires we retain for up to seven years. These are
            not used for marketing, communication, or any active processing.
            We will explain what is being retained and why in our confirmation
            email.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">
            Revoke Instagram app access directly
          </h2>
          <p className="mt-2">
            You can also revoke our Zaila AI Designs Instagram app&apos;s access
            to your data at any time, without sending us a request:
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-zinc-400">
            <li>Open Instagram on your phone</li>
            <li>Go to Settings → Apps and websites</li>
            <li>Find &quot;Zaila AI Designs&quot;</li>
            <li>Tap Remove</li>
          </ol>
          <p className="mt-3">
            This stops the app from accessing any new data about you. To also
            delete data we already received, please still send the email
            request described above.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Questions</h2>
          <p className="mt-2">
            See our{" "}
            <Link href="/privacy" className="text-fuchsia-400 hover:underline">
              Privacy Policy
            </Link>{" "}
            for full detail on what data we collect and how we use it. For any
            other questions, email{" "}
            <a
              href="mailto:hello@zailaaidesigns.com"
              className="text-fuchsia-400 hover:underline"
            >
              hello@zailaaidesigns.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
