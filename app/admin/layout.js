import NotificationToasts from "@/components/layout/NotificationToasts";
export default function AdminLayout({ children }) {
  return (
    <>
      <NotificationToasts />
      {children}
    </>
  );
}
