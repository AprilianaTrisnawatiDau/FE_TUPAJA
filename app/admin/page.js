"use client";
import { Star, Store, Info, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import { DetailPesananModal, StrukModal } from "@/components/modals/OrderModals";
import SalesChart from "@/components/SalesChart";
import Button from "@/components/ui/Button";
import FilterDropdown from "@/components/ui/FilterDropdown";
import FoodImage from "@/components/ui/FoodImage";
import { Modal } from "@/components/ui/Modal";
import { pad2, rupiah } from "@/lib/format";
import { jumlahItem, totalPesanan, useStore } from "@/lib/store";
const labelStatus = {
  belum_bayar: { teks: "Belum Bayar", cls: "bg-merah-soft text-merah" },
  menunggu: { teks: "Menunggu", cls: "bg-gray-200 text-gray-700" },
  proses: { teks: "Proses", cls: "bg-brand-soft text-brand-dark" },
  selesai: { teks: "Selesai", cls: "bg-hijau-soft text-hijau" },
  dibatalkan: { teks: "Dibatalkan", cls: "bg-merah-soft text-merah" },
};
let notifDemoSudah = false; // supaya notifikasi demo hanya muncul sekali
export default function DashboardPage() {
  const { menu, pesanan, warungBuka, waktuTutup, tutupWarung, bukaWarung, kirimNotifikasi } = useStore();
  const [periode, setPeriode] = useState("Bulan");
  const [modalTutup, setModalTutup] = useState(null);
  const [detail, setDetail] = useState(null);
  const [struk, setStruk] = useState(null);
  // Simulasi notifikasi masuk (nanti diganti realtime dari backend)
  useEffect(() => {
    if (notifDemoSudah) return;
    notifDemoSudah = true;
    const t1 = setTimeout(
      () => kirimNotifikasi({ jenis: "pesanan", judul: "Pesanan Baru", pesan: "Ada pesanan baru. Segera proses!" }),
      1500,
    );
    const t2 = setTimeout(
      () => kirimNotifikasi({ jenis: "bayar", judul: "Pembayaran Masuk", pesan: "Rp 30.000 dari Pelanggan" }),
      3500,
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [kirimNotifikasi]);
  const bestSeller = useMemo(
    () =>
      [...menu]
        .filter((m) => m.kategoriId !== "minuman")
        .sort((a, b) => b.terjual - a.terjual)
        .slice(0, 3),
    [menu],
  );
  const terbaru = pesanan.filter((p) => p.status !== "dibatalkan").slice(0, 4);
  return (
    <main className="min-h-dvh">
      <header className="bg-brand px-5 pt-6 pb-12 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="anim-head text-[22px] font-bold">Dashboard</h1>
            <p className="anim-head-2 max-w-[230px] text-[11px] leading-snug text-white/90">
              Pantau penjualan dan pesanan warung secara berkala.
            </p>
          </div>
          <div className="stagger flex gap-1.5 pt-1">
            <button
              onClick={() => setModalTutup(warungBuka ? "konfirmasi" : "ditutup")}
              className="press flex h-6 w-6 items-center justify-center rounded-md bg-white text-teks hover:scale-110"
              aria-label="Tutup warung"
            >
              <Store className="h-4 w-4" strokeWidth={2.4} />
            </button>
            <Link
              href="/admin/profile"
              className="press flex h-6 w-6 items-center justify-center rounded-md bg-white text-teks hover:scale-110"
              aria-label="Profile"
            >
              <UserRound className="h-4 w-4" strokeWidth={2.6} />
            </Link>
          </div>
        </div>
      </header>

      <div className="anim-sheet relative -mt-7 rounded-t-[26px] bg-white px-4 pt-4">
        {!warungBuka && (
          <button
            onClick={() => setModalTutup("ditutup")}
            className="animate-pop press mb-3 flex w-full items-center justify-between rounded-lg bg-merah-soft px-3 py-2 text-[10.5px] font-semibold text-merah"
          >
            <span>Warung sedang ditutup</span>
            <span className="underline">Buka kembali</span>
          </button>
        )}

        {/* Grafik */}
        <section className="anim-fade-up rounded-xl border-2 border-garis p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[12px] font-bold">Grafik Penjualan</h2>
            <FilterDropdown value={periode} onChange={setPeriode} />
          </div>
          <div className="rounded-lg border border-garis p-2">
            <p className="text-[7px] font-semibold">Grafik Penjualan</p>
            <SalesChart periode={periode} />
          </div>
        </section>

        <hr className="my-4 border-t-2 border-brand/60" />

        {/* Best seller */}
        <section>
          <h2 className="mb-2 flex items-center gap-1 text-[12px] font-bold">
            <Star className="h-4 w-4 fill-brand text-brand" /> Menu Best Seller
          </h2>
          <div className="stagger grid grid-cols-3 gap-2.5">
            {bestSeller.map((m) => (
              <div key={m.id} className="press group overflow-hidden rounded-lg border-2 border-brand p-1.5">
                <div className="overflow-hidden rounded-md">
                  <FoodImage
                    src={m.gambar}
                    alt={m.nama}
                    className="aspect-square w-full rounded-md transition duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="mt-1 text-[8.5px] leading-tight font-bold">{m.nama}</p>
                <p className="text-right text-[7px] text-teks-muda">Terjual {m.terjual}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-4 border-t-2 border-brand/60" />

        {/* Pesanan terbaru */}
        <section>
          <h2 className="mb-2 text-[12px] font-bold">Pesanan Terbaru</h2>
          <div className="stagger space-y-3">
            {terbaru.map((p) => {
              const st = labelStatus[p.status];
              return (
                <div key={p.id} className="press rounded-lg border-2 border-brand p-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-merah text-[9px] font-bold text-white">
                        {pad2(p.nomor)}
                      </span>
                      <span className="text-[11px] font-bold">No Meja {pad2(p.meja)}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold">{rupiah(totalPesanan(p))}</p>
                      <p className="text-[7.5px] text-teks-muda">{p.jam}</p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <p className="text-[9.5px]">
                      {jumlahItem(p)} item - {p.items.length} Jenis Menu
                    </p>
                    <span className={`rounded px-3 py-0.5 text-[8.5px] font-semibold ${st.cls}`}>{st.teks}</span>
                  </div>
                  <button
                    onClick={() => setDetail(p)}
                    className="mt-2 w-full rounded-md border border-garis py-1 text-[9px] text-gray-600 transition hover:border-brand hover:bg-brand-soft hover:text-brand-dark active:scale-[0.98]"
                  >
                    Lihat Detail Pesanan
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <BottomNav />

      {/* Modal konfirmasi tutup warung */}
      <Modal
        open={modalTutup === "konfirmasi"}
        onClose={() => setModalTutup(null)}
        className="relative max-w-[280px] text-center"
      >
        <button onClick={() => setModalTutup(null)} className="absolute top-3 right-3" aria-label="Tutup">
          <X className="h-4 w-4" strokeWidth={3} />
        </button>
        <Store className="anim-wiggle mx-auto h-12 w-12 fill-brand text-brand" strokeWidth={1.6} />
        <h3 className="mt-1 text-[15px] font-bold">Tutup Warung</h3>
        <p className="text-[10.5px] text-gray-600">Apakah anda yakin ingin menutup warung?</p>
        <div className="mt-3 flex gap-1.5 rounded-md bg-brand-soft p-2 text-left text-[9px] leading-snug text-gray-700">
          <Info className="mt-px h-3.5 w-3.5 shrink-0 text-brand-dark" />
          Pastikan semua pesanan selesai dan tidak ada transaksi yang sedang berlangsung.
        </div>
        <div className="mt-3 flex justify-center gap-3">
          <Button variant="abu" className="min-w-[80px] py-1.5 text-[10.5px]" onClick={() => setModalTutup(null)}>
            Batal
          </Button>
          <Button
            variant="merah"
            className="min-w-[80px] py-1.5 text-[10.5px]"
            onClick={() => {
              tutupWarung();
              setModalTutup("ditutup");
            }}
          >
            Tutup Warung
          </Button>
        </div>
      </Modal>

      {/* Modal warung ditutup */}
      <Modal
        open={modalTutup === "ditutup"}
        onClose={() => setModalTutup(null)}
        className="relative max-w-[280px] text-center"
      >
        <button onClick={() => setModalTutup(null)} className="absolute top-3 right-3" aria-label="Tutup">
          <X className="h-4 w-4" strokeWidth={3} />
        </button>
        <div className="anim-wiggle relative mx-auto h-12 w-12">
          <Store className="h-12 w-12 fill-brand text-brand" strokeWidth={1.6} />
          <span className="absolute top-1/2 left-1/2 h-[3px] w-14 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded bg-brand-dark ring-2 ring-white" />
        </div>
        <h3 className="mt-1 text-[15px] font-bold">Warung Ditutup</h3>
        <p className="text-[10px] leading-snug text-gray-600">
          Warung saat ini tidak menerima pesanan. Silakan buka kembali warung saat sudah siap menerima pesanan lagi.
        </p>
        <Button
          className="mt-3 px-4 py-1.5 text-[10.5px]"
          onClick={() => {
            bukaWarung();
            setModalTutup(null);
          }}
        >
          Buka Kembali Warung
        </Button>
        {waktuTutup && (
          <div className="mx-auto mt-2 w-fit rounded-md bg-brand-soft px-4 py-1 text-[9px]">
            <p className="font-semibold">Ditutup pada</p>
            <p>{waktuTutup}</p>
          </div>
        )}
      </Modal>

      <DetailPesananModal
        pesanan={detail}
        onClose={() => setDetail(null)}
        onCetak={() => {
          setStruk(detail);
          setDetail(null);
        }}
      />
      <StrukModal pesanan={struk} onClose={() => setStruk(null)} />
    </main>
  );
}
