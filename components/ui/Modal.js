"use client";
import { CircleCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";
import Button from "./Button";
/* Overlay gelap + kartu putih di tengah (dibatasi selebar bingkai HP).
   Muncul dengan efek "pop" dan menghilang dengan animasi keluar. */
const DURASI_KELUAR = 180; // ms

export function Modal({ open, onClose, children, className, title }) {
  const [tampil, setTampil] = useState(open); // masih dirender?
  const [keluar, setKeluar] = useState(false); // sedang animasi keluar?
  const [isiTerakhir, setIsiTerakhir] = useState(children);
  // simpan isi terakhir supaya tetap terlihat saat animasi keluar
  if (open && isiTerakhir !== children) setIsiTerakhir(children);

  // buka / tutup dengan animasi
  if (open && (!tampil || keluar)) {
    setTampil(true);
    setKeluar(false);
  }
  if (!open && tampil && !keluar) setKeluar(true);

  useEffect(() => {
    if (!keluar) return;
    const t = setTimeout(() => {
      setTampil(false);
      setKeluar(false);
    }, DURASI_KELUAR);
    return () => clearTimeout(t);
  }, [keluar]);

  useEffect(() => {
    if (!open || !onClose) return;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!tampil) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div
        className={cn(
          "relative flex h-full w-full max-w-[430px] items-center justify-center bg-black/45 px-6 backdrop-blur-[1.5px]",
          keluar ? "animate-fade-out" : "animate-fade-in"
        )}
        onClick={keluar ? undefined : onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "w-full rounded-xl bg-white p-4 shadow-2xl",
            keluar ? "animate-pop-out" : "animate-pop",
            className
          )}
          role="dialog"
          aria-modal
        >
          {title && (
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[13px] font-bold">{title}</h3>
              {onClose && (
                <button onClick={onClose} aria-label="Tutup" className="transition hover:rotate-90 active:scale-90">
                  <img src="/images/ikon/silang.png" alt="" className="h-4 w-4 object-contain" />
                </button>
              )}
            </div>
          )}
          {open ? children : isiTerakhir}
        </div>
      </div>
    </div>
  );
}
/* Dialog konfirmasi kecil: judul, pesan, Batal + tombol aksi */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Batal",
  confirmVariant = "merah",
  icon,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} onClose={onCancel} className="max-w-[260px] px-5 py-4 text-center">
      {icon && <div className="mb-1 flex justify-center">{icon}</div>}
      <h3 className="text-[13px] font-bold">{title}</h3>
      <p className="mt-1 text-[10.5px] leading-snug text-gray-600">{message}</p>
      <div className="mt-3 flex justify-center gap-2.5">
        <Button variant="abu" className="min-w-[72px] px-3 py-1.5 text-[10.5px]" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} className="min-w-[72px] px-3 py-1.5 text-[10.5px]" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
/* Pop-up sukses: centang hijau + teks, hilang otomatis */
export function SuccessPopup({ open, text, onDone }) {
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => doneRef.current(), 1500);
    return () => clearTimeout(t);
  }, [open]);
  return (
    <Modal open={open} onClose={onDone} className="w-auto max-w-[240px] px-5 py-3 text-center">
      <span className="anim-check mx-auto block w-fit">
        <CircleCheck className="h-8 w-8 fill-hijau text-white" strokeWidth={2.2} />
      </span>
      <p className="anim-fade-up mt-1 text-[11px] font-bold" style={{ animationDelay: "0.12s" }}>
        {text}
      </p>
    </Modal>
  );
}
