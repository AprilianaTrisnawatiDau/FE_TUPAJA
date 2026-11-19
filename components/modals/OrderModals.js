"use client";
import { Printer, X } from "lucide-react";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import FoodImage from "@/components/ui/FoodImage";
import Logo from "@/components/ui/Logo";
import { Modal } from "@/components/ui/Modal";
import { INFO_WARUNG } from "@/lib/data";
import { rupiah } from "@/lib/format";
import { totalPesanan, useStore } from "@/lib/store";
function Baris({ kiri, kanan, bold }) {
  return (
    <div className={`flex justify-between text-[10.5px] ${bold ? "font-bold" : ""}`}>
      <span>{kiri}</span>
      <span className="font-semibold">{kanan}</span>
    </div>
  );
}
function KepalaPesanan({ p }) {
  return (
    <div className="flex justify-between">
      <div>
        <p className="text-[11px] font-bold">No Meja {p.meja.toString().padStart(2, "0")}</p>
        <p className="text-[8.5px] text-teks-muda">{p.tanggal}</p>
      </div>
      <div className="text-right">
        <p className="text-[10.5px] font-semibold">{p.user}</p>
        <p className="text-[8.5px] text-teks-muda">{p.jam}</p>
      </div>
    </div>
  );
}
/* ===== Modal Detail Pesanan ===== */
export function DetailPesananModal({ pesanan, onClose, onCetak }) {
  const { menu } = useStore();
  if (!pesanan) return null;
  const p = pesanan;
  return (
    <Modal open onClose={onClose} className="p-0">
      <div className="flex items-center justify-between border-b border-garis px-3.5 py-2.5">
        <h3 className="text-[12px] font-bold">Detail Pesanan</h3>
        <button onClick={onClose} aria-label="Tutup">
          <X className="h-5 w-5" strokeWidth={2.8} />
        </button>
      </div>
      <div className="border-b border-garis px-3.5 py-2.5">
        <KepalaPesanan p={p} />
      </div>
      <div className="space-y-1 border-b border-garis px-3.5 py-2.5">
        <Baris kiri="Nama Pembeli" kanan={p.namaPembeli} />
        <Baris kiri="Nomor Urut Pesanan" kanan={p.nomorUrut} />
      </div>
      <div className="max-h-[38vh] space-y-2 overflow-y-auto px-2.5 py-2">
        {p.items.map((it) => {
          const mn = menu.find((x) => x.id === it.menuId);
          return (
            <div key={it.menuId} className="flex gap-2.5 rounded-lg border-2 border-garis p-1.5">
              <FoodImage src={mn?.gambar} alt={it.nama} className="h-[46px] w-[46px] shrink-0 rounded" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between">
                  <p className="text-[10px] font-bold">{it.nama}</p>
                  <span className="text-[10px]">x {it.jumlah}</span>
                </div>
                <p className="text-[8px] text-teks-muda">Kategori : {it.kategori}</p>
                <p className="text-[8.5px]">Catatan : {it.catatan || "-"}</p>
                <p className="text-right text-[10px] font-bold">{rupiah(it.harga, false)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="space-y-1 border-b border-garis px-3.5 pb-2.5">
        <Baris kiri="Metode Pembayaran" kanan={p.metodeBayar} />
        <Baris kiri="Tipe Pemesanan" kanan={p.tipe} />
      </div>
      <div className="px-3.5 pt-2 pb-3">
        <Baris kiri="Total" kanan={rupiah(totalPesanan(p), false)} bold />
        <Button className="mt-2.5 w-full py-1.5 text-[11px]" onClick={onCetak}>
          <Printer className="h-4 w-4" /> Cetak Struk
        </Button>
      </div>
    </Modal>
  );
}
/* ===== Modal Struk Pesanan (otomatis membuka dialog print) ===== */
export function StrukModal({ pesanan, onClose }) {
  useEffect(() => {
    if (!pesanan) return;
    const t = setTimeout(() => window.print(), 500);
    return () => clearTimeout(t);
  }, [pesanan]);
  if (!pesanan) return null;
  const p = pesanan;
  return (
    <Modal open onClose={onClose} className="print-area p-0">
      <div className="flex items-center justify-between border-b border-garis px-3.5 py-2.5">
        <h3 className="text-[12px] font-bold">Struk Pesanan</h3>
        <button onClick={onClose} aria-label="Tutup" className="no-print">
          <X className="h-5 w-5" strokeWidth={2.8} />
        </button>
      </div>
      <div className="flex flex-col items-center border-b border-garis px-3.5 py-3 text-center">
        <Logo className="scale-75" />
        <p className="text-[8.5px]">{INFO_WARUNG.alamat}</p>
        <p className="text-[8.5px]">{INFO_WARUNG.telp}</p>
      </div>
      <div className="border-b border-garis px-3.5 py-2.5">
        <KepalaPesanan p={p} />
        <div className="mt-1">
          <Baris kiri="Nomor Urut Pesanan" kanan={p.nomorUrut} />
        </div>
      </div>
      <div className="space-y-3 border-b border-garis px-3.5 py-2.5">
        {p.items.map((it) => (
          <div key={it.menuId}>
            <div className="flex justify-between text-[10px]">
              <span className="font-bold">{it.nama}</span>
              <span>x {it.jumlah}</span>
            </div>
            <p className="text-[8px] text-teks-muda">Kategori : {it.kategori}</p>
            <p className="text-[8.5px]">Catatan : {it.catatan || "-"}</p>
            <p className="text-right text-[10px] font-bold">{rupiah(it.harga, false)}</p>
          </div>
        ))}
      </div>
      <div className="space-y-1 border-b border-garis px-3.5 py-2.5">
        <Baris kiri="Metode Pembayaran" kanan={p.metodeBayar} />
        <Baris kiri="Tipe Pemesanan" kanan={p.tipe} />
      </div>
      <div className="border-b border-garis px-3.5 py-2.5">
        <Baris kiri="Total" kanan={rupiah(totalPesanan(p), false)} bold />
      </div>
      <p className="px-6 py-3 text-center text-[8.5px] leading-snug">
        Terima kasih telah berbelanja, kami menerima setiap kritik dan saran bisa langsung disampaikan ke penjual
      </p>
    </Modal>
  );
}
