import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata = {
  title: "Warung Tupaja",
  description: "Aplikasi pemesanan (pelanggan) dan admin Warung Tupaja",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff8c22",
};

/* Layout paling luar: dipakai halaman USER dan ADMIN.
   Bingkai admin ada di components/layout/AdminShell.js,
   bingkai user ada di components/layout/MobileFrame.js. */
export default function RootLayout({ children }) {
  return (
    <html lang="id" className="antialiased">
      <head>
        {/* ikon Font Awesome untuk halaman user */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
