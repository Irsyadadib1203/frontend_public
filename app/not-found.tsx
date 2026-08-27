"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <h1 className="font-gaming text-6xl font-extrabold text-foreground">
          404
        </h1>
        
        <h2 className="font-gaming text-xl font-bold text-foreground">
          Halaman Tidak Ditemukan
        </h2>
        
        <p className="text-xs text-muted-foreground leading-relaxed">
          Maaf, halaman <span className="font-mono text-primary font-bold">{pathname}</span> yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
        >
          <Home className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
