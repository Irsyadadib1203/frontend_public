"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Receipt, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveTransactionTable from '@/components/LiveTransactionTable';
import { toast } from 'sonner';

export default function CekTransaksiPage() {
  const router = useRouter();
  const [invoiceInput, setInvoiceInput] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceInput.trim()) {
      toast.error('Masukkan nomor invoice terlebih dahulu.');
      return;
    }
    router.push(`/invoice/${invoiceInput.trim()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      
      {/* Background Ambient Cyber Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <main className="flex-1 pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl space-y-10">
          
          {/* Cek Transaksi Box */}
          <div className="bg-card/90 border border-border/80 rounded-3xl p-8 shadow-2xl space-y-6 text-center max-w-xl mx-auto backdrop-blur-md">
            
            <div className="h-16 w-16 rounded-3xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
              <Receipt className="h-8 w-8" />
            </div>

            <div>
              <h1 className="font-gaming text-2xl font-extrabold text-foreground">
                Cek Status Transaksi
              </h1>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Lacak status pesanan top-up Anda secara realtime dengan memasukkan nomor invoice.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4 pt-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Masukkan Nomor Invoice (Contoh: IRX... / INV-...)"
                  value={invoiceInput}
                  onChange={(e) => setInvoiceInput(e.target.value)}
                  className="w-full bg-muted/50 border border-border/60 rounded-2xl pl-12 pr-4 py-4 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-primary to-cyan-400 hover:shadow-lg hover:shadow-primary/30 text-primary-foreground font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>Lacak Pesanan</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-border/50 text-left space-y-2 text-xs text-muted-foreground">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-primary" /> Di mana menemukan Nomor Invoice?
              </span>
              <p className="leading-relaxed text-[11px]">
                Nomor invoice dikirimkan otomatis ke WhatsApp / Email setelah Anda membuat pesanan. Nomor invoice diawali dengan <span className="font-mono text-primary font-bold">IRX</span> atau <span className="font-mono text-primary font-bold">INV-</span>.
              </p>
            </div>

          </div>

          {/* LIVE TRANSAKSI TABLE PLACEMENT (Requirement 1) */}
          <div>
            <LiveTransactionTable />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
