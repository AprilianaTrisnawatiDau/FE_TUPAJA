"use client";
import { CupSoda, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/format";
/* Gambar makanan dengan fallback placeholder kalau file belum ada. */
export default function FoodImage({ src, alt, className, minuman = false }) {
  const [gagal, setGagal] = useState(null);
  const error = !src || gagal === src;
  // gambar bisa gagal dimuat sebelum React siap (SSR) -> cek manual
  const ref = (img) => {
    if (img && img.complete && img.naturalWidth === 0 && src) setGagal(src);
  };
  if (error || !src) {
    const Icon = minuman ? CupSoda : UtensilsCrossed;
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-[#ffd29e] to-[#f7a24b] text-white",
          className,
        )}
        aria-label={alt}
      >
        <Icon className="h-1/2 w-1/2 max-h-8 max-w-8" strokeWidth={1.8} />
      </div>
    );
  }
  return (
    <img ref={ref} src={src} alt={alt} className={cn("object-cover", className)} onError={() => setGagal(src)} />
  );
}
