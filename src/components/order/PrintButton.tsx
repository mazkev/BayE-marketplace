"use client";

import React from "react";
import { Printer, Download } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="px-4 py-2 bg-[#0064d2] hover:bg-[#0053a0] text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
    >
      <Printer className="w-4 h-4" />
      <span>Cetak / Simpan PDF</span>
    </button>
  );
}
