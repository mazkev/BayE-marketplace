import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { Store, Star, ShieldCheck, Clock, MapPin, Package, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface StorePageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface ProductItemData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number | null;
  stock: number;
  images: string;
  featured: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    userId: string;
    productId: string;
  }[];
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;

  // Find products (default to all or specific category)
  const products = (await prisma.product.findMany({
    include: {
      category: true,
      reviews: true,
    },
  })) as unknown as ProductItemData[];

  const storeName = slug === "apex-gear" ? "Apex Gear Official Store" : "TechGear Partner Store";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-16">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Marketplace</span>
      </Link>

      {/* Store Header Banner Card */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 border-2 border-white/20 shadow-lg flex items-center justify-center shrink-0">
              <Store className="w-10 h-10 text-[#0064d2]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">{storeName}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Official Store</span>
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Spesialis Audio & Mechanical Keyboard Kustom Bergaransi Resmi
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Jakarta Selatan</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Online 5 mnt lalu</span>
                </span>
              </div>
            </div>
          </div>

          {/* Store Statistics Badges */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 shrink-0">
            <div>
              <div className="text-base font-black text-white flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
              <span className="text-[10px] text-slate-300">Rating Toko</span>
            </div>
            <div className="border-x border-white/10 px-3">
              <div className="text-base font-black text-white">99%</div>
              <span className="text-[10px] text-slate-300">Tepat Waktu</span>
            </div>
            <div>
              <div className="text-base font-black text-white">± 2 jam</div>
              <span className="text-[10px] text-slate-300">Kecepatan Balas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Store Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#0064d2]" />
            <h2 className="text-lg font-bold text-gray-900">
              Produk dari Toko Ini ({products.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: ProductItemData) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
