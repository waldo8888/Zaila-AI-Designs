import { Hero } from "@/components/hero";
import { RealitySection } from "@/components/reality-section";
import { ServicesSection } from "@/components/services-section";
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
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <SocialProofStrip />
      <ContactSection />
      <BackToTop />
    </>
  );
}
