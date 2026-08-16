"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  highlight: string;
  badge: string;
  badgeColor: string;
  bgGradient: string;
  borderColor: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: string;
  image: string;
  tag: string;
}

const slides: BannerSlide[] = [
  {
    id: 1,
    badge: "DEALS OF THE WEEK",
    badgeColor: "bg-[#e53238] text-white",
    title: "Super Tech Audio & Studio Gear",
    subtitle: "Diskon hingga 40% untuk Headphone ANC Wireless & TWS Hi-Res pilihan audiofil kelas dunia.",
    highlight: "Diskon s/d 40%",
    bgGradient: "from-blue-100 via-indigo-50 to-sky-100",
    borderColor: "border-blue-200",
    ctaText: "Belanja Audio",
    ctaLink: "/products?category=audio-headphone",
    ctaColor: "bg-[#0064d2] hover:bg-[#0053a0]",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    tag: "Audiofil Choice",
  },
  {
    id: 2,
    badge: "TRENDING IN KEYBOARDS",
    badgeColor: "bg-purple-600 text-white",
    title: "Custom Mechanical Keyboard Fest",
    subtitle: "Gasket mount premium, switches pre-lubed, dan konektivitas nirkabel triple-mode untuk mengetik maksimal.",
    highlight: "Mulai Rp 690rb",
    bgGradient: "from-purple-100 via-pink-50 to-violet-100",
    borderColor: "border-purple-200",
    ctaText: "Jelajahi Keyboard",
    ctaLink: "/products?category=mechanical-keyboard",
    ctaColor: "bg-purple-600 hover:bg-purple-700",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    tag: "Gasket Mount",
  },
  {
    id: 3,
    badge: "DESK MAKEOVER",
    badgeColor: "bg-emerald-600 text-white",
    title: "Minimalist Solid Oak Desk Setup",
    subtitle: "Stand monitor kayu oak alami, screenbar lampu monitor pintar, dan aksesoris meja kerja ergonomis.",
    highlight: "Setup Idaman 2026",
    bgGradient: "from-emerald-100 via-teal-50 to-green-100",
    borderColor: "border-emerald-200",
    ctaText: "Upgrade Setup Meja",
    ctaLink: "/products?category=desk-setup",
    ctaColor: "bg-emerald-600 hover:bg-emerald-700",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
    tag: "Ergonomic & Clean",
  },
  {
    id: 4,
    badge: "SPECIAL PROMO",
    badgeColor: "bg-amber-500 text-gray-900",
    title: "Gratis Ongkir Se-Indonesia + Voucher 10%",
    subtitle: "Gunakan kode voucher BAYE10 di halaman checkout untuk potongan langsung di transaksi pertama Anda.",
    highlight: "Kupon: BAYE10",
    bgGradient: "from-amber-100 via-orange-50 to-yellow-100",
    borderColor: "border-amber-200",
    ctaText: "Klaim Voucher",
    ctaLink: "/products",
    ctaColor: "bg-amber-600 hover:bg-amber-700",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80",
    tag: "100% Original",
  },
];

export function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-rotation timer (4.5 seconds interval)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const active = slides[currentSlide];

  return (
    <div
      className={`relative rounded-xl sm:rounded-3xl overflow-hidden border ${active.borderColor} shadow-xs group select-none transition-colors duration-500`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Container with Light Pastel Background */}
      <div className={`relative min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] bg-gradient-to-r ${active.bgGradient} transition-all duration-700 flex items-center`}>
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-center">
            {/* Left Banner Text Info */}
            <div className="md:col-span-7 space-y-2.5 sm:space-y-3.5 text-left">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-black tracking-wider uppercase shadow-xs ${active.badgeColor}`}>
                  {active.badge}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-white/80 text-gray-700 border border-gray-200">
                  {active.tag}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-snug">
                {active.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-700 max-w-lg leading-relaxed line-clamp-2 font-medium">
                {active.subtitle}
              </p>

              <div className="pt-1 sm:pt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
                <Link
                  href={active.ctaLink}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 ${active.ctaColor} text-white font-bold rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 cursor-pointer`}
                >
                  <span>{active.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/90 border border-gray-200 shadow-xs text-[11px] sm:text-xs font-bold text-gray-900 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{active.highlight}</span>
                </div>
              </div>
            </div>

            {/* Right Banner Image Showcase */}
            <div className="hidden sm:flex md:col-span-5 justify-center relative">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-white p-2 sm:p-3 transform group-hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={active.image}
                  alt={active.title}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-md text-[10px] sm:text-[11px] font-black text-gray-900 border border-gray-200 shadow-xs inline-block">
                    {active.highlight}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white border border-gray-200 text-gray-800 flex items-center justify-center shadow-md transition hover:scale-110 z-20 cursor-pointer"
        aria-label="Slide Sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white border border-gray-200 text-gray-800 flex items-center justify-center shadow-md transition hover:scale-110 z-20 cursor-pointer"
        aria-label="Slide Selanjutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-gray-200 shadow-xs">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentSlide === index
                ? "w-5 h-1.5 sm:w-6 sm:h-2 bg-[#0064d2]"
                : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Pindah ke slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
