import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "../posts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };
    return {
      title: `${post.title} | Zaila AI Designs`,
      description: post.description,
      alternates: { canonical: `https://zailai.com/blog/${post.slug}` },
      openGraph: {
        title: post.title,
        description: post.description,
        url: `https://zailai.com/blog/${post.slug}`,
        type: "article",
        publishedTime: post.date,
      },
    };
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-6 pt-28 pb-20">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M10 4L6 8L10 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        All articles
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block rounded-full bg-fuchsia-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-fuchsia-400">
            {post.category}
          </span>
          <span className="text-[11px] text-zinc-600">{post.readTime}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-zinc-400">{post.description}</p>
        <time
          dateTime={post.date}
          className="mt-4 block text-sm text-zinc-500"
        >
          {new Date(post.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      {/* Content - rendered from markdown-like content */}
      <div className="prose-zaila">
        {post.content.split("\n\n").map((block, i) => {
          if (block.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="text-2xl font-semibold text-white mt-12 mb-4 tracking-tight"
              >
                {block.replace("## ", "")}
              </h2>
            );
          }
          if (block.startsWith("### ")) {
            return (
              <h3
                key={i}
                className="text-lg font-semibold text-white mt-8 mb-3"
              >
                {block.replace("### ", "")}
              </h3>
            );
          }
          if (block.startsWith("- ")) {
            return (
              <ul key={i} className="space-y-2 my-4 ml-4">
                {block.split("\n").map((line, j) => (
                  <li
                    key={j}
                    className="text-[15px] leading-[1.8] text-zinc-300 list-disc list-outside marker:text-zinc-600"
                  >
                    {renderInlineMarkdown(line.replace(/^- /, ""))}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p
              key={i}
              className="text-[15px] leading-[1.8] text-zinc-300 my-4"
            >
              {renderInlineMarkdown(block)}
            </p>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-fuchsia-500/5 to-violet-500/5 p-8 text-center">
        <h3 className="text-xl font-semibold text-white">
          Want results like these for your business?
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Get a free consultation and custom proposal within 24 hours.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-all hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)]"
        >
          Start your project
        </Link>
      </div>
    </article>
  );
}

function renderInlineMarkdown(text: string) {
  // Split on bold markers and link markers
  const parts: (string | React.ReactElement)[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Check for link [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // Check for bold **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

    if (!linkMatch && !boldMatch) {
      parts.push(remaining);
      break;
    }

    const linkIndex = linkMatch ? remaining.indexOf(linkMatch[0]) : Infinity;
    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;

    if (linkIndex < boldIndex && linkMatch) {
      if (linkIndex > 0) parts.push(remaining.slice(0, linkIndex));
      parts.push(
        <Link
          key={`link-${keyIndex++}`}
          href={linkMatch[2]}
          className="text-fuchsia-400 hover:underline"
        >
          {linkMatch[1]}
        </Link>
      );
      remaining = remaining.slice(linkIndex + linkMatch[0].length);
    } else if (boldMatch) {
      if (boldIndex > 0) parts.push(remaining.slice(0, boldIndex));
      parts.push(
        <strong key={`bold-${keyIndex++}`} className="font-semibold text-white">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldIndex + boldMatch[0].length);
    }
  }

  return <>{parts}</>;
}
