"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { fetchRecentTransactions } from '@/lib/api';

export default function LiveTicker() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    async function loadRecent() {
      const data = await fetchRecentTransactions();
      if (active && data.length > 0) {
        setRecentOrders(data);
      }
    }

    loadRecent();
    const interval = setInterval(loadRecent, 15000); // refresh every 15s

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (recentOrders.length === 0) return null;

  return (
    <div className="bg-card/40 border-y border-border/40 py-2.5 overflow-hidden relative">
      <div className="container mx-auto px-4 flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0 bg-primary/15 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full border border-primary/30 shadow-sm">
          <Zap className="h-3.5 w-3.5 animate-bounce" />
          <span>TRANSAKSI REALTIME</span>
        </div>

        <div className="overflow-hidden relative w-full mask-marquee">
          <motion.div
            className="flex items-center gap-8 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {[...recentOrders, ...recentOrders].map((tx, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono text-foreground font-semibold">{tx.customer_id || 'User'}</span>
                <span>membeli</span>
                <span className="text-primary font-semibold">{tx.nominal_name || tx.game_name || 'Item Top Up'}</span>
                <span className="text-[10px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono">
                  {tx.payment_method || 'QRIS'}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                  SUKSES
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
