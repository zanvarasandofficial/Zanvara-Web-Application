"use client";

import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { submitContactMessage } from "../../lib/api/inbound";
import { inputClassName, labelClassName, primaryBtnClass } from "../../lib/ui/theme";
import Reveal from "../ui/Reveal";

const embeddedInputClassName =
  "w-full rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[#6B6B6B] focus:border-[#FFB347]/40 focus:shadow-[0_0_0_4px_rgba(255,179,71,0.1)]";

export default function ContactForm({ className = "", embedded = false }) {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const fieldClass = embedded ? embeddedInputClassName : inputClassName;

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    const formData = new FormData(event.currentTarget);

    try {
      await submitContactMessage({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone") || undefined,
        message: formData.get("message"),
      });

      setSubmitted(true);
      showToast("Message sent successfully.");
    } catch (submitError) {
      showToast(submitError.message ?? "Could not send message.", "error");
    } finally {
      setSaving(false);
    }
  }

  const formBody = submitted ? (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-6 py-10 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path
            d="M5 12L10 17L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p className="mt-5 text-xl font-semibold text-white">Message sent!</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-[#A3A3A3]">
        Thank you for reaching out. We will contact you shortly.
      </p>
    </div>
  ) : (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClassName}>First name</span>
          <input
            type="text"
            name="firstName"
            required
            placeholder="John"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClassName}>Last name</span>
          <input
            type="text"
            name="lastName"
            required
            placeholder="Doe"
            className={fieldClass}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClassName}>Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClassName}>
            Phone{" "}
            <span className="normal-case tracking-normal text-[#6B6B6B]">(optional)</span>
          </span>
          <input
            type="tel"
            name="phone"
            placeholder="+92 300 0000000"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClassName}>Message</span>
        <textarea
          name="message"
          required
          rows={embedded ? 6 : 7}
          placeholder="Tell us how we can help..."
          className={`${fieldClass} resize-none`}
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className={`${primaryBtnClass} w-full rounded-xl py-3.5`}
      >
        {saving ? "Sending..." : "Send Message"}
      </button>
    </form>
  );

  if (embedded) {
    return (
      <div className={className}>
        <div className="mb-8 border-b border-[#2A2A2A] pb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B]">
            Write to us
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-[1.65rem]">
            Send a message
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-7 text-[#A3A3A3]">
            Fill in the form and our team will reply as soon as possible.
          </p>
        </div>
        {formBody}
      </div>
    );
  }

  return (
    <Reveal delay={120}>
      <div
        className={`w-full overflow-hidden rounded-[1.75rem] border border-[#2A2A2A] bg-[#1A1A1A] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-9 lg:p-10 ${className}`}
      >
        <p className="text-[15px] font-semibold uppercase tracking-[0.22em] text-[#FFD9A6]">
          Send a message
        </p>
        <p className="mt-2 max-w-xl text-sm leading-7 text-[#A3A3A3]">
          Our team will get back to you as soon as possible.
        </p>
        <div className="mt-8">{formBody}</div>
      </div>
    </Reveal>
  );
}
