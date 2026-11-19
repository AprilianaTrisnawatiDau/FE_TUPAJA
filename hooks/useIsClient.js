"use client";
/* =========================================================
   Penanda "sudah di browser".
   Halaman user membaca keranjang/pesanan dari localStorage,
   yang hanya ada di browser. Komponen <ClientOnly> menunda
   tampilan sampai berjalan di browser, sehingga data bisa
   dibaca langsung saat state dibuat (tanpa setState di useEffect).
   ========================================================= */
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true, // di browser
    () => false // di server
  );
}

export function ClientOnly({ children, fallback = null }) {
  return useIsClient() ? children : fallback;
}

/* Baca JSON dari localStorage dengan aman */
export function bacaStorage(key, cadangan) {
  try {
    const isi = localStorage.getItem(key);
    return isi ? JSON.parse(isi) : cadangan;
  } catch (error) {
    console.error(`Gagal membaca ${key}:`, error);
    return cadangan;
  }
}
