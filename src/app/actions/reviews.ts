"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment: string;
  userName?: string;
}

export async function submitProductReview(data: CreateReviewInput) {
  try {
    if (!data.productId || !data.rating) {
      return { success: false, error: "Rating dan produk wajib diisi." };
    }

    // Find a buyer or create default reviewer
    let user = await prisma.user.findFirst({
      where: { role: "BUYER" },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.userName || "Pembeli Terverifikasi",
          email: `reviewer_${Date.now()}@example.com`,
          role: "BUYER",
        },
      });
    }

    await prisma.review.create({
      data: {
        productId: data.productId,
        userId: user.id,
        rating: data.rating,
        comment: data.comment,
      },
    });

    revalidatePath(`/products`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
