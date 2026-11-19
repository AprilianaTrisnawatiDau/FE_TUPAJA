import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  // izinkan dibuka lewat IP jaringan (misalnya dari HP)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "100.*.*.*"],
  // sembunyikan tombol "N" Next.js saat npm run dev
  devIndicators: false,
};

export default nextConfig;
