"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 500000;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 text-gray-900 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-[#0064d2] rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-gray-900">Keranjang Belanja</h2>
                <p className="text-xs text-gray-500">{totalItems} item dipilih</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-4 py-3 bg-blue-50/70 border-b border-blue-100 text-xs">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-gray-700 font-medium">
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    🎉 Selamat! Anda mendapat Gratis Ongkir
                  </span>
                ) : (
                  <span>
                    Tambah <strong className="text-[#0064d2] font-bold">{formatRupiah(remainingForFreeShipping)}</strong> lagi untuk Gratis Ongkir
                  </span>
                )}
              </span>
              <span className="text-gray-600 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-1">Keranjang masih kosong</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-5">
                  Pilih produk favorit Anda untuk mulai berbelanja.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-[#0064d2] hover:bg-[#0053a0] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                let firstImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300";
                try {
                  const parsed = JSON.parse(product.images);
                  if (Array.isArray(parsed) && parsed.length > 0) firstImage = parsed[0];
                } catch {
                  if (typeof product.images === "string" && product.images.startsWith("http")) {
                    firstImage = product.images;
                  }
                }

                const discount = product.discount || 0;
                const finalPrice = product.price * (1 - discount / 100);

                return (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-xs"
                  >
                    <img
                      src={firstImage}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100 shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-gray-400 hover:text-rose-600 transition shrink-0 p-0.5 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xs sm:text-sm font-bold text-gray-900">
                            {formatRupiah(finalPrice)}
                          </span>
                          {discount > 0 && (
                            <span className="text-[11px] text-gray-400 line-through">
                              {formatRupiah(product.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-gray-600 hover:text-gray-900 rounded transition cursor-pointer"
                            aria-label="Kurang"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 rounded transition cursor-pointer"
                            aria-label="Tambah"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[11px] text-gray-500">
                          Total: <strong className="text-gray-900">{formatRupiah(finalPrice * quantity)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} item)</span>
                  <span className="text-gray-900 font-semibold">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimasi Ongkir</span>
                  <span className="text-emerald-700 font-bold">
                    {subtotal >= freeShippingThreshold ? "GRATIS" : "Dihitung di checkout"}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm sm:text-base text-gray-900">
                  <span>Total Tagihan</span>
                  <span className="text-[#0064d2] font-black">{formatRupiah(subtotal)}</span>
                </div>
              </div>

              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 px-4 bg-[#0064d2] hover:bg-[#0053a0] active:bg-[#004280] text-white rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transaksi Terproteksi 100% Aman & Terenkripsi</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
