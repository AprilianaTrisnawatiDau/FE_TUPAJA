/* Bingkai mobile untuk halaman ADMIN (login & /admin).
   Di desktop tampil di tengah selebar HP.
   id="app-shell" dipakai saat mencetak laporan (lihat globals.css). */
export default function AdminShell({ children }) {
  return (
    <div
      id="app-shell"
      className="relative mx-auto min-h-dvh w-full max-w-[430px] overflow-x-hidden bg-white shadow-xl"
    >
      {children}
    </div>
  );
}
