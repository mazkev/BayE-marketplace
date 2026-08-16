"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const discount = parseFloat((formData.get("discount") as string) || "0");
    const stock = parseInt((formData.get("stock") as string) || "10", 10);
    const categoryId = formData.get("categoryId") as string;
    const imageUrl =
      (formData.get("imageUrl") as string) ||
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        discount,
        stock,
        categoryId,
        images: JSON.stringify([imageUrl]),
        featured: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/seller");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, price: number, stock: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: { price, stock },
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/seller");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/seller");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/orders");
    revalidatePath("/seller");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
