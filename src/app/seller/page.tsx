import React from "react";
import { prisma } from "@/lib/prisma";
import { SellerDashboardView } from "@/components/seller/SellerDashboardView";

export const dynamic = "force-dynamic";

interface OrderRecord {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  address: string;
  items: any[];
}

export default async function SellerPage() {
  const [products, orders, categories] = (await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ])) as [any[], OrderRecord[], any[]];

  const totalRevenue = orders.reduce((acc: number, o: OrderRecord) => acc + o.totalAmount, 0);
  const activeOrders = orders.filter((o: OrderRecord) => o.status !== "DELIVERED" && o.status !== "CANCELLED").length;

  const stats = {
    totalRevenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    activeOrders,
  };

  return (
    <SellerDashboardView
      stats={stats}
      products={products}
      orders={orders}
      categories={categories}
    />
  );
}
