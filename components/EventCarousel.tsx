"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  badge_text: string;
  is_active: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Fallback banners jika API belum ada data
const FALLBACK_BANNERS: Banner[] = [
  {
    id: 0,
    title: "Selamat Datang di IRXPlay",
    subtitle: "Platform top-up game terpercaya & tercepat. Top-up 24 jam non-stop!",
    image_url: "",
    link_url: "",
    badge_text: "PROMO AKTIF",
    is_active: true,
  },
];

export default function EventCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/banners`, {
          next: { revalidate: 60 },
        });
        const json = await res.json();
        const data: Banner[] = json?.data || [];
        setBanners(data.length > 0 ? data : FALLBACK_BANNERS);
      } catch {
        setBanners(FALLBACK_BANNERS);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  // Auto-slide every 5 seconds
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % (banners.length || 1));
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + (banners.length || 1)) % (banners.length || 1));
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (loading) {
    return (
      <div className="w-full h-48 sm:h-64 md:h-80 bg-card/40 border border-border/40 rounded-2xl animate-pulse" />
    );
  }

  const banner = banners[current];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border/50 shadow-2xl">
      {/* Banner Slide */}
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
        {/* Background Image */}
        {banner.image_url ? (
          <img
            src={banner.image_url}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 ${
            banner.image_url
              ? "bg-gradient-to-r from-black/75 via-black/40 to-transparent"
              : "bg-gradient-to-r from-primary/30 via-purple-900/40 to-cyan-900/20"
          }`}
        />

        {/* Decorative glowing orbs when no image */}
        {!banner.image_url && (
          <>
            <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-1/4 right-1/3 w-36 h-36 bg-purple-500/20 rounded-full blur-[60px]" />
          </>
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 lg:px-14 max-w-2xl">
          {banner.badge_text && (
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[11px] font-bold uppercase tracking-widest w-fit">
              {banner.badge_text}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-gaming font-bold text-white leading-tight drop-shadow-lg">
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p className="mt-2 text-xs sm:text-sm text-slate-200/90 max-w-md drop-shadow-md">
              {banner.subtitle}
            </p>
          )}
          {banner.link_url && (
            <a
              href={banner.link_url}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold w-fit hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
            >
              Lihat Promo
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-5 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}