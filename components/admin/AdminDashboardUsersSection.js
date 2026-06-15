"use client";

import AdminCustomersPanel from "./AdminCustomersPanel";

export default function AdminDashboardUsersSection() {
  return (
    <AdminCustomersPanel
      compact
      title="Recent customers"
      description="Checkout se sign in hone wale users."
    />
  );
}
