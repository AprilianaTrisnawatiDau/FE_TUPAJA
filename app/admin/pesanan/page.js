"use client";
import { ChevronDown, CircleAlert, ReceiptText, RotateCcw, Wallet } from "lucide-react";
import { Fragment, useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/layout/PageHeader";
import { DetailPesananModal, StrukModal } from "@/components/modals/OrderModals";
import Button from "@/components/ui/Button";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { cn, pad2, rupiah } from "@/lib/format";
import { totalPesanan, useStore } from "@/lib/store";
const statusDropdown = [
  { v: "menunggu", label: "Menunggu" },
  { v: "proses", label: "Proses" },
  { v: "selesai", label: "Selesai" },
];
function KartuPesanan({ p, onDetail, onValidasi, onBatal, onUbahStatus, onRefund }) {
  const [dropdown, setDropdown] = useState(false);
  const aktif = ["belum_bayar", "menunggu", "proses"].includes(p.status);
  const total = totalPesanan(p);
  return (
    <div className={cn("rounded-lg border-2 p-2.5 transition-colors duration-300", aktif ? "border-brand" : "border-garis")}>
      {/* Kepala */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-merah text-[9px] font-bold text-white">
            {pad2(p.nomor)}
          </span>
          <div>
            <p className="text-[11px] leading-tight font-bold">No Meja {pad2(p.meja)}</p>
            <p className="text-[8px]">Order {p.id}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold">{p.user}</p>
          <p className="text-[7.5px] text-teks-muda">{p.jam}</p>
        </div>
      </div>
      <p className="mt-0.5 border-b border-garis pb-1 text-[7.5px] text-teks-muda">{p.tanggal}</p>

      {/* Tabel item */}
      <div className="grid grid-cols-[1fr_40px_64px] gap-y-0.5 border-b border-garis py-1.5 text-[9.5px]">
        <span className="text-[7.5px] text-teks-muda">Menu</span>
        <span className="text-center text-[7.5px] text-teks-muda">Jmlh</span>
        <span className="text-right text-[7.5px] text-teks-muda">Harga</span>
        {p.items.map((it) => (
          <Fragment key={it.menuId}>
            <span>{it.nama}</span>
            <span className="text-center">{it.jumlah}</span>
            <span className="text-right">{rupiah(it.harga, false)}</span>
          </Fragment>
        ))}
      </div>
      <div className="flex justify-between border-b border-garis py-1.5 text-[10px] font-bold">
        <span>Total</span>
        <span>{rupiah(total, false)}</span>
      </div>

      {/* Baris status + detail */}
      <div className="mt-1.5 flex items-center justify-between">
        <div className="relative">
          {(p.status === "menunggu" || p.status === "proses") && (
            <>
              <button
                onClick={() => setDropdown((d) => !d)}
                className="flex items-center gap-1 rounded-full bg-abu px-3 py-0.5 text-[8.5px] font-semibold"
              >
                {p.status === "menunggu" ? "Menunggu" : "Proses"} <ChevronDown className="h-3 w-3" />
              </button>
              {dropdown && (
                <ul className="animate-pop absolute top-full left-0 z-20 mt-0.5 w-[90px] overflow-hidden rounded-md bg-white text-[9px] shadow-lg ring-1 ring-garis">
                  {statusDropdown
                    .filter((s) => s.v !== p.status)
                    .map((s) => (
                      <li key={s.v}>
                        <button
                          onClick={() => {
                            setDropdown(false);
                            onUbahStatus(s.v);
                          }}
                          className="w-full px-3 py-1 text-left hover:bg-brand-soft"
                        >
                          {s.label}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </>
          )}
          {p.status === "selesai" && (
            <span className="rounded-full bg-hijau px-4 py-0.5 text-[8.5px] font-semibold text-white">
              Pesanan Selesai
            </span>
          )}
          {p.status === "dibatalkan" && !p.refund && (
            <span className="rounded-full bg-merah px-3 py-0.5 text-[8.5px] font-semibold text-white">
              Pesanan Dibatalkan
            </span>
          )}
          {p.status === "dibatalkan" && p.refund && (
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-3 py-0.5 text-[8.5px] font-semibold",
                p.refund === "proses" ? "bg-brand-soft text-brand-dark" : "bg-hijau text-white",
              )}
            >
              <RotateCcw className="h-3 w-3" /> {p.refund === "proses" ? "Refund Proses" : "Refund Selesai"}
            </span>
          )}
        </div>
        <button
          onClick={onDetail}
          className="rounded bg-abu px-2.5 py-0.5 text-[8.5px] font-medium hover:brightness-95"
        >
          Detail Pesanan
        </button>
      </div>

      {/* Aksi */}
      {p.status === "belum_bayar" && (
        <div className="mt-2 space-y-1.5">
          <Button variant="hijau" className="w-full py-1.5 text-[10px]" onClick={onValidasi}>
            Validasi Pembayaran
          </Button>
          <Button variant="merah" className="w-full py-1.5 text-[10px]" onClick={onBatal}>
            Batalkan Pesanan
          </Button>
        </div>
      )}
      {(p.status === "menunggu" || p.status === "proses") && (
        <div className="mt-2 space-y-1.5">
          <div className="rounded-md bg-hijau-soft py-1 text-center text-[9.5px] font-medium text-hijau">
            Pembayaran telah divalidasi
          </div>
          <Button variant="merah" className="w-full py-1.5 text-[10px]" onClick={onBatal}>
            Batalkan Pesanan
          </Button>
        </div>
      )}

      {/* Informasi pembatalan + refund (jika sudah bayar lalu dibatalkan) */}
      {p.status === "dibatalkan" && p.refund && (
        <div className="mt-2 rounded-md border-2 border-merah p-2">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold">
            <ReceiptText className="h-4 w-4 text-merah" /> Informasi Pembatalan
          </p>
          <dl className="grid grid-cols-[95px_8px_1fr] text-[9px] leading-relaxed">
            {[
              ["Nama Pelanggan", p.namaPembeli],
              ["Metode Pembayaran", p.metodeBayar],
              ["Total", rupiah(total)],
              ["Alasan", p.alasanBatal ?? "-"],
              ["Status Refund", p.refund === "proses" ? "Diproses" : "Selesai"],
            ].map(([k, v]) => (
              <Fragment key={k}>
                <dt>{k}</dt>
                <span>:</span>
                <dd className="text-right">{v}</dd>
              </Fragment>
            ))}
          </dl>
          {p.refund === "proses" && (
            <Button variant="merah" className="mt-2 w-full py-1.5 text-[10px]" onClick={onRefund}>
              Konfirmasi Refund
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
export default function PesananPage() {
  const store = useStore();
  const [cari, setCari] = useState("");
  const [detail, setDetail] = useState(null);
  const [struk, setStruk] = useState(null);
  const [validasi, setValidasi] = useState(null);
  const [batal, setBatal] = useState(null);
  const [status, setStatus] = useState(null);
  const [refund, setRefund] = useState(null);
  const q = cari.toLowerCase();
  // urutkan: yang masih aktif di atas
  const urutan = { belum_bayar: 0, menunggu: 1, proses: 1, selesai: 2, dibatalkan: 2 };
  const daftar = store.pesanan
    .filter((p) => !q || `meja ${p.meja} ${p.user} ${p.id} ${p.namaPembeli}`.toLowerCase().includes(q))
    .sort((a, b) => urutan[a.status] - urutan[b.status] || b.nomor - a.nomor);
  return (
    <main className="min-h-dvh">
      <PageHeader
        title="Kelola Pesanan"
        subtitle="Pantau dan cek pesanan secara berkala"
        search={cari}
        onSearch={setCari}
      >
        <div className="px-5">
          <h2 className="-mt-1 mb-2.5 text-[12px] font-bold">Pesanan Terbaru</h2>
          <div className="stagger space-y-3" key={cari}>
            {daftar.map((p, i) => (
              <Fragment key={p.id}>
                {i > 0 && urutan[daftar[i - 1].status] < 2 && urutan[p.status] === 2 && (
                  <hr className="mx-6 border-t-2 border-brand" />
                )}
                <KartuPesanan
                  p={p}
                  onDetail={() => setDetail(p)}
                  onValidasi={() => setValidasi(p)}
                  onBatal={() => setBatal(p)}
                  onUbahStatus={(s) => setStatus({ p, s })}
                  onRefund={() => setRefund(p)}
                />
              </Fragment>
            ))}
            {!daftar.length && <p className="py-8 text-center text-[11px] text-teks-muda">Pesanan tidak ditemukan.</p>}
          </div>
        </div>
      </PageHeader>

      <BottomNav />

      {/* Validasi Pembayaran */}
      <Modal open={!!validasi} onClose={() => setValidasi(null)} className="max-w-[300px] px-5 py-5 text-center">
        {validasi && (
          <>
            <Wallet className="mx-auto h-11 w-11 text-hijau" strokeWidth={2.2} />
            <h3 className="mt-1 text-[16px] font-bold">Validasi Pembayaran</h3>
            <p className="text-[11px] leading-snug text-gray-700">
              Pastikan pembayaran pelanggan sudah diterima untuk pesanan ini.
            </p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-2 rounded-md bg-hijau-soft px-3 py-2 text-left text-[10.5px] font-semibold">
              <dt>No. Meja</dt>
              <dd>: {validasi.meja}</dd>
              <dt>Metode Pembayaran</dt>
              <dd>: {validasi.metodeBayar}</dd>
              <dt>Total</dt>
              <dd>: {rupiah(totalPesanan(validasi))}</dd>
            </dl>
            <div className="mt-4 flex gap-2">
              <Button variant="abu" className="flex-1 py-2 text-[11px]" onClick={() => setValidasi(null)}>
                Tutup
              </Button>
              <Button
                variant="hijau"
                className="flex-[1.6] py-2 text-[11px] whitespace-nowrap"
                onClick={() => {
                  store.validasiPembayaran(validasi.id);
                  setValidasi(null);
                }}
              >
                Validasi Pembayaran
              </Button>
            </div>
          </>
        )}
      </Modal>

      {/* Batalkan Pesanan */}
      <Modal open={!!batal} onClose={() => setBatal(null)} className="max-w-[300px] px-5 py-5 text-center">
        {batal && (
          <>
            <CircleAlert className="mx-auto h-11 w-11 text-merah" strokeWidth={2} />
            <h3 className="mt-1 text-[16px] font-bold">Batalkan Pesanan?</h3>
            <p className="text-[11px] leading-snug text-gray-700">Apakah anda yakin ingin membatalkan pesanan ini?</p>
            <dl className="mx-auto mt-3 grid w-fit grid-cols-[auto_1fr] gap-x-2 rounded-md bg-abu px-4 py-1.5 text-left text-[10.5px] font-semibold">
              <dt>No. Meja</dt>
              <dd>: {batal.meja}</dd>
              <dt>Total</dt>
              <dd>: {rupiah(totalPesanan(batal))}</dd>
            </dl>
            <div className="mt-3 flex items-center gap-1.5 rounded-md bg-merah-soft px-2.5 py-1.5 text-left text-[9.5px] leading-snug text-merah">
              <CircleAlert className="h-4 w-4 shrink-0" />
              Jika pesanan sudah dibayar, nominal akan dikembalikan kepada pelanggan.
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="abu" className="min-w-[90px] py-2 text-[11px]" onClick={() => setBatal(null)}>
                Tutup
              </Button>
              <Button
                variant="merah"
                className="min-w-[90px] py-2 text-[11px]"
                onClick={() => {
                  store.batalkanPesanan(batal.id);
                  setBatal(null);
                }}
              >
                Batalkan
              </Button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={!!status}
        title="Ubah Status?"
        message="Apakah anda yakin ingin mengubah status?"
        confirmText="Ya"
        onCancel={() => setStatus(null)}
        onConfirm={() => {
          if (status) store.ubahStatus(status.p.id, status.s);
          setStatus(null);
        }}
      />
      <ConfirmDialog
        open={!!refund}
        title="Konfirmasi Refund?"
        message="Pastikan dana sudah dikembalikan kepada pelanggan."
        confirmText="Ya"
        onCancel={() => setRefund(null)}
        onConfirm={() => {
          if (refund) store.konfirmasiRefund(refund.id);
          setRefund(null);
        }}
      />

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
