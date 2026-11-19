"use client";
import { ArrowLeft, CircleCheck, CircleUserRound, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input, PasswordInput } from "@/components/ui/Field";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useStore } from "@/lib/store";
export default function ProfilePage() {
  const router = useRouter();
  const { admin, ubahPassword } = useStore();
  const [lama, setLama] = useState("");
  const [baru, setBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [error, setError] = useState("");
  const [berhasil, setBerhasil] = useState(false);
  const [logout, setLogout] = useState(false);
  function simpan() {
    setError("");
    if (!lama || !baru || !konfirmasi) return setError("Semua kolom password wajib diisi.");
    if (lama !== admin.password) return setError("Password lama salah.");
    if (baru.length < 8) return setError("Password baru minimal 8 karakter.");
    if (baru !== konfirmasi) return setError("Konfirmasi password tidak sama.");
    ubahPassword(baru);
    setLama("");
    setBaru("");
    setKonfirmasi("");
    setBerhasil(true);
    setTimeout(() => setBerhasil(false), 2000);
  }
  return (
    <main className="min-h-dvh bg-cream">
      {/* Header krem */}
      <div className="px-5 pt-5 pb-12">
        <Link href="/admin" className="flex items-center gap-2 text-[12px] font-bold">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-merah text-white">
            <ArrowLeft className="h-4 w-4" strokeWidth={2.8} />
          </span>
          Profile
        </Link>
        <div className="mt-4 flex flex-col items-center">
          <CircleUserRound className="h-14 w-14" strokeWidth={1.6} />
          <p className="mt-1 text-[12px] font-bold">Admin</p>
        </div>
      </div>

      {/* Lembar putih */}
      <div className="anim-sheet stagger -mt-6 min-h-[70dvh] rounded-t-[24px] bg-white pb-10">
        <section className="px-6 pt-5 pb-5">
          <h2 className="mb-3 text-[12px] font-bold">Informasi Akun</h2>
          <Input label="Username" value={admin.username === "admin" ? "Admin" : admin.username} readOnly />
        </section>

        <hr className="border-t-[6px] border-gray-100" />

        <section className="relative space-y-3.5 px-6 pt-4 pb-5">
          <h2 className="text-[12px] font-bold">Ubah Password</h2>
          <PasswordInput label="Password Lama" value={lama} onChange={(e) => setLama(e.target.value)} />
          <PasswordInput label="Password Baru" value={baru} onChange={(e) => setBaru(e.target.value)} />
          <PasswordInput
            label="Konfirmasi Password Baru"
            value={konfirmasi}
            onChange={(e) => setKonfirmasi(e.target.value)}
          />
          {error && <p className="text-[10.5px] font-medium text-merah">{error}</p>}
          <Button className="mt-2 w-full py-2.5" onClick={simpan}>
            Simpan Perubahan
          </Button>

          {berhasil && (
            <div className="animate-pop absolute top-10 right-6 flex items-center gap-1 rounded-md bg-hijau px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
              <CircleCheck className="h-3.5 w-3.5" /> Berhasil disimpan
            </div>
          )}
        </section>

        <hr className="border-t-[6px] border-gray-100" />

        <section className="px-6 pt-6">
          <Button variant="merah" className="w-full py-2.5" onClick={() => setLogout(true)}>
            Logout
          </Button>
        </section>
      </div>

      <ConfirmDialog
        open={logout}
        icon={null}
        title=""
        message={
          <span className="block text-left">
            <span className="mb-1 flex items-center gap-1.5 text-[12px] font-bold text-teks">
              <LogOut className="h-4 w-4" /> Konfirmasi Logout
            </span>
            Apakah kamu yakin ingin logout dari akun admin?
          </span>
        }
        confirmText="Logout"
        onCancel={() => setLogout(false)}
        onConfirm={() => router.replace("/login")}
      />
    </main>
  );
}
