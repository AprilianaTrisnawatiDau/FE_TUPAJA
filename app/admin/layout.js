import AdminShell from "@/components/layout/AdminShell";
import NotificationToasts from "@/components/layout/NotificationToasts";

export default function AdminLayout({ children }) {
  return (
    <AdminShell>
      <NotificationToasts />
      {children}
    </AdminShell>
  );
}
