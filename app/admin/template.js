/* Template dibuat ulang setiap pindah halaman admin,
   jadi animasi "anim-page" diputar di setiap perpindahan halaman. */
export default function AdminTemplate({ children }) {
  return <div className="anim-page">{children}</div>;
}
