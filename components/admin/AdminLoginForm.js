"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminCardClassName,
} from "../../lib/ui/adminStyles";

export default function AdminLoginForm() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useAdminAuth();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(email, password);
      router.replace("/dashboard/admin");
    } catch (loginError) {
      setError(loginError.message ?? "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className={`${adminCardClassName} w-full max-w-md p-8`}>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white">
            Z
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Sign In</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access the Zanvara admin dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex flex-col gap-2">
            <span className={adminLabelClassName}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={adminInputClassName}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={adminLabelClassName}>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={adminInputClassName}
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className={`${adminPrimaryButtonClassName} w-full`}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="font-medium text-violet-700 hover:text-violet-800">
            Back to storefront
          </Link>
        </p>
      </div>
    </div>
  );
}
