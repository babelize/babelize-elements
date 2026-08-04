import {
  Languages,
  ListFilter,
  MessageSquare,
  Type,
  Calendar,
  Rows3,
  BadgeDollarSign,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { Reveal } from "./reveal";

const componentGroups = [
  {
    icon: Languages,
    title: "Language Switcher",
    description: "Dropdown & pill switchers with native-name locales and RTL detection.",
  },
  {
    icon: ListFilter,
    title: "Locale Picker",
    description: "Searchable locale pickers for regions, currencies, and date formats.",
  },
  {
    icon: MessageSquare,
    title: "Translation Widget",
    description: "Inline translation editor and string-management UI for your app.",
  },
  {
    icon: Type,
    title: "RTL-aware Layout",
    description: "Direction-aware navs, drawers, and layout primitives for RTL languages.",
  },
  {
    icon: Calendar,
    title: "Localized Date & Time",
    description: "Locale-aware date pickers and relative-time displays with pluralization.",
  },
  {
    icon: Rows3,
    title: "Plural Forms",
    description: "Pluralization helpers and UI for CLDR plural rules across 200+ locales.",
  },
  {
    icon: BadgeDollarSign,
    title: "Currency Input",
    description: "Locale-aware money inputs with formatting, symbols, and grouping.",
  },
  {
    icon: ImageIcon,
    title: "Localized Media",
    description: "Responsive media and asset components with alt-text localization.",
  },
];

export function Components() {
  return (
    <section
      id="components"
      className="relative border-t border-white/[0.06] py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
              The localization toolbox, growing every week
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-white/60">
              Components ship as the community builds them. Each card below is an
              open issue waiting for its first contributor.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {componentGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.06}>
              <a
                href="https://github.com/babelize/babelize-elements/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/70 transition-colors group-hover:border-emerald-500/20 group-hover:bg-emerald-500/10 group-hover:text-emerald-400">
                    <group.icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-white/50">
                    <span className="size-1.5 rounded-full bg-amber-400" />
                    Open issue
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">
                  {group.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                  {group.description}
                </p>
                <span className="mt-4 text-xs font-medium text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Claim this component →
                </span>
              </a>
            </Reveal>
          ))}

          <Reveal delay={componentGroups.length * 0.06}>
            <a
              href="https://github.com/babelize/babelize-elements/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full min-h-[190px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/[0.12] p-6 text-center transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/[0.04]"
            >
              <div className="inline-flex size-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Plus size={18} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-white">
                Propose a component
              </span>
              <span className="text-xs text-white/50">
                Have an idea for a localized UI? Open an issue.
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
