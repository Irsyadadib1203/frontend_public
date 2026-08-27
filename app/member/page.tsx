"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Wallet,
  Receipt,
  Key,
  LogOut,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { fetchUserTransactions, fetchUserDeposits } from '@/lib/api';
import { Transaction, Deposit } from '@/types';

export default function MemberDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, refreshUser } = useAuth();

  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [recentDeposits, setRecentDeposits] = useState<Deposit[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      async function loadMemberData() {
        setLoadingData(true);
        try {
          const [txData, depData] = await Promise.all([
            fetchUserTransactions(1, 5),
            fetchUserDeposits(1, 5),
          ]);
          setRecentTx(txData.items);
          setRecentDeposits(depData.items);
        } catch (err) {
          console.error('Failed loading member data:', err);
        } finally {
          setLoadingData(false);
        }
      }
      loadMemberData();
    }
  }, [user, authLoading, router]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center">
        <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="font-gaming text-sm text-muted-foreground">Memuat dashboard member...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-card via-card/90 to-card border border-border/80 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 text-primary font-bold flex items-center justify-center font-gaming text-2xl border border-primary/30 shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-gaming text-xl md:text-2xl font-extrabold text-foreground">{user.name}</h1>
                    <span className="text-[10px] font-bold text-primary bg-primary/15 px-2.5 py-0.5 rounded-full border border-primary/30 uppercase">
                      TIER {user.tier || 'MEMBER'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Saldo & Deposit Button */}
              <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-mono">SALDO AKUN</span>
                  <span className="font-mono text-xl font-extrabold text-emerald-400">
                    {formatRupiah(user.balance || 0)}
                  </span>
                </div>
                <Link
                  href="/member/deposit"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <PlusCircle className="h-4 w-4" /> Deposit
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Member Nav Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link
              href="/member/deposit"
              className="bg-card/80 border border-border/60 hover:border-emerald-500/60 p-5 rounded-2xl transition-all hover:scale-[1.02] shadow-lg group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-gaming text-sm font-bold text-foreground">Deposit Saldo</h3>
                  <p className="text-xs text-muted-foreground">Isi ulang saldo akun instan</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-400" />
            </Link>

            <Link
              href="/member/transactions"
              className="bg-card/80 border border-border/60 hover:border-primary/60 p-5 rounded-2xl transition-all hover:scale-[1.02] shadow-lg group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/15 text-primary group-hover:scale-110 transition-transform">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-gaming text-sm font-bold text-foreground">Riwayat Transaksi</h3>
                  <p className="text-xs text-muted-foreground">Daftar semua pesanan Anda</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>

            <Link
              href="/member/api-key"
              className="bg-card/80 border border-border/60 hover:border-cyan-500/60 p-5 rounded-2xl transition-all hover:scale-[1.02] shadow-lg group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Key className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-gaming text-sm font-bold text-foreground">API Key Reseller</h3>
                  <p className="text-xs text-muted-foreground">Integrasi H2H API Server</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-cyan-400" />
            </Link>
          </div>

          {/* Recent Member Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Orders */}
            <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="font-gaming text-sm font-bold text-foreground flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" /> Transaksi Terakhir
                </h3>
                <Link href="/member/transactions" className="text-xs text-primary font-bold hover:underline">
                  Lihat Semua
                </Link>
              </div>

              {loadingData ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Memuat data...</div>
              ) : recentTx.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Belum ada riwayat transaksi.</div>
              ) : (
                <div className="space-y-2.5">
                  {recentTx.map((tx) => (
                    <Link
                      key={tx.id}
                      href={`/invoice/${tx.invoice_number}`}
                      className="p-3 bg-muted/30 hover:bg-muted/60 border border-border/40 rounded-2xl flex items-center justify-between transition-all block text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-foreground">{tx.invoice_number}</span>
                        <span className="text-[11px] text-muted-foreground block">
                          {tx.game?.name || 'Game'} - {formatRupiah(tx.total_amount)}
                        </span>
                      </div>
                      <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full border ${
                        tx.status === 'success' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                        tx.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                        'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}>
                        {tx.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Deposits */}
            <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h3 className="font-gaming text-sm font-bold text-foreground flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-emerald-400" /> Riwayat Deposit Saldo
                </h3>
                <Link href="/member/deposit" className="text-xs text-emerald-400 font-bold hover:underline">
                  Tambah Saldo
                </Link>
              </div>

              {loadingData ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Memuat data...</div>
              ) : recentDeposits.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Belum ada riwayat deposit saldo.</div>
              ) : (
                <div className="space-y-2.5">
                  {recentDeposits.map((dep) => (
                    <div
                      key={dep.id}
                      className="p-3 bg-muted/30 border border-border/40 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-emerald-400">{formatRupiah(dep.total_amount)}</span>
                        <span className="text-[11px] text-muted-foreground block font-mono">
                          {dep.invoice_number} ({dep.payment_method})
                        </span>
                      </div>
                      <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full border ${
                        dep.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                        dep.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                        'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}>
                        {dep.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
