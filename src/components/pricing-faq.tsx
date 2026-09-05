import { Card } from "@/components/ui/card";

export const pricingFaq: { q: string; a: string }[] = [
  {
    q: "Why is a care plan required?",
    a: "Because the hosting lives inside it. Every site we build runs on managed edge hosting with SSL, a CDN, and monitoring — the care plan is what keeps it online, updated, and looked after. It's month to month, no long-term contract.",
  },
  {
    q: "Which care plan do I need?",
    a: "At minimum, the one that matches your build: Starter → Launch Care ($69/mo), Growth → Growth Care ($189/mo), Smart AI → Partner Care ($599/mo). You can always go up a tier; you can't go below the match, since the bigger builds need more looking after.",
  },
  {
    q: "What if I need more changes than my plan includes?",
    a: "Each plan includes a monthly bank of change time (20 minutes on Launch, 1 hour on Growth, 2.5 hours on Partner). Anything past that is billed at our standard care rate. Bigger jobs — roughly three to six hours, like a new page or a new integration — are always quoted separately so there are no surprise invoices.",
  },
  {
    q: "How does payment work?",
    a: "A deposit to start (Starter 50%, Growth 35%, Smart AI 30%), the balance at launch, and the care plan begins the day the site goes live.",
  },
  {
    q: "How long does it take?",
    a: "Days, not months — once we have your content. Starter and Growth sites are usually ready to review within days of kickoff. Smart AI builds with payments or custom integrations take longer. We give you a real date on the discovery call rather than a blanket promise.",
  },
  {
    q: "Can I cancel the care plan?",
    a: "Yes, it's month to month. Since the hosting lives inside the plan, talk to us before you cancel so the site doesn't go dark — we'll sort out a handoff.",
  },
  {
    q: "Do you do local SEO?",
    a: "Yes, as a standalone service from $1,499: Google Business Profile optimization, service-area pages, local schema, and a NAP consistency audit. It's priced independently of the build tiers.",
  },
  {
    q: "What about social media or brand work?",
    a: "We run that as a monthly retainer for clients we've built for. Ask on the discovery call and we'll scope it around your business.",
  },
];

export function PricingFaq() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pricingFaq.map((item) => (
        <Card key={item.q} className="p-6">
          <h3 className="text-[17px] font-semibold text-white">{item.q}</h3>
          <p className="mt-3 text-[15px] leading-[1.75] text-zinc-400">{item.a}</p>
        </Card>
      ))}
    </div>
  );
}
