"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Store, ArrowRight, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export default function LoginPage() {
  const { login, quickLogin } = useAuth();
  const [roleTab, setRoleTab] = useState<"BUYER" | "SELLER">("BUYER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage("");

    const success = await login(email, roleTab);
    setIsLoading(false);

    if (success) {
      if (roleTab === "SELLER") {
        router.push("/seller");
      } else {
        router.push("/");
      }
    } else {
      setErrorMessage("Gagal masuk. Silakan cek email Anda.");
    }
  };

  const handleQuickDemo = async (role: "BUYER" | "SELLER") => {
    setIsLoading(true);
    await quickLogin(role);
    setIsLoading(false);
    if (role === "SELLER") {
      router.push("/seller");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-1.5">
        <Link href="/" className="inline-flex flex-col items-center group">
          <div className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">
            <span className="text-[#e53238]">B</span>
            <span className="text-[#0064d2]">a</span>
            <span className="text-[#f5af02]">y</span>
            <span className="text-[#86b817]">E</span>
          </div>
          <span className="text-[10px] font-bold text-gray-500 tracking-tight mt-0.5 group-hover:text-blue-600 transition">
            a marketplace by mazkev
          </span>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 pt-1">
          Masuk ke Akun Anda
        </h1>
        <p className="text-xs text-gray-500">
          Pilih tipe akun untuk mengakses fitur yang sesuai
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setRoleTab("BUYER")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
            roleTab === "BUYER"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <User className="w-4 h-4 text-[#0064d2]" />
          <span>Akun Pembeli (Buyer)</span>
        </button>

        <button
          type="button"
          onClick={() => setRoleTab("SELLER")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
            roleTab === "SELLER"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Store className="w-4 h-4 text-amber-600" />
          <span>Akun Penjual (Seller)</span>
        </button>
      </div>

      {/* Login Box */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-5">
        {/* Role Description Banner */}
        <div className={`p-3 rounded-lg text-xs font-medium ${
          roleTab === "BUYER"
            ? "bg-blue-50 text-blue-900 border border-blue-200"
            : "bg-amber-50 text-amber-900 border border-amber-200"
        }`}>
          {roleTab === "BUYER" ? (
            <p>🛍️ <strong>Mode Pembeli:</strong> Belanja produk audio & gear, simpan wishlist, dan lacak status pengiriman pesanan.</p>
          ) : (
            <p>🏪 <strong>Mode Penjual:</strong> Masuk ke Seller Portal untuk mengelola katalog produk, harga, stok, dan memproses pesanan pembeli.</p>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Email</label>
            <input
              type="email"
              required
              placeholder={roleTab === "BUYER" ? "budi@example.com" : "seller@apexgear.id"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white text-gray-900 p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white text-gray-900 p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-xs sm:text-sm"
            />
            <p className="text-[10px] text-gray-400 mt-1">Gunakan password apa saja untuk demo.</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 ${
              roleTab === "BUYER"
                ? "bg-[#0064d2] hover:bg-[#0053a0]"
                : "bg-amber-600 hover:bg-amber-700"
            } text-white font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer`}
          >
            <span>{isLoading ? "Memproses..." : `Masuk sebagai ${roleTab === "BUYER" ? "Pembeli" : "Penjual"}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Demo Logins */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Atau Gunakan Akun Demo (1-Klik)
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("BUYER")}
              disabled={isLoading}
              className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition cursor-pointer"
            >
              <div className="font-bold text-xs text-gray-900 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#0064d2]" />
                <span>Budi Santoso</span>
              </div>
              <span className="text-[10px] text-gray-500 block">Akun Pembeli</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo("SELLER")}
              disabled={isLoading}
              className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition cursor-pointer"
            >
              <div className="font-bold text-xs text-gray-900 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span>Apex Gear Store</span>
              </div>
              <span className="text-[10px] text-gray-500 block">Akun Penjual</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 pt-1">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Autentikasi Terenkripsi & Terpisah Secara Aman</span>
      </div>
    </div>
  );
}
