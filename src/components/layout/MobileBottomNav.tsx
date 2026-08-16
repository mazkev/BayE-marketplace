"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Home, Compass, Package, ShoppingBag, User, Store } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();

  const isHome = pathname === "/";
  const isProducts = pathname.startsWith("/products");
  const isOrders = pathname.startsWith("/orders");
  const isSeller = pathname.startsWith("/seller");

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition ${
            isHome ? "text-[#0064d2] font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? "stroke-[2.5]" : "stroke-2"}`} />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Catalog / Explore */}
        <Link
          href="/products"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition ${
            isProducts ? "text-[#0064d2] font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Compass className={`w-5 h-5 ${isProducts ? "stroke-[2.5]" : "stroke-2"}`} />
          <span className="text-[10px]">Katalog</span>
        </Link>

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center gap-0.5 py-1 px-2 text-gray-500 hover:text-gray-900 transition cursor-pointer"
          aria-label="Buka Keranjang"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#e53238] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>

        {/* Orders */}
        <Link
          href="/orders"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition ${
            isOrders ? "text-[#0064d2] font-bold" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Package className={`w-5 h-5 ${isOrders ? "stroke-[2.5]" : "stroke-2"}`} />
          <span className="text-[10px]">Pesanan</span>
        </Link>

        {/* User / Seller Portal */}
        {user?.role === "SELLER" ? (
          <Link
            href="/seller"
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition ${
              isSeller ? "text-amber-700 font-bold" : "text-amber-600 hover:text-amber-700"
            }`}
          >
            <Store className={`w-5 h-5 ${isSeller ? "stroke-[2.5]" : "stroke-2"}`} />
            <span className="text-[10px]">Toko</span>
          </Link>
        ) : (
          <Link
            href={user ? "/orders" : "/login"}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-2 text-gray-500 hover:text-gray-900 transition"
          >
            <User className="w-5 h-5 stroke-2" />
            <span className="text-[10px]">{user ? "Akun" : "Masuk"}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
