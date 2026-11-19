"use client";
import { useSyncExternalStore } from "react";
import { STORE_STATUS } from "../data/storeConfig";

// Status buka/tutup warung, dipakai admin dan pelanggan.
// Sementara di localStorage, nanti diganti API /status.
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
  window.addEventListener("storage", callback); // perubahan dari tab lain
  window.addEventListener(EVENT, callback); // perubahan di tab yang sama
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function useStatusWarung() {
  return useSyncExternalStore(subscribe, getStatusWarung, () => STATUS_AWAL);
}