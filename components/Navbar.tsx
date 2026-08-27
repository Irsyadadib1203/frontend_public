"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Receipt,
  Newspaper,
  User as UserIcon,
  LogOut,
  Wallet,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import logoImg from '@/assets/logo.png';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '/', icon: Gamepad2 },
    { name: 'Cek Transaksi', href: '/cek-transaksi', icon: Receipt },
    { name: 'Berita', href: '/berita', icon: Newspaper },
  ];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform flex items-center justify-center bg-card border border-border/50">
            <Image
              src={logoImg}
              alt="Logo Toko"
              className="object-contain w-full h-full p-1"
              priority
            />
          </div>
          <div>
            <span className="font-gaming text-lg font-extrabold tracking-wider text-foreground flex items-center gap-1">
              TOPUP<span className="text-primary">STORE</span>
              <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
            </span>
            <span className="text-[10px] text-muted-foreground block -mt-1 tracking-widest font-mono">
              GAME & VOUCHER 24/7
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-card/40 p-1.5 rounded-full border border-border/50 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
                  isActive
                    ? 'text-primary-foreground font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabNav"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-400 rounded-full shadow-md shadow-primary/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* User Auth & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-card/60 hover:bg-card border border-border/60 px-3 py-1.5 rounded-full transition-all text-xs"
              >
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-xs leading-tight">{user.name}</p>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Wallet className="h-2.5 w-2.5" />
                    {formatRupiah(user.balance || 0)}
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-card border border-border/80 rounded-2xl shadow-2xl p-2 z-50"
                  >
                    <div className="p-2 border-b border-border/50 mb-1">
                      <p className="text-xs text-muted-foreground font-mono">Status Akun</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold capitalize text-primary bg-primary/15 px-2 py-0.5 rounded-md border border-primary/30">
                          {user.tier || 'Member'}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-bold font-mono">
                          {formatRupiah(user.balance || 0)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/member"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-colors"
                    >
                      <UserIcon className="h-4 w-4" />
                      Dashboard Member
                    </Link>
                    <Link
                      href="/member/deposit"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-colors"
                    >
                      <Wallet className="h-4 w-4" />
                      Deposit Saldo
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mt-1 border-t border-border/40"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-foreground bg-muted/50 hover:bg-muted border border-border/60 transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-primary-foreground bg-gradient-to-r from-primary to-cyan-400 hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-foreground bg-card/60 border border-border/60"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border/80 px-4 py-4 space-y-3"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    pathname === link.href
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:bg-muted/30'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-border/50">
              {user ? (
                <div className="space-y-2">
                  <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {formatRupiah(user.balance || 0)}
                    </span>
                  </div>
                  <Link
                    href="/member"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2 bg-primary/20 text-primary font-bold rounded-xl text-xs"
                  >
                    Dashboard Member
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="block w-full text-center py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-semibold"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-bold text-foreground bg-muted rounded-xl"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-bold text-primary-foreground bg-primary rounded-xl"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}