import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "TopUp Game";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://topupgame.com";

// generateMetadata dipanggil server-side per request — cocok untuk dynamic OG per game
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${API_BASE}/games/${slug}`, {
      next: { revalidate: 3600 }, // Cache 1 jam di server
    });

    if (!res.ok) throw new Error("not found");

    const json = await res.json();
    const game = json.data;

    const title = `Top Up ${game.name} Murah & Instan`;
    const description =
      game.description ||
      `Beli ${game.name} murah, aman, dan proses instan di ${SITE_NAME}. Harga terbaik, metode pembayaran lengkap.`;

    return {
      title,
      description,
      keywords: [
        `top up ${game.name}`,
        `topup ${game.name} murah`,
        `beli ${game.name}`,
        `${game.name} termurah`,
        "top up game",
        SITE_NAME,
      ],
      openGraph: {
        title: `${title} | ${SITE_NAME}`,
        description,
        url: `${SITE_URL}/game/${slug}`,
        images: game.image_url
          ? [{ url: game.image_url, width: 800, height: 600, alt: game.name }]
          : [{ url: "/og-default.jpg", width: 1200, height: 630, alt: SITE_NAME }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ${SITE_NAME}`,
        description,
        images: game.image_url ? [game.image_url] : ["/og-default.jpg"],
      },
    };
  } catch {
    // Fallback jika game tidak ditemukan
    return {
      title: "Top Up Game",
      description: `Top up game murah dan instan di ${SITE_NAME}`,
    };
  }
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}