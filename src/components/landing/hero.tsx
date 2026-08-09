"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Check, Globe, LayoutTemplate, Zap, Shield, ChevronDown, Copy, CornerDownLeft } from "lucide-react";

export function Hero() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'b' || e.key === 'Enter') {
        router.push('/docs/getting-started');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <main className="relative w-full overflow-hidden">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pt-24 pb-24 md:pt-32">
        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-6">
          <div className="mx-auto w-full max-w-7xl">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-6 flex w-fit items-center justify-center gap-2.5 rounded-full border border-emerald-500/20 bg-[#052e16]/30 px-4 py-1.5 text-xs sm:text-sm font-medium text-emerald-400 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              <span className="relative flex h-2 w-2 mt-[1px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Open Source • MIT Licensed
            </motion.div>

            {/* Heading area */}
            <div className="relative mb-12 space-y-6 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto max-w-4xl text-[2.75rem] leading-[1.1] font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5rem]"
              >
                Localization UI Components{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(52,211,153,0.2)]">for React.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-6 max-w-3xl text-[1.1rem] leading-relaxed text-neutral-400"
              >
                Open-source, copy-paste React components for internationalization (i18n).
                Build language switchers, locale pickers, and RTL layouts in minutes —
                MIT licensed, community-driven.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link
                  href="/docs/getting-started"
                  className="group flex h-11 items-center justify-center gap-3 rounded-xl bg-[#EDEDED] px-5 font-semibold text-black transition-all hover:bg-white"
                >
                  Get Started
                  <span className="flex size-6 items-center justify-center rounded-md bg-neutral-700/80 text-white transition-colors group-hover:bg-neutral-800">
                    <CornerDownLeft className="size-3.5" />
                  </span>
                </Link>
                <Link
                  href="#components"
                  className="group flex h-11 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#1a1a1a] px-5 font-medium text-white backdrop-blur-md transition-all hover:bg-white/[0.1]"
                >
                  Browse Components
                  <span className="flex size-6 items-center justify-center rounded-md bg-white/10 text-[11px] font-bold text-white/70 transition-colors group-hover:bg-white/20">
                    B
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Code Snippet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mx-auto mt-8 max-w-4xl"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0A] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.05] bg-white/[0.01] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="size-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                      <span className="size-3 rounded-full bg-[#febc2e] border border-[#d89f24]" />
                      <span className="size-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
                    </div>
                    <span className="ml-3 font-mono text-xs text-neutral-500">app.tsx</span>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-400 transition-colors hover:bg-white/10 hover:text-white">
                    <Copy className="size-3" />
                    Copy
                  </button>
                </div>
                <div className="overflow-x-auto p-6">
                  <pre className="font-mono text-[13px] leading-relaxed">
                    <code>
                      <span className="text-[#c678dd]">import</span>
                      <span className="text-[#abb2bf]"> {"{ "}</span>
                      <span className="text-emerald-400">LanguageSwitcher</span>
                      <span className="text-[#abb2bf]">{" } "}</span>
                      <span className="text-[#c678dd]">from</span>
                      <span className="text-[#98c379]"> &apos;@components/babelize/language-switcher&apos;</span>
                      <span className="text-[#abb2bf]">;</span>
                      {"\n\n"}
                      <span className="text-[#c678dd]">export default function</span>
                      <span className="text-[#61afef]"> App</span>
                      <span className="text-[#abb2bf]">() {"{"}</span>
                      {"\n"}
                      <span className="text-[#abb2bf]">{"  "}</span>
                      <span className="text-[#c678dd]">return</span>
                      <span className="text-[#abb2bf]"> (</span>
                      {"\n"}
                      <span className="text-[#abb2bf]">{"    "}&lt;</span>
                      <span className="text-emerald-400">LanguageSwitcher</span>
                      <span className="text-[#abb2bf]"> </span>
                      <span className="text-[#d19a66]">variant</span>
                      <span className="text-[#abb2bf]">={'"'}</span>
                      <span className="text-[#98c379]">dropdown</span>
                      <span className="text-[#abb2bf]">={'"'} /&gt;</span>
                      {"\n"}
                      <span className="text-[#abb2bf]">{"  "});</span>
                      {"\n"}
                      <span className="text-[#abb2bf]">{"}"}</span>
                    </code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </main>
  );
}
