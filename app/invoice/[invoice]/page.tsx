"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  ArrowLeft,
  Headphones,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchTransactionByInvoice } from '@/lib/api';
import { Transaction } from '@/types';
import { toast } from 'sonner';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceNumber = params?.invoice as string;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedInvoice, setCopiedInvoice] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const loadInvoice = async () => {
    if (!invoiceNumber) return;
    try {
      const data = await fetchTransactionByInvoice(invoiceNumber);
      if (data) {
        setTransaction(data);
      }
    } catch (err) {
      console.error('Error loading invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoice();
  }, [invoiceNumber]);

  // SSE: Real-time status stream — ganti polling 8s dengan push server langsung
  useEffect(() => {
    if (!invoiceNumber) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    const sseUrl = `${API_BASE}/transactions/${invoiceNumber}/stream`;

    let es: EventSource | null = null;
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;

    const FINAL_STATUSES = ['success', 'failed', 'refunded'];

    const isFinal = (status?: string) => status ? FINAL_STATUSES.includes(status) : false;

    const connectSSE = () => {
      if (typeof window === 'undefined' || !window.EventSource) {
        // Fallback: browser tidak support SSE, pakai polling biasa
        fallbackInterval = setInterval(loadInvoice, 8000);
        return;
      }

      es = new EventSource(sseUrl);

      es.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'status_update' && msg.payload?.status) {
            setTransaction(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                status: msg.payload.status,
                completed_at: msg.payload.completed_at ?? prev.completed_at,
              };
            });
            // Tutup koneksi SSE jika sudah final
            if (isFinal(msg.payload.status)) {
              es?.close();
            }
          } else if (msg.type === 'timeout') {
            // Server menutup setelah 5 menit — EventSource akan auto-reconnect
            es?.close();
          }
        } catch {
          // Ignore parse errors (heartbeat comments, dsb)
        }
      };

      es.onerror = () => {
        // EventSource akan otomatis reconnect — tidak perlu fallback
        // Tapi jika status sudah final, tutup untuk hemat resource
        setTransaction(prev => {
          if (prev && isFinal(prev.status)) es?.close();
          return prev;
        });
      };
    };

    connectSSE();

    return () => {
      es?.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [invoiceNumber]);

  const copyToClipboard = (text: string, type: 'invoice' | 'ref') => {
    navigator.clipboard.writeText(text);
    if (type === 'invoice') {
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
    toast.success('Disalin ke papan klip!');
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-400 font-extrabold text-xs">
            <CheckCircle2 className="h-4 w-4" /> TRANSAKSI SUKSES
          </div>
        );
      case 'processing':
        return (
          <div className="inline-flex items-center gap-2 bg-sky-500/15 border border-sky-500/30 px-4 py-2 rounded-full text-sky-400 font-extrabold text-xs">
            <RefreshCw className="h-4 w-4 animate-spin" /> SEDANG DIPROSES PROVIDER
          </div>
        );
      case 'failed':
        return (
          <div className="inline-flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 px-4 py-2 rounded-full text-rose-400 font-extrabold text-xs">
            <AlertCircle className="h-4 w-4" /> TRANSAKSI GAGAL
          </div>
        );
      case 'refunded':
        return (
          <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/30 px-4 py-2 rounded-full text-purple-400 font-extrabold text-xs">
            <RefreshCw className="h-4 w-4" /> DANA DIKEMBALIKAN (REFUNDED)
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-4 py-2 rounded-full text-amber-400 font-extrabold text-xs animate-pulse">
            <Clock className="h-4 w-4" /> MENUNGGU PEMBAYARAN
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center">
        <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="font-gaming text-sm text-muted-foreground">Memuat invoice transaksi...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-rose-500 mx-auto" />
          <h2 className="font-gaming text-2xl font-bold">Invoice Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground">Pastikan nomor invoice yang Anda cari sudah benar.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs"
          >
            Kembali ke Beranda
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Navigation back */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog Game
            </button>

            <button
              onClick={loadInvoice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded-xl border border-border/50 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Status
            </button>
          </div>

          {/* Invoice Card */}
          <div className="bg-card/90 border border-border/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/60 text-center md:text-left">
              <div>
                <span className="text-xs text-muted-foreground block font-mono">NOMOR INVOICE</span>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                  <h1 className="font-mono text-xl md:text-2xl font-extrabold text-foreground tracking-wider">
                    {transaction.invoice_number}
                  </h1>
                  <button
                    onClick={() => copyToClipboard(transaction.invoice_number, 'invoice')}
                    className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                    title="Salin Invoice"
                  >
                    {copiedInvoice ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>{renderStatusBadge(transaction.status)}</div>
            </div>

            {/* Payment Instruction (If Pending) */}
            {transaction.status === 'pending' && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <QrCode className="h-4 w-4" /> Instruksi Pembayaran ({transaction.payment_method})
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono">Bayar Sebelum 24 Jam</span>
                </div>

                <div className="pt-2 border-t border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground block">Jumlah Yang Harus Dibayar</span>
                    <span className="font-mono text-2xl font-extrabold text-amber-400">
                      {formatRupiah(transaction.total_amount)}
                    </span>
                  </div>

                  {transaction.payment_reference && (
                    <div className="bg-background/80 px-4 py-2.5 rounded-xl border border-border/60 text-center">
                      <span className="text-[10px] text-muted-foreground block font-mono">KODE / NOMOR VA</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-foreground">
                          {transaction.payment_reference}
                        </span>
                        <button
                          onClick={() => copyToClipboard(transaction.payment_reference || '', 'ref')}
                          className="p-1 rounded bg-muted text-muted-foreground"
                        >
                          {copiedRef ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Lakukan pembayaran persis sesuai nominal di atas. Setelah transfer berhasil, sistem akan mendeteksi otomatis dan memproses item top up Anda dalam 1 detik.
                </p>
              </div>
            )}

            {/* Serial Number Info (If Success) */}
            {transaction.status === 'success' && transaction.payment_reference && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-xs text-emerald-400 font-bold block">SN / Kode Voucher:</span>
                <span className="font-mono text-base font-extrabold text-foreground select-all">
                  {transaction.payment_reference}
                </span>
              </div>
            )}

            {/* Item Details */}
            <div className="space-y-3">
              <h3 className="font-gaming text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
                Rincian Item Top Up
              </h3>

              <div className="bg-muted/20 border border-border/40 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kategori Game</span>
                  <span className="font-bold text-foreground">{transaction.game?.name || 'Game Top Up'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono font-bold text-foreground">
                    {transaction.customer_id} {transaction.server_id ? `(${transaction.server_id})` : ''}
                  </span>
                </div>

                {transaction.nickname && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nickname</span>
                    <span className="font-bold text-emerald-400">{transaction.nickname}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-border/30">
                  <span className="text-muted-foreground">Item Produk</span>
                  <span className="font-bold text-foreground">{transaction.nominal?.name || 'Item Nominal'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metode Pembayaran</span>
                  <span className="font-bold text-primary">{transaction.payment_method}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waktu Pemesanan</span>
                  <span className="font-mono text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga Produk</span>
                <span className="font-mono text-foreground">{formatRupiah(transaction.selling_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Penanganan / Admin</span>
                <span className="font-mono text-foreground">{formatRupiah(transaction.admin_fee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/60 text-sm font-extrabold">
                <span className="text-foreground">Total Pembayaran</span>
                <span className="font-mono text-primary">{formatRupiah(transaction.total_amount)}</span>
              </div>
            </div>

            {/* Help / CS Footer */}
            <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Butuh bantuan transaksi ini?
              </span>
              <a
                href={`https://wa.me/6281234567890?text=Halo%20CS%20TopUpStore,%20saya%20butuh%20bantuan%20dengan%20invoice%20${transaction.invoice_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/30 transition-all"
              >
                <Headphones className="h-3.5 w-3.5" /> Chat CS WhatsApp
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
