import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Consultation — Zaila AI Designs",
  description:
    "Get a free consultation and custom quote for your AI-powered website. Tell us what you need and we'll reply within 24 hours.",
  alternates: { canonical: "https://zailai.com/contact" },
  openGraph: {
    title: "Free Consultation — Zaila AI Designs",
    description:
      "Get a free consultation and custom quote for your AI-powered website.",
    url: "https://zailai.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
