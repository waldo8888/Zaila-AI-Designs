"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const proofItems = [
  { metric: "48hr", label: "Average launch time" },
  { metric: "99", label: "Lighthouse score" },
  { metric: "3x", label: "Avg. lead increase" },
  { metric: "60%", label: "Cost savings vs agencies" },
  { metric: "$0", label: "Lock-in contracts" },
  { metric: "24/7", label: "AI chatbot uptime" },
];

export function SocialProofStrip() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="relative py-20 px-6 overflow-hidden">
      {/* Subtle divider lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-12"
        >
          By the numbers
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-4">
          {proofItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent leading-none">
                {item.metric}
              </div>
              <div className="mt-2 text-[11px] text-zinc-500 uppercase tracking-wider">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
