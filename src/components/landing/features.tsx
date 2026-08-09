"use client";

import { motion } from "motion/react";
import { Globe, Flag, ArrowLeftRight, Braces, Box, Puzzle, Users, Shield, Copy, ChevronDown, CheckCircle2 } from "lucide-react";
import { Reveal } from "./reveal";

const FEATURES = [
  {
    title: "Language Switchers",
    description: "Drop-in switchers with dropdowns, pills, flags, and full RTL support.",
    icon: Globe,
    gradient: "from-emerald-500/20 to-transparent",
    iconColor: "text-emerald-400",
  },
  {
    title: "Locale Pickers",
    description: "Searchable locale pickers with native names and flags.",
    icon: Flag,
    gradient: "from-blue-500/20 to-transparent",
    iconColor: "text-blue-400",
  },
  {
    title: "RTL Layout Support",
    description: "Automatic RTL detection and layout direction handling.",
    icon: ArrowLeftRight,
    gradient: "from-purple-500/20 to-transparent",
    iconColor: "text-purple-400",
  },
  {
    title: "i18n Integration",
    description: "Works with react-intl, next-intl, i18next, LinguiJS, and more.",
    icon: Braces,
    gradient: "from-yellow-500/20 to-transparent",
    iconColor: "text-yellow-400",
  },
];

export function Features() {
  return (
    <section className="relative w-full overflow-hidden py-32 font-sans selection:bg-emerald-500/30">
      <div className="container relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        
        {/* Hero-style Header */}
        <div className="mx-auto mb-24 flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-emerald-400 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5 mt-[1px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              Powerful by default
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mb-6 text-balance text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
              <span className="text-white">
                Everything you need{" "}
              </span>
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                to localize.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-lg text-white/50">
              Built for modern React apps. Copy, paste, and ship globally.
            </p>
          </Reveal>
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20 items-center">
          
          {/* Left: Bento Grid */}
          <Reveal delay={0.3}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FEATURES.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/[0.05] bg-white/[0.01] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all hover:bg-white/[0.03]"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
                      <feature.icon className={`size-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-white tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right: Hyper-modern IDE */}
          <Reveal delay={0.4} className="relative w-full">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_40px_100px_rgba(0,0,0,0.5)]">
              
              {/* macOS Top Bar */}
              <div className="flex h-12 items-center justify-between border-b border-white/[0.05] bg-white/[0.01] px-5">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-white/20" />
                  <div className="size-3 rounded-full bg-white/20" />
                  <div className="size-3 rounded-full bg-white/20" />
                  <span className="ml-4 font-mono text-xs font-medium text-neutral-500">app.tsx</span>
                </div>
                <button className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/[0.05] hover:text-white">
                  <Copy className="size-3.5" />
                  Copy
                </button>
              </div>

              {/* Code Area */}
              <div className="p-8">
                <pre className="font-mono text-sm leading-[1.8]">
                  <code>
                    <span className="text-neutral-600 mr-6 select-none">1</span>
                    <span className="text-[#ff7b72]">import</span>
                    <span className="text-[#c9d1d9]"> {"{ "}</span>
                    <span className="text-[#34d399]">LanguageSwitcher</span>
                    <span className="text-[#c9d1d9]">{" } "}</span>
                    <span className="text-[#ff7b72]">from</span>
                    <span className="text-[#a5d6ff]"> &quot;@babelize/elements&quot;</span>
                    <span className="text-[#c9d1d9]">;</span>
                    {"\n"}
                    <span className="text-neutral-600 mr-6 select-none">2</span>
                    {"\n"}
                    <span className="text-neutral-600 mr-6 select-none">3</span>
                    <span className="text-[#ff7b72]">export default function</span>
                    <span className="text-[#d2a8ff]"> App</span>
                    <span className="text-[#c9d1d9]">() {"{"}</span>
                    {"\n"}
                    <span className="text-neutral-600 mr-6 select-none">4</span>
                    <span className="text-[#c9d1d9]">  </span>
                    <span className="text-[#ff7b72]">return</span>
                    <span className="text-[#c9d1d9]"> (</span>
                    {"\n"}
                    <span className="text-neutral-600 mr-6 select-none">5</span>
                    <span className="text-[#c9d1d9]">    &lt;</span>
                    <span className="text-[#7ee787]">div</span>
                    <span className="text-[#c9d1d9]">&gt;</span>
                    {"\n"}
                    <span className="text-neutral-600 mr-6 select-none">6</span>
                    <span className="text-[#c9d1d9]">      &lt;</span>
                    <span className="text-[#34d399]">LanguageSwitcher</span>
                    <span className="text-[#c9d1d9]"> /&gt;</span>
                    {"\n"}
                    <span className="text-neutral-600 mr-6 select-none">7</span>
                    <span className="text-[#c9d1d9]">    &lt;/</span>
                    <span className="text-[#7ee787]">div</span>
                    <span className="text-[#c9d1d9]">&gt;</span>
                    {"\n"}
                    <span className="text-neutral-600 mr-6 select-none">8</span>
                    <span className="text-[#c9d1d9]">  );</span>
                    {"\n"}
                    <span className="text-neutral-600 mr-6 select-none">9</span>
                    <span className="text-[#c9d1d9]">{"}"}</span>
                  </code>
                </pre>
              </div>

            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
