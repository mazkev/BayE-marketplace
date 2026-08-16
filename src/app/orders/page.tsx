import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { Package, Clock, Truck, CheckCircle2, ShoppingBag, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderItemData {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    slug: string;
    images: string;
  };
}

interface OrderData {
  id: string;
  createdAt: Date;
  status: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  items: OrderItemData[];
}

export default async function OrdersPage() {
  const orders: OrderData[] = (await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })) as unknown as OrderData[];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Sedang Diproses</span>
          </span>
        );
      case "SHIPPED":
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-[#0064d2] border border-blue-200 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>Dalam Pengiriman</span>
          </span>
        );
      case "DELIVERED":
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Selesai / Terkirim</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Pesanan Saya
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Pantau status pengiriman, cetak invoice resmi, dan kelola riwayat transaksi Anda
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0064d2] hover:bg-[#0053a0] text-white text-xs font-bold rounded-lg shadow-xs transition w-fit"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Belanja Lagi</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-gray-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Belum ada riwayat pesanan</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Pesanan yang telah Anda checkout akan otomatis muncul dan dapat dipantau di sini.
          </p>
          <Link
            href="/products"
            className="inline-block mt-2 px-4 py-2 bg-[#0064d2] text-white text-xs font-bold rounded-lg"
          >
            Mulai Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-mono font-bold text-[#0064d2]">
                      #{order.id.slice(0, 10)}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}

                  {/* Print Invoice Link */}
                  <Link
                    href={`/orders/${order.id}/invoice`}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg border border-gray-200 flex items-center gap-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#0064d2]" />
                    <span>Lihat Invoice</span>
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2.5">
                {order.items.map((item) => {
                  let img = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150";
                  try {
                    const parsed = JSON.parse(item.product.images);
                    if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
                  } catch {
                    if (typeof item.product.images === "string") img = item.product.images;
                  }

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <img
                        src={img}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.quantity} x {formatRupiah(item.price)}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm font-black text-gray-900 shrink-0">
                        {formatRupiah(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery info & Total */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-gray-100">
                <div className="text-gray-600 space-y-0.5">
                  <div>
                    <strong className="text-gray-800">Alamat Kirim:</strong> {order.address}
                  </div>
                  <div>
                    <strong className="text-gray-800">Metode Bayar:</strong> {order.paymentMethod}
                  </div>
                </div>

                <div className="text-right sm:shrink-0">
                  <span className="text-gray-500 block text-[11px]">Total Transaksi:</span>
                  <span className="text-base font-black text-[#0064d2]">
                    {formatRupiah(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
