import { cn } from "@/lib/format";
const styles = {
  brand: "bg-brand text-white hover:bg-brand-dark",
  merah: "bg-merah text-white hover:brightness-110",
  hijau: "bg-hijau text-white hover:brightness-110",
  abu: "bg-abu text-teks hover:brightness-95",
  outline: "border border-garis bg-white text-teks hover:bg-gray-50",
};
export default function Button({ variant = "brand", className, ...props }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-[12px] font-semibold shadow-sm transition duration-150 hover:shadow-md active:scale-[0.96] active:shadow-none disabled:pointer-events-none disabled:opacity-60",
        styles[variant],
        className,
      )}
    />
  );
}
