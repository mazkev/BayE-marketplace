import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { Search, ArrowUpDown, Tag, X } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const categorySlug = params.category || "";
  const sort = params.sort || "newest";

  // Build Prisma where query
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  // Build Prisma orderBy query
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name-asc") orderBy = { name: "asc" };

  interface CategoryData {
    id: string;
    name: string;
    slug: string;
    _count: { products: number };
  }

  const [products, categories] = (await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        reviews: true,
      },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
  ])) as [any[], CategoryData[]];

  const activeCategory = categories.find((c: CategoryData) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {activeCategory ? activeCategory.name : "Katalog Semua Produk"}
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            Menampilkan <strong className="text-blue-600 font-bold">{products.length}</strong> produk pilihan
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <form method="GET" action="/products" className="relative flex-1 sm:flex-initial sm:w-64">
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Cari dalam katalog..."
              className="w-full bg-white text-xs text-gray-900 placeholder-gray-400 pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Sort Dropdown Links */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-300 text-[11px] sm:text-xs overflow-x-auto">
            <span className="text-gray-500 px-1.5 flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3 h-3" />
              <span className="hidden sm:inline">Urut:</span>
            </span>
            <Link
              href={`/products?${new URLSearchParams({
                ...(search ? { search } : {}),
                ...(categorySlug ? { category: categorySlug } : {}),
                sort: "newest",
              }).toString()}`}
              className={`px-2 py-1 rounded-md transition font-medium shrink-0 ${
                sort === "newest"
                  ? "bg-[#0064d2] text-white"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Terbaru
            </Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(search ? { search } : {}),
                ...(categorySlug ? { category: categorySlug } : {}),
                sort: "price-asc",
              }).toString()}`}
              className={`px-2 py-1 rounded-md transition font-medium shrink-0 ${
                sort === "price-asc"
                  ? "bg-[#0064d2] text-white"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Termurah
            </Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(search ? { search } : {}),
                ...(categorySlug ? { category: categorySlug } : {}),
                sort: "price-desc",
              }).toString()}`}
              className={`px-2 py-1 rounded-md transition font-medium shrink-0 ${
                sort === "price-desc"
                  ? "bg-[#0064d2] text-white"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Termahal
            </Link>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Link
          href="/products"
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
            !categorySlug
              ? "bg-[#0064d2] text-white shadow-xs"
              : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Semua ({categories.reduce((acc: number, c: CategoryData) => acc + c._count.products, 0)})</span>
        </Link>
        {categories.map((cat: CategoryData) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}${search ? `&search=${search}` : ""}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
              categorySlug === cat.slug
                ? "bg-[#0064d2] text-white shadow-xs"
                : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <span>{cat.name}</span>
            <span className="text-[10px] opacity-75">({cat._count.products})</span>
          </Link>
        ))}
      </div>

      {/* Active Filter Tags */}
      {(search || categorySlug) && (
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-gray-500 font-medium">Filter:</span>
          {search && (
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 font-medium text-[11px]">
              &quot;{search}&quot;
              <Link href={`/products?${categorySlug ? `category=${categorySlug}` : ""}`}>
                <X className="w-3 h-3 hover:text-rose-600 cursor-pointer" />
              </Link>
            </span>
          )}
          {categorySlug && (
            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1 font-medium text-[11px]">
              {activeCategory?.name}
              <Link href={`/products?${search ? `search=${search}` : ""}`}>
                <X className="w-3 h-3 hover:text-rose-600 cursor-pointer" />
              </Link>
            </span>
          )}
          <Link href="/products" className="text-gray-500 hover:text-rose-600 text-xs ml-1 font-medium">
            Reset
          </Link>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-white border border-gray-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Tidak ada produk ditemukan</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Coba gunakan kata kunci pencarian yang berbeda atau pilih kategori lain.
          </p>
          <Link
            href="/products"
            className="inline-block mt-2 px-4 py-2 bg-[#0064d2] text-white text-xs font-bold rounded-lg"
          >
            Lihat Semua Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
