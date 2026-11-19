"use client";
import { BadgeDollarSign, ClipboardList, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import LaporanPrint from "@/components/LaporanPrint";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/layout/PageHeader";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { laporanPenjualan, totalPesananPeriode } from "@/lib/data";
import { rupiah } from "@/lib/format";
const teksPeriode = {
  Hari: { periode: "Hari ini", pemasukan: "Pemasukan hari ini", pesanan: "Total Pesanan (hari)" },
  Minggu: { periode: "Minggu ini", pemasukan: "Pemasukan minggu ini", pesanan: "Total Pesanan (minggu)" },
  Bulan: { periode: "Bulan ini", pemasukan: "Pemasukan bulan ini", pesanan: "Total Pesanan (bulan)" },
};
export default function LaporanPage() {
  const [periode, setPeriode] = useState("Bulan");
  const [cari, setCari] = useState("");
  const semua = laporanPenjualan[periode];
  const rows = semua.filter((r) => r.nama.toLowerCase().includes(cari.toLowerCase()));
  const total = semua.reduce((s, r) => s + r.pendapatan, 0);
  const t = teksPeriode[periode];
  const [cetak, setCetak] = useState(null);

  // Siapkan data cetak (tanggal dihitung saat tombol ditekan)
  function cetakLaporan() {
    const now = new Date();
    const tgl = (d, opt) => d.toLocaleDateString("id-ID", opt);
    const lengkap = { day: "numeric", month: "long", year: "numeric" };
    let rentang;
    if (periode === "Hari") {
      rentang = tgl(now, { weekday: "long", ...lengkap });
    } else if (periode === "Minggu") {
      const senin = new Date(now);
      senin.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      const minggu = new Date(senin);
      minggu.setDate(senin.getDate() + 6);
      rentang = `${tgl(senin, lengkap)} – ${tgl(minggu, lengkap)}`;
    } else {
      const awal = new Date(now.getFullYear(), now.getMonth(), 1);
      const akhir = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      rentang = `${tgl(awal, lengkap)} – ${tgl(akhir, lengkap)}`;
    }
    const namaBulan = tgl(now, { month: "long", year: "numeric" });
    setCetak({
      judulPeriode: { Hari: "Laporan Harian", Minggu: "Laporan Mingguan", Bulan: `Laporan Bulanan · ${namaBulan}` }[periode],
      rentang: `Periode: ${rentang}`,
      dicetak: {
        tanggal: tgl(now, lengkap),
        jam: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      },
      rows: semua,
      totalPesanan: totalPesananPeriode[periode],
      namaFile: `Laporan-Penjualan-${periode}-${tgl(now, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-")}`,
    });
  }

  // Setelah dokumen cetak tampil -> buka dialog print / simpan PDF
  useEffect(() => {
    if (!cetak) return;
    const judulLama = document.title;
    document.title = cetak.namaFile; // jadi nama file PDF
    document.body.classList.add("mencetak-laporan");
    const selesai = () => {
      document.body.classList.remove("mencetak-laporan");
      document.title = judulLama;
      setCetak(null);
    };
    window.addEventListener("afterprint", selesai, { once: true });
    const timer = setTimeout(() => window.print(), 300);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", selesai);
    };
  }, [cetak]);
  return (
    <main className="min-h-dvh">
      <PageHeader
        title="Kelola Laporan"
        subtitle="Pantau dan evaluasi penjualan warung."
        search={cari}
        onSearch={setCari}
      >
        <div className="px-5">

          {/* Kartu ringkasan */}
          <div className="-mt-1 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg border-2 border-garis px-2 py-1.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-merah text-white">
                <BadgeDollarSign className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[12px] leading-tight font-bold">{rupiah(total)}</p>
                <p className="text-[7.5px]">{t.pemasukan}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border-2 border-garis px-2 py-1.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-merah text-white">
                <ClipboardList className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[12px] leading-tight font-bold">{totalPesananPeriode[periode]}</p>
                <p className="text-[7.5px]">{t.pesanan}</p>
              </div>
            </div>
          </div>

          <hr className="-mx-5 my-3 border-garis" />

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[13px] font-bold">Laporan Penjualan</h2>
              <p className="text-[10px] text-teks-muda">Periode : {t.periode}</p>
            </div>
            <div className="no-print">
              <FilterDropdown value={periode} onChange={setPeriode} />
            </div>
          </div>

          {/* Tabel */}
          <div className="mt-2 rounded-lg border-2 border-garis">
            <div className="flex justify-between border-b border-garis px-2.5 py-1 text-[7.5px] text-teks-muda">
              <span>Nama Menu</span>
              <span>Pendapatan</span>
            </div>
            {rows.map((r) => (
              <div
                key={r.nama}
                className="flex items-center justify-between border-b border-garis px-2.5 py-1.5 last:border-0"
              >
                <div>
                  <p className="text-[10px] font-bold">{r.nama}</p>
                  <p className="text-[7.5px] text-teks-muda">{r.porsi} Porsi</p>
                </div>
                <p className="text-[10px] font-bold">{rupiah(r.pendapatan)}</p>
              </div>
            ))}
            {!rows.length && <p className="py-4 text-center text-[10px] text-teks-muda">Menu tidak ditemukan.</p>}
          </div>

          <div className="mt-3 rounded-lg bg-brand px-3 py-2 text-white">
            <p className="text-[11px]">Total Pendapatan</p>
            <p className="text-[12px] font-bold">{rupiah(total)}</p>
          </div>

          <div className="no-print mt-2.5 flex justify-end">
            <button
              onClick={cetakLaporan}
              className="flex items-center gap-1 rounded-md bg-brand px-2.5 py-1 text-[9.5px] font-semibold text-white hover:bg-brand-dark"
            >
              <Printer className="h-3.5 w-3.5" /> Cetak Laporan
            </button>
          </div>
        </div>
      </PageHeader>

      <BottomNav />
      <LaporanPrint info={cetak} />
    </main>
  );
}
