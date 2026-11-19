/** Format angka ke Rupiah: 36000 -> "Rp 36.000" */
export function rupiah(n, spasi = true) {
  return `Rp${spasi ? " " : ""}${n.toLocaleString("id-ID")}`;
}
export function pad2(n) {
  return n.toString().padStart(2, "0");
}
export function cn(...cls) {
  return cls.filter(Boolean).join(" ");
}
