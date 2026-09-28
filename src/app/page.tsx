import { Hero } from "@/components/hero";
import { RealitySection } from "@/components/reality-section";
import { FixSection } from "@/components/fix-section";
import { ProcessSection } from "@/components/process-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { SocialProofStrip } from "@/components/social-proof-strip";
import { ContactSection } from "@/components/contact-section";
import { BackToTop } from "@/components/back-to-top";

export default function Home() {
  return (
    <>
      <Hero />
      <RealitySection />
      <FixSection />
      <ProcessSection />
      <TestimonialsSection />
      <SocialProofStrip />
      <ContactSection />
      <BackToTop />
    </>
  );
}
