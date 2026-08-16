import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { PrintButton } from "@/components/order/PrintButton";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, QrCode } from "lucide-react";

export const dynamic = "force-dynamic";

interface InvoiceOrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    slug: string;
    images: string;
  };
}

interface InvoiceOrderData {
  id: string;
  createdAt: Date;
  status: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  shippingFee: number;
  user: {
    name: string;
    email: string;
  };
  items: InvoiceOrderItem[];
}

interface InvoicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;

  const rawOrder = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!rawOrder) {
    notFound();
  }

  const order = rawOrder as unknown as InvoiceOrderData;
  const subtotalItems = order.items.reduce((acc: number, item: InvoiceOrderItem) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="flex items-center justify-between print:hidden border-b border-gray-200 pb-4">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pesanan</span>
        </Link>

        <PrintButton />
      </div>

      {/* Printable Invoice Paper (A4 Style) */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200 pb-6">
          <div>
            <div className="text-3xl font-black tracking-tighter mb-0.5 leading-none">
              <span className="text-[#e53238]">B</span>
              <span className="text-[#0064d2]">a</span>
              <span className="text-[#f5af02]">y</span>
              <span className="text-[#86b817]">E</span>
            </div>
            <p className="text-[11px] font-bold text-gray-500 mb-1">a marketplace by mazkev</p>
            <p className="text-xs text-gray-500">PT BayE Marketplace Indonesia</p>
            <p className="text-xs text-gray-500">Gedung Cyber 2 Tower, Jakarta Selatan, 12950</p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-wider">
              INVOICE RESMI
            </h1>
            <div className="text-xs font-mono font-bold text-gray-700">
              NO: INV/BAYE/{order.id.toUpperCase().slice(0, 10)}
            </div>
            <div className="text-xs text-gray-500">
              Tanggal: {new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>PEMBAYARAN LUNAS</span>
            </div>
          </div>
        </div>

        {/* Buyer & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-gray-200 pb-6">
          <div>
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider block mb-1">
              Diterbitkan Untuk:
            </span>
            <div className="font-bold text-sm text-gray-900">{order.user.name}</div>
            <div className="text-gray-600 mt-1">{order.user.email}</div>
          </div>

          <div>
            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider block mb-1">
              Tujuan Pengiriman:
            </span>
            <div className="text-gray-700 leading-relaxed">{order.address}</div>
            <div className="mt-2 text-gray-500">
              <strong className="text-gray-700">Metode Bayar:</strong> {order.paymentMethod}
            </div>
          </div>
        </div>

        {/* Invoice Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900 text-gray-900 uppercase text-[10px] tracking-wider font-black">
                <th className="pb-3">Deskripsi Produk</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Harga Satuan</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item: InvoiceOrderItem) => (
                <tr key={item.id}>
                  <td className="py-3 font-semibold text-gray-900">
                    {item.product.name}
                  </td>
                  <td className="py-3 text-center font-bold text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-gray-700 font-medium">
                    {formatRupiah(item.price)}
                  </td>
                  <td className="py-3 text-right font-bold text-gray-900">
                    {formatRupiah(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Breakdown & QR Signature */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t-2 border-gray-900 pt-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="p-3 border border-gray-200 rounded-xl bg-gray-50 inline-block">
              <QrCode className="w-16 h-16 text-gray-800 mx-auto" />
            </div>
            <p className="text-[10px] text-gray-400">
              Invoice ini sah dan diterbitkan secara digital oleh sistem TechGear.
            </p>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-xs text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal Produk:</span>
              <span className="font-semibold text-gray-900">{formatRupiah(subtotalItems)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim:</span>
              <span>
                {order.shippingFee === 0 ? (
                  <span className="text-emerald-700 font-bold">GRATIS</span>
                ) : (
                  formatRupiah(order.shippingFee)
                )}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-black text-gray-900">
              <span>Total Tagihan:</span>
              <span className="text-[#0064d2]">{formatRupiah(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
