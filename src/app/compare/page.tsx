"use client";

import React from "react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { useCart, CartProduct } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";
import { Scale, Trash2, ShoppingBag, Star, Check, X, ArrowLeft } from "lucide-react";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Bandingkan Produk (Product Comparison)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
              {compareList.length} produk
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Bandingkan spesifikasi, harga, diskon, dan rating produk secara berdampingan
          </p>
        </div>

        {compareList.length > 0 && (
          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="px-3.5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition"
            >
              + Tambah Produk Lain
            </Link>
            <button
              onClick={clearCompare}
              className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition cursor-pointer"
            >
              Reset Perbandingan
            </button>
          </div>
        )}
      </div>

      {compareList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-gray-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Belum ada produk yang dibandingkan</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Buka halaman detail produk apa saja lalu klik tombol &quot;Bandingkan Produk&quot; untuk melihat perbandingan tabel di sini.
          </p>
          <Link
            href="/products"
            className="inline-block mt-2 px-5 py-2.5 bg-[#0064d2] text-white text-xs font-bold rounded-lg"
          >
            Jelajahi Katalog Produk
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <tbody>
              {/* Product Header & Images */}
              <tr className="border-b border-gray-200">
                <td className="p-4 font-bold text-gray-400 uppercase text-[10px] w-48 bg-gray-50/70 align-top">
                  Produk
                </td>
                {compareList.map((prod) => {
                  let img = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300";
                  try {
                    const parsed = JSON.parse(prod.images);
                    if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
                  } catch {
                    if (typeof prod.images === "string") img = prod.images;
                  }

                  return (
                    <td key={prod.id} className="p-4 min-w-[220px] max-w-[260px] align-top space-y-2.5">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 p-2 border border-gray-100 flex items-center justify-center">
                        <img src={img} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                        <button
                          onClick={() => removeFromCompare(prod.id)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-white text-gray-400 hover:text-rose-600 shadow-xs border border-gray-200 cursor-pointer"
                          title="Hapus"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Link
                        href={`/products/${prod.slug}`}
                        className="font-bold text-xs text-gray-900 hover:text-blue-600 line-clamp-2 block leading-snug"
                      >
                        {prod.name}
                      </Link>
                    </td>
                  );
                })}
              </tr>

              {/* Price Row */}
              <tr className="border-b border-gray-100">
                <td className="p-4 font-bold text-gray-500 bg-gray-50/70">Harga Final</td>
                {compareList.map((prod) => {
                  const discount = prod.discount || 0;
                  const finalPrice = prod.price * (1 - discount / 100);
                  return (
                    <td key={prod.id} className="p-4">
                      <div className="text-base font-black text-gray-900">{formatRupiah(finalPrice)}</div>
                      {discount > 0 && (
                        <div className="text-[11px] text-gray-400 line-through">{formatRupiah(prod.price)} ({discount}% OFF)</div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Category Row */}
              <tr className="border-b border-gray-100">
                <td className="p-4 font-bold text-gray-500 bg-gray-50/70">Kategori</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 font-semibold text-blue-600">
                    {prod.category?.name || "Elektronik"}
                  </td>
                ))}
              </tr>

              {/* Stock Status Row */}
              <tr className="border-b border-gray-100">
                <td className="p-4 font-bold text-gray-500 bg-gray-50/70">Status Stok</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4">
                    {prod.stock > 0 ? (
                      <span className="text-emerald-700 font-bold">✓ Tersedia ({prod.stock} unit)</span>
                    ) : (
                      <span className="text-rose-600 font-bold">Stok Habis</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating Row */}
              <tr className="border-b border-gray-100">
                <td className="p-4 font-bold text-gray-500 bg-gray-50/70">Rating Pembeli</td>
                {compareList.map((prod) => {
                  const avg = prod.reviews && prod.reviews.length > 0
                    ? (prod.reviews.reduce((a, r) => a + r.rating, 0) / prod.reviews.length).toFixed(1)
                    : "5.0";
                  return (
                    <td key={prod.id} className="p-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span className="font-bold text-gray-900">{avg}</span>
                        <span className="text-gray-400">/ 5.0</span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Description Preview */}
              <tr className="border-b border-gray-100">
                <td className="p-4 font-bold text-gray-500 bg-gray-50/70">Deskripsi & Fitur</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4 text-gray-600 leading-relaxed text-[11px] align-top">
                    {prod.description}
                  </td>
                ))}
              </tr>

              {/* Action Button Row */}
              <tr>
                <td className="p-4 font-bold text-gray-500 bg-gray-50/70">Aksi</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-4">
                    <button
                      onClick={() => addToCart(prod as unknown as CartProduct, 1)}
                      disabled={prod.stock <= 0}
                      className="w-full py-2 px-3 bg-[#0064d2] hover:bg-[#0053a0] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>+ Keranjang</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
