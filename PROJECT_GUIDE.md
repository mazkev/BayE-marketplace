# BayE - a marketplace by mazkev

Fullstack E-Commerce Marketplace berarsitektur modern dengan **Next.js (App Router)**, **SQLite (Prisma 7)**, dan estetika **eBay Light Theme**.

---

## 🌟 Identitas Brand
- **Nama Aplikasi:** `BayE`
- **Tagline / Subtitle:** `a marketplace by mazkev`
- **Logo Palet Warna Khas eBay:**
  - **B** (Merah `#e53238`)
  - **a** (Biru `#0064d2`)
  - **y** (Kuning `#f5af02`)
  - **E** (Hijau `#86b817`)

---

## 🚀 Fitur Unggulan Lengkap

1. **Header & Auto-Suggest Search Bar:**
   - 3-Tier Navigation (Top utility, Main Search, Category sub-bar).
   - Live debounced search auto-suggest dropdown.
2. **Carousel Banner Dinamis:**
   - Auto-rotating slider promo setiap 4.5 detik dengan kontrol panah dan dots.
   - Kode voucher promo: `BAYE10` (Diskon 10%).
3. **Autentikasi & Pemisahan Akun (Buyer vs Seller):**
   - Login & registrasi terpisah dengan tombol 1-klik demo akun.
   - Dropdown profile dengan tombol switch role instan.
4. **Sistem Watchlist / Wishlist:**
   - Tersinkronisasi dengan localStorage & halaman khusus `/wishlist`.
5. **Fitur Komparasi Produk:**
   - Bandingkan spesifikasi dan harga hingga 4 produk di `/compare`.
6. **Form Ulasan & Rating Realtime:**
   - Kirim ulasan dan rating bintang 1-5 langsung di halaman produk.
7. **Cetak Invoice Faktur Pajak Resmi:**
   - Cetak langsung kwitansi / invoice resmi dengan QR verification di `/orders/[id]/invoice`.
8. **Seller Portal & Analitik Visual:**
   - Grafik bar omset bulanan & tombol ekspor rekap pesanan ke file `.csv`.
9. **Halaman Toko Publik:**
   - Profil storefront penjual di `/store/apex-gear`.
10. **Mobile-Friendly 100%:**
    - Mobile Bottom Navigation Bar & Sticky action bar pada produk.

---

## 🛠️ Stack Teknologi
- **Framework:** Next.js 16 (App Router, Server Actions)
- **Database:** SQLite (Local) via Prisma 7 & `@prisma/adapter-libsql`
- **Styling:** Tailwind CSS (Clean Light Mode)
- **Icons:** `lucide-react`
- **Efek:** `canvas-confetti`

---

## 💻 Menjalankan Proyek
```bash
# Install dependensi
npm install

# Setup database & seed
npx prisma db push
npx tsx prisma/seed.ts

# Jalankan server
npm run dev
```
Buka browser di **http://localhost:3000**.
