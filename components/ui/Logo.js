"use client";

/* Logo Warung Tupaja.
   Logo dibuat dengan SVG. Untuk memakai logo asli dari Figma, lihat public/images/BACA-SAYA.md.
 */
export default function Logo({ className = "" }) {
  return <LogoSvg className={className} />;
}

function LogoSvg({ className = "" }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg viewBox="0 0 64 56" className="h-12 w-14 shrink-0" aria-hidden>
        {/* uap */}
        <path
          d="M22 6c-3 3 3 5 0 9M30 3c-3 3 3 5 0 9M38 6c-3 3 3 5 0 9"
          stroke="#b8262b"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        {/* sumpit */}
        <path d="M40 22 62 8M42 25 63 14" stroke="#b8262b" strokeWidth="3" strokeLinecap="round" />
        {/* mie */}
        <path
          d="M14 27c4-6 8 2 12-4s8 2 12-4 6 4 10 0"
          stroke="#b8262b"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
        {/* mangkuk */}
        <path d="M5 28h50c0 13-11 21-25 21S5 41 5 28Z" fill="#b8262b" />
        <path d="M11 34h38M14 39h32" stroke="#fff" strokeWidth="1.6" strokeDasharray="3 3" />
        <rect x="21" y="49" width="18" height="4" rx="2" fill="#b8262b" />
      </svg>
      <div className="leading-[1.05] font-bold tracking-wide text-black">
        <div className="text-[19px]">WARUNG</div>
        <div className="text-[19px]">TUPAJA</div>
      </div>
    </div>
  );
}
