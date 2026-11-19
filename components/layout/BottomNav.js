"use client";
import { Archive, ChartNoAxesColumnIncreasing, ClipboardPen, House, NotebookTabs } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/format";
const items = [
  { href: "/admin", label: "Home", icon: House },
  { href: "/admin/pesanan", label: "Pesanan", icon: ClipboardPen },
  { href: "/admin/menu", label: "Menu", icon: NotebookTabs },
  { href: "/admin/stok", label: "Stok", icon: Archive },
  { href: "/admin/laporan", label: "Laporan", icon: ChartNoAxesColumnIncreasing },
];
/* Navigasi bawah: item aktif jadi lingkaran merah yang "naik" */
export default function BottomNav() {
  const path = usePathname();
  return (
    <>
      {/* ruang kosong supaya konten tidak tertutup nav */}
      <div className="h-24" />
      <nav className="anim-fade-up no-print fixed bottom-3 left-1/2 z-40 w-[calc(min(100vw,430px)-28px)] -translate-x-1/2">
        <ul className="grid h-[52px] grid-cols-5 items-center rounded-2xl border-2 border-garis bg-white shadow-md">
          {items.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
            return (
              <li key={href} className="flex justify-center">
                <Link
                  href={href}
                  className={cn(
                    "flex flex-col items-center justify-center transition duration-200 active:scale-90",
                    active
                      ? "anim-nav-pop -mt-7 h-[54px] w-[54px] rounded-full bg-merah text-white shadow-lg shadow-merah/40 ring-4 ring-white"
                      : "text-teks hover:-translate-y-0.5 hover:text-merah",
                  )}
                >
                  <Icon className={active ? "h-5 w-5" : "h-[18px] w-[18px]"} strokeWidth={2.2} />
                  <span className={cn("mt-0.5 font-medium", active ? "text-[8px]" : "text-[8.5px]")}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
