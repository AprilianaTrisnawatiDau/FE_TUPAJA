"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input, Label, inputCls } from "@/components/ui/Field";
import ImageUpload from "@/components/ui/ImageUpload";
import { Modal } from "@/components/ui/Modal";
import { useStore } from "@/lib/store";
/* ===== Tambah / Edit Kategori ===== */
export function KategoriFormModal({ open, data, onClose, onSaved }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={data ? "Edit Kategori" : "Tambah Kategori Baru"}
      className="max-w-[300px]"
    >
      <KategoriForm data={data} onSaved={onSaved} />
    </Modal>
  );
}
/* isi form dipasang ulang setiap modal dibuka -> state awal selalu segar */
function KategoriForm({ data, onSaved }) {
  const { tambahKategori, ubahKategori } = useStore();
  const [nama, setNama] = useState(data?.nama ?? "");
  const [gambar, setGambar] = useState(data?.gambar);
  const [error, setError] = useState("");
  function simpan() {
    if (!nama.trim()) return setError("Nama kategori wajib diisi.");
    if (data) {
      ubahKategori(data.id, { nama: nama.trim(), gambar });
      onSaved("Kategori Berhasil Diperbarui!");
    } else {
      tambahKategori({ nama: nama.trim(), gambar });
      onSaved("Kategori Berhasil Tersimpan!");
    }
  }
  return (
    <>
      <ImageUpload value={gambar} onChange={setGambar} />
      <Input
        className="mt-4"
        label="Nama Kategori"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        placeholder="Contoh: Bakso"
      />
      {error && <p className="mt-1 text-[10px] text-merah">{error}</p>}
      <Button className="mt-4 w-full py-1.5 text-[11px]" onClick={simpan}>
        {data ? "Perbarui Kategori" : "Simpan Kategori"}
      </Button>
    </>
  );
}
/* ===== Tambah / Edit Menu ===== */
export function MenuFormModal({ open, data, defaultKategori, onClose, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={data ? "Edit Menu" : "Tambah Menu Baru"} className="max-w-[300px]">
      <MenuForm data={data} defaultKategori={defaultKategori} onSaved={onSaved} />
    </Modal>
  );
}
function MenuForm({ data, defaultKategori, onSaved }) {
  const { kategori, tambahMenu, ubahMenu } = useStore();
  const [nama, setNama] = useState(data?.nama ?? "");
  const [kategoriId, setKategoriId] = useState(data?.kategoriId ?? defaultKategori ?? kategori[0]?.id ?? "");
  const [harga, setHarga] = useState(data ? `Rp ${data.harga.toLocaleString("id-ID")}` : "");
  const [gambar, setGambar] = useState(data?.gambar);
  const [error, setError] = useState("");
  function simpan() {
    const angka = Number(harga.replace(/\D/g, ""));
    if (!nama.trim() || !kategoriId || !angka) return setError("Nama, kategori, dan harga wajib diisi.");
    if (data) {
      ubahMenu(data.id, { nama: nama.trim(), kategoriId, harga: angka, gambar });
      onSaved("Menu Berhasil Diperbarui!");
    } else {
      tambahMenu({ nama: nama.trim(), kategoriId, harga: angka, gambar });
      onSaved("Menu Berhasil Tersimpan!");
    }
  }
  return (
    <>
      <ImageUpload value={gambar} onChange={setGambar} />
      <div className="mt-4 space-y-2.5">
        <Input
          label="Nama Menu"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Contoh: Bakso Campur"
        />
        <div>
          <Label>Kategori Menu</Label>
          <select value={kategoriId} onChange={(e) => setKategoriId(e.target.value)} className={inputCls}>
            {kategori.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Harga Menu"
          inputMode="numeric"
          value={harga}
          onChange={(e) => {
            const n = e.target.value.replace(/\D/g, "");
            setHarga(n ? `Rp ${Number(n).toLocaleString("id-ID")}` : "");
          }}
          placeholder="Rp 15.000"
        />
      </div>
      {error && <p className="mt-1 text-[10px] text-merah">{error}</p>}
      <Button className="mt-4 w-full py-1.5 text-[11px]" onClick={simpan}>
        {data ? "Perbarui Menu" : "Simpan Menu"}
      </Button>
    </>
  );
}
