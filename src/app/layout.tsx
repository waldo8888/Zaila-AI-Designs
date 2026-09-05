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
import { DeferredChatWidget } from "@/components/deferred-chat-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.zailaai.com"),
  title: "Zaila AI Designs — Premium websites for service businesses",
  description:
    "Premium websites, booking and lead systems, and AI support when it actually helps — for Hamilton service businesses. Launch in days, not months.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Zaila AI Designs — Premium websites for service businesses",
    description:
      "Premium websites, booking and lead systems, and AI support when it actually helps — for Hamilton service businesses. Launch in days, not months.",
    url: "https://www.zailaai.com",
    siteName: "Zaila AI Designs",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zaila AI Designs — Premium websites for service businesses. Launch in days, not months.",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaila AI Designs — Premium websites for service businesses",
    description:
      "Premium websites, booking and lead systems, and AI support when it actually helps — for Hamilton service businesses. Launch in days, not months.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.zailaai.com",
  },
  keywords: [
    "Hamilton web design",
    "web design Hamilton Ontario",
    "service business websites",
    "small business websites",
    "online booking website",
    "AI chatbot for small business",
    "website care plan",
    "fast website launch",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.zailaai.com/#website",
      url: "https://www.zailaai.com",
      name: "Zaila AI Designs",
      description:
        "Premium websites and lead systems for Hamilton service businesses.",
      publisher: { "@id": "https://www.zailaai.com/#business" },
    },
    {
      "@type": "ItemList",
      "@id": "https://www.zailaai.com/#nav",
      name: "Main Navigation",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Home",
          description:
            "Premium websites for Hamilton service businesses that want more leads",
          url: "https://www.zailaai.com",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Services",
          description:
            "Websites, lead systems, AI & automation, care plans, and local SEO",
          url: "https://www.zailaai.com/#services",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Pricing",
          description: "Website builds from $800, care plans from $69/mo",
          url: "https://www.zailaai.com/pricing",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "Blog",
          description:
            "Web design, lead flow, and local SEO notes for small businesses",
          url: "https://www.zailaai.com/blog",
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "How We Work",
          description: "Our approach — how Zaila builds and what to expect",
          url: "https://www.zailaai.com/growth-stories",
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "Contact",
          description: "Start your project with Zaila AI Designs",
          url: "https://www.zailaai.com/contact",
        },
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.zailaai.com/#business",
      name: "Zaila AI Designs",
      url: "https://www.zailaai.com",
      email: "hello@zailaaidesigns.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.zailaai.com/logo.png",
      },
      image: "https://www.zailaai.com/logo.png",
      description:
        "Hamilton, Ontario studio building premium websites, booking and lead systems, and AI support for service businesses. Launch in days, not months.",
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
        "Online Booking and Lead Capture Systems",
        "AI Chatbot Development",
        "Website Hosting and Maintenance",
        "Local SEO",
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
        <DeferredChatWidget />
      </body>
    </html>
  );
}
