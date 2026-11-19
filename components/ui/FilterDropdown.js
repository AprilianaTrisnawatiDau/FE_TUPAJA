"use client";
import { ChevronDown } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";
const opsi = ["Hari", "Minggu", "Bulan"];
/* Tombol "Filter ▾" dengan pilihan Hari / Minggu / Bulan */
export default function FilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  // tutup saat pindah halaman
  useLayoutEffect(() => () => setOpen(false), []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-md border-2 border-brand bg-white px-2 py-0.5 text-[11px] font-semibold"
      >
        Filter <ChevronDown className="h-3.5 w-3.5 fill-gray-400 text-gray-400" />
      </button>
      {open && (
        <ul className="animate-pop absolute right-0 z-20 mt-1 w-[70px] overflow-hidden rounded-md border-2 border-brand bg-white text-center text-[10.5px] shadow-md">
          {opsi.map((o) => (
            <li key={o}>
              <button
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={cn(
                  "w-full border-b border-garis py-1 last:border-0 hover:bg-brand-soft",
                  value === o && "font-bold",
                )}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
