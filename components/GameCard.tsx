"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Gamepad2, ChevronRight } from 'lucide-react';
import { Game } from '@/types';

interface GameCardProps {
  game: Game;
  delay?: number;
  variant?: 'popular' | 'default';
}

export default function GameCard({ game, delay = 0, variant = 'default' }: GameCardProps) {
  const [imgSrc, setImgSrc] = useState(game.image_url || '/placeholder-game.png');
  const [hasError, setHasError] = useState(false);

  // MINIMALIST COMPACT VARIANT FOR POPULAR GAMES
  if (variant === 'popular') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: delay * 0.04 }}
        whileHover={{ y: -3, scale: 1.02 }}
        className="group relative"
      >
        <Link href={`/game/${game.slug}`} className="block">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-card/90 border border-border/60 hover:border-amber-500/60 shadow-md group-hover:shadow-amber-500/20 transition-all duration-300 backdrop-blur-md">
            
            {/* Small Compact Image */}
            <div className="h-12 w-12 relative rounded-xl overflow-hidden bg-muted/50 shrink-0 border border-border/40">
              {!hasError ? (
                <Image
                  src={imgSrc}
                  alt={game.name}
                  fill
                  sizes="48px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={() => {
                    setHasError(true);
                    setImgSrc('/placeholder-game.png');
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-card">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>

            {/* Minimal Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-extrabold text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded font-mono">
                  POPULER
                </span>
              </div>
              <h4 className="font-gaming text-xs font-bold text-foreground truncate group-hover:text-amber-400 transition-colors mt-0.5">
                {game.name}
              </h4>
              <p className="text-[10px] text-muted-foreground truncate">{game.publisher || game.category || 'Game'}</p>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </Link>
      </motion.div>
    );
  }

  // STANDARD RICH CARD VARIANT FOR ALL PRODUCTS
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative"
    >
      <Link href={`/game/${game.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg group-hover:border-primary/60 group-hover:shadow-primary/20 transition-all duration-300">
          
          {/* Badge overlays */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            {game.is_popular && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
                <Sparkles className="h-2.5 w-2.5 fill-white" />
                POPULER
              </span>
            )}
            <span className="bg-background/80 backdrop-blur-md text-foreground/90 text-[10px] font-bold px-2 py-0.5 rounded-full border border-border/40 w-fit">
              {game.publisher || game.category || 'Game'}
            </span>
          </div>

          {/* Aspect Ratio Image Container */}
          <div className="aspect-[3/4] relative w-full bg-muted/40 overflow-hidden">
            {!hasError ? (
              <Image
                src={imgSrc}
                alt={game.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => {
                  setHasError(true);
                  setImgSrc('/placeholder-game.png');
                }}
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-card via-muted to-card p-4 text-center">
                <Gamepad2 className="h-10 w-10 text-primary opacity-60 mb-2" />
                <span className="text-xs font-bold text-foreground line-clamp-2">{game.name}</span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
          </div>

          {/* Card Footer Info */}
          <div className="p-3 bg-card/90 relative z-10">
            <h3 className="font-gaming text-xs md:text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {game.name}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-muted-foreground font-mono">Top Up Instant</span>
              <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                <Zap className="h-2.5 w-2.5 fill-primary" />
                24/7
              </span>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
