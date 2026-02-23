import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zaila AI Designs — AI-Powered Websites",
  description:
    "AI-powered business websites and automation for Hamilton small businesses. Launch fast, grow smarter.",
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
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
