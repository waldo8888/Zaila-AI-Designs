import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start your project — Zaila AI Designs",
  description:
    "Tell us what your business needs — we reply within 24 hours with a simple plan and a clear price. Free discovery call, no pitch.",
  alternates: { canonical: "https://www.zailaai.com/contact" },
  openGraph: {
    title: "Start your project — Zaila AI Designs",
    description:
      "Tell us what your business needs — we reply within 24 hours with a simple plan and a clear price.",
    url: "https://www.zailaai.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
