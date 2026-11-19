"use client";
/* =========================================================
   Dokumen cetak / PDF Laporan Penjualan (ukuran A4).
   Tidak tampil di layar; hanya muncul saat tombol
   "Cetak Laporan" ditekan (lihat app/admin/laporan/page.js).
   Dirender ke <body> lewat portal supaya lebarnya penuh A4,
   tidak terbatas bingkai HP (430px).
   ========================================================= */
import { createPortal } from "react-dom";
import Logo from "@/components/ui/Logo";
import { INFO_WARUNG } from "@/lib/data";
import { rupiah } from "@/lib/format";

export default function LaporanPrint({ info }) {
  if (!info) return null;
  const { judulPeriode, rentang, dicetak, rows, totalPesanan } = info;

  const total = rows.reduce((s, r) => s + r.pendapatan, 0);
  const totalPorsi = rows.reduce((s, r) => s + r.porsi, 0);
  const terlaris = [...rows].sort((a, b) => b.porsi - a.porsi)[0];

  const ringkasan = [
    { label: "Total Pendapatan", nilai: rupiah(total), utama: true },
    { label: "Total Pesanan", nilai: `${totalPesanan} pesanan` },
    { label: "Porsi Terjual", nilai: `${totalPorsi} porsi` },
  ];

  return createPortal(
    <div className="laporan-print">
      {/* ===== Kop ===== */}
      <header className="lp-kop">
        <div>
          <Logo />
          <p className="lp-alamat">
            {INFO_WARUNG.alamat}
            <br />
            {INFO_WARUNG.telp}
          </p>
        </div>
        <div className="lp-judul">
          <h1>LAPORAN PENJUALAN</h1>
          <p className="lp-periode">{judulPeriode}</p>
          <p>{rentang}</p>
        </div>
      </header>
      <div className="lp-garis" />

      {/* ===== Ringkasan ===== */}
      <section className="lp-ringkasan">
        {ringkasan.map((r) => (
          <div key={r.label} className={r.utama ? "lp-kotak lp-kotak-utama" : "lp-kotak"}>
            <span>{r.label}</span>
            <strong>{r.nilai}</strong>
          </div>
        ))}
      </section>

      {/* ===== Tabel rincian ===== */}
      <h2 className="lp-subjudul">Rincian Penjualan per Menu</h2>
      <table className="lp-tabel">
        <thead>
          <tr>
            <th className="lp-c">No</th>
            <th>Nama Menu</th>
            <th className="lp-r">Harga Satuan</th>
            <th className="lp-c">Porsi</th>
            <th className="lp-r">Pendapatan</th>
            <th className="lp-r">Kontribusi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.nama}>
              <td className="lp-c">{i + 1}</td>
              <td>
                {r.nama}
                {terlaris && r.nama === terlaris.nama && <span className="lp-badge">Terlaris</span>}
              </td>
              <td className="lp-r">{rupiah(Math.round(r.pendapatan / r.porsi))}</td>
              <td className="lp-c">{r.porsi}</td>
              <td className="lp-r">{rupiah(r.pendapatan)}</td>
              <td className="lp-r">{total ? ((r.pendapatan / total) * 100).toFixed(1) : 0}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>TOTAL</td>
            <td className="lp-c">{totalPorsi}</td>
            <td className="lp-r">{rupiah(total)}</td>
            <td className="lp-r">100%</td>
          </tr>
        </tfoot>
      </table>

      {/* ===== Catatan & tanda tangan ===== */}
      <section className="lp-bawah">
        <div className="lp-catatan">
          <strong>Catatan</strong>
          <ul>
            {terlaris && (
              <li>
                Menu terlaris periode ini adalah <b>{terlaris.nama}</b> dengan {terlaris.porsi} porsi.
              </li>
            )}
            <li>Pendapatan dihitung dari pesanan yang pembayarannya sudah divalidasi.</li>
          </ul>
        </div>
        <div className="lp-ttd">
          <p>Malang, {dicetak.tanggal}</p>
          <p>Mengetahui,</p>
          <div className="lp-ttd-ruang" />
          <p className="lp-ttd-nama">Admin {INFO_WARUNG.nama}</p>
        </div>
      </section>

      <footer className="lp-footer">
        <span>Dicetak dari Sistem Admin {INFO_WARUNG.nama}</span>
        <span>
          {dicetak.tanggal}, {dicetak.jam}
        </span>
      </footer>
    </div>,
    document.body
  );
}
