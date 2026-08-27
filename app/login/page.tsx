"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Gamepad2, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Masukkan email dan password.');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      toast.success('Login Berhasil! Selamat datang kembali.');
      router.push('/member');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          
          <div className="bg-card/90 border border-border/80 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-primary">
              <Gamepad2 className="h-32 w-32" />
            </div>

            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center mx-auto shadow-md">
                <LogIn className="h-6 w-6" />
              </div>
              <h1 className="font-gaming text-2xl font-extrabold text-foreground">
                Masuk Akun Member
              </h1>
              <p className="text-xs text-muted-foreground">
                Nikmati harga khusus member, potongan harga otomatis, & deposit saldo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-muted/50 border border-border/60 rounded-xl pl-10 pr-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-muted/50 border border-border/60 rounded-xl pl-10 pr-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || authLoading}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-cyan-400 hover:shadow-lg hover:shadow-primary/30 text-primary-foreground font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Memproses...
                  </>
                ) : (
                  <>
                    <span>Masuk Ke Akun</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
              Belum memiliki akun member?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Daftar Sekarang
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}