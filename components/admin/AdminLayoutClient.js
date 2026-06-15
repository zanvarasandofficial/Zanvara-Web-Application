"use client";

import { usePathname } from "next/navigation";
import { AdminAuthProvider } from "../../context/AdminAuthContext";
import AdminAuthGate from "./AdminAuthGate";
import AdminShell from "./AdminShell";

function AdminLayoutInner({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/dashboard/admin/login";

  if (isLoginPage) {
    return children;
  }

  return (
    <AdminAuthGate>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGate>
  );
}

export default function AdminLayoutClient({ children }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
