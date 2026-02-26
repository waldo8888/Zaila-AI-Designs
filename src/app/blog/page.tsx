import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { blogPosts } from "./posts";

export const metadata: Metadata = {
  title: "Blog — AI Web Design Insights | Zaila AI Designs",
  description:
    "Tips on AI-powered web design, local SEO, and conversion optimization for small businesses. Grow smarter with Zaila.",
  alternates: { canonical: "https://zailai.com/blog" },
  openGraph: {
    title: "Blog — AI Web Design Insights | Zaila AI Designs",
    description:
      "Tips on AI-powered web design, local SEO, and conversion optimization for small businesses.",
    url: "https://zailai.com/blog",
  },
};

const categoryColors: Record<string, string> = {
  "AI & Web Design": "text-fuchsia-400 bg-fuchsia-500/10",
  "Local Business": "text-violet-400 bg-violet-500/10",
  Conversion: "text-cyan-400 bg-cyan-500/10",
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-28 pb-20">
      <SectionHeading
        eyebrow="Blog"
        title="Insights & strategy"
        description="Practical guides on AI web design, local SEO, and growing your business online."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 transition-all hover:border-white/[0.12] hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${
                  categoryColors[post.category] ?? "text-zinc-400 bg-zinc-500/10"
                }`}
              >
                {post.category}
              </span>
              <span className="text-[11px] text-zinc-600">{post.readTime}</span>
            </div>
            <h3 className="text-lg font-semibold text-white leading-snug tracking-tight group-hover:text-fuchsia-300 transition-colors">
              {post.title}
            </h3>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-3">
              {post.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="mt-5 text-sm font-medium text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Read article →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
