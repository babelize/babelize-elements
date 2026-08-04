import { Copy, Globe2, Accessibility } from "lucide-react";
import { Reveal } from "./reveal";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const features = [
  {
    icon: Copy,
    title: "Copy & Paste",
    description:
      "No installs, no lock-in. Copy the code into your project and ship — full source control, always.",
  },
  {
    icon: Globe2,
    title: "Localization-first",
    description:
      "Pluralization, RTL, and locale data built into every component. Localized by default, not as an afterthought.",
  },
  {
    icon: Accessibility,
    title: "Accessible",
    description:
      "Keyboard support, ARIA labels, and WCAG-aware markup. Localized UIs that work for everyone.",
  },
  {
    icon: GithubIcon,
    title: "Community-built",
    description:
      "MIT-licensed and free forever. Components are built by contributors and reviewed by maintainers.",
  },
];

export function Features() {
  return (
    <section className="relative border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Every localized app needs these. Build them once, share them forever.
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Babelize Elements turns the repetitive work of building localized
              interfaces into a shared, open-source toolbox.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <div className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.04]">
                <div className="inline-flex size-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <feature.icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
