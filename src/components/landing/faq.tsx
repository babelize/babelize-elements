"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I install Babelize Elements?",
    answer:
      "Install via npm: `npm install @babelize/elements`. Works with Next.js, Remix, and any React app. Import components directly from the package.",
  },
  {
    question: "Can I customize the language switcher and locale picker components?",
    answer:
      "Absolutely. Since you own the code, every component is fully customizable with Tailwind CSS classes and props. Change colors, spacing, animations, and behavior however you like. No design constraints.",
  },
  {
    question: "Are these React i18n components production-ready?",
    answer:
      "Every merged component is reviewed by maintainers and follows our accessibility, TypeScript, and localization checklist before it's documented. They're used in production apps worldwide.",
  },
  {
    question: "Is Babelize Elements really free and open source?",
    answer:
      "Yes — MIT-licensed and free forever. The code lives on GitHub, contributions are welcome, and you can use the components in any project, commercial or not. No attribution required.",
  },
  {
    question: "Which internationalization (i18n) libraries are supported?",
    answer:
      "Babelize Elements works with every major i18n library: next-intl, react-i18next, react-intl, LinguiJS, FormatJS, and more. The components are library-agnostic — pass your own locale state and callbacks.",
  },
  {
    question: "How do I contribute a component to Babelize Elements?",
    answer:
      "Browse the open issues on GitHub, build the component following the contribution guide, and open a pull request. Maintainers review and merge it, and it ships to the docs for everyone.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:gap-16">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <Reveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                </span>
                Support
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Frequently asked{" "}
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                  questions
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/50">
                Everything you need to know about using Babelize Elements in your React projects.
                Can&apos;t find what you&apos;re looking for? Check out our GitHub discussions.
              </p>
            </Reveal>
          </div>

          {/* Accordion */}
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <Reveal key={faq.question} delay={i * 0.1}>
                  <div
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border transition-colors duration-300",
                      isOpen
                        ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                        : "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03]"
                    )}
                  >
                    <button
                      className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span
                        className={cn(
                          "text-base font-medium transition-colors duration-300",
                          isOpen ? "text-emerald-400" : "text-white group-hover:text-white/80"
                        )}
                      >
                        {faq.question}
                      </span>
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                          isOpen
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rotate-45"
                            : "border-white/[0.08] bg-white/[0.02] text-white/50 group-hover:bg-white/[0.06] group-hover:text-white"
                        )}
                      >
                        <Plus size={16} />
                      </div>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 text-sm leading-relaxed text-white/50">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
