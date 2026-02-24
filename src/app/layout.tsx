import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Navbar } from "@/components/navbar-new";
import { FooterNew } from "@/components/footer-new";
import { SphereBackground } from "@/components/sphere-background";
import { SmoothScroll } from "@/components/smooth-scroll";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-black text-zinc-100 antialiased`}
      >
        <SmoothScroll>
          <SphereBackground />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <FooterNew />
        </SmoothScroll>
      </body>
    </html>
  );
}
