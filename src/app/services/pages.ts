export interface LocalPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  intro: string;
  features: { title: string; description: string }[];
  stats: { value: string; label: string }[];
  faq: { q: string; a: string }[];
}

export const localPages: LocalPage[] = [
  {
    slug: "ai-web-design-hamilton",
    metaTitle: "AI Web Design Hamilton — Fast Websites for Local Businesses | Zaila",
    metaDescription:
      "Hamilton's AI-powered web design agency. Modern, fast-loading websites built in days for local businesses. From $499. Free consultation.",
    title: "AI Web Design Hamilton",
    h1: "AI Web Design for Hamilton Businesses",
    subtitle: "Modern, fast-loading websites built in days — not months.",
    intro:
      "Hamilton businesses deserve websites that compete with Toronto agencies at a fraction of the cost. We use AI-powered design and Next.js to build conversion-focused websites that load instantly, rank on Google, and capture leads 24/7.",
    features: [
      {
        title: "Built for Hamilton businesses",
        description:
          "We understand the Hamilton market. From contractors on the Mountain to restaurants in Locke Street, we build sites that resonate with your local customers.",
      },
      {
        title: "Live in days, not months",
        description:
          "Traditional Hamilton agencies quote 8–12 weeks. We launch professional, AI-powered websites in as little as 48 hours. Same quality, 10x the speed.",
      },
      {
        title: "Mobile-first & fast",
        description:
          "Over 65% of Hamilton local searches happen on mobile. Every site we build scores 95+ on Google Lighthouse and loads in under 2 seconds.",
      },
      {
        title: "Local SEO built in",
        description:
          "Proper schema markup, Google Business Profile optimization, and Hamilton-targeted content so you rank for the searches that matter.",
      },
    ],
    stats: [
      { value: "$499", label: "Starting price" },
      { value: "48hr", label: "Avg. launch" },
      { value: "99", label: "Performance score" },
      { value: "$0", label: "Contracts" },
    ],
    faq: [
      {
        q: "How much does a website cost in Hamilton?",
        a: "Traditional Hamilton agencies charge $3K–$15K. Our AI-powered websites start at $499 for a Starter site and $699 for a full Growth site with booking, chatbot, and social proof.",
      },
      {
        q: "How fast can you build my website?",
        a: "Most sites launch within 2–4 days after our initial discovery call. Complex projects with custom integrations may take 5–7 days.",
      },
      {
        q: "Do you only work with Hamilton businesses?",
        a: "We're based in Hamilton and specialize in local businesses here, but we work with clients across Ontario and Canada.",
      },
      {
        q: "What if I already have a website?",
        a: "We can redesign and migrate your existing site. We'll audit your current site, identify what's working, and build a faster, more modern version.",
      },
    ],
  },
  {
    slug: "nextjs-website-hamilton",
    metaTitle:
      "Next.js Website Development Hamilton — Modern Web Apps | Zaila AI Designs",
    metaDescription:
      "Custom Next.js website development in Hamilton. Blazing fast React sites with server-side rendering, SEO optimization, and Vercel hosting. From $499.",
    title: "Next.js Websites Hamilton",
    h1: "Next.js Website Development in Hamilton",
    subtitle:
      "Enterprise-grade technology, small business pricing.",
    intro:
      "Next.js is the framework behind Vercel, Netflix, Nike, and Notion. We bring that same technology to Hamilton businesses — blazing fast React websites with server-side rendering, automatic SEO optimization, and edge deployment. No WordPress bloat. No slow loading. Just modern web technology that works.",
    features: [
      {
        title: "React + Next.js architecture",
        description:
          "Server-side rendering, static generation, and edge functions deliver sub-second page loads. Your site runs on the same stack used by Fortune 500 companies.",
      },
      {
        title: "Vercel edge hosting",
        description:
          "Deployed on Vercel's global edge network — your Hamilton customers get near-instant load times, and so does everyone else. Built-in SSL, CDN, and 99.99% uptime.",
      },
      {
        title: "SEO that works",
        description:
          "Next.js generates proper metadata, structured data, and fast-loading pages that Google loves. We handle technical SEO so you can focus on your business.",
      },
      {
        title: "No WordPress headaches",
        description:
          "No plugins to update, no security patches, no database management. A Next.js site on Vercel is secure, fast, and maintenance-free by default.",
      },
    ],
    stats: [
      { value: "<1s", label: "Page load" },
      { value: "99.99%", label: "Uptime" },
      { value: "0", label: "Plugins needed" },
      { value: "A+", label: "Security grade" },
    ],
    faq: [
      {
        q: "What is Next.js?",
        a: "Next.js is a React framework built by Vercel. It's the most popular framework for modern websites, used by companies like Netflix, Nike, and Notion. It provides server-side rendering, automatic code splitting, and optimization out of the box.",
      },
      {
        q: "Why Next.js instead of WordPress?",
        a: "WordPress sites are slow (average 4+ second load), require constant plugin updates, and are frequent targets for security exploits. Next.js sites load in under 1 second, need zero maintenance, and are secure by default.",
      },
      {
        q: "Can I update content myself?",
        a: "Yes. We can set up a headless CMS (like Sanity or Contentful) so you can edit content through a simple dashboard without touching code.",
      },
      {
        q: "Will my site be hard to maintain?",
        a: "The opposite. Next.js on Vercel handles hosting, SSL, CDN, and deployments automatically. There are no servers to manage and no plugins to update.",
      },
    ],
  },
  {
    slug: "ai-chatbot-ontario",
    metaTitle: "AI Chatbots for Ontario Businesses — 24/7 Lead Capture | Zaila",
    metaDescription:
      "Custom AI chatbots for Ontario businesses. Capture leads, answer FAQs, and book appointments automatically — 24/7. Integrated with your website.",
    title: "AI Chatbots Ontario",
    h1: "AI Chatbots for Ontario Businesses",
    subtitle:
      "Capture leads and answer questions — even when you're closed.",
    intro:
      "Ontario businesses lose leads every night, weekend, and holiday. An AI chatbot on your website answers customer questions instantly, captures contact info, and can even book appointments — 24/7, 365 days a year. No extra staff needed.",
    features: [
      {
        title: "24/7 lead capture",
        description:
          "Your chatbot never sleeps. It engages visitors, answers common questions, and captures qualified leads around the clock — even at 2 AM on a holiday.",
      },
      {
        title: "Trained on your business",
        description:
          "We train the AI on your services, pricing, FAQs, and policies. It gives accurate, on-brand answers — not generic chatbot responses.",
      },
      {
        title: "Booking integration",
        description:
          "Connect your calendar so customers can book appointments directly through the chatbot. No phone calls, no email back-and-forth.",
      },
      {
        title: "Lead qualification",
        description:
          "The chatbot asks the right questions to qualify leads before they reach you. You only spend time on prospects who are ready to buy.",
      },
    ],
    stats: [
      { value: "24/7", label: "Availability" },
      { value: "<5s", label: "Response time" },
      { value: "12+hr", label: "Saved per week" },
      { value: "3x", label: "More leads" },
    ],
    faq: [
      {
        q: "How does the AI chatbot work?",
        a: "We build a custom chatbot trained on your business information — services, pricing, FAQs, policies. It uses AI to understand visitor questions and provide accurate, conversational responses.",
      },
      {
        q: "Will it sound robotic?",
        a: "No. Modern AI chatbots use natural language processing to have human-like conversations. Visitors often can't tell they're talking to a bot.",
      },
      {
        q: "Can it integrate with my existing tools?",
        a: "Yes. We can connect the chatbot to your calendar (Google, Calendly), CRM, email, and other tools you already use.",
      },
      {
        q: "What if the chatbot can't answer a question?",
        a: "It gracefully hands off to you — capturing the visitor's info and question so you can follow up personally. No leads slip through the cracks.",
      },
    ],
  },
];

export function getLocalPageBySlug(slug: string): LocalPage | undefined {
  return localPages.find((page) => page.slug === slug);
}
