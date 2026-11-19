import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
export const metadata = {
  title: "Warung Tupaja - Admin",
  description: "Aplikasi admin Warung Tupaja",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff8c22",
};
export default function RootLayout({ children }) {
  return (
    <html lang="id" className="antialiased">
      <body>
        <StoreProvider>
          {/* Bingkai mobile: di desktop tampil di tengah selebar HP */}
          <div
            id="app-shell"
            className="relative mx-auto min-h-dvh w-full max-w-[430px] overflow-x-hidden bg-white shadow-xl"
          >
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
