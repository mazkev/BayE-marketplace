"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { useCart, CartProduct } from "@/context/CartContext";
import { useWishlist, WishlistProduct } from "@/context/WishlistContext";
import { useCompare, CompareProduct } from "@/context/CompareContext";
import { useToast } from "@/context/ToastContext";
import { ReviewForm } from "@/components/product/ReviewForm";
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ArrowLeft,
  Share2,
  Heart,
  Scale,
  Store
} from "lucide-react";

interface ProductDetailViewProps {
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
      id: string;
      name: string;
      slug: string;
    };
    reviews?: {
      id: string;
      rating: number;
      comment?: string | null;
      createdAt: Date;
      user: {
        name: string;
        avatar?: string | null;
      };
    }[];
  };
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  let imageList: string[] = [];
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed)) imageList = parsed;
  } catch {
    if (typeof product.images === "string") imageList = [product.images];
  }
  if (imageList.length === 0) {
    imageList = ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"];
  }

  const discount = product.discount || 0;
  const finalPrice = product.price * (1 - discount / 100);

  const avgRating =
    product.reviews && product.reviews.length > 0
      ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
      : "5.0";

  const totalReviews = product.reviews ? product.reviews.length : 1;

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleAddToCart = () => {
    addToCart(product as unknown as CartProduct, quantity);
    showToast(`"${product.name}" (${quantity} unit) ditambahkan ke keranjang!`, "success");
  };

  const handleBuyNow = () => {
    addToCart(product as unknown as CartProduct, quantity);
    setIsCartOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast("Link produk berhasil disalin!", "info");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCompareClick = () => {
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product as unknown as CompareProduct);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 pb-24 sm:pb-8">
      {/* Breadcrumb & Top Bar */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 hover:text-blue-600 font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Compare Button */}
          <button
            onClick={handleCompareClick}
            className={`px-3 py-1.5 rounded-lg border transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              isCompared
                ? "bg-blue-50 text-blue-700 border-blue-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isCompared ? "Di Komparasi" : "Bandingkan"}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition flex items-center gap-1.5 cursor-pointer font-medium text-xs"
            title="Salin Link Produk"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Tersalin!" : "Bagikan"}</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product as unknown as WishlistProduct)}
            className={`p-1.5 rounded-lg bg-white border border-gray-300 transition cursor-pointer ${
              isWishlisted ? "text-rose-600 fill-rose-600" : "text-gray-500 hover:text-rose-600 hover:bg-gray-50"
            }`}
            title="Simpan ke Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-600 text-rose-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xs p-4 sm:p-6 flex items-center justify-center">
            <img
              src={imageList[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#dd1e31] text-white font-black text-xs rounded-md shadow-xs">
                {discount}% OFF
              </span>
            )}
          </div>

          {imageList.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden border-2 transition p-1 bg-white cursor-pointer shrink-0 ${
                    selectedImageIndex === idx
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-gray-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Purchase Controls */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="inline-block px-2 py-0.5 rounded bg-blue-50 text-[#0064d2] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider"
                >
                  {product.category.name}
                </Link>
              )}

              <Link
                href="/store/apex-gear"
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1"
              >
                <Store className="w-3 h-3 text-amber-600" />
                <span>Apex Gear Official Store ➔</span>
              </Link>
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating and Stock Header */}
            <div className="flex items-center gap-2.5 mt-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="font-bold text-gray-900">{avgRating}</span>
                <span className="text-gray-500">({totalReviews} Ulasan)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span>
                {product.stock > 0 ? (
                  <span className="text-emerald-700 font-bold text-xs sm:text-sm">
                    ✓ Stok ({product.stock})
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold text-xs sm:text-sm">Stok Habis</span>
                )}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-0.5">
            <div className="flex items-baseline gap-2.5">
              <span className="text-xl sm:text-3xl font-black text-gray-900">
                {formatRupiah(finalPrice)}
              </span>
              {discount > 0 && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-500">
              Termasuk PPN. Garansi resmi 12 bulan replacement langsung.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Deskripsi Produk</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700">Jumlah:</span>
              <div className="flex items-center bg-gray-100 rounded-lg border border-gray-300 px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-gray-600">
                Subtotal: <strong className="text-gray-900 font-bold">{formatRupiah(finalPrice * quantity)}</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-2.5 sm:py-3 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0064d2] border border-blue-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition disabled:opacity-40 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>+ Keranjang Belanja</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-2.5 sm:py-3 px-4 rounded-lg bg-[#0064d2] hover:bg-[#0053a0] active:bg-[#004280] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-40 cursor-pointer"
              >
                <span>Beli Sekarang</span>
              </button>
            </div>
          </div>

          {/* Delivery & Warranty Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center text-xs">
            <div className="p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#0064d2]" />
              <span className="font-semibold text-gray-800 text-[10px] sm:text-[11px]">Gratis Ongkir</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-gray-800 text-[10px] sm:text-[11px]">Garansi 1 Thn</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-gray-800 text-[10px] sm:text-[11px]">7 Hari Retur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Live Submission Form */}
      <section className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-lg font-bold text-gray-900">Ulasan & Rating Pembeli</h2>
            <p className="text-[11px] sm:text-xs text-gray-500">Ulasan terverifikasi langsung dari pembeli produk ini</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-sm sm:text-base font-black text-gray-900">{avgRating}</span>
            <span className="text-xs text-gray-500">/ 5.0</span>
          </div>
        </div>

        {/* Live Review Submission Form */}
        <ReviewForm productId={product.id} productName={product.name} />

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        rev.user.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                      }
                      alt={rev.user.name}
                      className="w-7 h-7 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{rev.user.name}</h4>
                      <span className="text-[10px] text-emerald-700 font-semibold">✓ Pembeli Terverifikasi</span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating ? "fill-amber-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {rev.comment && (
                  <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-center rounded-xl bg-gray-50 border border-gray-200 col-span-2 text-gray-500 text-xs">
              Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan!
            </div>
          )}
        </div>
      </section>

      {/* Sticky Mobile Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-12 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 px-3 flex items-center justify-between gap-2 shadow-lg">
        <div className="min-w-0">
          <div className="text-xs font-black text-gray-900 line-clamp-1">
            {formatRupiah(finalPrice)}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold">
            ✓ Gratis Ongkir
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-2.5 rounded-lg bg-blue-50 text-[#0064d2] border border-blue-200 font-bold text-xs flex items-center justify-center cursor-pointer"
            title="Tambah ke Keranjang"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="px-4 py-2.5 rounded-lg bg-[#0064d2] text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <span>Beli Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
