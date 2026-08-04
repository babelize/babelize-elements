import Link from "next/link";
import { Copy, Rocket, GitPullRequest } from "lucide-react";
import { Reveal } from "./reveal";

const steps = [
  {
    icon: Copy,
    step: "01",
    title: "Pick a component",
    description:
      "Browse the docs or the repository, find the component you need, and copy its source into your project.",
  },
  {
    icon: Rocket,
    step: "02",
    title: "Drop it in your app",
    description:
      "Import the component and pass your locale data. Works with next-intl, react-i18next, or your own i18n setup.",
  },
  {
    icon: GitPullRequest,
    step: "03",
    title: "Contribute it back",
    description:
      "Built something the community needs? Open a pull request and get your component merged for everyone.",
  },
];

export function GettingStarted() {
  return (
    <section className="relative border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
              From zero to localized in minutes
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Components are copy-paste by design. No packages to install, no
              config to wire up.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08}>
              <div className="relative flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8">
                <span className="font-mono text-sm text-emerald-500">
                  {step.step}
                </span>
                <div className="mt-4 inline-flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white">
                  <step.icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/docs/getting-started"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-medium text-black transition-all hover:bg-emerald-400 active:scale-[0.98]"
            >
              Read the getting-started guide
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
