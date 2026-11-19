"use client";
import { Wallet, UtensilsCrossed } from "lucide-react";
import { useStore } from "@/lib/store";
/* Notifikasi hitam di atas layar (Pembayaran Masuk / Pesanan Baru) */
export default function NotificationToasts() {
  const { notifikasi, tutupNotifikasi } = useStore();
  if (!notifikasi.length) return null;
  return (
    <div className="pointer-events-none fixed top-3 left-1/2 z-[60] flex w-[calc(min(100vw,430px)-24px)] -translate-x-1/2 flex-col gap-2">
      {notifikasi.map((n) => (
        <button
          key={n.id}
          onClick={() => tutupNotifikasi(n.id)}
          className="animate-slide-down pointer-events-auto flex items-start gap-2.5 rounded-lg bg-black px-3 py-2.5 text-left text-white shadow-xl"
        >
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${n.jenis === "bayar" ? "bg-hijau" : "bg-brand"}`}
          >
            {n.jenis === "bayar" ? <Wallet className="h-3 w-3" /> : <UtensilsCrossed className="h-3 w-3" />}
          </span>
          <span>
            <span className="block text-[9px] text-gray-400">Warung Tupaja</span>
            <span className="block text-[12px] font-semibold">{n.judul}</span>
            <span className="block text-[10px] text-gray-200">{n.pesan}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
