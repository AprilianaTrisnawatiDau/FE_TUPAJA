# Warung Tupaja — Front End

Aplikasi pemesanan makanan untuk **Warung Tupaja**. Ada dua bagian:

- **Pelanggan**: scan QR di meja, pilih menu, bayar dengan QRIS, lalu pantau pesanan.
- **Admin**: kelola pesanan, menu, stok, laporan, dan buka/tutup warung.

Dibuat dengan **Next.js (App Router) + JavaScript**, **CSS Modules** untuk halaman pelanggan, dan **Tailwind CSS** untuk halaman admin. Semua tampilan dibuat untuk ukuran HP.

Versi online: **https://fe-tupaja.vercel.app**

## Cara menjalankan

```bash
npm install
npm run dev
```

Cukup jalankan **satu kali**. Pelanggan dan admin ada di server yang sama:

| Bagian | Alamat |
|---|---|
| Pelanggan | http://localhost:3000 (splash, lalu menu) |
| Admin | http://localhost:3000/login |

**Login admin (demo):** username `admin`, password `12345678`.

Di laptop, tekan `F12`, lalu `Ctrl + Shift + M` supaya tampil seperti di HP.

## Halaman

### Pelanggan
| URL | Halaman |
|---|---|
| `/splash` | Logo pembuka. Setelah 2 detik pindah ke menu |
| `/home` | Menu populer, kategori, cari menu, tambah ke keranjang |
| `/cart` | Keranjang dan catatan pesanan |
| `/checkout` | Konfirmasi pesanan |
| `/pembayaran-qris` | Pembayaran QRIS |
| `/tracking` | Status dan nomor antrean pesanan |
| `/cancel-modal`, `/rincian-pembatalan` | Batalkan pesanan dan rinciannya |
| `/warung-tutup` | Tampilan saat warung tutup |

### Admin
| URL | Halaman |
|---|---|
| `/login` | Login admin |
| `/admin` | Dashboard: grafik, menu terlaris, pesanan terbaru, Tutup/Buka Warung |
| `/admin/pesanan` | Kelola pesanan: validasi, status, batal, refund, struk |
| `/admin/menu` | Kelola kategori dan menu (tambah, edit, hapus, nonaktif) |
| `/admin/stok` | Kelola stok |
| `/admin/laporan` | Laporan penjualan dan cetak PDF |
| `/admin/profile` | Ubah password dan logout |

## Fitur Warung Tutup

1. Admin menekan **Tutup Warung** di dashboard.
2. Pelanggan yang membuka aplikasi melihat splash, lalu muncul pop-up **"Warung Tutup"**. Pelanggan yang sedang membuka menu juga langsung melihat pop-up ini.
3. Tombol **Mengerti** membawa pelanggan ke halaman warung tutup.
4. Saat admin menekan **Buka Warung**, pelanggan otomatis kembali ke menu.

Untuk sementara, status ini disimpan di browser (localStorage), jadi hanya terbaca di **browser yang sama**. Contohnya, admin di satu tab dan pelanggan di tab lain. Setelah backend tersambung, status akan dibaca dari API `/status`.

Untuk demo tanpa admin, ubah `STORE_STATUS` di `data/storeConfig.js` menjadi `"tutup"`.

## Struktur folder

```
app/
├── (user)/        → halaman pelanggan (tiap halaman punya file .module.css)
├── admin/         → halaman admin (Tailwind)
├── login/         → login admin
├── splash/, warung-tutup/
├── layout.js      → layout utama (font, Font Awesome, StoreProvider)
└── globals.css    → warna, font, animasi, aturan cetak laporan
components/
├── home/          → komponen menu pelanggan
├── layout/        → bingkai HP, bottom nav admin & pelanggan, notifikasi
├── modals/        → pop-up admin
├── ui/            → tombol, input, gambar, dll.
├── SalesChart.js  → grafik dashboard
└── LaporanPrint.js→ tampilan cetak laporan A4
data/              → data menu pelanggan (dummy) dan status awal warung
lib/               → data & state admin, format rupiah, status warung
services/          → penghubung ke backend Express.js
hooks/             → useIsClient (komponen yang hanya jalan di browser)
public/images/     → logo, foto menu, foto kategori, QRIS dummy
```

## Integrasi backend (Express.js)

Backend dibuat di repo terpisah. Folder `services/` sudah disiapkan:

- `services/api.js` adalah satu pintu untuk semua request ke backend.
- `services/menuService.js` berisi `GET /menus`, `GET /menus/:id`, dan `GET /categories`.
- `services/storeService.js` berisi `POST /sessions` (QR meja) dan `GET /status` (buka/tutup).
- `services/orderStorage.js` masih memakai localStorage dan nanti diganti ke `/orders`.

Langkah menyambungkan:

1. Buat file `.env.local` di folder ini:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```
2. Di Vercel, isi variabel yang sama di **Settings → Environment Variables**.
3. Ganti data dummy di halaman dengan fungsi dari `services/`.

Catatan:
- Data sekarang masih **dummy**. Data admin kembali ke awal saat halaman di-refresh.
- Data menu pelanggan (`data/menuData.js`) dan admin (`lib/data.js`) nanti harus diambil dari satu sumber, yaitu API.
- Harga dan total pesanan wajib dicek ulang oleh backend saat checkout.
- Front end tidak boleh terhubung langsung ke database.

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan mode development |
| `npm run lint` | Mengecek penulisan kode |
| `npm run build` | Mengecek apakah siap di-deploy |
| `npm start` | Menjalankan hasil build |
