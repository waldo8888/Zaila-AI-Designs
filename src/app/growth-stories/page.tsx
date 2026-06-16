import type { Metadata } from "next";
import { GrowthStoriesClient } from "./client";

export const metadata: Metadata = {
  title: "How We Work — Our Approach | Zaila AI Designs",
  description:
    "How Zaila builds: we diagnose before we build, launch in days not months, design to convert, and keep your site working with a care plan. Hamilton-based, edge-fast.",
  alternates: { canonical: "https://www.zailaai.com/growth-stories" },
  openGraph: {
    title: "How We Work — Our Approach | Zaila AI Designs",
    description:
      "How Zaila builds: diagnose first, launch in days not months, design to convert, and keep it working with a care plan.",
    url: "https://www.zailaai.com/growth-stories",
    siteName: "Zaila AI Designs",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Zaila AI Designs",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
};

const principles = [
  {
    title: "Diagnose before we build",
    summary:
      "We figure out what's actually losing you leads before anyone writes a line of code.",
    body: "Most sites get built backwards — design first, ask what it's for later. We start with a short conversation about your business: who you're trying to reach, what's getting in their way, what a win looks like. Then we build for that. No discovery call, no proposal until we understand the problem.",
    points: [
      "A real conversation about your goals — not a sales pitch",
      "We map the path from visitor to booked customer",
      "Scope written down in plain language before work starts",
    ],
    color: "fuchsia" as const,
  },
  {
    title: "Launch in days, not months",
    summary:
      "AI handles the heavy lifting, so you're live in a week — not stuck in a three-month agency queue.",
    body: "Traditional agencies move slowly because the process is slow, not because the work is hard. We use AI for the parts machines are good at — generating code, optimizing, testing — and keep humans on the parts that matter: your story, your design, your decisions. Most builds go from first call to live site in a few days.",
    points: [
      "AI-assisted build with fast iterations and constant feedback",
      "Custom domain, SSL, and analytics live on day one",
      "Complex projects take a little longer — we'll tell you up front",
    ],
    color: "violet" as const,
  },
  {
    title: "Built to convert, not just look nice",
    summary:
      "Pretty is the floor. The point is a site that turns visitors into customers.",
    body: "A site that looks premium but doesn't move anyone to act is decoration. Every page we build leads somewhere — a clear next step, a booking, a form, a call. Mobile-first, because that's where most of your visitors actually are. Fast, because slow sites quietly lose people before the page even loads.",
    points: [
      "Mobile-first design — most visitors are on a phone",
      "One clear next step on every page",
      "Booking, payments, and AI support added when they earn their place",
    ],
    color: "cyan" as const,
  },
  {
    title: "Care that keeps it working",
    summary:
      "A site is like a houseplant. Looks fine in week one. By month nine, somebody should be watering it.",
    body: "Launch day is the start, not the finish. Every build comes with a care plan: managed hosting on a fast edge network, ongoing changes, performance checks, and a real person to email when you need something. No long-term lock-in — care plans are month-to-month.",
    points: [
      "Managed hosting — global edge, SSL, CDN",
      "Ongoing updates and performance monitoring",
      "Month-to-month — cancel anytime, no lock-in contracts",
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
  return <GrowthStoriesClient principles={principles} colorMap={colorMap} />;
}
