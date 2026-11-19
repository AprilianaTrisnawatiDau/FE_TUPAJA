"use client";

// Logo yang sama dengan splash (public/images/logo/Logo.png)
export default function Logo({ className = "" }) {
  return (
    <img
      src="/images/logo/Logo.png"
      alt="Logo Warung Tupaja"
      width={200}
      height={80}
      className={`h-auto w-[200px] ${className}`}
    />
  );
}
