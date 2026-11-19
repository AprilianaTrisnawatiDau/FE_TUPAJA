"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ADMIN_DEFAULT, kategoriAwal, menuAwal, pesananAwal } from "./data";
import { setStatusWarung, useStatusWarung } from "./statusWarung";
import { keFormatAdmin, simpanPerubahanAdmin, usePesananPelangganMentah } from "./pesananPelanggan";

const NOMOR_TERAKHIR_DUMMY = Math.max(...pesananAwal.map((p) => p.nomor));
const StoreContext = createContext(null);
const slug = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") +
  "-" +
  Math.random().toString(36).slice(2, 6);
export function StoreProvider({ children }) {
  const [admin, setAdmin] = useState(ADMIN_DEFAULT);
  // Status buka/tutup disimpan bersama supaya halaman pelanggan ikut tahu
  const { buka: warungBuka, waktuTutup } = useStatusWarung();
  const [kategori, setKategori] = useState(kategoriAwal);
  const [menu, setMenu] = useState(menuAwal);
  const [pesananDummy, setPesananDummy] = useState(pesananAwal);
  // Pesanan dari pelanggan digabung dengan data dummy, pesanan pelanggan paling atas
  const mentahPelanggan = usePesananPelangganMentah();
  const pesanan = useMemo(
    () => [...mentahPelanggan.map((o) => keFormatAdmin(o, NOMOR_TERAKHIR_DUMMY)).reverse(), ...pesananDummy],
    [mentahPelanggan, pesananDummy],
  );
  const [notifikasi, setNotifikasi] = useState([]);
  const tutupNotifikasi = useCallback((id) => setNotifikasi((n) => n.filter((x) => x.id !== id)), []);
  const kirimNotifikasi = useCallback(
    (n) => {
      const id = Date.now() + Math.random();
      setNotifikasi((list) => [...list, { ...n, id }]);
      setTimeout(() => tutupNotifikasi(id), 4500);
    },
    [tutupNotifikasi],
  );
  const value = useMemo(() => {
    const updPesanan = (id, fn) => {
      const dariPelanggan = pesanan.find((p) => p.id === id && p.idPelanggan);
      if (dariPelanggan) return simpanPerubahanAdmin(dariPelanggan.idPelanggan, dariPelanggan, fn(dariPelanggan));
      setPesananDummy((list) => list.map((p) => (p.id === id ? fn(p) : p)));
    };
    return {
      admin,
      ubahPassword: (baru) => setAdmin((a) => ({ ...a, password: baru })),
      warungBuka,
      waktuTutup,
      tutupWarung: () => {
        const d = new Date();
        const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sept", "Okt", "Nov", "Des"][
          d.getMonth()
        ];
        const jam = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
        setStatusWarung({ buka: false, waktuTutup: `${d.getDate()} ${bulan} ${d.getFullYear()}, ${jam}` });
      },
      bukaWarung: () => setStatusWarung({ buka: true, waktuTutup: null }),
      kategori,
      menu,
      tambahKategori: (k) => setKategori((l) => [...l, { ...k, id: slug(k.nama) }]),
      ubahKategori: (id, data) => setKategori((l) => l.map((k) => (k.id === id ? { ...k, ...data } : k))),
      hapusKategori: (id) => {
        setKategori((l) => l.filter((k) => k.id !== id));
        setMenu((l) => l.filter((x) => x.kategoriId !== id));
      },
      tambahMenu: (x) => setMenu((l) => [...l, { ...x, id: slug(x.nama), stok: 0, aktif: true, terjual: 0 }]),
      ubahMenu: (id, data) => setMenu((l) => l.map((x) => (x.id === id ? { ...x, ...data } : x))),
      hapusMenu: (id) => setMenu((l) => l.filter((x) => x.id !== id)),
      pesanan,
      validasiPembayaran: (id) => updPesanan(id, (p) => ({ ...p, sudahBayar: true, status: "menunggu" })),
      ubahStatus: (id, status) => updPesanan(id, (p) => ({ ...p, status })),
      batalkanPesanan: (id) =>
        updPesanan(id, (p) => ({
          ...p,
          status: "dibatalkan",
          refund: p.sudahBayar ? "proses" : undefined,
          alasanBatal: "Pesanan Berubah",
        })),
      konfirmasiRefund: (id) => updPesanan(id, (p) => ({ ...p, refund: "selesai" })),
      notifikasi,
      kirimNotifikasi,
      tutupNotifikasi,
    };
  }, [admin, warungBuka, waktuTutup, kategori, menu, pesanan, notifikasi, kirimNotifikasi, tutupNotifikasi]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore harus dipakai di dalam <StoreProvider>");
  return ctx;
}
export const totalPesanan = (p) => p.items.reduce((s, i) => s + i.harga, 0);
export const jumlahItem = (p) => p.items.reduce((s, i) => s + i.jumlah, 0);
export function statusStok(stok) {
  if (stok <= 0) return { label: "Habis", cls: "bg-merah-soft text-merah" };
  if (stok <= 5) return { label: "Menipis", cls: "bg-brand-soft text-brand-dark" };
  return { label: "Tersedia", cls: "bg-hijau-soft text-hijau" };
}
