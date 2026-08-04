"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, CornerDownLeft } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Components", href: "#components" },
  { label: "Getting Started", href: "/docs/getting-started" },
  { label: "Contribute", href: "/docs/contributing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
              />
            </div>
          </Link>

          {/* Center Links removed as requested */}

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* GitHub button - desktop */}
            <div className="hidden sm:block">
              <a
                href="https://github.com/babelize/babelize-elements"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/[0.1] text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            </div>

            {/* GitHub button - mobile */}
            <div className="sm:hidden">
              <a
                href="https://github.com/babelize/babelize-elements"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-full border border-white/[0.1] text-white/80 transition-colors hover:bg-white/5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            </div>

            {/* Get Started button */}
            <Link
              href="/docs/getting-started"
              className="group relative isolate inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-emerald-500 px-4 text-left text-sm font-medium text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] sm:h-10 sm:px-5"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Get Started</span>
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-950/20 p-1 transition-all duration-200 ease-in-out group-hover:shadow-xl sm:size-7">
                  <CornerDownLeft size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
            <a
              href="https://github.com/babelize/babelize-elements"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 rounded-xl border border-white/[0.1] px-4 py-2.5 text-center text-sm text-white/80"
            >
              Star on GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
