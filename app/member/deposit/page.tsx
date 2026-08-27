"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, PlusCircle, RefreshCw, ArrowLeft, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { createMemberDeposit, fetchUserDeposits, fetchPaymentMethods } from '@/lib/api';
import { Deposit, PaymentMethod } from '@/types';
import { toast } from 'sonner';

export default function DepositMemberPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [amount, setAmount] = useState<string>('50000');
  const [selectedMethod, setSelectedMethod] = useState<string>('QRIS');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const QUICK_AMOUNTS = [20000, 50000, 100000, 250000, 500000, 1000000];

  const loadData = async () => {
    setLoading(true);
    try {
      const [pmData, depData] = await Promise.all([
        fetchPaymentMethods(),
        fetchUserDeposits(1, 20),
      ]);
      setPaymentMethods(pmData.filter((pm) => pm.is_active && pm.code !== 'SALDO'));
      setDeposits(depData.items);
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

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 10000) {
      toast.error('Minimal deposit saldo adalah Rp 10.000');
      return;
    }

    setSubmitting(true);
    const res = await createMemberDeposit(numAmount, selectedMethod);
    setSubmitting(false);

    if (res.success && res.data) {
      toast.success('Permintaan deposit berhasil dibuat!');
      refreshUser();
      loadData();
    } else {
      toast.error(res.message || 'Gagal mengajukan deposit.');
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <button
            onClick={() => router.push('/member')}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Deposit Form */}
            <div className="lg:col-span-6 bg-card/90 border border-border/80 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-border/50 pb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="font-gaming text-lg font-bold text-foreground">Deposit Saldo Akun</h1>
                  <p className="text-xs text-muted-foreground">Isi ulang saldo untuk transaksi kilat tanpa biaya admin.</p>
                </div>
              </div>

              <form onSubmit={handleSubmitDeposit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Jumlah Deposit (Rp)</label>
                  <input
                    type="number"
                    min="10000"
                    step="1000"
                    placeholder="Minimal 10.000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-muted/50 border border-border/60 rounded-xl px-4 py-3 text-xs font-mono font-bold text-emerald-400 placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
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

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Metode Pembayaran</label>
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-full bg-muted/50 border border-border/60 rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                  >
                    <option value="QRIS">QRIS All Payment</option>
                    <option value="BCA">Transfer Bank BCA</option>
                    <option value="BRI">Transfer Bank BRI</option>
                    <option value="MANDIRI">Transfer Bank Mandiri</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Memproses...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" /> Ajukan Deposit
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Deposit History */}
            <div className="lg:col-span-6 bg-card/90 border border-border/80 rounded-3xl p-6 shadow-2xl space-y-4">
              <h2 className="font-gaming text-base font-bold text-foreground border-b border-border/50 pb-3">
                Riwayat Deposit Anda
              </h2>

              {loading ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Memuat data...</div>
              ) : deposits.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Belum ada deposit.</div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {deposits.map((dep) => (
                    <div
                      key={dep.id}
                      className="p-3.5 bg-muted/30 border border-border/40 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono text-sm font-extrabold text-emerald-400 block">
                          {formatRupiah(dep.total_amount)}
                        </span>
                        <span className="text-[11px] text-muted-foreground block font-mono">
                          {dep.invoice_number} ({dep.payment_method})
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {new Date(dep.created_at).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <span className={`font-bold uppercase text-[10px] px-2.5 py-1 rounded-full border ${
                        dep.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                        dep.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse' :
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
