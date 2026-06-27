"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { useToast } from "../../context/ToastContext";
import { inputClassName, labelClassName } from "../../lib/ui/formStyles";

function lockBodyScroll() {
  const scrollY = window.scrollY;
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  return scrollY;
}

function unlockBodyScroll(scrollY) {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
}

export default function CheckoutAuthModal({ open, onClose, onSuccess }) {
  const { sendOtp, verifyOtp } = useCustomerAuth();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setStep("email");
      setEmail("");
      setName("");
      setCode("");
      setIsSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const scrollY = lockBodyScroll();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unlockBodyScroll(scrollY);
    };
  }, [open, onClose]);

  async function handleSendOtp(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await sendOtp(email.trim(), name.trim());
      showToast(result.message, "success");
      setStep("otp");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await verifyOtp(email.trim(), code.trim(), name.trim());
      showToast("You are signed in. Continue checkout.", "success");
      onSuccess?.();
      onClose();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-4 pt-[max(1rem,10vh)] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-auth-title"
    >
      <button
        type="button"
        aria-label="Close sign in dialog"
        className="fixed inset-0 cursor-pointer bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-md rounded-[1.75rem] border border-white/[0.08] bg-[#0d0d12] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.75)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          Close
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
          Sign in to checkout
        </p>
        <h2 id="checkout-auth-title" className="mt-3 text-2xl font-semibold text-white">
          Continue with email
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          We will send a 6-digit verification code to your email. No password needed.
        </p>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-5">
            <label className="flex flex-col gap-2.5">
              <span className={labelClassName}>Full name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Ali Khan"
                className={inputClassName}
              />
            </label>

            <label className="flex flex-col gap-2.5">
              <span className={labelClassName}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                className={inputClassName}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,179,71,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending code..." : "Send verification code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
            <p className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
              Code sent to <span className="font-medium text-white">{email}</span>
            </p>

            <label className="flex flex-col gap-2.5">
              <span className={labelClassName}>Verification code</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                required
                placeholder="123456"
                className={`${inputClassName} text-center text-lg tracking-[0.35em]`}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting || code.length !== 6}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#F59E0B] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,179,71,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Verifying..." : "Verify and continue"}
            </button>

            <button
              type="button"
              onClick={() => setStep("email")}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[#FFB347]/35 hover:bg-white/[0.06]"
            >
              Change email
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
