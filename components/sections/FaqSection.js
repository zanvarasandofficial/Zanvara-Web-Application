"use client";

import { useState } from "react";
import { faqItems } from "../../lib/data/faqs";
import { useStorePolicy } from "../../context/StorePolicyContext";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

export default function FaqSection() {
  const [openId, setOpenId] = useState(faqItems[0]?.id ?? null);
  const { faqDelivery } = useStorePolicy();

  return (
    <section className="relative overflow-hidden border-t border-[#2A2A2A] bg-[#111111] py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFB347]/30 to-transparent"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Support"
            title="Frequently Asked Questions"
            subtitle="Quick answers about shopping, delivery, device setup, and returns on Zanvara."
            align="center"
          />
        </Reveal>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openId === item.id;
            const answerText =
              item.answerKey === "delivery" ? faqDelivery : item.answer;

            return (
              <Reveal key={item.id} delay={index * 60}>
                <div
                  className={[
                    "overflow-hidden rounded-2xl border transition-all duration-300",
                    isOpen
                      ? "border-[#FFB347]/35 bg-[#1A1A1A] shadow-[0_0_30px_rgba(255,179,71,0.1)]"
                      : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#FFB347]/20",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-white sm:text-lg">
                      {item.question}
                    </span>
                    <span
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                        isOpen
                          ? "rotate-180 border-[#FFB347]/35 bg-[#FFB347]/10 text-[#FFD9A6]"
                          : "border-[#2A2A2A] bg-[#111111] text-[#A3A3A3]",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={[
                      "grid transition-all duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      {item.steps?.length ? (
                        <ol className="list-decimal space-y-2.5 px-5 pb-5 pl-10 text-sm leading-7 text-[#A3A3A3] sm:px-6 sm:pl-11 sm:text-base">
                          {item.steps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ol>
                      ) : (
                        <p className="px-5 pb-5 text-sm leading-7 text-[#A3A3A3] sm:px-6 sm:text-base">
                          {answerText}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
