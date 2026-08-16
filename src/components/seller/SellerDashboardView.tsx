"use client";

import React, { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { createProduct, deleteProduct, updateOrderStatus, updateProduct } from "@/app/actions/seller";
import { useAuth } from "@/context/AuthContext";
import { SellerCharts } from "@/components/seller/SellerCharts";
import {
  Store,
  DollarSign,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface SellerDashboardProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    activeOrders: number;
  };
  products: any[];
  orders: any[];
  categories: any[];
}

export function SellerDashboardView({ stats, products, orders, categories }: SellerDashboardProps) {
  const { user, quickLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createProduct(formData);
    setIsSubmitting(false);
    if (res.success) {
      setIsAddModalOpen(false);
    } else {
      alert(res.error || "Gagal menambah produk");
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSubmitting(true);
    const res = await updateProduct(editingProduct.id, Number(editingProduct.price), Number(editingProduct.stock));
    setIsSubmitting(false);
    if (res.success) {
      setEditingProduct(null);
    } else {
      alert(res.error || "Gagal mengupdate produk");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
  };

  // If user is not logged in as SELLER, show account switch prompt
  const isSeller = user?.role === "SELLER";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Role Warning / Notice if not logged in as Seller */}
      {!isSeller && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-200/60 rounded-lg text-amber-800 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Mode Akses: {user ? `Sedang Login sebagai ${user.name} (Pembeli)` : "Belum Login"}</p>
              <p className="text-amber-700">Untuk mengelola toko, menambah produk baru, atau mengubah status pesanan, Anda perlu masuk dengan Akun Penjual (Seller).</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => quickLogin("SELLER")}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Masuk sebagai Seller (Apex Gear)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Seller Management Portal
              </h1>
              {isSeller && (
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  Aktif (Seller)
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Kelola inventaris produk dan proses pesanan toko TechGear Anda
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!isSeller) {
              alert("Silakan masuk dengan akun Seller terlebih dahulu untuk menambah produk.");
              return;
            }
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0064d2] hover:bg-[#0053a0] text-white font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Total Pendapatan</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700">
            {formatRupiah(stats.totalRevenue)}
          </div>
          <div className="text-[11px] text-gray-400">Dari seluruh transaksi sukses</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Total Pesanan Masuk</span>
            <ShoppingBag className="w-4 h-4 text-[#0064d2]" />
          </div>
          <div className="text-xl font-black text-gray-900">{stats.totalOrders}</div>
          <div className="text-[11px] text-amber-700 font-bold">
            {stats.activeOrders} pesanan aktif
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Total Produk Aktif</span>
            <Package className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-xl font-black text-gray-900">{stats.totalProducts}</div>
          <div className="text-[11px] text-gray-400">Tersedia di katalog publik</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Database Storage</span>
            <Store className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-gray-900 font-mono">SQLite</div>
          <div className="text-[11px] text-emerald-700 font-bold">✓ Connected & Synced</div>
        </div>
      </div>

      {/* Visual Analytics Charts & CSV Export */}
      <SellerCharts orders={orders} products={products} />

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-2.5 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "products"
              ? "border-[#0064d2] text-[#0064d2]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Kelola Produk ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-2.5 px-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === "orders"
              ? "border-[#0064d2] text-[#0064d2]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pesanan Masuk ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: Products Table */}
      {activeTab === "products" && (
        <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-3 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider bg-gray-50">
                <tr>
                  <th className="p-2.5 font-bold">Produk</th>
                  <th className="p-2.5 font-bold">Kategori</th>
                  <th className="p-2.5 font-bold">Harga</th>
                  <th className="p-2.5 font-bold">Stok</th>
                  <th className="p-2.5 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => {
                  let img = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100";
                  try {
                    const parsed = JSON.parse(prod.images);
                    if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
                  } catch {
                    if (typeof prod.images === "string") img = prod.images;
                  }

                  return (
                    <tr key={prod.id} className="hover:bg-gray-50/80 transition">
                      <td className="p-2.5 pr-4 flex items-center gap-3">
                        <img
                          src={img}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{prod.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">/{prod.slug}</div>
                        </div>
                      </td>
                      <td className="p-2.5 pr-4">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                          {prod.category?.name || "-"}
                        </span>
                      </td>
                      <td className="p-2.5 pr-4 font-bold text-gray-900">
                        {formatRupiah(prod.price)}
                        {prod.discount > 0 && (
                          <span className="text-[10px] text-rose-600 block font-bold">
                            Diskon {prod.discount}%
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 pr-4">
                        <span
                          className={`font-bold ${
                            prod.stock <= 5 ? "text-rose-600" : "text-emerald-700"
                          }`}
                        >
                          {prod.stock} unit
                        </span>
                      </td>
                      <td className="p-2.5 text-right space-x-1.5">
                        <Link
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          className="p-1.5 inline-block text-gray-500 hover:text-blue-600 rounded bg-gray-100 hover:bg-gray-200"
                          title="Lihat di Store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-1.5 text-gray-500 hover:text-amber-600 rounded bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                          title="Edit Cepat"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 rounded bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Orders Management */}
      {activeTab === "orders" && (
        <div className="space-y-3">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-xl bg-white border border-gray-200 space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5 text-xs">
                <div>
                  <span className="text-gray-500">Order ID: </span>
                  <span className="font-mono font-bold text-[#0064d2]">#{ord.id}</span>
                  <span className="text-gray-400 ml-2">
                    {new Date(ord.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Ubah Status:</span>
                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                    className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="PROCESSING">PROCESSING (Diproses)</option>
                    <option value="SHIPPED">SHIPPED (Dikirim)</option>
                    <option value="DELIVERED">DELIVERED (Selesai)</option>
                    <option value="CANCELLED">CANCELLED (Batal)</option>
                  </select>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-1.5 text-xs">
                {ord.items.map((it: any) => (
                  <div key={it.id} className="flex justify-between items-center text-gray-700">
                    <span>
                      {it.quantity}x {it.product.name}
                    </span>
                    <span className="font-bold text-gray-900">{formatRupiah(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
                <div>
                  <strong className="text-gray-800">Alamat:</strong> {ord.address}
                </div>
                <div className="text-right">
                  Total: <strong className="text-[#0064d2] font-black text-sm">{formatRupiah(ord.totalAmount)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Tambah Produk Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nama Produk</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Misal: Keychron K2 Wireless Keyboard"
                  className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Harga (Rp)</label>
                  <input
                    name="price"
                    type="number"
                    required
                    placeholder="1200000"
                    className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Diskon (%)</label>
                  <input
                    name="discount"
                    type="number"
                    defaultValue="0"
                    placeholder="10"
                    className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Stok Awal</label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue="20"
                    required
                    className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Kategori</label>
                  <select
                    name="categoryId"
                    required
                    className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">URL Foto Produk</label>
                <input
                  name="imageUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  defaultValue="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800"
                  className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Deskripsi Produk</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Jelaskan fitur, bahan, dan keunggulan produk..."
                  className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-900 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0064d2] hover:bg-[#0053a0] text-white font-bold rounded-lg shadow-xs transition cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Edit Product */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-gray-200 p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h3 className="text-xs font-bold text-gray-900">Edit Cepat Produk</h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-900 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
              <p className="text-gray-900 font-bold line-clamp-1">{editingProduct.name}</p>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Stok Tersedia</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 text-gray-500 hover:text-gray-900 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-[#0064d2] hover:bg-[#0053a0] text-white font-bold rounded-lg transition cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
