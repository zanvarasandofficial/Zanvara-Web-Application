"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryButtonClassName,
  adminSecondaryButtonClassName,
  adminCardClassName,
} from "../../lib/ui/adminStyles";

export default function AdminLoginForm() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login, sendOtp, verifyOtp } = useAdminAuth();
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setStep("form");
    setCode("");
    setPassword("");
    setConfirmPassword("");
    resetMessages();
  }

  async function handleLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    resetMessages();

    try {
      const result = await login(email.trim(), password);

      if (result.isAdmin) {
        router.replace("/dashboard/admin");
        return;
      }

      window.location.href = "/account/profile";
    } catch (loginError) {
      setError(loginError.message ?? "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendOtp(event) {
    event.preventDefault();
    setSubmitting(true);
    resetMessages();

    if (password.length < 8) {
      setError("Password kam az kam 8 characters ka hona chahiye.");
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password aur confirm password match nahi kar rahe.");
      setSubmitting(false);
      return;
    }

    try {
      await sendOtp(email.trim(), name.trim());
      setStep("otp");
      setSuccess("Verification code sent to your email.");
    } catch (otpError) {
      setError(otpError.message ?? "OTP send nahi ho saka.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setSubmitting(true);
    resetMessages();

    try {
      const result = await verifyOtp(
        email.trim(),
        code.trim(),
        name.trim(),
        password,
      );

      if (result.isAdmin) {
        router.replace("/dashboard/admin");
        return;
      }

      window.location.href = "/account/profile";
    } catch (verifyError) {
      setError(verifyError.message ?? "Verification failed.");
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
          <h1 className="text-2xl font-semibold text-slate-900">
            {mode === "login" ? "Admin Sign In" : "Admin Sign Up"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {mode === "login"
              ? "Email aur password se sign in karein. Admin role par dashboard khulega, warna aap ka account page."
              : "Signup par OTP verify hoga. Password account ke liye save ho jayega."}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={[
              "rounded-lg px-3 py-2 text-sm font-semibold transition",
              mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500",
            ].join(" ")}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={[
              "rounded-lg px-3 py-2 text-sm font-semibold transition",
              mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500",
            ].join(" ")}
          >
            Sign up
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={adminInputClassName}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className={adminInputClassName}
              />
            </label>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className={`${adminPrimaryButtonClassName} w-full`}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : step === "form" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Full name</span>
              <input
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ali Khan"
                className={adminInputClassName}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={adminInputClassName}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Kam az kam 8 characters"
                className={adminInputClassName}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Confirm password</span>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Password dubara likhein"
                className={adminInputClassName}
              />
            </label>

            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-600">
              Account banne ke baad aap storefront par sign in honge. Agar aap ka role baad mein{" "}
              <strong>ADMIN</strong> ho jaye to login par seedha admin dashboard khulega.
            </p>

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
              {submitting ? "Sending code..." : "Send verification code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Code sent to <span className="font-medium text-slate-900">{email}</span>
            </p>

            <label className="flex flex-col gap-2">
              <span className={adminLabelClassName}>Verification code</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className={`${adminInputClassName} text-center text-lg tracking-[0.35em]`}
              />
            </label>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting || code.length !== 6}
              className={`${adminPrimaryButtonClassName} w-full`}
            >
              {submitting ? "Verifying..." : "Verify and create account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("form");
                setCode("");
                resetMessages();
              }}
              className={`${adminSecondaryButtonClassName} w-full`}
            >
              Back
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="font-medium text-violet-700 hover:text-violet-800">
            Back to storefront
          </Link>
        </p>
      </div>
    </div>
  );
}
