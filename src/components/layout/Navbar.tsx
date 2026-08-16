"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { formatRupiah } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  Store,
  Package,
  Menu,
  X,
  ChevronDown,
  HelpCircle,
  Flame,
  Layers,
  Headphones,
  Keyboard,
  Monitor,
  Smartphone,
  Tag,
  LogOut,
  ArrowRightLeft,
  Heart,
  Scale,
  Star,
  Loader2
} from "lucide-react";

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout, quickLogin } = useAuth();
  const { totalWishlist } = useWishlist();
  const { compareList } = useCompare();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Auto-suggest search state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLiveDropdown, setShowLiveDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowLiveDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        setSearchResults(data.results || []);
        setShowLiveDropdown(true);
      } catch (e) {
        console.error("Live search failed", e);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close auto-suggest
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowLiveDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLiveDropdown(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    
    router.push(`/products?${params.toString()}`);
    setMobileMenuOpen(false);
  };

  const handleSwitchAccount = async (role: "BUYER" | "SELLER") => {
    setUserDropdownOpen(false);
    await quickLogin(role);
    if (role === "SELLER") {
      router.push("/seller");
    } else {
      router.push("/");
    }
  };

  const categories = [
    { slug: "all", name: "Semua Kategori" },
    { slug: "audio-headphone", name: "Audio & Headphone" },
    { slug: "mechanical-keyboard", name: "Mechanical Keyboard" },
    { slug: "desk-setup", name: "Desk Setup" },
    { slug: "smart-gadgets", name: "Smart Gadgets" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-xs">
      {/* 1. TOP UTILITY BAR */}
      <div className="border-b border-gray-200 bg-white text-[12px] text-gray-600 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Greeting & Status */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 text-gray-900 font-semibold hover:text-blue-600 cursor-pointer"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                    alt={user.name}
                    className="w-4 h-4 rounded-full object-cover border border-gray-300"
                  />
                  <span>Halo, <strong className="text-gray-900">{user.name}</strong></span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                    user.role === "SELLER"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}>
                    {user.role === "SELLER" ? "Toko Penjual" : "Pembeli"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-gray-200 shadow-2xl p-2 z-50 text-xs text-gray-800"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{user.email}</div>
                    </div>

                    <div className="py-1">
                      {user.role === "BUYER" ? (
                        <button
                          onClick={() => handleSwitchAccount("SELLER")}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50 text-amber-800 font-semibold transition cursor-pointer"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
                          <span>Ganti ke Akun Penjual (Seller)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSwitchAccount("BUYER")}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-800 font-semibold transition cursor-pointer"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                          <span>Ganti ke Akun Pembeli (Buyer)</span>
                        </button>
                      )}

                      {user.role === "SELLER" && (
                        <Link
                          href="/seller"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
                        >
                          <Store className="w-3.5 h-3.5 text-amber-600" />
                          <span>Buka Dashboard Seller</span>
                        </Link>
                      )}

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
                      >
                        <Package className="w-3.5 h-3.5 text-gray-500" />
                        <span>Riwayat Pesanan Saya</span>
                      </Link>

                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 font-medium transition cursor-pointer border-t border-gray-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span>Hi!</span>
                <Link href="/login" className="text-blue-600 font-bold hover:underline">
                  Masuk (Login)
                </Link>
                <span>atau</span>
                <Link href="/register" className="text-blue-600 font-bold hover:underline">
                  Daftar
                </Link>
              </div>
            )}

            <span className="text-gray-300 hidden sm:inline">|</span>
            <Link
              href="/products?sort=price-asc"
              className="hover:text-blue-600 transition hidden sm:inline-flex items-center gap-1 text-rose-600 font-medium"
            >
              <Flame className="w-3 h-3" />
              <span>Daily Deals</span>
            </Link>
            
            {user?.role === "SELLER" ? (
              <Link
                href="/seller"
                className="hover:text-amber-700 transition hidden md:inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
              >
                <Store className="w-3 h-3" />
                <span>Dashboard Toko Saya</span>
              </Link>
            ) : (
              <Link
                href="/seller"
                className="hover:text-blue-600 transition hidden md:inline-flex items-center gap-1 text-gray-600 font-medium"
              >
                <Store className="w-3 h-3 text-amber-600" />
                <span>Mulai Jual (Seller)</span>
              </Link>
            )}
          </div>

          {/* Right Utilities (Wishlist & Compare Counter) */}
          <div className="flex items-center gap-3 sm:gap-4 text-[12px]">
            <Link
              href="/compare"
              className="hover:text-blue-600 transition flex items-center gap-1 text-gray-700 font-medium relative"
            >
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>Bandingkan</span>
              {compareList.length > 0 && (
                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 font-bold rounded-full text-[10px]">
                  {compareList.length}
                </span>
              )}
            </Link>

            <span className="text-gray-300">|</span>

            <Link
              href="/wishlist"
              className="hover:text-blue-600 transition flex items-center gap-1 text-gray-700 font-medium relative"
            >
              <Heart className={`w-3.5 h-3.5 ${totalWishlist > 0 ? "text-rose-600 fill-rose-600" : "text-gray-500"}`} />
              <span>Watchlist</span>
              {totalWishlist > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 font-bold rounded-full text-[10px]">
                  {totalWishlist}
                </span>
              )}
            </Link>

            <span className="text-gray-300 hidden sm:inline">|</span>

            <Link
              href="/orders"
              className="hover:text-blue-600 transition hidden sm:inline-flex items-center gap-1 text-gray-700 font-medium"
            >
              <Package className="w-3.5 h-3.5 text-gray-500" />
              <span>Pesanan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR (With Live Auto-Suggest Search) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* BayE - a marketplace by mazkev Brand Logo */}
          <Link href="/" className="flex flex-col shrink-0 group">
            <div className="text-2xl sm:text-3xl font-black tracking-tighter leading-none">
              <span className="text-[#e53238]">B</span>
              <span className="text-[#0064d2]">a</span>
              <span className="text-[#f5af02]">y</span>
              <span className="text-[#86b817]">E</span>
            </div>
            <span className="text-[9px] font-bold text-gray-500 tracking-tight -mt-0.5 group-hover:text-blue-600 transition">
              a marketplace by mazkev
            </span>
          </Link>

          {/* Category Dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Kategori</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {categoryDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-2xl p-2 z-50 text-xs text-gray-800"
                onClick={() => setCategoryDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 font-bold text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100">
                  Pilih Kategori
                </div>
                <Link
                  href="/products?category=audio-headphone"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition text-gray-800 font-medium"
                >
                  <Headphones className="w-3.5 h-3.5 text-blue-600" />
                  <span>Audio & Headphone</span>
                </Link>
                <Link
                  href="/products?category=mechanical-keyboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition text-gray-800 font-medium"
                >
                  <Keyboard className="w-3.5 h-3.5 text-purple-600" />
                  <span>Mechanical Keyboard</span>
                </Link>
                <Link
                  href="/products?category=desk-setup"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition text-gray-800 font-medium"
                >
                  <Monitor className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Desk Setup & Risers</span>
                </Link>
                <Link
                  href="/products?category=smart-gadgets"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition text-gray-800 font-medium"
                >
                  <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Smart Gadgets</span>
                </Link>
              </div>
            )}
          </div>

          {/* Search Bar with Live Auto-Suggest Dropdown */}
          <div ref={searchContainerRef} className="flex-1 max-w-3xl relative">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center bg-white rounded-lg border-2 border-gray-900 focus-within:border-blue-600 overflow-hidden shadow-xs transition"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari jutaan headphone, mechanical keyboard, desk setup..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowLiveDropdown(true)}
                  className="w-full bg-white text-xs sm:text-sm text-gray-900 placeholder-gray-400 pl-10 pr-3 py-2.5 focus:outline-none"
                />
                {isSearching && (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin absolute right-3" />
                )}
              </div>

              <div className="hidden sm:block border-l border-gray-300">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-50 text-xs text-gray-700 px-3 py-2.5 focus:outline-none cursor-pointer pr-6 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug} className="bg-white text-gray-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-6 sm:px-8 py-2.5 bg-[#0064d2] hover:bg-[#0053a0] active:bg-[#004280] text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Cari</span>
              </button>
            </form>

            {/* LIVE AUTO-SUGGEST DROPDOWN */}
            {showLiveDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-100">
                <div className="p-2.5 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                  <span>Hasil Rekomendasi Cepat</span>
                  <span className="text-blue-600 lowercase font-normal">tekan Enter untuk semua hasil</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {searchResults.map((item) => {
                    let img = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100";
                    try {
                      const parsed = JSON.parse(item.images);
                      if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
                    } catch {
                      if (typeof item.images === "string") img = item.images;
                    }

                    const discount = item.discount || 0;
                    const finalPrice = item.price * (1 - discount / 100);

                    return (
                      <Link
                        key={item.id}
                        href={`/products/${item.slug}`}
                        onClick={() => setShowLiveDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50/60 transition group"
                      >
                        <img
                          src={img}
                          alt={item.name}
                          className="w-12 h-12 object-contain rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-1">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-gray-900">
                              {formatRupiah(finalPrice)}
                            </span>
                            {discount > 0 && (
                              <span className="text-[10px] font-bold text-[#dd1e31]">
                                {discount}% OFF
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400">
                              • {item.category?.name}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Cart Trigger & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 transition flex items-center gap-2 cursor-pointer"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5 text-[#0064d2]" />
              <span className="hidden md:inline text-xs font-bold text-gray-800">
                Cart
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#e53238] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 lg:hidden rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY SUB-NAVBAR */}
      <div className="border-t border-gray-200 bg-white hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 text-xs font-semibold text-gray-700 py-2.5 overflow-x-auto scrollbar-none">
            <Link
              href="/"
              className="text-blue-600 font-bold hover:text-blue-700 transition shrink-0"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="hover:text-blue-600 transition shrink-0 flex items-center gap-1"
            >
              <Tag className="w-3 h-3 text-blue-600" />
              <span>Semua Produk</span>
            </Link>
            <Link
              href="/products?category=audio-headphone"
              className="hover:text-blue-600 transition shrink-0"
            >
              Audio & Headphones
            </Link>
            <Link
              href="/products?category=mechanical-keyboard"
              className="hover:text-blue-600 transition shrink-0"
            >
              Mechanical Keyboard
            </Link>
            <Link
              href="/products?category=desk-setup"
              className="hover:text-blue-600 transition shrink-0"
            >
              Desk Setup & Risers
            </Link>
            <Link
              href="/products?category=smart-gadgets"
              className="hover:text-blue-600 transition shrink-0"
            >
              Smart Gadgets
            </Link>
            <Link
              href="/products?sort=price-asc"
              className="hover:text-rose-600 text-rose-600 font-bold transition shrink-0 flex items-center gap-1"
            >
              <Flame className="w-3 h-3" />
              <span>Super Deals</span>
            </Link>

            <Link
              href="/seller"
              className={`ml-auto font-bold transition shrink-0 flex items-center gap-1 ${
                user?.role === "SELLER"
                  ? "text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
                  : "text-amber-600 hover:text-amber-700"
              }`}
            >
              <Store className="w-3 h-3" />
              <span>{user?.role === "SELLER" ? "Dashboard Toko (Aktif)" : "Seller Portal"}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
