import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/spline-test/"],
      },
    ],
    sitemap: "https://zailai.com/sitemap.xml",
  };
}
