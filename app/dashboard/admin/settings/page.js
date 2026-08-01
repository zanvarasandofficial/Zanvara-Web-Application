"use client";

import { useState } from "react";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader";
import StoreDeliverySettingsPanel from "../../../../components/admin/StoreDeliverySettingsPanel";
import {
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminCardClassName,
} from "../../../../lib/ui/adminStyles";

const tabs = [
  { id: "general", label: "General" },
  { id: "store", label: "Store" },
  { id: "notifications", label: "Notifications" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("store");

  return (
    <>
      <AdminPageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Manage store profile, delivery preferences, and admin notifications."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "rounded-xl px-4 py-2.5 text-sm font-semibold transition",
              activeTab === tab.id
                ? "bg-[#FFB347] text-white shadow-md shadow-[#FFB347]/20"
                : "border border-slate-200 bg-white text-slate-600 hover:border-[#FFB347]/30 hover:text-[#F59E0B]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className={`${adminCardClassName} mt-6 p-6`}>
        {activeTab === "general" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Store name</span>
              <input type="text" defaultValue="Zanvara" className={adminInputClassName} />
            </label>
            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Support email</span>
              <input type="email" defaultValue="zanvarasand@gmail.com" className={adminInputClassName} />
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className={adminLabelClassName}>Store tagline</span>
              <input type="text" defaultValue="The Art of Calm" className={adminInputClassName} />
            </label>
            <p className="sm:col-span-2 text-sm text-slate-500">
              General fields are not saved to the database yet — use Store for delivery rules.
            </p>
          </div>
        ) : null}

        {activeTab === "store" ? <StoreDeliverySettingsPanel /> : null}

        {activeTab === "notifications" ? (
          <div className="space-y-4">
            {[
              "New order alerts",
              "Low stock alerts",
              "Customer message alerts",
            ].map((item) => (
              <label
                key={item}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{item}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#FFB347]" />
              </label>
            ))}
            <p className="text-sm text-slate-500">Notification toggles are not saved yet.</p>
          </div>
        ) : null}

        {activeTab !== "store" ? (
          <button type="button" className={`${adminPrimaryButtonClassName} mt-6`} disabled>
            Save (coming soon)
          </button>
        ) : null}
      </section>
    </>
  );
}
