import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./reveal";

export function Contribute() {
  const t = useTranslations();
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] md:p-16">
            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                <Sparkles size={14} />
                {t("contribute.contribute")}
              </div>
              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl">
                {t.rich("contribute.builtByTheCommunityFor", {
                  span: (chunks) => <span className="text-emerald-400">{chunks}</span>,
                })}
              </h2>
              <p className="mt-4 text-lg text-white/60">
                {t("contribute.joinTheBabelizeElementsOpenSource")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/docs/getting-started/contributing"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-medium text-black transition-all hover:bg-emerald-400 active:scale-[0.98]"
                >
                  {t("contribute.readTheContributionGuide")}
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://github.com/babelize/babelize-elements/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.12] px-6 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {t("contribute.browseOpenIssues")}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
