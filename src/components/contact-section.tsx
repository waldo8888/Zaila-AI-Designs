"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { submitContactForm } from "@/app/actions";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  function isFieldActive(name: string) {
    return focusedField === name || filledFields.has(name);
  }

  function handleInput(name: string, value: string) {
    setFilledFields((prev) => {
      const next = new Set(prev);
      if (value) next.add(name);
      else next.delete(name);
      return next;
    });
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative min-h-screen flex items-center py-32 px-6"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(120,50,200,0.12),transparent_50%)]" />

      <motion.div
        style={{ opacity, y }}
        className="relative mx-auto max-w-6xl w-full"
      >
        {/* Header - Centered */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-6">
              Get started
            </p>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white mb-6">
              Ready to <span className="text-gradient">launch</span>?
            </h2>
            <p className="max-w-xl mx-auto text-[18px] leading-[1.8] text-zinc-400">
              Tell us what you need — we&apos;ll respond with a simple plan and a clear price. No contracts, no surprises.
            </p>
            <p className="mt-4 text-[14px] text-zinc-400">
              Or email us directly at{" "}
              <a href="mailto:zailaaidesigns@gmail.com" className="text-fuchsia-400/80 hover:text-fuchsia-400 transition-colors">
                zailaaidesigns@gmail.com
              </a>
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24">
          {/* Left - Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
          >
            {/* Feature cards */}
            <div className="space-y-6 mb-12">
              {[
                {
                  title: "Quick Response",
                  desc: "We respond to all inquiries within 24 hours.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  ),
                },
                {
                  title: "No Commitment",
                  desc: "Free consultation with a custom proposal.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  ),
                },
                {
                  title: "Transparent Pricing",
                  desc: "Clear quotes with no hidden fees.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="group flex items-start gap-5 p-5 rounded-2xl transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 border border-white/[0.05] flex items-center justify-center text-zinc-400 group-hover:text-fuchsia-400 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-medium text-white mb-1">{item.title}</h3>
                    <p className="text-[14px] text-zinc-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact details */}
            <div className="space-y-4 border-t border-white/[0.05] pt-8">
              <a
                href="mailto:zailaaidesigns@gmail.com"
                className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <span className="text-[15px]">zailaaidesigns@gmail.com</span>
              </a>
              <div className="flex items-center gap-4 text-zinc-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a8 8 0 0 1 8 8c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 8-8z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
                <span className="text-[15px]">Hamilton, Ontario</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0, 1] }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full min-h-[500px] items-center justify-center rounded-3xl glass-card p-12 text-center"
              >
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                    className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20"
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                      <path d="M3 12l6 6L21 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <h3 className="text-[28px] font-semibold text-white mb-4">
                    Message sent!
                  </h3>
                  <p className="text-[16px] text-zinc-400 max-w-sm mb-8">
                    Thanks for reaching out. We&apos;ll get back to you within 24 hours with a custom proposal.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[14px] text-fuchsia-400 hover:text-fuchsia-300 transition-colors underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-3xl glass-card glass-card-interactive p-8 md:p-12">
                <div className="space-y-8">
                  {/* Name field */}
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className={`absolute left-0 transition-all duration-300 ${
                        isFieldActive("name")
                          ? "top-0 text-[11px] text-fuchsia-400"
                          : "top-4 text-[14px] text-zinc-400"
                      }`}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      onFocus={() => setFocusedField("name")}
                      onBlur={(e) => { if (!e.target.value) setFocusedField(null); }}
                      onInput={(e) => handleInput("name", (e.target as HTMLInputElement).value)}
                      className="w-full border-b border-white/[0.08] bg-transparent pt-6 pb-3 text-[16px] text-white outline-none transition-all focus:border-fuchsia-500/50"
                    />
                  </div>

                  {/* Email field */}
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className={`absolute left-0 transition-all duration-300 ${
                        isFieldActive("email")
                          ? "top-0 text-[11px] text-fuchsia-400"
                          : "top-4 text-[14px] text-zinc-400"
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      onFocus={() => setFocusedField("email")}
                      onBlur={(e) => { if (!e.target.value) setFocusedField(null); }}
                      onInput={(e) => handleInput("email", (e.target as HTMLInputElement).value)}
                      className="w-full border-b border-white/[0.08] bg-transparent pt-6 pb-3 text-[16px] text-white outline-none transition-all focus:border-fuchsia-500/50"
                    />
                  </div>

                  {/* Project type */}
                  <div className="relative">
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-4">
                      Project Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Website", "AI Chatbot", "Booking System", "Full Package"].map((type) => (
                        <label key={type} className="cursor-pointer">
                          <input type="radio" name="project" value={type} className="peer sr-only" />
                          <span className="inline-block rounded-full border border-white/10 px-5 py-2.5 text-[13px] text-zinc-400 transition-all peer-checked:border-fuchsia-500/50 peer-checked:bg-fuchsia-500/10 peer-checked:text-white hover:border-white/20">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="relative">
                    <label
                      htmlFor="message"
                      className={`absolute left-0 transition-all duration-300 ${
                        isFieldActive("message")
                          ? "top-0 text-[11px] text-fuchsia-400"
                          : "top-4 text-[14px] text-zinc-400"
                      }`}
                    >
                      Tell us about your project
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      onFocus={() => setFocusedField("message")}
                      onBlur={(e) => { if (!e.target.value) setFocusedField(null); }}
                      onInput={(e) => handleInput("message", (e.target as HTMLTextAreaElement).value)}
                      className="w-full resize-none border-b border-white/[0.08] bg-transparent pt-6 pb-3 text-[16px] text-white outline-none transition-all focus:border-fuchsia-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-12 w-full overflow-hidden rounded-full bg-white px-8 py-5 text-[15px] font-medium text-black transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] disabled:opacity-60"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? "Sending..." : "Send Message"}
                    {!loading && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        className="transition-transform duration-500 group-hover:translate-x-1"
                      >
                        <path
                          d="M3 9H15M15 9L10 4M15 9L10 14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-200 to-violet-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </button>

                {error && (
                  <p className="mt-4 text-center text-[14px] text-red-400">{error}</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
