import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "TopUp Game";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://topupgame.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${API_BASE}/articles/${slug}`, {
      next: { revalidate: 1800 }, // Cache 30 menit
    });

    if (!res.ok) throw new Error("not found");

    const json = await res.json();
    const article = json.data;

    const title = article.title || "Berita & Promo";
    const description =
      article.excerpt || article.content?.slice(0, 160) || `Baca berita dan promo terbaru di ${SITE_NAME}`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | ${SITE_NAME}`,
        description,
        url: `${SITE_URL}/berita/${slug}`,
        images: article.thumbnail
          ? [{ url: article.thumbnail, width: 1200, height: 630, alt: title }]
          : [{ url: "/og-default.jpg", width: 1200, height: 630, alt: SITE_NAME }],
        type: "article",
        publishedTime: article.created_at,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ${SITE_NAME}`,
        description,
        images: article.thumbnail ? [article.thumbnail] : ["/og-default.jpg"],
      },
    };
  } catch {
    return {
      title: "Berita & Promo",
      description: `Baca berita, promo, dan event terbaru di ${SITE_NAME}`,
    };
  }
}

export default function BeritaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}