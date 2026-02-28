import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localPages, getLocalPageBySlug } from "../pages";
import { ServicePageClient } from "./client";

export function generateStaticParams() {
  return localPages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const page = getLocalPageBySlug(slug);
    if (!page) return { title: "Not Found" };
    return {
      title: page.metaTitle,
      description: page.metaDescription,
      alternates: { canonical: `https://zailai.com/services/${page.slug}` },
      openGraph: {
        title: page.metaTitle,
        description: page.metaDescription,
        url: `https://zailai.com/services/${page.slug}`,
        images: [
          {
            url: "/logo.png",
            width: 1200,
            height: 630,
            alt: page.metaTitle,
          },
        ],
      },
    };
  });
}

export default async function LocalServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLocalPageBySlug(slug);
  if (!page) notFound();

  // JSON-LD for local service page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.metaDescription,
    provider: { "@id": "https://zailai.com/#business" },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Ontario",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://zailai.com" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://zailai.com/services" },
      { "@type": "ListItem", position: 3, name: page.title, item: `https://zailai.com/services/${page.slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <ServicePageClient
        slug={page.slug}
        title={page.title}
        h1={page.h1}
        subtitle={page.subtitle}
        intro={page.intro}
        features={page.features}
        stats={page.stats}
        faq={page.faq}
      />
    </>
  );
}
