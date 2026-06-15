"use client";

import { useState } from "react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { getGoogleAuthUrl } from "../../lib/api/customer-auth";
import CheckoutAuthModal from "./CheckoutAuthModal";

export default function CheckoutAuthSection({ onAuthenticated }) {
  const { user, isLoading, logout } = useCustomerAuth();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-8">
        <p className="text-sm text-zinc-400">Checking your account...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="rounded-[1.75rem] border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Signed in
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {user.name || "Welcome back"}
            </h2>
            <p className="mt-1 text-sm text-emerald-100/80">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-8">
        <h2 className="text-xl font-semibold text-white">Sign in to continue</h2>
        {/* <p className="mt-2 text-sm leading-6 text-zinc-400">
          Checkout ke liye pehle sign in karein. Reviews bhi sirf login ke baad di ja sakti hain.
        </p> */}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setEmailModalOpen(true)}
            className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-violet-500/35 hover:bg-white/[0.06]"
          >
            Continue with Email
          </button>

          <a
            href={getGoogleAuthUrl("/checkout")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-5 py-3.5 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-zinc-100"
          >
            <span aria-hidden="true" className="text-base">
              G
            </span>
            Continue with Google
          </a>
        </div>
      </div>

      <CheckoutAuthModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSuccess={onAuthenticated}
      />
    </>
  );
}
