"use client";
/* =========================================================
   Grafik Penjualan (Dashboard) dengan animasi:
   1. Garis "tergambar" dari kiri ke kanan + area oranye naik
      (setiap kali halaman dibuka / filter diganti)
   2. Titik terakhir berdenyut (efek "live")
   3. Sorotan + gelembung nilai berpindah otomatis tiap bulan
      (berhenti sementara saat grafik disentuh / di-hover)
   ========================================================= */
import { useEffect, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { grafikPenjualan } from "@/lib/data";

const DURASI_GAMBAR = 1200; // ms, lama animasi garis
const JEDA_PINDAH = 2000; // ms, sorotan pindah ke titik berikutnya

/* Titik pada garis: biasa, aktif (dengan gelembung), atau terakhir (berdenyut) */
function Titik({ cx, cy, index, payload, aktif, terakhir }) {
  if (cx == null || cy == null) return null;
  const isAktif = index === aktif;
  const isTerakhir = index === terakhir;
  // geser gelembung supaya tidak terpotong di sisi kiri / kanan grafik
  const bx = isTerakhir ? cx - 24 : Math.max(cx, 32);
  return (
    <g>
      {isTerakhir && (
        <circle cx={cx} cy={cy} r={3} fill="#ff8c22" opacity={0.5}>
          <animate attributeName="r" values="3;10" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.55;0" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={cx} cy={cy} r={isAktif ? 4.5 : 2.6} fill={isAktif ? "#ff8c22" : "#111"} stroke="#fff" strokeWidth={isAktif ? 2 : 0.8} style={{ transition: "r 0.3s" }} />
      {isAktif && (
        <g key={`gelembung-${index}`} className="chart-pop">
          <rect x={bx - 30} y={cy - 25} width={60} height={16} rx={4} fill="#111" />
          <path d={`M${cx - 4},${cy - 9.5} L${cx},${cy - 5} L${cx + 4},${cy - 9.5} Z`} fill="#111" />
          <text x={bx} y={cy - 14} textAnchor="middle" fill="#fff" fontSize={8} fontWeight={600}>
            {payload.nilai} pesanan
          </text>
        </g>
      )}
    </g>
  );
}

export default function SalesChart({ periode }) {
  const data = [...grafikPenjualan[periode]];
  const terakhir = data.length - 1;
  const [aktif, setAktif] = useState(-1); // -1 = belum ada sorotan
  const [jeda, setJeda] = useState(false); // berhenti saat disentuh

  // Ganti filter -> mulai lagi dari awal setelah garis selesai tergambar
  const [periodeLalu, setPeriodeLalu] = useState(periode);
  if (periodeLalu !== periode) {
    setPeriodeLalu(periode);
    setAktif(-1);
  }

  useEffect(() => {
    const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (jeda || kurangiGerak) return;
    const t = setTimeout(
      () => setAktif((i) => (i + 1) % data.length),
      aktif === -1 ? DURASI_GAMBAR + 200 : JEDA_PINDAH
    );
    return () => clearTimeout(t);
  }, [aktif, jeda, data.length]);

  return (
    <div
      className="h-32.5 w-full"
      onMouseEnter={() => setJeda(true)}
      onMouseLeave={() => setJeda(false)}
      onTouchStart={() => setJeda(true)}
      onTouchEnd={() => setTimeout(() => setJeda(false), 2500)}
    >
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 300, height: 130 }}>
        <ComposedChart key={periode} data={data} margin={{ top: 28, right: 12, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="isiOranye" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8c22" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ff8c22" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eee" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ stroke: "#ff8c22", strokeDasharray: "2 2" }}
            contentStyle={{ background: "#111", border: "none", borderRadius: 4, padding: "2px 8px" }}
            labelStyle={{ color: "#fff", fontSize: 9 }}
            itemStyle={{ color: "#fff", fontSize: 9, padding: 0 }}
            formatter={(v, name) => (name === "nilai" ? [`${v} pesanan`, ""] : [null, null])}
            separator=""
          />
          {/* garis putus-putus dari titik yang disorot sampai sumbu bawah (tidak keluar grafik) */}
          {aktif >= 0 && (
            <ReferenceLine
              x={data[aktif].label}
              stroke="#ff8c22"
              strokeDasharray="2 2"
              strokeWidth={1}
              ifOverflow="hidden"
              segment={[
                { x: data[aktif].label, y: 0 },
                { x: data[aktif].label, y: data[aktif].nilai },
              ]}
            />
          )}
          <Area
            type="monotone"
            dataKey="nilai"
            stroke="none"
            fill="url(#isiOranye)"
            animationDuration={DURASI_GAMBAR + 200}
            animationEasing="ease-out"
            tooltipType="none"
            activeDot={false}
          />
          <Line
            type="linear"
            dataKey="nilai"
            stroke="#111"
            strokeWidth={1.6}
            dot={(p) => <Titik key={p.index} {...p} aktif={aktif} terakhir={terakhir} />}
            activeDot={{ r: 5, fill: "#ff8c22", stroke: "#fff", strokeWidth: 2 }}
            animationDuration={DURASI_GAMBAR}
            animationEasing="ease-in-out"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
