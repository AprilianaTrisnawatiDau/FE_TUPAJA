"use client";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import FoodImage from "@/components/ui/FoodImage";
import { Modal, SuccessPopup } from "@/components/ui/Modal";
import { cn } from "@/lib/format";
import { statusStok, useStore } from "@/lib/store";
export default function StokPage() {
  const { menu, kategori, ubahMenu } = useStore();
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState("semua");
  const [edit, setEdit] = useState(null);
  const [jumlah, setJumlah] = useState("0");
  const [sukses, setSukses] = useState(false);
  const daftar = menu.filter(
    (m) => (filter === "semua" || m.kategoriId === filter) && m.nama.toLowerCase().includes(cari.toLowerCase()),
  );
  const namaKategori = (id) => kategori.find((k) => k.id === id)?.nama ?? "-";
  return (
    <main className="min-h-dvh">
      <PageHeader
        title="Kelola Stok"
        subtitle="Pantau dan atur ketersediaan stok menu."
        search={cari}
        onSearch={setCari}
        searchPlaceholder="Cari"
      >
        {/* Chip kategori */}
        <div className="no-scrollbar -mt-2 flex gap-2 overflow-x-auto px-5 pb-1">
          {[{ id: "semua", nama: "Semua" }, ...kategori].map((k) => (
            <button
              key={k.id}
              onClick={() => setFilter(k.id)}
              className={cn(
                "shrink-0 rounded-full border-2 px-4 py-1 text-[10.5px] font-semibold transition-all duration-200 active:scale-95",
                filter === k.id ? "border-brand bg-brand text-white" : "border-garis bg-white",
              )}
            >
              {k.nama}
            </button>
          ))}
        </div>

        <div className="stagger mt-3 space-y-2.5 px-5" key={filter + cari}>
          {daftar.map((m) => {
            const st = statusStok(m.stok);
            return (
              <button
                key={m.id}
                onClick={() => {
                  setEdit(m);
                  setJumlah(String(m.stok));
                }}
                className="press flex w-full items-center gap-3 rounded-lg border-2 border-garis p-2 text-left hover:border-brand/60"
              >
                <FoodImage
                  src={m.gambar}
                  alt={m.nama}
                  minuman={m.kategoriId === "minuman"}
                  className="h-11 w-11 shrink-0 rounded-md"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold">{m.nama}</p>
                  <p className="text-[8.5px] text-teks-muda">{namaKategori(m.kategoriId)}</p>
                  <p className="text-[9px]">Stok : {m.stok} Porsi</p>
                </div>
                <span className={cn("rounded px-2.5 py-0.5 text-[8.5px] font-semibold", st.cls)}>{st.label}</span>
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </button>
            );
          })}
          {!daftar.length && <p className="py-8 text-center text-[11px] text-teks-muda">Menu tidak ditemukan.</p>}
        </div>
      </PageHeader>

      <BottomNav />

      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit Stok" className="max-w-[310px]">
        {edit && (
          <>
            <div className="flex items-center gap-3">
              <FoodImage
                src={edit.gambar}
                alt={edit.nama}
                minuman={edit.kategoriId === "minuman"}
                className="h-[84px] w-[84px] shrink-0 rounded-lg border-2 border-garis"
              />
              <div>
                <p className="text-[13px] font-bold">{edit.nama}</p>
                <p className="mt-3 text-[10px] font-semibold">Jumlah Stok</p>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    className="w-20 rounded-md border border-garis px-2 py-1 text-[11px] font-semibold outline-none focus:border-brand"
                  />
                  <span className="text-[10px]">Porsi</span>
                </div>
              </div>
            </div>
            <Button
              className="mt-4 w-full py-1.5 text-[11px]"
              onClick={() => {
                ubahMenu(edit.id, { stok: Math.max(0, Number(jumlah) || 0) });
                setEdit(null);
                setSukses(true);
              }}
            >
              Perbarui Stok
            </Button>
          </>
        )}
      </Modal>

      <SuccessPopup open={sukses} text="Stok Berhasil Diperbarui!" onDone={() => setSukses(false)} />
    </main>
  );
}
