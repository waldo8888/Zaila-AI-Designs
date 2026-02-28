"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ================================================================
   DECISION-TREE TYPES & DATA
   ================================================================ */

interface TreeNode {
  message: string;
  options?: { label: string; next: string }[];
  input?: { placeholder: string; next: string; field: "name" | "email" | "business" };
}

const TREE: Record<string, TreeNode> = {
  start: {
    message:
      "Hey! I'm Zaila — your AI-powered web design assistant. What brings you here today?",
    options: [
      { label: "I need a new website", next: "website" },
      { label: "I'm interested in an AI chatbot", next: "chatbot" },
      { label: "I want to see pricing", next: "pricing" },
      { label: "Just browsing", next: "browsing" },
    ],
  },

  /* --- Website branch --- */
  website: {
    message:
      "Great choice! We build blazing-fast, AI-powered websites for small businesses. What's most important to you?",
    options: [
      { label: "Speed & performance", next: "web_speed" },
      { label: "Beautiful design", next: "web_design" },
      { label: "SEO & local visibility", next: "web_seo" },
      { label: "All of the above", next: "web_all" },
    ],
  },
  web_speed: {
    message:
      "We use Next.js and edge delivery to ship sites that score 95+ on Lighthouse. Most load in under 1 second. Want to see what we can do for your business?",
    options: [
      { label: "Yes, let's chat!", next: "capture_name" },
      { label: "Tell me about pricing", next: "pricing" },
      { label: "Start over", next: "start" },
    ],
  },
  web_design: {
    message:
      "Our designs are custom — no templates, no cookie-cutter layouts. Each site is crafted to match your brand's personality and convert visitors into customers.",
    options: [
      { label: "I'd love a custom design", next: "capture_name" },
      { label: "What's the timeline?", next: "timeline" },
      { label: "Start over", next: "start" },
    ],
  },
  web_seo: {
    message:
      "Every site comes SEO-optimised out of the box — structured data, fast Core Web Vitals, local schema, and meta tags that actually rank. Hamilton businesses love us.",
    options: [
      { label: "Let's get started", next: "capture_name" },
      { label: "What about pricing?", next: "pricing" },
      { label: "Start over", next: "start" },
    ],
  },
  web_all: {
    message:
      "You've got great taste! Speed, design, and SEO work together — and that's exactly what we deliver. Ready to see a proposal?",
    options: [
      { label: "Absolutely!", next: "capture_name" },
      { label: "How long does it take?", next: "timeline" },
      { label: "Start over", next: "start" },
    ],
  },

  /* --- Chatbot branch --- */
  chatbot: {
    message:
      "AI chatbots are our specialty! They handle customer questions 24/7, capture leads while you sleep, and never call in sick. What's your use case?",
    options: [
      { label: "Customer support", next: "chat_support" },
      { label: "Lead capture & booking", next: "chat_leads" },
      { label: "Just curious how it works", next: "chat_how" },
    ],
  },
  chat_support: {
    message:
      "A support chatbot can answer FAQs, route complex issues, and free up your time for higher-value work. We train it on your actual business data.",
    options: [
      { label: "That sounds perfect", next: "capture_name" },
      { label: "What does it cost?", next: "pricing" },
      { label: "Start over", next: "start" },
    ],
  },
  chat_leads: {
    message:
      "Our lead-capture bots qualify prospects, book appointments, and pipe the data straight to your CRM or inbox. It's like a sales rep that never sleeps.",
    options: [
      { label: "I want one!", next: "capture_name" },
      { label: "Show me pricing", next: "pricing" },
      { label: "Start over", next: "start" },
    ],
  },
  chat_how: {
    message:
      "We build custom AI chatbots using cutting-edge language models, trained specifically on your products, services, and FAQs. They integrate right into your site.",
    options: [
      { label: "Impressive — let's talk", next: "capture_name" },
      { label: "Back to options", next: "start" },
    ],
  },

  /* --- Pricing branch --- */
  pricing: {
    message:
      "Our websites start at **$499** with monthly Care Plans from **$49/mo** that include hosting, updates, and support. Want the details?",
    options: [
      { label: "See pricing breakdown", next: "pricing_breakdown" },
      { label: "Get a custom quote", next: "capture_name" },
      { label: "What's included?", next: "whats_included" },
    ],
  },
  pricing_breakdown: {
    message:
      "Here's how it works:\n\n• Starter: **$499** (1-3 pages)\n• Growth: **$899** (chatbot + booking)\n• Smart: **$1,499+** (payments + automation)\n\nCare Plans: **$49–$399/mo** for hosting, updates, and support.",
    options: [
      { label: "Get a custom quote", next: "capture_name" },
      { label: "What's the timeline?", next: "timeline" },
      { label: "Back to start", next: "start" },
    ],
  },
  pricing_link: {
    message:
      "Check out our pricing page for the full breakdown. Or I can get you a custom quote tailored to your needs — just say the word!",
    options: [
      { label: "Get me a custom quote", next: "capture_name" },
      { label: "Back to start", next: "start" },
    ],
  },
  whats_included: {
    message:
      "All sites include: custom design, mobile-first dev, SEO, performance tuning, managed hosting on a global edge network (SSL, CDN, and monitoring included). Analytics included from Growth tier up. Ongoing support via Care Plans ($49–$399/mo).",
    options: [
      { label: "Let's do it", next: "capture_name" },
      { label: "See our work", next: "portfolio" },
      { label: "Back to start", next: "start" },
    ],
  },

  /* --- Timeline --- */
  timeline: {
    message:
      "Most websites launch within 2–4 days. We work fast — Day 1 is discovery, Days 2-3 are build, and Day 4 you're live. Chatbots can be added during the build sprint.",
    options: [
      { label: "That works for me", next: "capture_name" },
      { label: "See our work", next: "portfolio" },
      { label: "Back to options", next: "start" },
    ],
  },

  /* --- Portfolio / See our work --- */
  portfolio: {
    message:
      "We've helped businesses across Hamilton and Ontario launch fast, beautiful websites. Check out our Growth Stories page to see real results — or let's chat about your project!",
    options: [
      { label: "Let's chat!", next: "capture_name" },
      { label: "Tell me about pricing", next: "pricing" },
      { label: "Back to start", next: "start" },
    ],
  },

  /* --- Browsing --- */
  browsing: {
    message:
      "No worries! Feel free to explore. If you have any questions, I'm right here. Want me to point you somewhere specific?",
    options: [
      { label: "Tell me about your services", next: "website" },
      { label: "Show me pricing", next: "pricing" },
      { label: "See your work", next: "portfolio" },
      { label: "I'll look around", next: "bye_browse" },
    ],
  },
  bye_browse: {
    message:
      "Enjoy exploring! Click my icon any time if you need help. We're always here.",
    options: [{ label: "Start over", next: "start" }],
  },

  /* --- Lead capture funnel --- */
  capture_name: {
    message: "Awesome! Let's get you connected with our team. What's your name?",
    input: { placeholder: "Your name", next: "capture_email", field: "name" },
  },
  capture_email: {
    message: "Nice to meet you! What's the best email to reach you at?",
    input: { placeholder: "you@email.com", next: "capture_biz", field: "email" },
  },
  capture_biz: {
    message: "Almost there — what's your business name or website (if you have one)?",
    input: {
      placeholder: "Business name or URL",
      next: "captured",
      field: "business",
    },
  },
  captured: {
    message:
      "You're all set! Our team will reach out within 24 hours with a custom plan for you. In the meantime, feel free to explore the site!",
    options: [
      { label: "See your work", next: "portfolio" },
      { label: "Start over", next: "start" },
    ],
  },
};

