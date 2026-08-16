import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 text-xs mt-auto">
      {/* Value Proposition Bar */}
      <div className="border-b border-gray-200 py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-[#0064d2]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Gratis Ongkir</h4>
                <p className="text-[11px] text-gray-500">Min. belanja Rp 500rb se-Indonesia</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Garansi Resmi 100%</h4>
                <p className="text-[11px] text-gray-500">Produk original & terjamin</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">7 Hari Pengembalian</h4>
                <p className="text-[11px] text-gray-500">Mudah & tanpa syarat rumit</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Customer Support 24/7</h4>
                <p className="text-[11px] text-gray-500">Bantuan via Live Chat & CS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-2">
            <Link href="/" className="inline-flex flex-col group">
              <div className="text-2xl sm:text-3xl font-black tracking-tighter leading-none">
                <span className="text-[#e53238]">B</span>
                <span className="text-[#0064d2]">a</span>
                <span className="text-[#f5af02]">y</span>
                <span className="text-[#86b817]">E</span>
              </div>
              <span className="text-[9px] font-bold text-gray-500 tracking-tight mt-0.5">
                a marketplace by mazkev
              </span>
            </Link>
            <p className="text-gray-500 leading-relaxed text-[11px] pt-1">
              Marketplace ritel terkemuka untuk headphone audiofil, keyboard mekanikal kustom, dan perlengkapan setup meja ergonomis.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="font-bold text-gray-900 text-xs mb-2.5">Kategori Pilihan</h5>
            <ul className="space-y-1.5">
              <li>
                <Link href="/products?category=audio-headphone" className="hover:text-blue-600 transition">
                  Audio & Headphones
                </Link>
              </li>
              <li>
                <Link href="/products?category=mechanical-keyboard" className="hover:text-blue-600 transition">
                  Mechanical Keyboard
                </Link>
              </li>
              <li>
                <Link href="/products?category=desk-setup" className="hover:text-blue-600 transition">
                  Desk Setup & Risers
                </Link>
              </li>
              <li>
                <Link href="/products?category=smart-gadgets" className="hover:text-blue-600 transition">
                  Smart Gadgets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="font-bold text-gray-900 text-xs mb-2.5">Layanan & Akun</h5>
            <ul className="space-y-1.5">
              <li>
                <Link href="/orders" className="hover:text-blue-600 transition">
                  Lacak Pesanan Saya
                </Link>
              </li>
              <li>
                <Link href="/seller" className="hover:text-blue-600 transition">
                  Portal Penjual (Seller Portal)
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-blue-600 transition">
                  Watchlist / Favorit
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-600 transition">
                  Bandingkan Produk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="font-bold text-gray-900 text-xs mb-2.5">Metode Pembayaran Aman</h5>
            <p className="text-gray-500 mb-2 text-[11px]">
              Mendukung Virtual Account (BCA, Mandiri, BRI, BNI), QRIS, E-Wallet, dan Kartu Kredit.
            </p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-gray-700">
              <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200 font-sans">BCA VA</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200 font-sans">QRIS</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200 font-sans">GoPay</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200 font-sans">OVO</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-[11px] gap-2">
          <p>© 2026 BayE - a marketplace by mazkev. Fullstack Next.js + SQLite Marketplace.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-700 cursor-pointer">User Agreement</span>
            <span className="hover:text-gray-700 cursor-pointer">Security Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
