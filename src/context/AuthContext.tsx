"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser } from "@/app/actions/auth";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  avatar?: string | null;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, role?: string) => Promise<boolean>;
  logout: () => void;
  quickLogin: (role: "BUYER" | "SELLER") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("techgear_auth_user");
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Default demo session as Buyer
        setUser({
          id: "demo-buyer-id",
          name: "Budi Santoso",
          email: "budi@example.com",
          role: "BUYER",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        });
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: string = "BUYER"): Promise<boolean> => {
    setIsLoading(true);
    const res = await loginUser(email, role);
    setIsLoading(false);
    if (res.success && res.user) {
      const sessionUser: UserSession = res.user as UserSession;
      setUser(sessionUser);
      localStorage.setItem("techgear_auth_user", JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const quickLogin = async (role: "BUYER" | "SELLER") => {
    if (role === "BUYER") {
      await login("budi@example.com", "BUYER");
    } else {
      await login("seller@apexgear.id", "SELLER");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("techgear_auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, quickLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
