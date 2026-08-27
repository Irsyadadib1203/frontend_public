"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldCheck, Zap, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchRecentTransactions } from '@/lib/api';

interface LiveTxItem {
  id: number | string;
  invoice_number: string;
  customer_id: string;
  game_name: string;
  nominal_name: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export default function LiveTransactionTable() {
  const [transactions, setTransactions] = useState<LiveTxItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to mask invoice number in the middle: e.g. "INV-20260825-1234" => "INV*******34"
  const maskInvoice = (inv: string) => {
    if (!inv) return 'IRX*******00';
    if (inv.length <= 6) return inv;
    const prefix = inv.substring(0, 3);
    const suffix = inv.substring(inv.length - 2);
    return `${prefix}*******${suffix}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const loadData = async () => {
    try {
      const data = await fetchRecentTransactions();
      if (Array.isArray(data) && data.length > 0) {
        // Map and cap to 15 items
        setTransactions(data.slice(0, 15));
      }
    } catch (err) {
      console.error('Failed fetching live transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 5 seconds for live update
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderStatusBadge = (status: string) => {
    const st = (status || 'pending').toLowerCase();
    if (st === 'success' || st === 'sukses') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-sans">
          <CheckCircle2 className="h-3 w-3" /> Sukses
        </span>
      );
    }
    if (st === 'processing') {
      return (
        <span className="inline-flex items-center gap-1 bg-sky-500/15 text-sky-400 border border-sky-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-sans">
          <RefreshCw className="h-3 w-3 animate-spin" /> Diproses
        </span>
      );
    }
    if (st === 'failed' || st === 'gagal') {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-sans">
          <AlertCircle className="h-3 w-3" /> Gagal
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-sans">
        <Clock className="h-3 w-3" /> Pending
      </span>
    );
  };

  return (
    <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-2xl space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/15 text-primary border border-primary/30">
            <Zap className="h-5 w-5 fill-primary" />
          </div>
          <div>
            <h3 className="font-gaming text-base font-bold text-foreground flex items-center gap-2">
              Transaksi Terakhir (Live Feed)
            </h3>
            <p className="text-xs text-muted-foreground">
              Memuat 15 transaksi terbaru secara otomatis 24 jam nonstop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] text-emerald-400 font-bold font-mono uppercase tracking-wider">
            Live Updates
          </span>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <span>Memuat 15 transaksi terbaru...</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          Belum ada data transaksi live.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-gaming uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Waktu</th>
                <th className="p-3">Kategori / Game</th>
                <th className="p-3">Nomor Invoice</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              <AnimatePresence initial={false}>
                {transactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id || tx.invoice_number || index}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(tx.created_at)}
                    </td>
                    <td className="p-3 font-sans">
                      <span className="font-bold text-foreground block">
                        {tx.game_name || 'Game Top Up'}
                      </span>
                      {tx.nominal_name && (
                        <span className="text-[10px] text-primary block truncate max-w-[180px]">
                          {tx.nominal_name}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-cyan-400 tracking-wider whitespace-nowrap">
                      {maskInvoice(tx.invoice_number)}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      {renderStatusBadge(tx.status)}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
