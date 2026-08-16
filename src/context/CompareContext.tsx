"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";

export interface CompareProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount?: number | null;
  stock: number;
  images: string;
  category?: {
    name: string;
  };
  reviews?: {
    rating: number;
  }[];
}

interface CompareContextType {
  compareList: CompareProduct[];
  addToCompare: (product: CompareProduct) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<CompareProduct[]>([]);
  const { showToast } = useToast();

  const addToCompare = (product: CompareProduct) => {
    if (compareList.length >= 4) {
      showToast("Maksimal 4 produk untuk dibandingkan", "error");
      return;
    }
    if (compareList.some((p) => p.id === product.id)) {
      showToast("Produk sudah ada di daftar komparasi", "info");
      return;
    }
    setCompareList((prev) => [...prev, product]);
    showToast(`"${product.name}" ditambahkan ke perbandingan!`, "success");
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
    showToast("Produk dihapus dari perbandingan", "info");
  };

  const isInCompare = (productId: string) => {
    return compareList.some((p) => p.id === productId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
