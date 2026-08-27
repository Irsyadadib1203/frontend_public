"use client";

import { useEffect, useState } from "react";
import { Newspaper, Clock, Tag, ChevronRight, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image_url: string;
  read_time: string;
  is_published: boolean;
  created_at: string;
}

const CATEGORIES = ["Semua", "Promo", "Update", "Event", "Patch Notes"];

const CATEGORY_COLORS: Record<string, string> = {
  Promo: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Update: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  Event: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  "Patch Notes": "bg-purple-500/15 text-purple-400 border border-purple-500/30",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BeritaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const loadArticles = async (cat?: string) => {
    setLoading(true);
    setError(null);
    try {
      const query = cat && cat !== "Semua" ? `?category=${encodeURIComponent(cat)}` : "";
      const res = await fetch(`${API_BASE}/articles${query}`);
      const json = await res.json();
      setArticles(json?.data || []);
    } catch {
      setError("Gagal memuat berita. Periksa koneksi server backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(hsl(195 100% 50% / 0.8) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <Navbar />

      <main className="flex-1 pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Newspaper className="w-3.5 h-3.5" />
              Berita & Info Terbaru
            </div>
            <h1 className="font-gaming text-3xl md:text-4xl font-bold text-foreground">
              Berita{" "}
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                IRXPlay
              </span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Update terbaru seputar promo, event, patch notes, dan informasi game favorit Anda.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none justify-center flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                    : "bg-card/80 text-muted-foreground hover:text-foreground hover:bg-card border border-border/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center max-w-md mx-auto mb-8">
              <p className="text-xs text-rose-300 mb-4">{error}</p>
              <button
                onClick={() => loadArticles(activeCategory)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Coba Lagi
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-muted/50" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-muted/50 rounded w-1/3" />
                    <div className="h-4 bg-muted/50 rounded w-4/5" />
                    <div className="h-3 bg-muted/40 rounded w-full" />
                    <div className="h-3 bg-muted/40 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          {!loading && !error && articles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="group bg-card/60 border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-muted/30 overflow-hidden flex-shrink-0">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          CATEGORY_COLORS[article.category] || "bg-card/80 text-muted-foreground border border-border"
                        } backdrop-blur-sm`}
                      >
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.read_time}
                      </span>
                      <span>{formatDate(article.created_at)}</span>
                    </div>

                    <h3 className="font-gaming font-bold text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 flex-1">
                      {article.excerpt}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/40">
                      <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group/btn">
                        Baca Selengkapnya
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && articles.length === 0 && (
            <div className="py-16 text-center">
              <Newspaper className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-gaming text-lg font-bold text-foreground mb-2">Belum Ada Berita</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {activeCategory !== "Semua"
                  ? `Belum ada artikel dalam kategori "${activeCategory}".`
                  : "Belum ada artikel yang dipublikasikan. Tambahkan melalui Admin Panel."}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
