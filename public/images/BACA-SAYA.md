# Folder gambar

Semua menu dan kategori sudah punya gambar ilustrasi (.svg) di folder ini.

## Mengganti dengan foto asli dari Figma

1. Di Figma, pilih fotonya lalu klik **Export → PNG/JPG 2x**.
2. Simpan dengan nama yang sama seperti file .svg yang mau diganti, misalnya `menu/nasi-goreng-telur.jpg`.
3. Di `lib/data.js`, ganti ekstensi `.svg` menjadi `.jpg` atau `.png` untuk item tersebut.

Jika sebuah file tidak ditemukan, aplikasi otomatis menampilkan kotak oranye sebagai pengganti.

## Daftar file

**Menu (`images/menu/`):** nasi-goreng-telur, nasi-goreng-mawut, nasi-goreng-biasa, nasi-goreng-jumbo,
bakmie-goreng, bakmie-goreng-udang, mie-pangsit, mie-ayam, mie-ayam-jamur, paket-hemat-1, es-teh, es-jeruk

**Kategori (`images/kategori/`):** nasi-goreng, bakmie, mie-pangsit, mie-ayam, paket-hemat, minuman

**Logo:** dibuat langsung di `components/ui/Logo.jsx`. Untuk memakai logo asli, export dari Figma ke
`public/images/logo.png`, lalu ganti isi fungsi `Logo` dengan
`<img src="/images/logo.png" alt="Warung Tupaja" className={className} />`.
