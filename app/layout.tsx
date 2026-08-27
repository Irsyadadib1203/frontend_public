import type { Metadata } from "next";
import "@/app/global.css";
import { Providers } from "@/components/providers"

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "TopUp Game";
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL  || "https://topupgame.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Top Up Game Murah & Instan`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Top up game online murah, aman, dan proses instan. Mobile Legends, Free Fire, PUBG, Genshin Impact, dan 100+ game lainnya. Bayar via QRIS, transfer bank, dan dompet digital.",
  keywords: [
    "top up game", "topup murah", "topup mobile legends", "beli diamond murah",
    "topup free fire", "topup pubg", "topup genshin impact", "voucher game online",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "id_ID",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Top Up Game Murah`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
