import { Hero } from "@/components/hero";
import { StorySection } from "@/components/story-section";
import { ServicesSection } from "@/components/services-section";
import { ProcessSection } from "@/components/process-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactSection } from "@/components/contact-section";
import { BackToTop } from "@/components/back-to-top";

export default function Home() {
  return (
    <>
      <Hero />
      <StorySection />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
      <BackToTop />
    </>
  );
}
