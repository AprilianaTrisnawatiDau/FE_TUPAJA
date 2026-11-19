# Warung Tupaja — Fondasi Frontend Next.js

Frontend menggunakan JavaScript, Next.js App Router, CSS Modules, dan API service layer untuk integrasi ke Express.js.

## Struktur tahap awal

```text
warung-tupaja/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── globals.css
│   └── home.module.css
├── components/
│   ├── home/
│   └── layout/
├── data/
├── hooks/
├── services/
│   ├── api.js
│   └── menuService.js
├── public/
│   └── images/
├── .env.local
└── package.json
```

Folder `components`, `data`, dan `hooks` disiapkan untuk ekstraksi komponen dan state bersama pada tahap berikutnya. Route halaman lain dibuat ketika masing-masing halaman lama dimigrasikan agar tidak ada halaman placeholder yang menyesatkan.

## Pemasangan

1. Salin isi folder `app` ke folder `app` proyek Next.js. Timpa `page.js`, `layout.js`, dan `globals.css` bila diminta.
2. Salin folder `services` ke root proyek.
3. Buat folder `public/images` dan masukkan semua gambar produk dengan nama file yang sama seperti di HTML lama.
4. Salin `.env.local.example` menjadi `.env.local` jika Express berjalan di `http://localhost:5000`.
5. Jalankan `npm run dev`.

## CSS

- `globals.css` hanya untuk reset, font inheritance, dan token warna global.
- `home.module.css` hanya untuk halaman Home. Class CSS diimpor sebagai `styles.namaClass`, jadi tidak bocor ke halaman lain.

## Integrasi Express

`services/api.js` adalah satu pintu request HTTP. `services/menuService.js` sudah menyediakan fungsi `getMenus`, `getMenuById`, dan `getCategories` dengan asumsi kontrak endpoint Express:

- `GET /api/menus`
- `GET /api/menus/:id`
- `GET /api/categories`

Endpoint tersebut adalah rancangan kontrak, belum berarti backend sudah tersedia. Saat Express siap, sesuaikan URL dan bentuk response di service ini. Jangan menghubungkan frontend langsung ke database.

## Catatan

Halaman Home masih memakai katalog lokal hasil migrasi HTML agar UI tetap berjalan sebelum API Express tersedia. Integrasi fetch menu dilakukan setelah struktur response backend disepakati. Keranjang masih memakai localStorage seperti perilaku awal; pesanan final dan harga wajib divalidasi backend saat checkout.
