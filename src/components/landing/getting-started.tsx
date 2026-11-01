"use client";
import { useTranslations } from "next-intl";

import Link from "next/link";
import { ArrowDown, ArrowRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const benefits = [
  {
    number: "01",
    title: "Build faster",
    statement: "Stop rebuilding localization UI.",
    description:
      "Use ready-made components instead of repeatedly creating language selectors, locale controls, editing interfaces, and RTL behavior from scratch.",
    href: "/docs/getting-started",
  },
  {
    number: "02",
    title: "Stay consistent",
    statement: "One localization experience across your app.",
    description:
      "Keep language switching and localization interactions visually consistent instead of maintaining different implementations throughout the product.",
    href: "/docs/getting-started",
  },
  {
    number: "03",
    title: "Ship globally",
    statement: "Languages, locales, and RTL — handled.",
    description:
      "Build interfaces that are ready for users across different languages and writing directions without creating separate UI systems.",
    href: "/docs/getting-started",
  },
];

const benefitsTitleKeys: Record<string, string> = {
  "Build faster": "getting-started.buildFaster",
  "Stay consistent": "getting-started.stayConsistent",
  "Ship globally": "getting-started.shipGlobally",
};

const benefitsStatementKeys: Record<string, string> = {
  "Stop rebuilding localization UI.": "getting-started.stopRebuildingLocalizationUi",
  "One localization experience across your app.":
    "getting-started.oneLocalizationExperienceAcrossYour",
  "Languages, locales, and RTL — handled.": "getting-started.languagesLocalesAndRtl",
};

const benefitsDescriptionKeys: Record<string, string> = {
  "Use ready-made components instead of repeatedly creating language selectors, locale controls, editing interfaces, and RTL behavior from scratch.":
    "getting-started.useReadyMadeComponentsInsteadOf",
  "Keep language switching and localization interactions visually consistent instead of maintaining different implementations throughout the product.":
    "getting-started.keepLanguageSwitchingAndLocalization",
  "Build interfaces that are ready for users across different languages and writing directions without creating separate UI systems.":
    "getting-started.buildInterfacesThatAreReady",
};

/* ── Subtle hover demonstrations ── */

function BuildFasterMicro() {
  const t = useTranslations();
  return (
    <div className="mt-6 flex min-h-[96px] flex-col justify-center">
      <div className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2 transition-opacity duration-300 group-hover:opacity-40">
        <span className="text-xs text-white/50 line-through decoration-white/30">
          {t("getting-started.buildFromScratch")}
        </span>
        <X className="size-3.5 shrink-0 text-white/30" />
      </div>
      <div className="flex justify-center py-1">
        <ArrowDown className="size-3 text-white/25" />
      </div>
      <div className="flex items-center justify-between gap-3 rounded-md border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2">
        <span className="text-xs text-white/80">{t("getting-started.useBabelize")}</span>
        <Check className="size-3.5 shrink-0 text-emerald-400" />
      </div>
    </div>
  );
}

function StayConsistentMicro() {
  const t = useTranslations();
  return (
    <div className="mt-6 flex min-h-[96px] flex-col items-center justify-center gap-2">
      <div className="flex items-end gap-1.5">
        <span className="-translate-y-1 rounded-md bg-white/[0.03] px-2 py-1 text-[10px] text-white/50 transition-transform duration-300 group-hover:translate-y-0">
          {t("getting-started.dropdown")}
        </span>
        <span className="rounded-md bg-white/[0.03] px-2 py-1 text-[10px] text-white/50">
          {t("getting-started.pill")}
        </span>
        <span className="translate-y-1 rounded-md bg-white/[0.03] px-2 py-1 text-[10px] text-white/50 transition-transform duration-300 group-hover:translate-y-0">
          {t("getting-started.segmented")}
        </span>
      </div>
      <ArrowDown className="size-3 text-white/25" />
      <span className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.06] px-2.5 py-1 text-[10px] font-medium text-emerald-300">
        {t("getting-started.oneLanguageswitcher")}
      </span>
    </div>
  );
}

function ShipGloballyMicro() {
  const t = useTranslations();
  return (
    <div className="mt-6 flex min-h-[96px] items-center justify-center">
      <div className="flex items-center gap-1.5 text-xs font-medium text-white/60">
        <span>{t("getting-started.en")}</span>
        <ArrowRight className="size-3 text-white/25" />
        <span>{t("getting-started.fr")}</span>
        <ArrowRight className="size-3 text-white/25" />
        <span>{t("getting-started.de")}</span>
        <ArrowRight className="size-3 text-white/25" />
        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-emerald-300 transition-shadow duration-300 group-hover:shadow-[0_0_16px_rgba(16,185,129,0.35)]">
          {t("getting-started.ar")}
        </span>
      </div>
      <span className="ml-3 text-[10px] text-white/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {t("getting-started.rtl")}
      </span>
    </div>
  );
}

const micros = [BuildFasterMicro, StayConsistentMicro, ShipGloballyMicro];

export function GettingStarted() {
  const t = useTranslations();
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Statement */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              {t("getting-started.whyBabelize")}
            </div>
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              {t.rich("getting-started.localizationShouldntSlowDownYour", {
                span: (chunks) => (
                  <span className="bg-gradient-to-r from-emerald-300 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                    {chunks}
                  </span>
                ),
              })}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/50">
              {t("getting-started.skipTheRepetitiveWorkOf")}
            </p>
          </div>
        </Reveal>

        {/* Benefits — one cohesive composition */}
        <div className="mt-16 grid grid-cols-1 md:mt-20 lg:grid-cols-3">
          {benefits.map((benefit, i) => {
            const Micro = micros[i];
            return (
              <Reveal key={benefit.number} delay={i * 0.1} className="h-full">
                <div
                  className={cn(
                    "group flex h-full flex-col py-10 lg:px-10 lg:py-0",
                    i === 0 && "lg:pl-0",
                    i === benefits.length - 1 && "lg:pr-0",
                    i > 0 && "border-t border-white/[0.06] lg:border-l lg:border-t-0",
                  )}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-emerald-400">{benefit.number}</span>
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {t(benefitsTitleKeys[benefit.title] ?? benefit.title)}
                    </h3>
                  </div>

                  <p className="mt-4 text-lg font-medium leading-snug text-white/90">
                    {t(benefitsStatementKeys[benefit.statement] ?? benefit.statement)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {t(benefitsDescriptionKeys[benefit.description] ?? benefit.description)}
                  </p>

                  <Micro />

                  <Link
                    href={benefit.href}
                    className="mt-auto inline-flex items-center gap-1.5 pt-6 text-xs font-medium text-white/40 transition-colors duration-300 group-hover:text-emerald-300"
                  >
                    {t("getting-started.explore")}
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
