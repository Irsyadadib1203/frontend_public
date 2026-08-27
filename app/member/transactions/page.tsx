"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Receipt, ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { fetchUserTransactions } from '@/lib/api';
import { Transaction } from '@/types';

export default function MemberTransactionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const loadData = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await fetchUserTransactions(currentPage, 15);
      setTransactions(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      loadData(page);
    }
  }, [user, authLoading, page, router]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <button
            onClick={() => router.push('/member')}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
          </button>

          <div className="bg-card/90 border border-border/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-gaming text-xl font-bold text-foreground">Riwayat Transaksi Member</h1>
                  <p className="text-xs text-muted-foreground">Daftar lengkap semua transaksi yang pernah Anda lakukan.</p>
                </div>
              </div>

              <button
                onClick={() => loadData(page)}
                className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center text-xs text-muted-foreground">Memuat riwayat transaksi...</div>
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center text-xs text-muted-foreground">Belum ada riwayat transaksi.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 border-b border-border/60 text-muted-foreground font-gaming uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Invoice</th>
                      <th className="p-3">Game & Item</th>
                      <th className="p-3">User ID</th>
                      <th className="p-3">Total Tagihan</th>
                      <th className="p-3">Metode</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-bold text-foreground">{tx.invoice_number}</td>
                        <td className="p-3 font-sans">
                          <span className="font-bold text-foreground block">{tx.game?.name || 'Game'}</span>
                          <span className="text-[11px] text-muted-foreground">{tx.nominal?.name || 'Item'}</span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {tx.customer_id} {tx.server_id ? `(${tx.server_id})` : ''}
                        </td>
                        <td className="p-3 text-primary font-bold">{formatRupiah(tx.total_amount)}</td>
                        <td className="p-3 text-muted-foreground font-sans">{tx.payment_method}</td>
                        <td className="p-3 text-center font-sans">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            tx.status === 'success' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                            tx.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                            'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3 text-center font-sans">
                          <Link
                            href={`/invoice/${tx.invoice_number}`}
                            className="p-1.5 rounded-lg bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center gap-1 transition-all text-[11px]"
                          >
                            Detail <ExternalLink className="h-3 w-3" />
                          </Link>
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
