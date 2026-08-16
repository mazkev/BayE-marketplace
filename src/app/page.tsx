import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { BannerSlider } from "@/components/home/BannerSlider";
import {
  Flame,
  Zap,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Truck,
  Store
} from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

export default async function HomePage() {
  // Fetch data directly from Prisma SQLite
  const [categories, featuredProducts, discountProducts] = (await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
    prisma.product.findMany({
      where: { featured: true },
      include: {
        category: true,
        reviews: true,
      },
      take: 8,
    }),
    prisma.product.findMany({
      where: { discount: { gt: 0 } },
      include: {
        category: true,
        reviews: true,
      },
      take: 4,
    }),
  ])) as [CategoryItem[], any[], any[]];

  const categoryImages: Record<string, { img: string }> = {
    "audio-headphone": {
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
    },
    "mechanical-keyboard": {
      img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300",
    },
    "desk-setup": {
      img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300",
    },
    "smart-gadgets": {
      img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300",
    },
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
      {/* 1. AUTO-ROTATING HERO BANNER SLIDER */}
      <section>
        <BannerSlider />
      </section>

      {/* 2. POPULAR CATEGORIES (Clean eBay Category Cards) */}
      <section className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Kategori Pilihan
          </h2>
          <Link
            href="/products"
            className="text-[11px] sm:text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
          >
            <span>Semua Kategori</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5">
          {categories.map((cat) => {
            const meta = categoryImages[cat.slug] || {
              img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
            };

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group p-2.5 sm:p-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-500 transition-all duration-200 flex items-center gap-2.5 sm:gap-3 shadow-xs"
              >
                <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  <img
                    src={meta.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">
                    {cat._count.products} produk
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. TODAY'S SUPER DEALS (eBay Flash Deals Module) */}
      {discountProducts.length > 0 && (
        <section className="space-y-2.5 sm:space-y-3">
          <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-50 text-[#dd1e31] rounded-lg border border-rose-200 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                      Today&apos;s Super Deals
                    </h2>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#dd1e31] text-white uppercase">
                      Flash Sale
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 hidden sm:block">
                    Diskon s/d 20% & Gratis Ongkir untuk item pilihan
                  </p>
                </div>
              </div>

              <Link
                href="/products?sort=price-asc"
                className="px-3 py-1.5 bg-[#dd1e31] hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] sm:text-xs flex items-center gap-1 shrink-0 transition"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {discountProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. FEATURED PRODUCTS (eBay Collection Grid) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              <Zap className="w-3 h-3" />
              <span>Rekomendasi Utama</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Produk Unggulan & Trending
            </h2>
          </div>

          {/* Quick Filter Tabs (Scrollable on mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <Link
              href="/products"
              className="px-2.5 py-1 rounded-md bg-[#0064d2] text-white text-[11px] font-bold shrink-0 shadow-xs"
            >
              Semua Gear
            </Link>
            <Link
              href="/products?category=audio-headphone"
              className="px-2.5 py-1 rounded-md bg-white hover:bg-gray-100 text-gray-700 text-[11px] font-semibold shrink-0 border border-gray-300 transition"
            >
              Audiofil
            </Link>
            <Link
              href="/products?category=mechanical-keyboard"
              className="px-2.5 py-1 rounded-md bg-white hover:bg-gray-100 text-gray-700 text-[11px] font-semibold shrink-0 border border-gray-300 transition"
            >
              Keyboards
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. MONEY BACK GUARANTEE BAR */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-1">
        <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">BayE Buyer Guarantee</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Barang sesuai pesanan atau uang kembali 100%.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">Pengiriman Cepat</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              SiCepat, JNE, dan GoSend Instant dengan no resi live.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex items-start gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">Jual di BayE</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Buka toko gratis via <Link href="/seller" className="text-blue-600 underline font-semibold">Portal Seller</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
