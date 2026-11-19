# FE TUMAPA — Admin Warung Tupaja

Front end admin Warung Tupaja dengan **Next.js + JavaScript (JSX) + CSS (Tailwind)**, tampilan mobile.

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Di laptop, tekan `F12` lalu `Ctrl + Shift + M` supaya tampil seperti di HP.

**Login demo:** username `admin`, password `12345678`.

## Halaman

| URL | Halaman |
|---|---|
| `/login` | Login (+ pop-up Login Gagal) |
| `/admin` | Dashboard: grafik, best seller, pesanan terbaru, Tutup Warung, notifikasi |
| `/admin/profile` | Profile: ubah password, logout |
| `/admin/pesanan` | Kelola Pesanan: validasi, status, batalkan, refund, detail, struk |
| `/admin/menu` | Kelola Menu: kategori & menu (tambah/edit/hapus/nonaktif) |
| `/admin/stok` | Kelola Stok |
| `/admin/laporan` | Kelola Laporan |

## Struktur

```
app/            → halaman (.js)
components/     → layout, modals, ui
lib/            → data dummy (data.js), state (store.js), format
public/images/  → gambar menu & kategori (lihat BACA-SAYA.md)
app/globals.css → warna, font Poppins, animasi, aturan cetak
```

Data masih dummy dan kembali ke awal saat halaman di-refresh. `lib/store.js` adalah tempat
menyambungkan ke backend/API nanti.
