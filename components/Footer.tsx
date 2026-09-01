"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Zap, Headphones, Heart, Instagram } from 'lucide-react';
import logoImg from '@/assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-card/80 border-t border-border/60 relative overflow-hidden pt-12 pb-8 mt-16">
      {/* Background Ambient Cyber Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-border/50">
          <div className="flex items-start gap-3 bg-muted/20 p-4 rounded-2xl border border-border/40">
            <div className="p-3 bg-primary/15 rounded-xl text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-gaming text-sm font-bold text-foreground">Proses Otomatis 1 Detik</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Top-up langsung diproses otomatis tanpa perlu menunggu konfirmasi manual.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-muted/20 p-4 rounded-2xl border border-border/40">
            <div className="p-3 bg-secondary/15 rounded-xl text-secondary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-gaming text-sm font-bold text-foreground">100% Aman & Legal</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Semua item berasal dari provider resmi dan dijamin legalitas akun 100%.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-muted/20 p-4 rounded-2xl border border-border/40">
            <div className="p-3 bg-cyan-500/15 rounded-xl text-cyan-400">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-gaming text-sm font-bold text-foreground">Layanan CS 24/7</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Tim Customer Service siap membantu 24 jam nonstop via WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* Footer Main Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center bg-card border border-border/60 shadow-md">
                <Image src={logoImg} alt="Logo Toko" className="object-contain w-full h-full p-1" />
              </div>
              <span className="font-gaming text-lg font-extrabold text-foreground">
                TOPUP<span className="text-primary">STORE</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Platform Top-Up Game & Voucher Game Tercepat, Termurah, dan Terpercaya di Indonesia dengan proses instan 24 Jam.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-gaming text-xs font-bold text-foreground uppercase tracking-wider mb-3">Peta Situs</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/cek-transaksi" className="text-muted-foreground hover:text-primary transition-colors">Cek Status Transaksi</Link>
              </li>
              <li>
                <Link href="/berita" className="text-muted-foreground hover:text-primary transition-colors">Berita & Promo Game</Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Masuk Member</Link>
              </li>
            </ul>
          </div>

          {/* Informasi Perusahaan */}
          <div>
            <h5 className="font-gaming text-xs font-bold text-foreground uppercase tracking-wider mb-3">Informasi</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tentang-kami" className="text-muted-foreground hover:text-primary transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="text-muted-foreground hover:text-primary transition-colors">Kebijakan Privasi</Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="text-muted-foreground hover:text-primary transition-colors">Syarat & Ketentuan</Link>
              </li>
            </ul>
          </div>

          {/* Media Sosial (Item 3: Instagram) */}
          <div>
            <h5 className="font-gaming text-xs font-bold text-foreground uppercase tracking-wider mb-3">Media Sosial</h5>
            <p className="text-xs text-muted-foreground mb-3">Ikuti Instagram kami untuk promo & giveaway terbaru:</p>
            
            <a
              href="https://instagram.com/irxplay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 px-3.5 py-2 rounded-xl transition-all"
            >
              <Instagram className="h-4 w-4" />
              <span>@irxplay</span>
            </a>
          </div>

          {/* Contact Support */}
          <div>
            <h5 className="font-gaming text-xs font-bold text-foreground uppercase tracking-wider mb-3">Bantuan & CS</h5>
            <p className="text-xs text-muted-foreground mb-3">Ada kendala transaksi? Hubungi CS kami:</p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 rounded-xl transition-all"
            >
              <Headphones className="h-4 w-4" />
              WhatsApp CS 24 Hours
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
          <p>© {new Date().getFullYear()} IRXPLAY. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> IRX Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