/* ================================================================
   ANIMATED AVATAR (SVG turbulence + glow) - Living, breathing AI
   ================================================================ */

type AvatarState = "idle" | "thinking" | "typing";

function AnimatedAvatar({
  state,
  size,
  onClick,
}: {
  state: AvatarState;
  size: number;
  onClick?: () => void;
}) {
  const filterId = "zaila-distort";
  const glowFilterId = "zaila-glow";

  const config = {
    idle: {
      baseFrequency: 0.012,
      scale: 2,
      glowColor: "rgba(168,85,247,0.4)",
      glowColorAlt: "rgba(232,121,249,0.3)",
      glowSize: size * 0.2,
      animDur: "4s",
      breatheDur: "3.5s",
      floatDur: "6s",
    },
    thinking: {
      baseFrequency: 0.035,
      scale: 6,
      glowColor: "rgba(99,102,241,0.6)",
      glowColorAlt: "rgba(168,85,247,0.5)",
      glowSize: size * 0.3,
      animDur: "0.6s",
      breatheDur: "1s",
      floatDur: "2s",
    },
    typing: {
      baseFrequency: 0.02,
      scale: 4,
      glowColor: "rgba(232,121,249,0.55)",
      glowColorAlt: "rgba(251,146,60,0.4)",
      glowSize: size * 0.28,
      animDur: "0.8s",
      breatheDur: "0.6s",
      floatDur: "3s",
    },
  }[state];

  return (
    <button
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{
        width: size + 20,
        height: size + 20,
        // Breathing + floating animation on the container
        animation: `avatar-breathe ${config.breatheDur} ease-in-out infinite, avatar-float ${config.floatDur} ease-in-out infinite`,
      }}
      aria-label="Toggle chat"
    >
      {/* Energy particles floating around */}
      {[...Array(6)].map((_, i) => (
        <span
          key={`particle-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            background: i % 2 === 0 ? config.glowColor : config.glowColorAlt,
            left: '50%',
            top: '50%',
            animation: `avatar-orbit ${3 + i * 0.7}s linear infinite`,
            animationDelay: `${i * -0.5}s`,
            transformOrigin: `${(size / 2) + 5 + i * 4}px 0px`,
            filter: 'blur(0.5px)',
            opacity: 0.7,
          }}
        />
      ))}

      {/* Outer aura - breathing glow */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: -8,
          background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
          animation: `avatar-aura ${config.breatheDur} ease-in-out infinite`,
          filter: `blur(${size * 0.08}px)`,
        }}
      />

      {/* Pulsing glow rings */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: 10 - i * 2,
            border: `1.5px solid ${i % 2 === 0 ? config.glowColor : config.glowColorAlt}`,
            animation: `chat-pulse ${parseFloat(config.animDur) + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
            opacity: 0.4 - i * 0.1,
          }}
        />
      ))}

      {/* Spinning halo - dual layer */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: 7,
          background: `conic-gradient(from 0deg, transparent 40%, ${config.glowColor} 50%, transparent 60%, transparent 90%, ${config.glowColorAlt} 95%, transparent 100%)`,
          animation: `spin ${parseFloat(config.animDur) * 1.5}s linear infinite`,
          filter: `blur(${size * 0.03}px)`,
        }}
      />
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: 8,
          background: `conic-gradient(from 180deg, transparent 50%, ${config.glowColorAlt} 60%, transparent 70%)`,
          animation: `spin ${parseFloat(config.animDur) * 2.5}s linear infinite reverse`,
          filter: `blur(${size * 0.025}px)`,
          opacity: 0.6,
        }}
      />

      {/* Inner glow backdrop - breathing */}
      <span
        className="absolute rounded-full pointer-events-none transition-all duration-500"
        style={{
          inset: 10,
          boxShadow: `
            0 0 ${config.glowSize}px ${config.glowSize / 2}px ${config.glowColor},
            inset 0 0 ${config.glowSize / 2}px ${config.glowSize / 4}px ${config.glowColorAlt}
          `,
          animation: `avatar-glow-pulse ${config.breatheDur} ease-in-out infinite`,
        }}
      />

      {/* SVG with distortion */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10 rounded-full"
        style={{
          position: 'absolute',
          left: 10,
          top: 10,
        }}
      >
        <defs>
          <clipPath id="avatar-clip">
            <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} />
          </clipPath>
          <filter id={filterId}>
            <feTurbulence
              type="turbulence"
              baseFrequency={config.baseFrequency}
              numOctaves={3}
              seed={42}
              result="turbulence"
            >
              <animate
                attributeName="baseFrequency"
                values={`${config.baseFrequency};${config.baseFrequency * 2};${config.baseFrequency * 1.2};${config.baseFrequency}`}
                dur={config.animDur}
                repeatCount="indefinite"
              />
              <animate
                attributeName="seed"
                values="42;57;31;42"
                dur={parseFloat(config.animDur) * 3 + "s"}
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={config.scale}
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                values={`${config.scale};${config.scale * 1.5};${config.scale}`}
                dur={config.animDur}
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
          {/* Subtle glow filter for the image */}
          <filter id={glowFilterId}>
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g clipPath="url(#avatar-clip)" filter={`url(#${filterId})`}>
          <image
            href="/zaila_chatbot.png"
            x="0"
            y="0"
            width={size}
            height={size}
            preserveAspectRatio="xMidYMid slice"
            filter={`url(#${glowFilterId})`}
          />
        </g>
        {/* Animated specular highlights - like eyes catching light */}
        <circle
          cx={size * 0.38}
          cy={size * 0.32}
          r={size * 0.12}
          fill="rgba(255,255,255,0.08)"
          className="pointer-events-none"
        >
          <animate
            attributeName="opacity"
            values="0.08;0.15;0.08"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx={size * 0.62}
          cy={size * 0.35}
          r={size * 0.06}
          fill="rgba(255,255,255,0.05)"
          className="pointer-events-none"
        >
          <animate
            attributeName="opacity"
            values="0.05;0.12;0.05"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Subtle inner shadow for depth */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="4"
          style={{ filter: 'blur(2px)' }}
          className="pointer-events-none"
        />
      </svg>

      {/* State indicator dot */}
      <span
        className="absolute z-20 rounded-full border-2 border-[#0a0a0a]"
        style={{
          width: 14,
          height: 14,
          bottom: 8,
          right: 8,
          background: state === 'typing'
            ? 'linear-gradient(135deg, #22c55e, #10b981)'
            : state === 'thinking'
            ? 'linear-gradient(135deg, #f59e0b, #eab308)'
            : 'linear-gradient(135deg, #22c55e, #10b981)',
          animation: state === 'thinking'
            ? 'avatar-status-pulse 0.8s ease-in-out infinite'
            : state === 'typing'
            ? 'avatar-status-pulse 0.4s ease-in-out infinite'
            : 'none',
        }}
      />
    </button>
  );
}

