"use client";

import { useState } from "react";
import Reveal from "../ui/Reveal";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-600 focus:border-violet-500/40 focus:bg-black/60 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.12)]";

export default function ContactForm({ className = "" }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Reveal delay={120}>
      <div
        className={`mx-auto w-full overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8 ${className}`}
      >
        <p className="text-[15px] font-semibold uppercase tracking-[0.22em] text-violet-300">
          Send a message
        </p>
        {/* <h2 className="mt-2 text-2xl font-semibold text-white">We&apos;d love to hear from you</h2> */}
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-zinc-400">
          Our team will get back to you as soon as possible.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-6 text-center">
            <p className="text-lg font-semibold text-white">Message sent!</p>
            <p className="mt-2 text-sm text-zinc-400">
              Thank you for reaching out. We will contact you shortly.
            </p>
          </div>
        ) : (
          <form className="mx-auto mt-8 w-full space-y-5 text-left" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2.5">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                  First name
                </span>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="John"
                  className={inputClassName}
                />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                  Last name
                </span>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Doe"
                  className={inputClassName}
                />
              </label>
            </div>

            <label className="flex flex-col gap-2.5">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className={inputClassName}
              />
            </label>

            <label className="flex flex-col gap-2.5">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                Phone number{" "}
                <span className="normal-case tracking-normal text-zinc-600">(optional)</span>
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="+92 300 0000000"
                className={inputClassName}
              />
            </label>

            <label className="flex flex-col gap-2.5">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                Message
              </span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us how we can help..."
                className={`${inputClassName} resize-none`}
              />
            </label>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] px-4 py-3.5 text-sm font-semibold text-white transition-all duration-500 hover:bg-right hover:shadow-[0_0_32px_rgba(139,92,246,0.35)]"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </Reveal>
  );
}
