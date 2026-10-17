"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, CornerDownLeft } from "lucide-react";
import { GitHubCounter, RotatingGitHubCounter } from "./github-counter";
import type { GitHubStats } from "@/lib/github";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Components", href: "#components" },
  { label: "Getting Started", href: "/docs/getting-started" },
  { label: "Contribute", href: "/docs/getting-started/contributing" },
];

export interface NavbarProps {
  stats?: GitHubStats;
  starsCount?: number | null;
}

export function Navbar({ stats, starsCount }: NavbarProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const resolvedStats = stats ?? (starsCount !== undefined ? { stars: starsCount } : undefined);
  const resolvedStarsCount = stats?.stars ?? starsCount;

  return (
    <nav className="fixed right-0 left-0 z-50 mx-auto flex max-w-7xl justify-center top-2 px-6 py-4 transition-all duration-300">
      <div className="w-full">
        <div className="flex w-full items-center justify-between rounded-full border border-white/[0.08] bg-[#050505]/70 px-2 py-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl transition-all duration-300 sm:px-4 sm:py-3 md:px-5">
          {/* Logo */}
          <Link href="/" className="cursor-pointer">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              <Image
                src="/elements_logo.svg"
                alt="Babelize Elements"
                width={112}
                height={21}
                className="h-6 w-auto sm:h-7"
                style={{ objectFit: "contain" }}
                priority
                loading="eager"
              />
            </div>
          </Link>

          {/* Center Links removed as requested */}

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* GitHub counter - desktop (cycles stars → forks → PRs) */}
            <div className="hidden sm:block">
              <RotatingGitHubCounter stats={resolvedStats} />
            </div>

            {/* Get Started button */}
            <Link
              href="/docs/getting-started"
              className="group relative isolate hidden h-9 items-center justify-center overflow-hidden rounded-full bg-emerald-500 px-4 text-left text-sm font-medium text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] sm:inline-flex sm:h-10 sm:px-5"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Get Started</span>
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-950/20 p-1 transition-all duration-200 ease-in-out group-hover:shadow-xl sm:size-7">
                  <CornerDownLeft
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="inline-flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/5 lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mx-auto mt-2 max-w-7xl rounded-2xl border border-white/[0.08] bg-[#050505]/90 p-2 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1 flex justify-center">
              <GitHubCounter
                metric="stars"
                count={resolvedStarsCount}
                className="w-full justify-center py-2.5 h-auto text-center"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
