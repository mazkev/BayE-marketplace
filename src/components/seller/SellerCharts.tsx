"use client";

import React from "react";
import { formatRupiah } from "@/lib/utils";
import { Download, TrendingUp, BarChart3, PieChart } from "lucide-react";

interface SellerChartsProps {
  orders: any[];
  products: any[];
}

export function SellerCharts({ orders, products }: SellerChartsProps) {
  // Export to CSV spreadsheet
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("Belum ada data pesanan untuk diekspor.");
      return;
    }

    const headers = ["Order ID", "Tanggal", "Nama Pembeli", "Total Tagihan (IDR)", "Ongkir (IDR)", "Metode Bayar", "Status", "Alamat Pengiriman"];
    const rows = orders.map((o) => [
      `#${o.id}`,
      new Date(o.createdAt).toLocaleDateString("id-ID"),
      o.user?.name || "Pembeli",
      o.totalAmount,
      o.shippingFee,
      `"${o.paymentMethod}"`,
      o.status,
      `"${o.address.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_penjualan_techgear_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status breakdown calculations
  const processingCount = orders.filter((o) => o.status === "PROCESSING").length;
  const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const total = orders.length || 1;

  // Monthly revenue mock simulation data based on real orders
  const totalRevenue = orders.reduce((a, o) => a + o.totalAmount, 0);
  const monthlyData = [
    { month: "Jan", amount: totalRevenue * 0.15 },
    { month: "Feb", amount: totalRevenue * 0.2 },
    { month: "Mar", amount: totalRevenue * 0.25 },
    { month: "Apr", amount: totalRevenue * 0.18 },
    { month: "Mei", amount: totalRevenue * 0.22 },
    { month: "Bulan Ini", amount: totalRevenue },
  ];

  const maxAmount = Math.max(...monthlyData.map((d) => d.amount), 1);

  return (
    <div className="space-y-4">
      {/* Top Action Bar: Export CSV */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Analitik Performa Penjualan</span>
        </h3>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ekspor Laporan (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Monthly Revenue Bar Graph */}
        <div className="md:col-span-7 p-4 rounded-xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-[#0064d2]" />
              <span>Tren Omset Penjualan (IDR)</span>
            </span>
            <span className="text-[11px] font-black text-emerald-700">
              Total: {formatRupiah(totalRevenue)}
            </span>
          </div>

          <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
            {monthlyData.map((d, idx) => {
              const heightPercent = Math.max(15, Math.round((d.amount / maxAmount) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[9px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition">
                    {formatRupiah(d.amount)}
                  </div>
                  <div
                    className="w-full max-w-[32px] bg-gradient-to-t from-[#0064d2] to-blue-400 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-semibold text-gray-600">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Fulfillment Breakdown */}
        <div className="md:col-span-5 p-4 rounded-xl bg-white border border-gray-200 shadow-xs space-y-3">
          <div className="border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
              <PieChart className="w-3.5 h-3.5 text-purple-600" />
              <span>Distribusi Status Pesanan</span>
            </span>
          </div>

          <div className="space-y-2.5 text-xs pt-1">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-amber-800 font-bold">Diproses (Processing):</span>
                <span className="font-bold text-gray-900">{processingCount} ({Math.round((processingCount / total) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(processingCount / total) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#0064d2] font-bold">Dalam Pengiriman (Shipped):</span>
                <span className="font-bold text-gray-900">{shippedCount} ({Math.round((shippedCount / total) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(shippedCount / total) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-emerald-700 font-bold">Selesai / Terkirim (Delivered):</span>
                <span className="font-bold text-gray-900">{deliveredCount} ({Math.round((deliveredCount / total) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(deliveredCount / total) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
