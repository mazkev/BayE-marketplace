"use client";

import React from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { useCart, CartProduct } from "@/context/CartContext";
import { useWishlist, WishlistProduct } from "@/context/WishlistContext";
import { useCompare, CompareProduct } from "@/context/CompareContext";
import { useToast } from "@/context/ToastContext";
import { Star, ShoppingBag, Check, Heart, Truck, Scale } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discount?: number | null;
    stock: number;
    images: string;
    category?: {
      name: string;
    };
    reviews?: {
      rating: number;
    }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const { showToast } = useToast();

  let firstImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600";
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

  const avgRating =
    product.reviews && product.reviews.length > 0
      ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
      : "5.0";

  const totalReviews = product.reviews ? product.reviews.length : 1;

  const isInCart = cart.some((item) => item.product.id === product.id);
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product as unknown as CartProduct, 1);
    showToast(`"${product.name}" ditambahkan ke keranjang!`, "success");
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product as unknown as WishlistProduct);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product as unknown as CompareProduct);
    }
  };

  return (
    <div className="group relative bg-white hover:bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-gray-50 p-3 sm:p-4 border-b border-gray-100"
      >
        <img
          src={firstImage}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-[#dd1e31] text-white rounded shadow-xs">
              {discount}% OFF
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-400 text-gray-900 rounded">
              Sisa {product.stock}
            </span>
          )}
        </div>

        {/* Action Buttons Top Right: Wishlist & Compare */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlistClick}
            className="p-1.5 rounded-full bg-white/95 hover:bg-white text-gray-700 shadow-xs border border-gray-200 transition cursor-pointer"
            title={isWishlisted ? "Hapus dari Watchlist" : "Simpan ke Watchlist"}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isWishlisted ? "text-rose-600 fill-rose-600" : "text-gray-400 hover:text-rose-600"
              }`}
            />
          </button>

          <button
            onClick={handleCompareClick}
            className={`p-1.5 rounded-full bg-white/95 hover:bg-white shadow-xs border border-gray-200 transition cursor-pointer ${
              isCompared ? "text-[#0064d2] border-blue-400" : "text-gray-400 hover:text-blue-600"
            }`}
            title="Bandingkan Produk"
          >
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Category Pill */}
        {product.category?.name && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold bg-gray-900/80 text-white rounded">
            {product.category.name}
          </span>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
        <div className="space-y-1">
          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-gray-800">{avgRating}</span>
            <span className="text-[10px] sm:text-[11px] text-gray-400">({totalReviews})</span>
          </div>
        </div>

        {/* eBay Style Pricing & Shipping */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div>
            <div className="text-sm sm:text-lg font-black text-gray-900 tracking-tight">
              {formatRupiah(finalPrice)}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {discount > 0 && (
                <span className="text-[11px] sm:text-xs text-gray-400 line-through font-normal">
                  {formatRupiah(product.price)}
                </span>
              )}
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <Truck className="w-3 h-3 text-emerald-600" />
                <span>Gratis Ongkir</span>
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-1.5 sm:py-2 px-3 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
              isInCart
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                : "bg-[#0064d2] hover:bg-[#0053a0] active:bg-[#004280] text-white shadow-xs"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Di Keranjang</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Keranjang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
