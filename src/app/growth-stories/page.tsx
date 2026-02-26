import type { Metadata } from "next";
import { GrowthStoriesClient } from "./client";

export const metadata: Metadata = {
  title: "Growth Stories — Real Results from AI Websites | Zaila AI Designs",
  description:
    "See how Hamilton businesses grew with AI-powered websites. Real before & after results: faster load times, 3x more leads, 60% cost savings vs traditional agencies.",
  alternates: { canonical: "https://zailai.com/growth-stories" },
  openGraph: {
    title: "Growth Stories — Real Results from AI Websites | Zaila AI Designs",
    description:
      "See how Hamilton businesses grew with AI-powered websites. Real before & after results.",
    url: "https://zailai.com/growth-stories",
  },
};

const caseStudies = [
  {
    client: "Mitchell & Co.",
    industry: "Professional Services",
    quote:
      "Zaila AI Designs completely transformed our online presence. We went from zero to a professional, conversion-focused site in under a week.",
    person: "Sarah Mitchell",
    role: "Owner",
    stats: [
      { label: "More leads", value: "3x", detail: "Monthly leads tripled in 30 days" },
      { label: "Launch time", value: "4 days", detail: "From concept to live site" },
      { label: "Load speed", value: "0.8s", detail: "Down from 4.2s on old site" },
    ],
    before: [
      "No website — relying solely on word-of-mouth",
      "Losing leads to competitors with online presence",
      "Quoted $6K+ and 8 weeks by a local agency",
    ],
    after: [
      "Conversion-focused site with lead capture forms",
      "AI chatbot handling FAQs and booking inquiries 24/7",
      "Organic search traffic growing month-over-month",
    ],
    color: "fuchsia" as const,
  },
  {
    client: "Chen Services",
    industry: "Home Services",
    quote:
      "The AI chatbot alone has saved us hours per week. It handles FAQs and captures leads while we focus on running the business.",
    person: "David Chen",
    role: "Founder",
    stats: [
      { label: "Hours saved", value: "12+/wk", detail: "From automated FAQ handling" },
      { label: "Lead capture", value: "24/7", detail: "AI chatbot never sleeps" },
      { label: "Response time", value: "<5s", detail: "Instant answers for visitors" },
    ],
    before: [
      "Spending hours answering the same questions by phone",
      "Missing leads after business hours",
      "Template website with no automation",
    ],
    after: [
      "AI chatbot captures and qualifies leads automatically",
      "Online booking integrated — no more phone tag",
      "Monthly growth plan keeps site optimized",
    ],
    color: "violet" as const,
  },
  {
    client: "Rodriguez Tech",
    industry: "Technology Consulting",
    quote:
      "Agency-level quality at a fraction of the cost. The monthly growth plan keeps our site fresh and performing at its best.",
    person: "Emma Rodriguez",
    role: "CEO",
    stats: [
      { label: "Cost savings", value: "60%", detail: "Vs. previous agency retainer" },
      { label: "Performance", value: "99", detail: "Lighthouse performance score" },
      { label: "Uptime", value: "99.9%", detail: "Zero downtime since launch" },
    ],
    before: [
      "Paying $2,400/mo to a traditional agency",
      "Slow site — Lighthouse score of 42",
      "Updates took 2–3 weeks to implement",
    ],
    after: [
      "Growth Plan at $119/mo — same quality, better results",
      "Lighthouse 99 — blazing fast on all devices",
      "Updates deployed in 24–48 hours",
    ],
    color: "cyan" as const,
  },
  {
    client: "Serenity Wellness",
    industry: "Health & Wellness",
    quote:
      "From concept to live in 48 hours. The speed and quality blew us away. Our booking rate tripled in the first month.",
    person: "Lisa Park",
    role: "Director",
    stats: [
      { label: "Launch time", value: "48hr", detail: "Concept to live in 2 days" },
      { label: "Bookings", value: "3x", detail: "Online bookings tripled in month one" },
      { label: "Bounce rate", value: "−40%", detail: "Visitors stay and convert" },
    ],
    before: [
      "DIY Wix site that looked dated and slow",
      "No online booking — all appointments by phone",
      "High bounce rate from poor mobile experience",
    ],
    after: [
      "Modern, mobile-first design with instant load times",
      "Integrated booking system with automated reminders",
      "Patients find and book directly from Google",
    ],
    color: "emerald" as const,
  },
];

const colorMap = {
  fuchsia: {
    gradient: "from-fuchsia-500/20 to-fuchsia-500/5",
    border: "border-fuchsia-500/20",
    text: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    glow: "bg-fuchsia-500/10",
    dot: "bg-fuchsia-400",
  },
  violet: {
    gradient: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/20",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    glow: "bg-violet-500/10",
    dot: "bg-violet-400",
  },
  cyan: {
    gradient: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    glow: "bg-cyan-500/10",
    dot: "bg-cyan-400",
  },
  emerald: {
    gradient: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    glow: "bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
};

export default function GrowthStoriesPage() {
  return <GrowthStoriesClient caseStudies={caseStudies} colorMap={colorMap} />;
}
