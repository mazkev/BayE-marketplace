"use server";

import { prisma } from "@/lib/prisma";

export async function loginUser(email: string, requestedRole?: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // If user doesn't exist, create a default one with the requested role
      user = await prisma.user.create({
        data: {
          email,
          name: requestedRole === "SELLER" ? "Toko Seller Baru" : "Pembeli Baru",
          role: requestedRole || "BUYER",
          avatar: requestedRole === "SELLER"
            ? "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150"
            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        },
      });
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function registerUser(name: string, email: string, role: string) {
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Email sudah terdaftar. Silakan login." };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        avatar: role === "SELLER"
          ? "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150"
          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
