import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Navbar } from "@/components/navbar-new";
import { FooterNew } from "@/components/footer-new";
import { SphereBackground } from "@/components/sphere-background";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CustomCursor } from "@/components/custom-cursor";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ChatWidget } from "@/components/chat-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zailai.com"),
  title: "Zaila AI Designs — AI-Powered Websites",
  description:
    "AI-powered business websites and automation for Hamilton small businesses. Launch fast, grow smarter.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Zaila AI Designs — AI-Powered Websites",
    description:
      "AI-powered business websites and automation for Hamilton small businesses. Launch fast, grow smarter.",
    url: "https://zailai.com",
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
  twitter: {
    card: "summary_large_image",
    title: "Zaila AI Designs — AI-Powered Websites",
    description:
      "AI-powered business websites and automation for Hamilton small businesses. Launch fast, grow smarter.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://zailai.com",
  },
  keywords: [
    "AI web design",
    "AI website builder",
    "Hamilton web design",
    "small business websites",
    "AI chatbot",
    "website automation",
    "Next.js agency",
    "fast website launch",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://zailai.com/#website",
      url: "https://zailai.com",
      name: "Zaila AI Designs",
      description:
        "AI-powered business websites and automation for Hamilton small businesses.",
      publisher: { "@id": "https://zailai.com/#business" },
    },
    {
      "@type": "ItemList",
      "@id": "https://zailai.com/#nav",
      name: "Main Navigation",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Home",
          description:
            "AI-powered websites for Hamilton small businesses",
          url: "https://zailai.com",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Services",
          description:
            "AI web design, chatbots, automation, and local SEO services",
          url: "https://zailai.com/#services",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Pricing",
          description: "Website build packages starting at $899",
          url: "https://zailai.com/pricing",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "Blog",
          description:
            "AI and web design insights for small businesses",
          url: "https://zailai.com/blog",
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "Growth Stories",
          description: "Real client results and case studies",
          url: "https://zailai.com/growth-stories",
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "Contact",
          description: "Start your project with Zaila AI Designs",
          url: "https://zailai.com/contact",
        },
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://zailai.com/#business",
      name: "Zaila AI Designs",
      url: "https://zailai.com",
      email: "zailaaidesigns@gmail.com",
      logo: {
        "@type": "ImageObject",
        url: "https://zailai.com/logo.png",
      },
      image: "https://zailai.com/logo.png",
      description:
        "AI-powered web design and automation agency serving Hamilton and Ontario small businesses. Websites that launch in days, not months.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamilton",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      areaServed: [
        { "@type": "City", name: "Hamilton" },
        { "@type": "AdministrativeArea", name: "Ontario" },
      ],
      priceRange: "$$",
      serviceType: [
        "Web Design",
        "AI Chatbot Development",
        "Website Automation",
        "SEO Optimization",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-black text-zinc-100 antialiased`}
      >
        <SmoothScroll>
          <CustomCursor />
          <SphereBackground />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <FooterNew />
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
        <ChatWidget />
      </body>
    </html>
  );
}
