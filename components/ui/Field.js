"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/format";
export const inputCls =
  "w-full rounded-md border border-garis bg-white px-3 py-2 text-[12px] text-teks outline-none placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20";
export function Label({ children, className }) {
  return <label className={cn("mb-1 block text-[11px] font-semibold text-teks", className)}>{children}</label>;
}
export function Input({ label, className, ...props }) {
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <input {...props} className={inputCls} />
    </div>
  );
}
export function PasswordInput({ label, className, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <input {...props} type={show ? "text" : "password"} className={cn(inputCls, "pr-9")} />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-teks"
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        >
          {show ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