/* ================================================================
   TYPING DOTS
   ================================================================ */

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-zinc-500"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/* ================================================================
   CHAT WIDGET
   ================================================================ */

interface Message {
  from: "bot" | "user";
  text: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNode, setCurrentNode] = useState<string>("start");
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [leadData, setLeadData] = useState<Record<string, string>>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [conversationPath, setConversationPath] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Track conversation analytics */
  const trackNode = useCallback((nodeKey: string) => {
    setConversationPath((prev) => {
      const newPath = [...prev, nodeKey];
      // Log in development for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("[Chat Analytics] Path:", newPath.join(" → "));
      }
      return newPath;
    });
  }, []);

  /* Auto-scroll to bottom */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /* Focus input when node has input field */
  useEffect(() => {
    const node = TREE[currentNode];
    if (node?.input && !isTyping && open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentNode, isTyping, open]);

  /* Bot types a message character-by-character */
  const botType = useCallback((text: string, nodeKey: string) => {
    setIsTyping(true);
    setAvatarState("typing");

    let i = 0;
    const partial: Message = { from: "bot", text: "" };
    setMessages((prev) => [...prev, partial]);

    const interval = setInterval(() => {
      i++;
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { from: "bot", text: text.slice(0, i) };
        return copy;
      });
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setAvatarState("idle");
        setCurrentNode(nodeKey);
      }
    }, 18);
  }, []);

  /* Navigate to a tree node */
  const goTo = useCallback(
    (nodeKey: string) => {
      const node = TREE[nodeKey];
      if (!node) return;
      trackNode(nodeKey);
      setAvatarState("thinking");
      setTimeout(() => {
        botType(node.message, nodeKey);
      }, 400);
    },
    [botType, trackNode]
  );

  /* Start conversation on first open */
  const handleOpen = useCallback(() => {
    setOpen(true);
    if (!hasStarted) {
      setHasStarted(true);
      const startNode = TREE.start;
      setTimeout(() => botType(startNode.message, "start"), 300);
    }
  }, [hasStarted, botType]);

  /* Handle option click */
  const handleOption = useCallback(
    (label: string, next: string) => {
      if (isTyping) return;
      setMessages((prev) => [...prev, { from: "user", text: label }]);
      goTo(next);
    },
    [isTyping, goTo]
  );

  /* Handle text input submission */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const node = TREE[currentNode];
      if (!node?.input || isTyping || !inputValue.trim()) return;

      const value = inputValue.trim();
      setMessages((prev) => [...prev, { from: "user", text: value }]);
      setInputValue("");

      const updated = { ...leadData, [node.input.field]: value };
      setLeadData(updated);

      // If we just captured business, submit the lead with conversation path
      if (node.input.field === "business") {
        fetch("/api/chat-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...updated,
            conversationPath: conversationPath.join(" → "),
            capturedAt: new Date().toISOString(),
          }),
        }).catch(() => {
          /* silent fail — message still shows */
        });
      }

      goTo(node.input.next);
    },
    [currentNode, isTyping, inputValue, leadData, goTo, conversationPath]
  );

  const node = TREE[currentNode];

  return (
    <>
      {/* Keyframes injected once */}
      <style jsx global>{`
        @keyframes chat-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.18); opacity: 0; }
        }

        @keyframes avatar-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        @keyframes avatar-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        @keyframes avatar-orbit {
          0% { transform: rotate(0deg) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          50% { opacity: 0.4; }
          90% { opacity: 0.8; }
          100% { transform: rotate(360deg) translateX(0); opacity: 0; }
        }

        @keyframes avatar-aura {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }

        @keyframes avatar-glow-pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        @keyframes avatar-status-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
      `}</style>

      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-3">
        {/* Chat panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
              className="w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: "min(520px, 70vh)" }}
              data-lenis-prevent
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src="/zaila_chatbot.png"
                      alt="Zaila"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a0a]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Zaila</p>
                    <p className="text-[10px] text-emerald-400">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors text-lg leading-none cursor-pointer"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin"
                style={{ overscrollBehavior: 'contain', touchAction: 'pan-y' }}
                onWheel={(e) => {
                  const el = e.currentTarget;
                  const isAtTop = el.scrollTop === 0;
                  const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

                  // Prevent scroll propagation when not at boundaries, or when scrolling away from boundary
                  if ((!isAtTop && !isAtBottom) ||
                      (isAtTop && e.deltaY > 0) ||
                      (isAtBottom && e.deltaY < 0)) {
                    e.stopPropagation();
                  }

                  // Always stop if there's scrollable content
                  if (el.scrollHeight > el.clientHeight) {
                    e.stopPropagation();
                  }
                }}
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        msg.from === "user"
                          ? "bg-fuchsia-500/20 text-fuchsia-100 rounded-br-sm"
                          : "bg-white/[0.06] text-zinc-300 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.06] rounded-2xl rounded-bl-sm">
                      <TypingDots />
                    </div>
                  </div>
                )}

                {/* Quick-reply options */}
                {!isTyping && node?.options && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex flex-wrap gap-2 pt-1"
                  >
                    {node.options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => handleOption(opt.label, opt.next)}
                        className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/[0.07] px-3.5 py-1.5 text-xs text-fuchsia-300 hover:bg-fuchsia-500/[0.15] hover:border-fuchsia-500/40 transition-all cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Text input for lead capture */}
              {!isTyping && node?.input && (
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06]"
                >
                  <input
                    ref={inputRef}
                    type={node.input.field === "email" ? "email" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={node.input.placeholder}
                    className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-fuchsia-500/30 transition-colors"
                    autoComplete={node.input.field === "email" ? "email" : "off"}
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-fuchsia-500/20 px-3.5 py-2 text-sm text-fuchsia-300 hover:bg-fuchsia-500/30 transition-colors cursor-pointer"
                    aria-label="Send"
                  >
                    →
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating avatar button */}
        <AnimatedAvatar
          state={avatarState}
          size={60}
          onClick={open ? () => setOpen(false) : handleOpen}
        />
      </div>
    </>
  );
}
