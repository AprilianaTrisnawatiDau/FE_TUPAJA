"use client";
import { ArrowLeft, ChevronRight, CirclePlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/layout/PageHeader";
import { KategoriFormModal, MenuFormModal } from "@/components/modals/MenuForms";
import Button from "@/components/ui/Button";
import FoodImage from "@/components/ui/FoodImage";
import { ConfirmDialog, SuccessPopup } from "@/components/ui/Modal";
import { cn, rupiah } from "@/lib/format";
import { useStore } from "@/lib/store";
/* Tombol ikon edit (kotak oranye) & hapus (tong sampah) */
function AksiIkon({ onEdit, onHapus }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="flex h-[18px] w-[18px] items-center justify-center rounded-[3px] bg-brand text-white"
        aria-label="Edit"
      >
        <Pencil className="h-3 w-3" strokeWidth={2.6} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onHapus();
        }}
        aria-label="Hapus"
      >
        <Trash2 className="h-[17px] w-[17px] fill-black text-black" strokeWidth={1.6} />
      </button>
    </div>
  );
}
export default function MenuPage() {
  const store = useStore();
  const { kategori, menu } = store;
  const [tab, setTab] = useState("kategori");
  const [cari, setCari] = useState("");
  const [detailId, setDetailId] = useState(null); // kategori yang dibuka
  const [chip, setChip] = useState(null); // kategori terpilih di tab menu
  // modal-modal
  const [formKategori, setFormKategori] = useState({ open: false });
  const [formMenu, setFormMenu] = useState({ open: false });
  const [hapusKategori, setHapusKategori] = useState(null);
  const [hapusMenu, setHapusMenu] = useState(null);
  const [ubahStatus, setUbahStatus] = useState(null);
  const [sukses, setSukses] = useState("");
  const jumlahMenu = (id) => menu.filter((m) => m.kategoriId === id).length;
  const detail = kategori.find((k) => k.id === detailId);
  const chipAktif = chip && kategori.some((k) => k.id === chip) ? chip : kategori[0]?.id;
  const q = cari.toLowerCase();
  const modals = (
    <>
      <KategoriFormModal
        open={formKategori.open}
        data={formKategori.data}
        onClose={() => setFormKategori({ open: false })}
        onSaved={(p) => {
          setFormKategori({ open: false });
          setSukses(p);
        }}
      />
      <MenuFormModal
        open={formMenu.open}
        data={formMenu.data}
        defaultKategori={formMenu.kategoriId}
        onClose={() => setFormMenu({ open: false })}
        onSaved={(p) => {
          setFormMenu({ open: false });
          setSukses(p);
        }}
      />
      <ConfirmDialog
        open={!!hapusKategori}
        title="Hapus Kategori?"
        message="Apakah anda yakin ingin menghapus kategori ini? Semua menu di dalamnya ikut terhapus."
        confirmText="Hapus Kategori"
        onCancel={() => setHapusKategori(null)}
        onConfirm={() => {
          if (hapusKategori) store.hapusKategori(hapusKategori.id);
          setHapusKategori(null);
          setDetailId(null);
          setSukses("Kategori Berhasil Dihapus!");
        }}
      />
      <ConfirmDialog
        open={!!hapusMenu}
        title="Hapus Menu ?"
        message="Apakah anda yakin ingin menghapus menu ini?"
        confirmText="Hapus Menu"
        onCancel={() => setHapusMenu(null)}
        onConfirm={() => {
          if (hapusMenu) store.hapusMenu(hapusMenu.id);
          setHapusMenu(null);
          setSukses("Menu Berhasil Dihapus!");
        }}
      />
      <ConfirmDialog
        open={!!ubahStatus}
        title="Ubah Status?"
        message="Apakah anda yakin ingin mengubah status?"
        confirmText="Ya"
        onCancel={() => setUbahStatus(null)}
        onConfirm={() => {
          if (ubahStatus) store.ubahMenu(ubahStatus.id, { aktif: !ubahStatus.aktif });
          setUbahStatus(null);
        }}
      />
      <SuccessPopup open={!!sukses} text={sukses} onDone={() => setSukses("")} />
    </>
  );
  /* ================= Halaman detail kategori ================= */
  if (detail) {
    const isi = menu.filter((m) => m.kategoriId === detail.id);
    return (
      <main className="min-h-dvh bg-brand">
        <div className="h-3" />
        <div className="anim-sheet min-h-[calc(100dvh-12px)] rounded-t-[24px] bg-white px-5 pt-4 pb-10">
          <button onClick={() => setDetailId(null)} className="flex items-center gap-2 text-[13px] font-bold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
              <ArrowLeft className="h-4 w-4" strokeWidth={2.8} />
            </span>
            {detail.nama}
          </button>

          <div className="mt-4 flex items-end gap-3">
            <FoodImage src={detail.gambar} alt={detail.nama} className="h-[74px] w-[74px] rounded-lg" />
            <div className="flex-1 self-start pt-1">
              <p className="text-[13px] font-bold">{detail.nama}</p>
              <p className="text-[10px] text-teks-muda">{isi.length} Menu</p>
            </div>
            <AksiIkon
              onEdit={() => setFormKategori({ open: true, data: detail })}
              onHapus={() => setHapusKategori(detail)}
            />
          </div>

          <div className="stagger mt-5 space-y-2.5">
            {isi.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border-2 border-garis p-2">
                <FoodImage
                  src={m.gambar}
                  alt={m.nama}
                  minuman={m.kategoriId === "minuman"}
                  className="h-10 w-10 rounded-md"
                />
                <div className="flex-1">
                  <p className="text-[11px] font-bold">{m.nama}</p>
                  <p className="text-[9px] text-teks-muda">{rupiah(m.harga)}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="mt-4 w-full py-2 text-[11px]"
            onClick={() => setFormMenu({ open: true, kategoriId: detail.id })}
          >
            <CirclePlus className="h-4 w-4" /> Tambah Menu
          </Button>
        </div>
        {modals}
      </main>
    );
  }
  /* ================= Halaman utama Kelola Menu ================= */
  const daftarKategori = kategori.filter((k) => k.nama.toLowerCase().includes(q));
  const kategoriChip = kategori.find((k) => k.id === chipAktif);
  const daftarMenu = menu.filter((m) => (q ? m.nama.toLowerCase().includes(q) : m.kategoriId === chipAktif));
  return (
    <main className="min-h-dvh">
      <PageHeader
        title="Kelola Menu"
        subtitle="Atur, Tambah, Ubah, dan Hapus Menu"
        search={cari}
        onSearch={setCari}
        searchPlaceholder="Cari"
      >
        <div className="px-5">
          {/* Tab Kategori / Menu (latar oranye bergeser halus) */}
          <div className="relative -mt-2 grid grid-cols-2 rounded-lg border-2 border-garis p-0.5">
            <span
              aria-hidden
              className="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-md bg-brand transition-transform duration-300"
              style={{ transform: tab === "menu" ? "translateX(100%)" : "none", transitionTimingFunction: "var(--ease-out)" }}
            />
            {["kategori", "menu"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative z-10 rounded-md py-1 text-[11px] font-semibold capitalize transition-colors duration-300",
                  tab === t ? "text-white" : "text-teks"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "kategori" ? (
            <>
              <div className="stagger mt-3 space-y-2.5">
                {daftarKategori.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => setDetailId(k.id)}
                    className="press flex w-full items-center gap-3 rounded-lg border-2 border-garis p-2 text-left hover:border-brand/60"
                  >
                    <FoodImage
                      src={k.gambar}
                      alt={k.nama}
                      minuman={k.id === "minuman"}
                      className="h-10 w-10 shrink-0 rounded-md"
                    />
                    <div className="flex-1">
                      <p className="text-[11px] font-bold">{k.nama}</p>
                      <p className="text-[8.5px] text-teks-muda">{jumlahMenu(k.id)} Menu</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </button>
                ))}
              </div>
              <Button
                className="mt-4 w-full py-2 text-[11px]"
                onClick={() => setFormKategori({ open: true, data: null })}
              >
                <CirclePlus className="h-4 w-4" /> Tambah Kategori
              </Button>
            </>
          ) : (
            <>
              {/* Chip kategori bergambar */}
              <div className="stagger no-scrollbar -mx-5 mt-3 flex gap-2.5 overflow-x-auto px-5 pb-1">
                {kategori.map((k) => (
                  <button key={k.id} onClick={() => setChip(k.id)} className="w-[46px] shrink-0 text-center">
                    <FoodImage
                      src={k.gambar}
                      alt={k.nama}
                      minuman={k.id === "minuman"}
                      className={cn(
                        "h-[46px] w-[46px] rounded-md border-2 transition-all duration-200",
                        chipAktif === k.id ? "border-brand" : "border-garis",
                      )}
                    />
                    <span className="mt-0.5 block text-[7.5px] leading-tight">{k.nama}</span>
                  </button>
                ))}
              </div>

              <h2 className="mt-2 text-[12px] font-bold">{q ? "Hasil Pencarian" : kategoriChip?.nama}</h2>
              <div className="stagger mt-2 space-y-2.5" key={chipAktif + cari}>
                {daftarMenu.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setUbahStatus(m)}
                    className="press flex cursor-pointer items-center gap-3 rounded-lg border-2 border-garis p-2 hover:border-brand/60"
                    title="Klik untuk mengubah status aktif/nonaktif"
                  >
                    <FoodImage
                      src={m.gambar}
                      alt={m.nama}
                      minuman={m.kategoriId === "minuman"}
                      className={cn("h-10 w-10 shrink-0 rounded-md", !m.aktif && "opacity-70 grayscale")}
                    />
                    <div className="flex-1">
                      <p className="text-[11px] font-bold">{m.nama}</p>
                      <p className="text-[9px] text-teks-muda">{rupiah(m.harga)}</p>
                    </div>
                    {/* posisi kanan-bawah kartu, sesuai Figma */}
                    <div className="self-end">
                      {m.aktif ? (
                        <AksiIkon onEdit={() => setFormMenu({ open: true, data: m })} onHapus={() => setHapusMenu(m)} />
                      ) : (
                        <span className="rounded-full bg-[#9a9a9a] px-3 py-0.5 text-[8.5px] font-semibold text-white">
                          Nonaktif
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {!daftarMenu.length && <p className="py-6 text-center text-[11px] text-teks-muda">Belum ada menu.</p>}
              </div>
            </>
          )}
        </div>
      </PageHeader>

      <BottomNav />
      {modals}
    </main>
  );
}
