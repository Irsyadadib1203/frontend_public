"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  Zap,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Building2,
  Headphones
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { createMemberDeposit, fetchUserDeposits, fetchPaymentMethods } from '@/lib/api';
import { Deposit, PaymentMethod } from '@/types';
import { toast } from 'sonner';

interface ManualBank {
  code: string;
  name: string;
  accountNo: string;
  accountName: string;
}

const MANUAL_BANKS: ManualBank[] = [
  { code: 'MANUAL_BCA', name: 'Bank BCA', accountNo: '8831234567', accountName: 'TOPUP GAME INDONESIA' },
  { code: 'MANUAL_BRI', name: 'Bank BRI', accountNo: '012301000123501', accountName: 'TOPUP GAME INDONESIA' },
  { code: 'MANUAL_MANDIRI', name: 'Bank Mandiri', accountNo: '1370012345678', accountName: 'TOPUP GAME INDONESIA' },
  { code: 'MANUAL_SEABANK', name: 'SeaBank', accountNo: '901234567890', accountName: 'TOPUP GAME INDONESIA' },
];

export default function DepositMemberPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [mode, setMode] = useState<'instant' | 'manual'>('instant');
  const [amount, setAmount] = useState<string>('50000');
  const [selectedInstantMethod, setSelectedInstantMethod] = useState<string>('QRIS');
  const [selectedManualBank, setSelectedManualBank] = useState<string>('MANUAL_BCA');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [activeDeposit, setActiveDeposit] = useState<Deposit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [copiedInvoice, setCopiedInvoice] = useState<boolean>(false);
  const [copiedPayCode, setCopiedPayCode] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);

  const QUICK_AMOUNTS = [20000, 50000, 100000, 250000, 500000, 1000000];

  const loadData = async () => {
    setLoading(true);
    try {
      const [pmData, depData] = await Promise.all([
        fetchPaymentMethods(),
        fetchUserDeposits(1, 20),
      ]);
      const validInstantMethods = pmData.filter((pm) => pm.is_active && pm.code !== 'SALDO');
      setPaymentMethods(validInstantMethods);
      if (validInstantMethods.length > 0 && !validInstantMethods.some(pm => pm.code === selectedInstantMethod)) {
        setSelectedInstantMethod(validInstantMethods[0].code);
      }
      setDeposits(depData.items);

      // Cek apakah ada deposit pending yang sedang aktif
      const pendingDep = depData.items.find((d) => d.status === 'pending');
      if (pendingDep && !activeDeposit) {
        setActiveDeposit(pendingDep);
      }
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
      loadData();
    }
  }, [user, authLoading, router]);

  // Realtime Polling saat activeDeposit pending
  useEffect(() => {
    if (!activeDeposit || activeDeposit.status !== 'pending') return;

    const interval = setInterval(async () => {
      try {
        const depData = await fetchUserDeposits(1, 10);
        const current = depData.items.find((d) => d.invoice_number === activeDeposit.invoice_number);
        if (current) {
          if (current.status !== activeDeposit.status) {
            setActiveDeposit(current);
            setDeposits(depData.items);
            if (current.status === 'approved') {
              toast.success('Deposit Berhasil! Saldo telah masuk ke akun Anda.');
              refreshUser();
            }
          }
        }
      } catch (err) {
        console.error('Check deposit status error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeDeposit, refreshUser]);

  // Kalkulasi estimasi biaya untuk mode instan
  const instantFeeCalculation = useMemo(() => {
    const numAmount = Number(amount) || 0;
    const pm = paymentMethods.find((p) => p.code === selectedInstantMethod);
    if (!pm) return { fee: 0, total: numAmount };

    const pFee = pm.fee_percent ?? pm.percent_fee ?? 0;
    const fFee = pm.fee_flat ?? pm.fixed_fee ?? 0;
    const percentFee = (numAmount * pFee) / 100;
    const totalFee = fFee + percentFee;
    return {
      fee: totalFee,
      total: numAmount + totalFee,
    };
  }, [amount, selectedInstantMethod, paymentMethods]);

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 10000) {
      toast.error('Minimal deposit saldo adalah Rp 10.000');
      return;
    }

    const chosenMethod = mode === 'instant' ? selectedInstantMethod : selectedManualBank;

    setSubmitting(true);
    const res = await createMemberDeposit(numAmount, chosenMethod);
    setSubmitting(false);

    if (res.success && res.data) {
      toast.success('Permintaan deposit berhasil dibuat!');
      setActiveDeposit(res.data);
      refreshUser();
      loadData();
    } else {
      toast.error(res.message || 'Gagal mengajukan deposit.');
    }
  };

  const copyToClipboard = (text: string, type: 'invoice' | 'paycode' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'invoice') {
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2000);
    } else if (type === 'paycode') {
      setCopiedPayCode(true);
      setTimeout(() => setCopiedPayCode(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
    toast.success('Disalin ke papan klip!');
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (authLoading || !user) return null;

  const currentManualBank = MANUAL_BANKS.find((b) => b.code === selectedManualBank) || MANUAL_BANKS[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/member')}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
            </button>

            {/* User Saldo Header Badge */}
            <div className="bg-card border border-border/80 px-4 py-1.5 rounded-2xl flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">Saldo Saat Ini:</span>
              <span className="font-mono text-xs font-extrabold text-emerald-400">
                {formatRupiah(user.balance)}
              </span>
            </div>
          </div>

          {/* ACTIVE DEPOSIT BILL / PAYMENT INVOICE (IF ANY) */}
          {activeDeposit && activeDeposit.status === 'pending' && (
            <div className="mb-8 bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-4 w-4 animate-pulse" /> Tagihan Deposit Menunggu Pembayaran
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="font-mono text-lg font-extrabold text-foreground tracking-wider">
                      {activeDeposit.invoice_number}
                    </h2>
                    <button
                      onClick={() => copyToClipboard(activeDeposit.invoice_number, 'invoice')}
                      className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground"
                    >
                      {copiedInvoice ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setActiveDeposit(null)}
                  className="text-xs text-muted-foreground hover:text-foreground underline decoration-dotted"
                >
                  Tutup Tampilan Tagihan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground block">Jumlah Yang Harus Ditransfer</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-2xl md:text-3xl font-extrabold text-amber-400">
                        {formatRupiah(activeDeposit.total_amount)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(String(activeDeposit.total_amount), 'amount')}
                        className="p-1 rounded bg-muted text-muted-foreground"
                        title="Salin Jumlah"
                      >
                        {copiedAmount ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {activeDeposit.unique_code > 0 && (
                      <p className="text-[11px] text-rose-400 font-semibold mt-1">
                        ⚠️ Wajib transfer persis hingga 3 digit kode unik ({activeDeposit.unique_code}) agar verifikasi berhasil!
                      </p>
                    )}
                  </div>

                  <div className="bg-background/80 rounded-2xl p-4 border border-border/60 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nominal Saldo:</span>
                      <span className="font-bold text-foreground">{formatRupiah(activeDeposit.amount)}</span>
                    </div>
                    {activeDeposit.admin_fee ? (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Biaya Gateway:</span>
                        <span className="font-mono text-foreground">{formatRupiah(activeDeposit.admin_fee)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Metode Bayar:</span>
                      <span className="font-bold text-primary">{activeDeposit.payment_method}</span>
                    </div>
                  </div>

                  {/* Manual Transfer Destination Info */}
                  {activeDeposit.payment_type === 'manual' && (
                    <div className="bg-muted/40 p-4 rounded-2xl border border-border/60 space-y-2">
                      <span className="text-[11px] text-muted-foreground block font-mono">REKENING TUJUAN TRANSFER:</span>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-foreground">{currentManualBank.name}</p>
                          <p className="font-mono text-sm font-extrabold text-emerald-400">{currentManualBank.accountNo}</p>
                          <p className="text-[10px] text-muted-foreground">a.n {currentManualBank.accountName}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(currentManualBank.accountNo, 'paycode')}
                          className="px-3 py-1.5 bg-muted text-xs font-bold rounded-xl border border-border/50 hover:bg-muted/80 flex items-center gap-1.5"
                        >
                          {copiedPayCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />} Salin Rekening
                        </button>
                      </div>

                      <div className="pt-2">
                        <a
                          href={`https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20sudah%20transfer%20deposit%20dengan%20nomor%20invoice%20${activeDeposit.invoice_number}%20sebesar%20${formatRupiah(activeDeposit.total_amount)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 py-2 rounded-xl border border-emerald-500/30 transition-all"
                        >
                          <Headphones className="h-3.5 w-3.5" /> Konfirmasi Transfer via WhatsApp
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Virtual Account / Code Display */}
                  {activeDeposit.payment_reference && activeDeposit.payment_type !== 'manual' && (
                    <div className="bg-background/80 p-4 rounded-2xl border border-border/60 text-center space-y-1">
                      <span className="text-[10px] text-muted-foreground font-mono block">KODE / NOMOR VIRTUAL ACCOUNT:</span>
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono text-base font-extrabold text-foreground">
                          {activeDeposit.payment_reference}
                        </span>
                        <button
                          onClick={() => copyToClipboard(activeDeposit.payment_reference || '', 'paycode')}
                          className="p-1 rounded bg-muted text-muted-foreground"
                        >
                          {copiedPayCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* QRIS / Checkout URL Container */}
                <div className="flex flex-col items-center justify-center space-y-3">
                  {activeDeposit.qr_url ? (
                    <div className="p-4 bg-white rounded-2xl border border-border text-center shadow-lg">
                      <p className="text-xs text-gray-800 font-bold mb-2">Scan QRIS Untuk Tambah Saldo</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeDeposit.qr_url}
                        alt="QRIS Deposit"
                        className="w-48 h-48 md:w-56 md:h-56 object-contain rounded-lg border border-gray-200 mx-auto"
                      />
                      <p className="text-[10px] text-gray-500 mt-2">Dukungan: GoPay, OVO, DANA, BCA, Mandiri, BRI, BNI & Semua QRIS</p>
                    </div>
                  ) : null}

                  {activeDeposit.checkout_url ? (
                    <a
                      href={activeDeposit.checkout_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full max-w-xs inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all"
                    >
                      Buka Halaman Pembayaran Tripay <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}

                  <div className="text-center text-[11px] text-muted-foreground flex items-center gap-1.5 animate-pulse">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" /> Menunggu transfer masuk (Otomatis deteksi)...
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Deposit Form */}
            <div className="lg:col-span-7 bg-card/90 border border-border/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="font-gaming text-lg font-bold text-foreground">Deposit Saldo Akun</h1>
                  <p className="text-xs text-muted-foreground">Pilih jalur instan otomatis 24 jam atau transfer bank bebas biaya admin.</p>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-muted/40 p-1.5 rounded-2xl border border-border/50">
                <button
                  type="button"
                  onClick={() => setMode('instant')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === 'instant'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>⚡ Instan 24/7 (Otomatis)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('manual')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === 'manual'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span> Bebas Biaya (Manual)</span>
                </button>
              </div>

              <form onSubmit={handleSubmitDeposit} className="space-y-5">
                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Jumlah Deposit Saldo (Rp)</label>
                  <input
                    type="number"
                    min="10000"
                    step="1000"
                    placeholder="Minimal 10.000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-muted/50 border border-border/60 rounded-xl px-4 py-3 text-sm font-mono font-bold text-emerald-400 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Quick Amounts */}
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(String(amt))}
                      className={`py-2 px-1 rounded-xl text-[11px] font-mono font-bold border transition-all ${
                        Number(amount) === amt
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                          : 'bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted'
                      }`}
                    >
                      {formatRupiah(amt)}
                    </button>
                  ))}
                </div>

                {/* Mode: Instant Tripay Payment Channels */}
                {mode === 'instant' && (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-foreground">
                      Pilih Kanal Pembayaran Otomatis Tripay:
                    </label>

                    {paymentMethods.length === 0 ? (
                      <div className="p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground text-center">
                        Memuat daftar kanal pembayaran Tripay...
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                        {paymentMethods.map((pm) => (
                          <div
                            key={pm.code}
                            onClick={() => setSelectedInstantMethod(pm.code)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                              selectedInstantMethod === pm.code
                                ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                : 'bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted/40'
                            }`}
                          >
                            <span className="text-xs font-bold text-foreground truncate">{pm.name}</span>
                            <span className="text-[10px] text-muted-foreground mt-1 font-mono">
                              Fee: {(pm.fee_flat || pm.fixed_fee || 0) > 0 ? formatRupiah(pm.fee_flat || pm.fixed_fee || 0) : ''}
                              {(pm.fee_percent || pm.percent_fee || 0) > 0 ? ` +${pm.fee_percent || pm.percent_fee}%` : ''}
                              {!(pm.fee_flat || pm.fixed_fee) && !(pm.fee_percent || pm.percent_fee) ? 'Gratis' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fee Summary */}
                    <div className="bg-muted/30 rounded-2xl p-3.5 border border-border/50 space-y-1.5 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Nominal Saldo Masuk:</span>
                        <span className="font-mono font-bold text-foreground">{formatRupiah(Number(amount) || 0)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Biaya Penanganan (Gateway):</span>
                        <span className="font-mono text-foreground">{formatRupiah(instantFeeCalculation.fee)}</span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t border-border/40 font-extrabold text-sm">
                        <span className="text-foreground">Total Tagihan:</span>
                        <span className="font-mono text-amber-400">{formatRupiah(instantFeeCalculation.total)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mode: Manual Bank Transfer (0% Fee) */}
                {mode === 'manual' && (
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-foreground">
                      Pilih Rekening Bank Tujuan (0% Biaya Admin):
                    </label>

                    <div className="grid grid-cols-2 gap-2.5">
                      {MANUAL_BANKS.map((b) => (
                        <div
                          key={b.code}
                          onClick={() => setSelectedManualBank(b.code)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                            selectedManualBank === b.code
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                              : 'bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted/40'
                          }`}
                        >
                          <Building2 className="h-5 w-5" />
                          <div>
                            <p className="text-xs font-bold text-foreground">{b.name}</p>
                            <p className="text-[10px] text-emerald-400 font-bold font-mono">Bebas Biaya (0%)</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 text-xs text-muted-foreground leading-relaxed space-y-1.5">
                      <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Keuntungan Transfer Manual:
                      </p>
                      <p className="text-[11px]">
                        100% Bebas biaya admin. Cocok untuk deposit jumlah besar/reseller. Sistem akan menyisipkan 3 digit kode unik (misal Rp 100.214) yang akan masuk utuh menjadi saldo akun Anda.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3.5 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                    mode === 'instant'
                      ? 'bg-primary hover:bg-primary/90 shadow-primary/20'
                      : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                  }`}
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Memproses Permintaan...
                    </>
                  ) : mode === 'instant' ? (
                    <>
                      <Zap className="h-4 w-4 text-amber-300" /> Bayar Instan 24 Jam
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" /> Ajukan Transfer Manual (0% Fee)
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Deposit History */}
            <div className="lg:col-span-5 bg-card/90 border border-border/80 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                  <h2 className="font-gaming text-sm font-bold text-foreground">
                    Riwayat Deposit
                  </h2>
                  <button
                    onClick={loadData}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="py-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-primary" /> Memuat data...
                  </div>
                ) : deposits.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">Belum ada riwayat deposit.</div>
                ) : (
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {deposits.map((dep) => (
                      <div
                        key={dep.id}
                        onClick={() => dep.status === 'pending' && setActiveDeposit(dep)}
                        className={`p-3.5 bg-muted/30 border rounded-2xl flex items-center justify-between text-xs transition-all ${
                          dep.status === 'pending'
                            ? 'border-amber-500/40 hover:bg-amber-500/5 cursor-pointer'
                            : 'border-border/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-extrabold text-emerald-400">
                              {formatRupiah(dep.total_amount)}
                            </span>
                            {dep.payment_type === 'instant' ? (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold">
                                INSTAN
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                MANUAL
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground block font-mono">
                            {dep.invoice_number} ({dep.payment_method})
                          </span>
                          <span className="text-[10px] text-muted-foreground block">
                            {new Date(dep.created_at).toLocaleString('id-ID')}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className={`font-bold uppercase text-[10px] px-2.5 py-1 rounded-full border ${
                            dep.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                            dep.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse' :
                            'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}>
                            {dep.status === 'approved' ? 'Berhasil' : dep.status === 'pending' ? 'Menunggu' : dep.status}
                          </span>
                          {dep.status === 'pending' && (
                            <span className="text-[10px] text-amber-400 block mt-1 underline">Lihat Bayar</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border/50 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Jaminan Keamanan Transaksi
                </span>
                Saldo yang berhasil terverifikasi akan langsung tercatat di mutasi saldo dan dapat digunakan berbelanja 24/7.
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
