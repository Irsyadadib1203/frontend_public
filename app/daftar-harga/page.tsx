"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Tag, Gamepad2, RefreshCw, Layers } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchPublicGames } from '@/lib/api';
import { Game, Nominal } from '@/types';

export default function DaftarHargaPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGameId, setSelectedGameId] = useState<number | 'all'>('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchPublicGames();
        setGames(data);
      } catch (err) {
        console.error('Failed to load games:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Flatten all nominals with game info
  const allNominals = useMemo(() => {
    const list: { gameName: string; nominal: Nominal }[] = [];
    games.forEach((g) => {
      if (selectedGameId !== 'all' && g.id !== selectedGameId) return;
      if (g.nominals) {
        g.nominals.forEach((n) => {
          if (!n.is_active) return;
          if (
            searchQuery &&
            !g.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !n.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return;
          }
          list.push({ gameName: g.name, nominal: n });
        });
      }
    });
    return list;
  }, [games, selectedGameId, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="mb-8 text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 px-3 py-1 rounded-full text-xs font-bold text-primary">
              <Tag className="h-3.5 w-3.5" /> Transparansi Harga Reseller & Member
            </div>
            <h1 className="font-gaming text-2xl md:text-4xl font-extrabold text-foreground">
              Daftar Harga Produk
            </h1>
            <p className="text-xs text-muted-foreground">
              Periksa daftar harga lengkap semua game dan tingkatan diskon tier (Public, Member, VIP, Reseller).
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card/80 border border-border/80 rounded-2xl p-4 mb-6 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari Game atau Nominal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/50 border border-border/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {/* Game Selector Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
              <select
                value={selectedGameId}
                onChange={(e) => setSelectedGameId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full md:w-64 bg-muted/50 border border-border/60 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">Semua Game</option>
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Table */}
          <div className="bg-card/90 border border-border/80 rounded-3xl overflow-hidden shadow-2xl">
            {loading ? (
              <div className="py-16 text-center">
                <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Memuat daftar harga...</p>
              </div>
            ) : allNominals.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Gamepad2 className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                <p className="text-xs font-bold text-foreground">Tidak Ada Data Produk</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 border-b border-border/60 text-muted-foreground font-gaming uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Game</th>
                      <th className="p-4">Item Nominal</th>
                      <th className="p-4">Harga Publik</th>
                      <th className="p-4 text-emerald-400">Harga Member</th>
                      <th className="p-4 text-cyan-400">Harga VIP</th>
                      <th className="p-4 text-amber-400">Harga Reseller</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {allNominals.map(({ gameName, nominal }, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-bold font-sans text-foreground">{gameName}</td>
                        <td className="p-4 font-sans text-foreground/90">{nominal.name}</td>
                        <td className="p-4 text-foreground font-bold">{formatRupiah(nominal.price_public)}</td>
                        <td className="p-4 text-emerald-400 font-bold">{formatRupiah(nominal.price_member)}</td>
                        <td className="p-4 text-cyan-400 font-bold">{formatRupiah(nominal.price_vip)}</td>
                        <td className="p-4 text-amber-400 font-bold">{formatRupiah(nominal.price_reseller)}</td>
                        <td className="p-4 text-center font-sans">
                          {nominal.is_active ? (
                            <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                              Tersedia
                            </span>
                          ) : (
                            <span className="bg-rose-500/15 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                              Gangguan
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
