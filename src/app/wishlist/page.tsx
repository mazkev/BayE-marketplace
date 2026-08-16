"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart, CartProduct } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2, ArrowRight, Truck } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item as unknown as CartProduct, 1);
    });
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Watchlist / Wishlist Saya
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200">
              {wishlist.length} item
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Daftar produk favorit yang Anda simpan untuk dibeli nanti
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={clearWishlist}
              className="px-3.5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
            >
              Kosongkan
            </button>
            <button
              onClick={handleMoveAllToCart}
              className="px-4 py-2 bg-[#0064d2] hover:bg-[#0053a0] text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Beli Semua ({wishlist.length})</span>
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-gray-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Watchlist Anda masih kosong</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Klik ikon hati (❤️) pada produk yang Anda sukai di katalog untuk menyimpannya di sini.
          </p>
          <Link
            href="/products"
            className="inline-block mt-2 px-5 py-2.5 bg-[#0064d2] text-white text-xs font-bold rounded-lg"
          >
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((item) => {
            let img = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400";
            try {
              const parsed = JSON.parse(item.images);
              if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
            } catch {
              if (typeof item.images === "string") img = item.images;
            }

            const discount = item.discount || 0;
            const finalPrice = item.price * (1 - discount / 100);

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              >
                <div className="relative aspect-square bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-center">
                  <img
                    src={img}
                    alt={item.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-300"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white text-rose-600 shadow-xs border border-gray-200 transition cursor-pointer hover:bg-rose-50"
                    title="Hapus dari Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {discount > 0 && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-black uppercase bg-[#dd1e31] text-white rounded">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-bold text-xs sm:text-sm text-gray-900 hover:text-blue-600 transition line-clamp-2"
                    >
                      {item.name}
                    </Link>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div>
                      <div className="text-base font-black text-gray-900">
                        {formatRupiah(finalPrice)}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {discount > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatRupiah(item.price)}
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          <span>Gratis Ongkir</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(item as unknown as CartProduct, 1)}
                      className="w-full py-2 px-3 bg-[#0064d2] hover:bg-[#0053a0] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>+ Keranjang</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
