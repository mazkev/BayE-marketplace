"use client";

import React, { useState } from "react";
import { submitProductReview } from "@/app/actions/reviews";
import { useToast } from "@/context/ToastContext";
import { Star, Send, Loader2 } from "lucide-react";

interface ReviewFormProps {
  productId: string;
  productName: string;
}

export function ReviewForm({ productId, productName }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("Budi Santoso");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast("Mohon tuliskan ulasan Anda terlebih dahulu", "error");
      return;
    }

    setIsSubmitting(true);
    const res = await submitProductReview({
      productId,
      rating,
      comment,
      userName,
    });
    setIsSubmitting(false);

    if (res.success) {
      showToast("Ulasan Anda berhasil dikirim!", "success");
      setComment("");
    } else {
      showToast(res.error || "Gagal mengirim ulasan", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3.5 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
        <h4 className="font-bold text-xs sm:text-sm text-gray-900">
          Tulis Ulasan untuk {productName}
        </h4>

        {/* 5-Star Interactive Rating Picker */}
        <div className="flex items-center gap-1">
          <span className="text-gray-500 font-medium mr-1">Beri Bintang:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 text-amber-500 hover:scale-125 transition cursor-pointer"
            >
              <Star
                className={`w-5 h-5 ${
                  (hoverRating || rating) >= star
                    ? "fill-amber-500 text-amber-500"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-1 font-bold text-gray-900">({rating}/5)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1">
          <label className="block text-gray-600 font-bold mb-1">Nama Pengulas</label>
          <input
            type="text"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-gray-600 font-bold mb-1">Pengalaman / Testimoni</label>
          <textarea
            required
            rows={2}
            placeholder="Bagikan pengalaman pemakaian, kualitas bahan, suara audio, atau kenyamanan produk..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-white text-gray-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-xs"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#0064d2] hover:bg-[#0053a0] text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Ulasan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
