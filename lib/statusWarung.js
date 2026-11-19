"use client";
/* =========================================================
   STATUS WARUNG (buka / tutup)
   Dipakai bersama oleh admin dan pelanggan.
   - Admin menekan "Tutup Warung" / "Buka Warung" di dashboard.
   - Pelanggan membaca status ini di splash, home, dan halaman warung tutup.
   Sementara disimpan di localStorage (hanya berlaku di browser yang sama).
   Nanti diganti dengan GET/PATCH /status ke backend Express.
   ========================================================= */
import { useSyncExternalStore } from "react";
import { STORE_STATUS } from "../data/storeConfig";

const KEY = "warungTupaja_status";
const EVENT = "warungTupaja_status_berubah";
const STATUS_AWAL = { buka: STORE_STATUS !== "tutup", waktuTutup: null };

let cacheTeks = null;
let cacheStatus = STATUS_AWAL;

export function getStatusWarung() {
  if (typeof window === "undefined") return STATUS_AWAL;
  try {
    const teks = localStorage.getItem(KEY);
    if (teks !== cacheTeks) {
      cacheTeks = teks;
      cacheStatus = teks ? { ...STATUS_AWAL, ...JSON.parse(teks) } : STATUS_AWAL;
    }
    return cacheStatus;
  } catch {
    return STATUS_AWAL;
  }
}

export function setStatusWarung(status) {
  localStorage.setItem(KEY, JSON.stringify(status));
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback) {
  // "storage" = perubahan dari tab lain, EVENT = perubahan di tab yang sama
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function useStatusWarung() {
  return useSyncExternalStore(subscribe, getStatusWarung, () => STATUS_AWAL);
}
