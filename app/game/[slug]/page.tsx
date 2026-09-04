"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Search,
  Wallet,
  QrCode,
  CreditCard,
  Building2,
  Store,
  Phone,
  Mail,
  User as UserIcon,
  ChevronRight,
  RefreshCw,
  Sparkles,
  X,
  Tag,
  Lock,
  LogIn
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { fetchGameBySlug, checkNickname, fetchPaymentMethods, createTransactionOrder } from '@/lib/api';
import { Game, Nominal, PaymentMethod, Transaction } from '@/types';
import { toast } from 'sonner';

export default function GameDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const { user, refreshUser } = useAuth();

  const [game, setGame] = useState<Game | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [userIdInput, setUserIdInput] = useState<string>('');
  const [serverIdInput, setServerIdInput] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [checkingNick, setCheckingNick] = useState<boolean>(false);
  const [nickValidated, setNickValidated] = useState<boolean>(false);

  const [selectedNominal, setSelectedNominal] = useState<Nominal | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');

  // Confirmation & Auth Modals
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [gData, pmData] = await Promise.all([
          fetchGameBySlug(slug),
          fetchPaymentMethods(),
        ]);

        if (active) {
          if (!gData) {
            setError('Game tidak ditemukan.');
          } else {
            setGame(gData);
            if (gData.nominals && gData.nominals.length > 0) {
              const activeNominals = gData.nominals.filter((n) => n.is_active);
              if (activeNominals.length > 0) {
                setSelectedNominal(activeNominals[0]);
              }
            }
          }

          setPaymentMethods(pmData);
          if (pmData.length > 0) {
            setSelectedPayment(pmData[0]);
          }
        }
      } catch (err: any) {
        console.error('Failed to load game detail:', err);
        if (active) setError('Gagal memuat detail game.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [slug]);

  // Handle Nickname Check
  const handleCheckNickname = async () => {
    if (!game) return;
    if (!userIdInput.trim()) {
      toast.error('Masukkan User ID terlebih dahulu.');
      return;
    }

    setCheckingNick(true);
    setNickValidated(false);
    setNickname('');

    const code = game.nickname_check_code || game.name.toUpperCase().replace(/\s+/g, '_');
    const res = await checkNickname(code, userIdInput, serverIdInput);

    setCheckingNick(false);
    if (res.success && res.nickname) {
      setNickname(res.nickname);
      setNickValidated(true);
      toast.success(`Nickname ditemukan: ${res.nickname}`);
    } else {
      setNickValidated(false);
      toast.error(res.message || 'Gagal memverifikasi ID Game.');
    }
  };

  // Price calculations based on User Tier & Payment Fee
  const getItemPrice = (nominal: Nominal) => {
    if (!user) return nominal.price_public;
    switch (user.tier) {
      case 'vip':
        return nominal.price_vip || nominal.price_member;
      case 'reseller':
        return nominal.price_reseller || nominal.price_vip;
      case 'member':
        return nominal.price_member || nominal.price_public;
      default:
        return nominal.price_public;
    }
  };

  const calculateTotal = () => {
    if (!selectedNominal) return 0;
    const baseSelling = getItemPrice(selectedNominal);
    if (!selectedPayment) return baseSelling;

    let fee = selectedPayment.fee_flat || 0;
    if (selectedPayment.fee_percent > 0) {
      fee += baseSelling * (selectedPayment.fee_percent / 100);
    }
    return Math.round(baseSelling + fee);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Group payment methods by category (Requirement 2: ALWAYS show Saldo option)
  const groupedPayments = useMemo(() => {
    const categories: Record<string, PaymentMethod[]> = {
      balance: [
        {
          id: 999,
          code: 'SALDO',
          name: 'Saldo Akun IRXPLAY',
          category: 'balance',
          description: user ? `Saldo Anda: ${formatRupiah(user.balance || 0)}` : 'Wajib Login / Registrasi untuk bayar via Saldo',
          fee_flat: 0,
          fee_percent: 0,
          is_active: true,
        },
      ],
      qris: [],
      ewallet: [],
      virtual_account: [],
      retail: [],
    };

    paymentMethods.forEach((pm) => {
      if (!pm.is_active) return;
      // Normalize backend category string → frontend group key
      const rawCat = (pm.category || '').toLowerCase().replace(/\s+/g, '_');
      let cat: string;
      if (rawCat === 'e-wallet' || rawCat === 'e_wallet' || rawCat === 'ewallet') {
        cat = 'ewallet';
      } else if (rawCat === 'virtual_account' || rawCat === 'virtual account') {
        cat = 'virtual_account';
      } else if (rawCat === 'qris') {
        cat = 'qris';
      } else if (rawCat === 'convenience_store' || rawCat === 'convenience store' || rawCat === 'retail') {
        cat = 'retail';
      } else if (rawCat === 'saldo_akun' || rawCat === 'balance') {
        cat = 'balance';
      } else {
        cat = 'qris'; // fallback ke qris
      }
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(pm);
    });

    return categories;
  }, [paymentMethods, user]);

  const handleSelectPayment = (pm: PaymentMethod) => {
    if (pm.code === 'SALDO' && !user) {
      setSelectedPayment(pm);
      setShowAuthRequiredModal(true);
      return;
    }
    setSelectedPayment(pm);
  };

  const handleSubmitOrder = async () => {
    if (!game || !selectedNominal || !selectedPayment) {
      toast.error('Lengkapi semua pilihan terlebih dahulu.');
      return;
    }

    if (!userIdInput.trim()) {
      toast.error('Masukkan User ID Akun Game Anda.');
      return;
    }

    if (game.has_zone_id && !serverIdInput.trim()) {
      toast.error('Masukkan Zone ID / Server Akun Game Anda.');
      return;
    }

    if (!phoneInput.trim()) {
      toast.error('Masukkan Nomor WhatsApp untuk menerima struk transaksi.');
      return;
    }

    // REQUIREMENT 2: If Saldo is selected and user is NOT logged in, require login!
    if (selectedPayment.code === 'SALDO' && !user) {
      setShowAuthRequiredModal(true);
      return;
    }

    // Check if Saldo payment has enough balance
    if (selectedPayment.code === 'SALDO' && user) {
      const totalCost = calculateTotal();
      if (user.balance < totalCost) {
        toast.error('Saldo Akun Anda tidak mencukupi. Silakan lakukan deposit saldo terlebih dahulu.');
        return;
      }
    }

    setShowConfirmModal(true);
  };

  const handleConfirmPay = async () => {
    if (!game || !selectedNominal || !selectedPayment) return;

    setSubmitting(true);
    try {
      const res = await createTransactionOrder({
        game_id: game.id,
        nominal_id: selectedNominal.id,
        customer_id: userIdInput.trim(),
        server_id: serverIdInput.trim(),
        customer_phone: phoneInput.trim(),
        customer_email: emailInput.trim(),
        nickname: nickname,
        payment_method: selectedPayment.code,
        user_id: user ? user.id : undefined,
      });

      if (res.success && res.data) {
        toast.success('Pesanan berhasil dibuat!');
        if (refreshUser) {
          refreshUser();
        }
        setShowConfirmModal(false);
        router.push(`/invoice/${res.data.invoice_number}`);
      } else {
        toast.error(res.message || 'Gagal membuat pesanan transaksi.');
      }
    } catch (err: any) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center">
        <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="font-gaming text-sm text-muted-foreground">Memuat detail game...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-rose-500 mx-auto" />
          <h2 className="font-gaming text-2xl font-bold">{error || 'Game Tidak Ditemukan'}</h2>
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

      <main className="flex-1 pt-20 pb-28">
        
        {/* Top Game Banner */}
        <section className="relative bg-card/60 border-b border-border/50 py-8 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              
              {/* Game Thumbnail */}
              <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-3xl overflow-hidden border-2 border-primary/40 shadow-xl shadow-primary/20 shrink-0 bg-muted">
                <Image
                  src={game.image_url || '/placeholder-game.png'}
                  alt={game.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Game Info */}
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="bg-primary/15 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-primary/30">
                    {game.category}
                  </span>
                  {game.publisher && (
                    <span className="bg-muted text-muted-foreground text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                      {game.publisher}
                    </span>
                  )}
                </div>

                <h1 className="font-gaming text-2xl md:text-4xl font-extrabold text-foreground">
                  {game.name}
                </h1>

                <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                  {game.description || 'Top-Up Diamond / Voucher instan resmi 24 jam nonstop. Masukkan ID Akun, pilih nominal, selesaikan pembayaran, dan pesanan akan otomatis diproses.'}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-4 text-[11px] text-emerald-400 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" /> Proses 1 Detik
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Garansi Legal 100%
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Main Form Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form Steps Column */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* STEP 1: ACCOUNT DATA */}
                <div className="bg-card/80 border border-border/60 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                    <div className="h-8 w-8 rounded-xl bg-primary/20 text-primary font-bold flex items-center justify-center font-gaming text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="font-gaming text-base font-bold text-foreground">Lengkapi Data Akun</h3>
                      <p className="text-xs text-muted-foreground">Masukkan ID Game untuk verifikasi nickname tujuan.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        {game.user_id_label || 'User ID'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 12345678"
                        value={userIdInput}
                        onChange={(e) => setUserIdInput(e.target.value)}
                        className="w-full bg-muted/50 border border-border/60 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    {game.has_zone_id && (
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">
                          {game.zone_id_label || 'Zone ID / Server'} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: 2124"
                          value={serverIdInput}
                          onChange={(e) => setServerIdInput(e.target.value)}
                          className="w-full bg-muted/50 border border-border/60 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Nickname Validation Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/20 p-3 rounded-2xl border border-border/40">
                    <div className="text-xs">
                      {checkingNick ? (
                        <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Memeriksa ID...
                        </span>
                      ) : nickValidated ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Nickname: {nickname}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Pastikan User ID sudah benar sebelum pesan.</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleCheckNickname}
                      disabled={checkingNick}
                      className="w-full sm:w-auto px-4 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/40 font-bold rounded-xl text-xs transition-all shrink-0"
                    >
                      Cek Nickname
                    </button>
                  </div>
                </div>

                {/* STEP 2: NOMINAL SELECTION */}
                <div className="bg-card/80 border border-border/60 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-primary/20 text-primary font-bold flex items-center justify-center font-gaming text-sm">
                        2
                      </div>
                      <div>
                        <h3 className="font-gaming text-base font-bold text-foreground">Pilih Nominal Top Up</h3>
                        <p className="text-xs text-muted-foreground">Pilih jumlah item yang ingin dibeli.</p>
                      </div>
                    </div>

                    {user && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        Tier {user.tier.toUpperCase()} Active
                      </span>
                    )}
                  </div>

                  {(!game.nominals || game.nominals.length === 0) ? (
                    <p className="text-xs text-muted-foreground py-4 text-center">Belum ada nominal produk untuk game ini.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {game.nominals
                        .filter((nom) => nom.is_active)
                        .map((nom) => {
                          const isSelected = selectedNominal?.id === nom.id;
                          const price = getItemPrice(nom);
                          const hasDiscount = user && price < nom.price_public;

                          return (
                            <button
                              key={nom.id}
                              type="button"
                              onClick={() => setSelectedNominal(nom)}
                              className={`relative p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-primary/15 border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/40'
                                  : 'bg-muted/40 border-border/50 hover:bg-muted/70 hover:border-border'
                              }`}
                            >
                              <div>
                                <span className="text-xs font-bold text-foreground block line-clamp-2 leading-snug">
                                  {nom.name}
                                </span>
                              </div>

                              <div className="mt-3 pt-2 border-t border-border/30 flex items-end justify-between">
                                <div>
                                  {hasDiscount && (
                                    <span className="text-[10px] text-muted-foreground line-through block">
                                      {formatRupiah(nom.price_public)}
                                    </span>
                                  )}
                                  <span className="font-mono text-xs font-extrabold text-primary">
                                    {formatRupiah(price)}
                                  </span>
                                </div>

                                {isSelected && (
                                  <CheckCircle2 className="h-4 w-4 text-primary fill-primary/20 shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* STEP 3: PAYMENT METHOD SELECTION (Requirement 2) */}
                <div className="bg-card/80 border border-border/60 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                    <div className="h-8 w-8 rounded-xl bg-primary/20 text-primary font-bold flex items-center justify-center font-gaming text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="font-gaming text-base font-bold text-foreground">Pilih Metode Pembayaran</h3>
                      <p className="text-xs text-muted-foreground">Pilih kanal pembayaran yang diinginkan.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Saldo Akun (ALWAYS DISPLAYED - REQUIREMENT 2) */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Wallet className="h-3.5 w-3.5" /> Pembayaran Saldo Akun Member
                      </span>
                      {groupedPayments.balance.map((pm) => (
                        <button
                          key={pm.code}
                          type="button"
                          onClick={() => handleSelectPayment(pm)}
                          className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                            selectedPayment?.code === pm.code
                              ? 'bg-emerald-500/15 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                              : 'bg-muted/40 border-border/50 hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                              <Wallet className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">{pm.name}</h4>
                              <p className="text-[11px] text-muted-foreground">{pm.description}</p>
                            </div>
                          </div>

                          {user ? (
                            <span className="text-xs font-mono font-bold text-emerald-400">Bebas Admin</span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Lock className="h-3 w-3" /> Wajib Login
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* QRIS & E-Wallet */}
                    {groupedPayments.qris.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <QrCode className="h-3.5 w-3.5 text-primary" /> QRIS & E-Wallet (Instan)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {groupedPayments.qris.map((pm) => (
                            <button
                              key={pm.code}
                              type="button"
                              onClick={() => handleSelectPayment(pm)}
                              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                selectedPayment?.code === pm.code
                                  ? 'bg-primary/15 border-primary ring-2 ring-primary/30'
                                  : 'bg-muted/40 border-border/50 hover:bg-muted'
                              }`}
                            >
                              <span className="text-xs font-bold text-foreground">{pm.name}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                Fee: {pm.fee_flat ? formatRupiah(pm.fee_flat) : `${pm.fee_percent}%`}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Virtual Account */}
                    {groupedPayments.virtual_account.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-secondary" /> Virtual Account Bank
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {groupedPayments.virtual_account.map((pm) => (
                            <button
                              key={pm.code}
                              type="button"
                              onClick={() => handleSelectPayment(pm)}
                              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                selectedPayment?.code === pm.code
                                  ? 'bg-primary/15 border-primary ring-2 ring-primary/30'
                                  : 'bg-muted/40 border-border/50 hover:bg-muted'
                              }`}
                            >
                              <span className="text-xs font-bold text-foreground">{pm.name}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                Fee: {formatRupiah(pm.fee_flat)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* STEP 4: CONTACT INFO */}
                <div className="bg-card/80 border border-border/60 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                    <div className="h-8 w-8 rounded-xl bg-primary/20 text-primary font-bold flex items-center justify-center font-gaming text-sm">
                      4
                    </div>
                    <div>
                      <h3 className="font-gaming text-base font-bold text-foreground">Kontak Bukti Transaksi</h3>
                      <p className="text-xs text-muted-foreground">Struk dan notifikasi transaksi akan dikirimkan via WhatsApp.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Nomor WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="tel"
                          placeholder="Contoh: 08123456789"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          className="w-full bg-muted/50 border border-border/60 rounded-xl pl-10 pr-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Alamat Email (Opsional)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="email"
                          placeholder="email@domain.com"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full bg-muted/50 border border-border/60 rounded-xl pl-10 pr-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Order Sidebar Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-2xl sticky top-24 space-y-4">
                  <h3 className="font-gaming text-base font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" /> Rincian Pesanan
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Game</span>
                      <span className="font-bold text-foreground">{game.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">User ID</span>
                      <span className="font-mono font-bold text-foreground">{userIdInput || '-'}</span>
                    </div>

                    {game.has_zone_id && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Zone ID</span>
                        <span className="font-mono font-bold text-foreground">{serverIdInput || '-'}</span>
                      </div>
                    )}

                    {nickname && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Nickname</span>
                        <span className="font-bold text-emerald-400">{nickname}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <span className="text-muted-foreground">Produk</span>
                      <span className="font-bold text-foreground text-right">{selectedNominal?.name || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Metode Bayar</span>
                      <span className="font-bold text-primary">{selectedPayment?.name || '-'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground block">Total Pembayaran</span>
                      <span className="font-mono text-xl font-extrabold text-primary">
                        {formatRupiah(calculateTotal())}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    className="w-full py-3.5 bg-gradient-to-r from-primary to-cyan-400 hover:shadow-lg hover:shadow-primary/30 text-primary-foreground font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all transform hover:scale-[1.02]"
                  >
                    Beli Sekarang
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground pt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Transaksi terenkripsi & aman 100%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Auth Required Modal for Saldo Payment (Requirement 2) */}
      <AnimatePresence>
        {showAuthRequiredModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border/80 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center relative"
            >
              <button
                onClick={() => setShowAuthRequiredModal(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="h-16 w-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
                <Lock className="h-8 w-8" />
              </div>

              <div>
                <h3 className="font-gaming text-lg font-bold text-foreground">Login / Registrasi Diperlukan</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Untuk menggunakan metode pembayaran <span className="font-bold text-emerald-400">Saldo Akun</span>, Anda diwajibkan untuk masuk atau mendaftar akun terlebih dahulu.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  className="py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all shadow-md"
                >
                  <LogIn className="h-4 w-4" /> Masuk Akun
                </Link>
                <Link
                  href="/register"
                  className="py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  Daftar Akun
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border/80 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-border/50 pb-3">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-gaming text-base font-bold text-foreground">Konfirmasi Pesanan</h3>
                  <p className="text-xs text-muted-foreground">Periksa kembali rincian transaksi Anda.</p>
                </div>
              </div>

              <div className="space-y-2 text-xs bg-muted/30 p-4 rounded-2xl border border-border/40">
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Kategori Game</span>
                  <span className="font-bold text-foreground">{game.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono font-bold text-foreground">{userIdInput} {serverIdInput ? `(${serverIdInput})` : ''}</span>
                </div>
                {nickname && (
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Nickname</span>
                    <span className="font-bold text-emerald-400">{nickname}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Nominal Item</span>
                  <span className="font-bold text-foreground">{selectedNominal?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Metode Bayar</span>
                  <span className="font-bold text-primary">{selectedPayment?.name}</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span className="text-muted-foreground">Total Tagihan</span>
                  <span className="font-extrabold text-primary text-sm">{formatRupiah(calculateTotal())}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="py-3 bg-muted text-foreground font-bold rounded-xl text-xs hover:bg-muted/80 transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPay}
                  disabled={submitting}
                  className="py-3 bg-primary text-primary-foreground font-extrabold rounded-xl text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Memproses...
                    </>
                  ) : (
                    'Lanjut Bayar'
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}