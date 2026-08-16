"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/app/actions/auth";
import { User, Store, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsLoading(true);
    setErrorMessage("");

    const res = await registerUser(name, email, role);
    if (res.success && res.user) {
      await login(email, role);
      if (role === "SELLER") {
        router.push("/seller");
      } else {
        router.push("/");
      }
    } else {
      setErrorMessage(res.error || "Gagal mendaftar.");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
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
          Buat Akun Baru
        </h1>
        <p className="text-xs text-gray-500">
          Daftar sebagai pembeli atau buka toko Anda sendiri
        </p>
      </div>

      {/* Role Switcher */}
      <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setRole("BUYER")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
            role === "BUYER"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <User className="w-4 h-4 text-[#0064d2]" />
          <span>Akun Pembeli</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("SELLER")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
            role === "SELLER"
              ? "bg-white text-gray-900 shadow-xs border border-gray-200"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Store className="w-4 h-4 text-amber-600" />
          <span>Akun Penjual</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              {role === "BUYER" ? "Nama Lengkap" : "Nama Toko / Brand"}
            </label>
            <input
              type="text"
              required
              placeholder={role === "BUYER" ? "Misal: Budi Santoso" : "Misal: Apex Gear Official"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white text-gray-900 p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 ${
              role === "BUYER"
                ? "bg-[#0064d2] hover:bg-[#0053a0]"
                : "bg-amber-600 hover:bg-amber-700"
            } text-white font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer`}
          >
            <span>{isLoading ? "Mendaftar..." : `Daftar sebagai ${role === "BUYER" ? "Pembeli" : "Penjual"}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Masuk di Sini
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Data Pribadi Terlindungi Sesuai Ketentuan Layanan</span>
      </div>
    </div>
  );
}
