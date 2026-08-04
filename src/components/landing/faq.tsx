"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Do I need to install anything?",
    answer:
      "No. Babelize Elements components are copy-paste by design. Copy the source into your project and use it — no registry, no runtime dependency, no lock-in.",
  },
  {
    question: "Can I customize the components?",
    answer:
      "Absolutely. Since you own the code, every component is fully customizable with Tailwind classes and props. Change colors, spacing, and behavior however you like.",
  },
  {
    question: "Are the components production-ready?",
    answer:
      "Every merged component is reviewed by maintainers and follows our accessibility, TypeScript, and localization checklist before it's documented on this site.",
  },
  {
    question: "Is this library really open source?",
    answer:
      "Yes — MIT-licensed and free forever. The code lives on GitHub, contributions are welcome, and you can use the components in any project, commercial or not.",
  },
  {
    question: "How do I contribute a component?",
    answer:
      "Browse the open issues on GitHub, build the component following the contribution guide, and open a pull request. Maintainers review and merge it, and it ships to the docs.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Got questions? We&apos;ve got answers.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={faq.question} delay={i * 0.04}>
                <button
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium text-white">
                    {faq.question}
                  </span>
                  <Plus
                    size={18}
                    className={cn(
                      "shrink-0 text-white/40 transition-transform duration-300",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen
                      ? "grid-rows-[1fr] pb-5 opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed text-white/60">
                      {faq.answer}
                    </p>
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
