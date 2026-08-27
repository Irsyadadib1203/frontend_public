"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Zap, Sparkles, Search, Layers, RefreshCw, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCarousel from '@/components/EventCarousel';
import LiveTicker from '@/components/LiveTicker';
import GameCard from '@/components/GameCard';
import { fetchPublicGames } from '@/lib/api';
import { Game, GameCategory } from '@/types';

// Focused strictly on Games & Voucher Game
const CATEGORIES: { label: string; value: GameCategory | 'Semua' }[] = [
  { label: 'Semua Produk', value: 'Semua' },
  { label: 'Mobile Games', value: 'Games' },
  { label: 'Voucher Game', value: 'Voucher' },
];

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'Semua'>('Semua');

  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublicGames();
      setGames(data);
    } catch (err: any) {
      console.error('Failed to load games:', err);
      setError('Gagal memuat katalog produk. Pastikan server Golang backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  // Filter games based on search and selected category (strictly Games & Voucher)
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (game.category !== 'Games' && game.category !== 'Voucher') return false;

      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.publisher && game.publisher.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        activeCategory === 'Semua' || game.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, activeCategory]);

  const popularGames = useMemo(() => {
    return games.filter((game) => game.is_popular && (game.category === 'Games' || game.category === 'Voucher'));
  }, [games]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      
      {/* Rich Cyber Background Lighting & Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Dynamic Glowing Radial Lights */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />
        
        {/* Cyber Hexagon/Grid Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(hsl(195 100% 50% / 0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <Navbar />

      <main className="flex-1 pt-20 relative z-10">
        {/* Live Transaction Marquee Ticker */}
        <LiveTicker />

        {/* Hero Section */}
        <section className="relative pt-6 pb-6 overflow-hidden">
          <div className="container mx-auto px-4 space-y-6">
            
            {/* Search Bar Placed ABOVE the Banner (Requirement 6) */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <input
                  type="text"
                  placeholder="Cari Game & Voucher favoritmu di IRXPlay... (e.g. Mobile Legends, Free Fire)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card/90 border border-primary/40 rounded-full pl-12 pr-4 py-4 text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all shadow-2xl backdrop-blur-xl"
                />
              </div>
            </div>

            {/* Banner Carousel */}
            <EventCarousel />

          </div>
        </section>

        {/* Category Tabs & Filter Section */}
        <section id="games-section" className="py-6 bg-card/40 border-y border-border/40 backdrop-blur-md">
          <div className="container mx-auto px-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start md:justify-center">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                        : 'bg-card/80 text-muted-foreground hover:text-foreground hover:bg-card border border-border/50'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

          </div>
        </section>

        {/* Game Populer Section - Minimalist Compact Layout */}
        {!searchQuery && activeCategory === 'Semua' && popularGames.length > 0 && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Zap className="h-4 w-4 fill-amber-400" />
                </div>
                <div>
                  <h2 className="font-gaming text-lg font-bold text-foreground">Game Populer</h2>
                  <p className="text-[11px] text-muted-foreground">Pilihan game paling favorit & transaksi tercepat</p>
                </div>
              </div>

              {/* Minimalist Compact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {popularGames.map((game, idx) => (
                  <GameCard key={game.id} game={game} delay={idx} variant="popular" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Products Catalog - Standard Rich Layout */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/15 text-primary border border-primary/30">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-gaming text-xl font-bold text-foreground">
                    {activeCategory === 'Semua' ? 'Semua Produk Game & Voucher' : activeCategory}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {filteredGames.length} produk siap di top-up 24 jam
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center max-w-md mx-auto my-8">
                <AlertCircle className="h-10 w-10 text-rose-400 mx-auto mb-3" />
                <p className="text-xs text-rose-300 font-semibold mb-4">{error}</p>
                <button
                  onClick={loadGames}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-card/40 border border-border/40 rounded-2xl p-3 space-y-3 animate-pulse">
                    <div className="aspect-[3/4] bg-muted/60 rounded-xl" />
                    <div className="h-4 bg-muted/60 rounded w-3/4" />
                    <div className="h-3 bg-muted/40 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* Games Grid */}
            {!loading && !error && filteredGames.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredGames.map((game, idx) => (
                  <GameCard key={game.id} game={game} delay={idx} variant="default" />
                ))}
              </div>
            )}

            {/* Empty Search Result */}
            {!loading && !error && filteredGames.length === 0 && (
              <div className="py-12 text-center space-y-3">
                <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                <h3 className="font-gaming text-base font-bold text-foreground">Produk Tidak Ditemukan</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Maaf, produk dengan kata kunci "{searchQuery}" tidak ditemukan.
                </p>
              </div>
            )}

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}