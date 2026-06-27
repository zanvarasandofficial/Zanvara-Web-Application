"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useToast } from "../../context/ToastContext";
import { inputClassName, labelClassName } from "../../lib/ui/formStyles";
import Reveal from "../ui/Reveal";

function formatAuthProvider(provider) {
  if (provider === "GOOGLE") return "Google";
  if (provider === "EMAIL") return "Email OTP";
  return provider || "Unknown";
}

export default function ProfileView() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, updateProfile, logout } = useCustomerAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/checkout");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  if (isLoading || !user) {
    return (
      <div className="pb-16 pt-8 sm:pt-10">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile(name.trim());
      showToast("Profile updated successfully.", "success");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            My Account
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Profile</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Apna name update karein. Email sign-in method ke sath linked hai.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-8"
          >
            <div className="space-y-5">
              <label className="flex flex-col gap-2.5">
                <span className={labelClassName}>Full name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={2}
                  placeholder="Ali Khan"
                  className={inputClassName}
                />
              </label>

              <label className="flex flex-col gap-2.5">
                <span className={labelClassName}>Email</span>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className={`${inputClassName} cursor-not-allowed opacity-70`}
                />
              </label>

              <div className="flex flex-col gap-2.5">
                <span className={labelClassName}>Signed in with</span>
                <p className="inline-flex w-fit rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-sm font-medium text-violet-200">
                  {formatAuthProvider(user.authProvider)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving || name.trim().length < 2}
                className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_32px_rgba(139,92,246,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>

              <Link
                href="/account/orders"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-violet-500/35 hover:bg-white/[0.06]"
              >
                My Orders
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="inline-flex items-center cursor-pointer justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-3.5 text-sm font-semibold text-rose-200 transition-all duration-300 hover:border-rose-500/35"
              >
                Sign out
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
