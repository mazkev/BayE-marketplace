# BayE - a marketplace by mazkev 🛍️

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-LibSQL-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

**BayE** adalah aplikasi Fullstack E-Commerce Marketplace berkinerja tinggi dengan inspirasi antarmuka bergaya **eBay Light Theme**, dibangun menggunakan **Next.js (App Router)**, **SQLite lokal via Prisma 7**, dan **Tailwind CSS**.

---

## 🌟 Fitur Utama

### 1. 🛒 Pengalaman Pembeli (Buyer Experience)
- **Header 3-Tier Ikonis:** Top utility bar, search bar lebar dengan auto-suggest live, dan category sub-bar horizontal.
- **🔍 Live Search Auto-Suggest:** Rekomendasi pencarian real-time dengan preview thumbnail, harga diskon, dan rating saat mengetik.
- **🎠 Auto-Rotating Promo Banner:** Hero banner slider promo otomatis (4.5s) dengan controls & smart hover pause.
- **❤️ Watchlist / Wishlist System:** Halaman tersendiri (`/wishlist`) dengan tombol *"Beli Semua ke Keranjang"*.
- **⚖️ Fitur Bandingkan Produk (`/compare`):** Bandingkan spesifikasi dan harga hingga 4 produk berdampingan.
- **⭐ Sistem Ulasan & Rating Bintang:** Kirim ulasan dan rating langsung di halaman produk.
- **🛍️ Cart Drawer & Checkout:** Multi-kurir (SiCepat, JNE, GoSend), promo kupon `BAYE10`, dan simulasi metode bayar (BCA VA, Mandiri, QRIS, GoPay).
- **🧾 Cetak Invoice PDF Resmi (`/orders/[id]/invoice`):** Faktur kwitansi berstandar A4 siap-print lengkap dengan verifikasi QR signature.

### 2. 🏪 Pengalaman Penjual (Seller & Store Portal)
- **Seller Management Dashboard (`/seller`):** Kelola stok barang, tambah produk baru dengan foto, dan update status pesanan.
- **📊 Grafik Analitik Visual:** Bar chart omset bulanan dan diagram status pemrosesan pesanan.
- **📥 Ekspor Laporan CSV:** Download rekap data transaksi dalam format `.csv` untuk Excel/pembukuan.
- **🏬 Halaman Profil Toko Publik (`/store/apex-gear`):** Etalase resmi toko dengan badge *Official Store*, rating 4.9/5, dan katalog khusus.

### 3. 👥 Autentikasi & Pemisahan Peran (Role Separation)
- Login dan Register terpisah untuk **Pembeli (Buyer)** dan **Penjual (Seller)**.
- Tombol **1-Klik Demo Login** untuk pengujian instan.
- Dropdown header untuk switch akun dan peran seketika.

### 4. 📱 100% Mobile-Friendly
- **Mobile Bottom Navigation Bar:** Navigasi bawah sticky khas aplikasi mobile belanja online.
- **Sticky Purchase Bar:** Bar aksi instan di halaman detail produk pada layar smartphone.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Server Actions, API Routes)
- **Database:** SQLite (LibSQL Adapter) + Prisma 7 ORM
- **Styling:** Tailwind CSS 4 + Lucide Icons
- **Language:** TypeScript (Strict Mode)
- **Animations & Effects:** Canvas Confetti

---

## 🚀 Panduan Menjalankan Proyek (Quick Start)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/baye-marketplace.git
cd baye-marketplace
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Setup Database SQLite & Seed Demo Data
```bash
# Push skema database ke SQLite
npx prisma db push

# Generate Prisma Client types
npx prisma generate

# Jalankan seeder produk dan data awal
npx tsx prisma/seed.ts
```

### 4. Jalankan Development Server
```bash
npm run dev
```

Buka **[http://localhost:3000](http://localhost:3000)** di browser Anda.

---

## 📂 Struktur Direktori

```plaintext
src/
├── app/                      # Next.js App Router Pages & API Routes
│   ├── actions/              # Server Actions (checkout, seller, auth, reviews)
│   ├── api/search/           # Live search API endpoint
│   ├── cart/                 # Cart & checkout flow
│   ├── compare/              # Product comparison tool
│   ├── login/                # Role-based login page
│   ├── orders/               # Orders tracking & [id]/invoice
│   ├── products/             # Product catalog & [slug] PDP
│   ├── register/             # User registration page
│   ├── seller/               # Seller management dashboard
│   ├── store/[slug]/         # Public seller storefront profile
│   ├── wishlist/             # Watchlist & saved items
│   ├── globals.css           # Global Tailwind & light theme tokens
│   ├── layout.tsx            # Root shell with global providers
│   └── page.tsx              # Homepage with BannerSlider & deals
├── components/               # Modular UI Components
│   ├── cart/                 # Cart drawer
│   ├── home/                 # BannerSlider carousel
│   ├── layout/               # Navbar, Footer, MobileBottomNav
│   ├── order/                # PrintButton for invoices
│   ├── product/              # ProductCard, ProductDetailView, ReviewForm
│   └── seller/               # SellerDashboardView, SellerCharts
├── context/                  # Client Context Providers
│   ├── AuthContext.tsx       # User & role authentication state
│   ├── CartContext.tsx       # Shopping cart state
│   ├── CompareContext.tsx    # Product comparison state
│   ├── ToastContext.tsx      # Floating toast notification system
│   └── WishlistContext.tsx   # Watchlist persistence state
└── lib/                      # Helper libraries & Prisma LibSQL client
```

---

## 📝 Lisensi & Kredit

Dibuat dengan ❤️ oleh **mazkev** — *BayE (a marketplace by mazkev)* © 2026.
