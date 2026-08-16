"use server";

import { prisma } from "@/lib/prisma";

export interface CheckoutInput {
  recipient: string;
  phone: string;
  address: string;
  city: string;
  courier: string;
  paymentMethod: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingFee: number;
}

export async function processCheckout(data: CheckoutInput) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Keranjang belanja kosong." };
    }

    // Get default buyer or create if not exists
    let buyer = await prisma.user.findFirst({
      where: { role: "BUYER" },
    });

    if (!buyer) {
      buyer = await prisma.user.create({
        data: {
          name: data.recipient || "Pelanggan TechGear",
          email: `buyer_${Date.now()}@example.com`,
          role: "BUYER",
        },
      });
    }

    const fullAddressString = `${data.recipient} (${data.phone}) - ${data.address}, ${data.city} [Kurir: ${data.courier}]`;

    // Create Order with OrderItems in SQLite transaction
    const order = await prisma.order.create({
      data: {
        userId: buyer.id,
        status: "PROCESSING",
        totalAmount: data.totalAmount,
        shippingFee: data.shippingFee,
        paymentMethod: data.paymentMethod,
        address: fullAddressString,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Reduce stock for products
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Checkout failed:", error);
    return { success: false, error: error.message || "Gagal memproses pesanan." };
  }
}
