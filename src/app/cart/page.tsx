"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";
import { processCheckout } from "@/app/actions/checkout";
import confetti from "canvas-confetti";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  Tag,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const router = useRouter();

  // Form states
  const [recipient, setRecipient] = useState("Budi Santoso");
  const [phone, setPhone] = useState("081234567890");
  const [city, setCity] = useState("Jakarta Selatan");
  const [address, setAddress] = useState("Jl. Sudirman No. 45, Kebayoran Baru");
  const [courier, setCourier] = useState("sicepat");
  const [paymentMethod, setPaymentMethod] = useState("BCA Virtual Account");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Courier shipping costs
  const courierOptions: Record<string, { name: string; fee: number; eta: string }> = {
    sicepat: { name: "SiCepat BEST (1-2 Hari)", fee: 22000, eta: "1-2 Hari" },
    jne: { name: "JNE Reguler (2-3 Hari)", fee: 18000, eta: "2-3 Hari" },
    gosend: { name: "GoSend Instant (3 Jam)", fee: 35000, eta: "3 Jam" },
  };

  const freeShippingThreshold = 500000;
  const baseShippingFee = courierOptions[courier]?.fee || 20000;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : baseShippingFee;

  const totalPayment = Math.max(0, subtotal - promoDiscount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === "BAYE10" || code === "TECHGEAR10") {
      const discount = Math.round(subtotal * 0.1);
      setPromoDiscount(discount);
      setPromoMessage("✓ Kupon BAYE10 berhasil diterapkan! (Diskon 10%)");
    } else {
      setPromoMessage("Kupon tidak valid. Coba gunakan: BAYE10");
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    try {
      const orderItems = cart.map((item) => {
        const discount = item.product.discount || 0;
        const price = item.product.price * (1 - discount / 100);
        return {
          productId: item.product.id,
          quantity: item.quantity,
          price,
        };
      });

      const res = await processCheckout({
        recipient,
        phone,
        city,
        address,
        courier: courierOptions[courier]?.name || courier,
        paymentMethod,
        items: orderItems,
        totalAmount: totalPayment,
        shippingFee,
      });

      if (res.success && res.orderId) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        setOrderSuccessId(res.orderId);
        clearCart();
      } else {
        alert(res.error || "Gagal membuat pesanan.");
      }
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State View
  if (orderSuccessId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Pesanan Berhasil Dibuat!</h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Terima kasih telah berbelanja. Pesanan Anda dengan ID <strong className="text-[#0064d2] font-mono">#{orderSuccessId.slice(0, 8)}</strong> sedang diproses.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-gray-200 text-left space-y-2 text-xs text-gray-700 max-w-md mx-auto shadow-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Penerima:</span>
            <span className="font-semibold text-gray-900">{recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Metode Bayar:</span>
            <span className="font-semibold text-gray-900">{paymentMethod}</span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-2">
            <span className="text-gray-500">Total Tagihan:</span>
            <span className="font-black text-[#0064d2] text-sm">{formatRupiah(totalPayment)}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-3">
          <Link
            href="/orders"
            className="px-5 py-2.5 bg-[#0064d2] hover:bg-[#0053a0] text-white font-bold rounded-lg text-xs transition shadow-xs"
          >
            Lihat Pesanan Saya
          </Link>
          <Link
            href="/products"
            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-lg text-xs border border-gray-300 transition"
          >
            Lanjut Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Keranjang & Checkout
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Review pesanan dan lengkapi rincian alamat pengiriman
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-gray-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Keranjang belanja Anda kosong</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Pilih produk favorit Anda di katalog untuk melanjutkan transaksi.
          </p>
          <Link
            href="/products"
            className="inline-block mt-2 px-5 py-2.5 bg-[#0064d2] text-white text-xs font-bold rounded-lg"
          >
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cart Items & Shipping Forms */}
          <div className="lg:col-span-7 space-y-4">
            {/* Cart Items List */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <ShoppingBag className="w-4 h-4 text-[#0064d2]" />
                <span>Daftar Produk ({totalItems})</span>
              </h2>

              <div className="divide-y divide-gray-100">
                {cart.map(({ product, quantity }) => {
                  let firstImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200";
                  try {
                    const parsed = JSON.parse(product.images);
                    if (Array.isArray(parsed) && parsed.length > 0) firstImage = parsed[0];
                  } catch {
                    if (typeof product.images === "string" && product.images.startsWith("http")) {
                      firstImage = product.images;
                    }
                  }

                  const discount = product.discount || 0;
                  const finalPrice = product.price * (1 - discount / 100);

                  return (
                    <div key={product.id} className="py-3 first:pt-0 last:pb-0 flex gap-3 items-center">
                      <img
                        src={firstImage}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-contain bg-gray-50 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xs font-bold text-gray-900">
                            {formatRupiah(finalPrice)}
                          </span>
                          {discount > 0 && (
                            <span className="text-[11px] text-gray-400 line-through">
                              {formatRupiah(product.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 text-gray-600 hover:text-gray-900 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address Information */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Alamat Pengiriman</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Nama Penerima</label>
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">No. WhatsApp / HP</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Kota / Kabupaten</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Alamat Lengkap</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Courier Selection */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <Truck className="w-4 h-4 text-cyan-600" />
                <span>Opsi Kurir Pengiriman</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {Object.entries(courierOptions).map(([key, opt]) => (
                  <label
                    key={key}
                    className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition ${
                      courier === key
                        ? "bg-blue-50/60 border-blue-600 text-gray-900"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <input
                        type="radio"
                        name="courier"
                        value={key}
                        checked={courier === key}
                        onChange={() => setCourier(key)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-bold text-[#0064d2]">
                        {subtotal >= freeShippingThreshold ? "GRATIS" : formatRupiah(opt.fee)}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{opt.name}</div>
                      <div className="text-[11px] text-gray-500">Estimasi: {opt.eta}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Metode Pembayaran</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {["BCA Virtual Account", "Mandiri VA", "QRIS Instant", "GoPay / OVO"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2.5 rounded-lg border font-semibold text-left transition cursor-pointer ${
                      paymentMethod === method
                        ? "bg-blue-50 border-blue-600 text-[#0064d2]"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Pay CTA */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            {/* Promo Code Box */}
            <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2 shadow-xs">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#0064d2]" />
                <span>Punya Kode Voucher?</span>
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Gunakan: TECHGEAR10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white text-xs text-gray-900 uppercase placeholder-gray-400 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg border border-gray-300 transition cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
              {promoMessage && (
                <p className={`text-[11px] ${promoDiscount > 0 ? "text-emerald-700 font-bold" : "text-rose-600 font-medium"}`}>
                  {promoMessage}
                </p>
              )}
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-gray-900">Ringkasan Pembayaran</h3>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Total Harga ({totalItems} barang)</span>
                  <span className="font-semibold text-gray-900">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Ongkos Kirim</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">GRATIS</span>
                    ) : (
                      formatRupiah(shippingFee)
                    )}
                  </span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Diskon Voucher</span>
                    <span>-{formatRupiah(promoDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total Tagihan</span>
                  <span className="text-[#0064d2] font-black">{formatRupiah(totalPayment)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 bg-[#0064d2] hover:bg-[#0053a0] active:bg-[#004280] text-white font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses Pesanan...</span>
                  </>
                ) : (
                  <>
                    <span>Bayar Sekarang ({formatRupiah(totalPayment)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Jaminan Transaksi Aman 100%</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
