"use client";
import { useSyncExternalStore } from "react";
import { ORDERS_EVENT, ORDERS_KEY, updateOrder } from "../services/orderStorage";

// Pesanan dari halaman pelanggan, diubah ke format yang dipakai halaman admin.
// Sementara lewat localStorage, nanti diganti API /orders.
const STATUS_KE_ADMIN = { Menunggu: "menunggu", Proses: "proses", Selesai: "selesai", Dibatalkan: "dibatalkan" };
const STATUS_KE_PELANGGAN = { menunggu: "Menunggu", proses: "Proses", selesai: "Selesai", dibatalkan: "Dibatalkan" };
const KOSONG = [];

let cacheTeks = null;
let cacheData = KOSONG;

function bacaMentah() {
  try {
    const teks = localStorage.getItem(ORDERS_KEY);
    if (teks !== cacheTeks) {
      cacheTeks = teks;
      const data = teks ? JSON.parse(teks) : [];
      cacheData = Array.isArray(data) ? data : KOSONG;
    }
    return cacheData;
  } catch {
    return KOSONG;
  }
}

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(ORDERS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ORDERS_EVENT, callback);
  };
}

export function usePesananPelangganMentah() {
  return useSyncExternalStore(subscribe, bacaMentah, () => KOSONG);
}

export function keFormatAdmin(order, nomorAwal) {
  const waktu = new Date(Number(order.waktuPesan) || Date.now());
  const sudahBayar = order.pembayaran === "Lunas";
  const nomor = nomorAwal + Number(order.nomorPesanan || 0);
  let status = STATUS_KE_ADMIN[order.status] || "menunggu";
  if (!sudahBayar && status === "menunggu") status = "belum_bayar";

  return {
    id: String(nomor).padStart(3, "0"),
    idPelanggan: order.id,
    nomor,
    meja: 1,
    user: order.nama || "Pelanggan",
    namaPembeli: order.nama || "Pelanggan",
    nomorUrut: String(order.nomorAntrian || 0).padStart(3, "0"),
    tanggal: waktu.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    jam: waktu.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    items: (order.items || []).map((it) => ({
      menuId: it.id || it.name,
      nama: it.name,
      kategori: it.category || "-",
      jumlah: Number(it.quantity || 0),
      harga: Number(it.price || 0) * Number(it.quantity || 0),
      catatan: order.catatan || undefined,
    })),
    metodeBayar: order.metodePembayaran || "Tunai",
    tipe: order.tipePemesanan || "Makan ditempat",
    status,
    sudahBayar,
    refund: order.refund,
    alasanBatal: order.alasanPembatalan,
  };
}

// Simpan perubahan dari admin ke pesanan pelanggan
export function simpanPerubahanAdmin(idPelanggan, sebelum, sesudah) {
  const ubah = {};
  if (sesudah.status !== sebelum.status && STATUS_KE_PELANGGAN[sesudah.status]) {
  ubah.status = STATUS_KE_PELANGGAN[sesudah.status];
  if (sesudah.status === "selesai") ubah.waktuSelesai = Date.now();
}
  if (sesudah.status === "menunggu" && sebelum.status === "belum_bayar") ubah.status = "Menunggu";
  if (sesudah.sudahBayar && !sebelum.sudahBayar) ubah.pembayaran = "Lunas";
  if (sesudah.refund !== sebelum.refund) ubah.refund = sesudah.refund;
  if (sesudah.alasanBatal && sesudah.alasanBatal !== sebelum.alasanBatal) ubah.alasanPembatalan = sesudah.alasanBatal;
  if (Object.keys(ubah).length) updateOrder(idPelanggan, ubah);
}
