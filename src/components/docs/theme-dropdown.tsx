"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { themeNames, type ThemeName } from "./themes";

const THEME_ACCENTS: Record<ThemeName, string> = {
  emerald: "#00bd7d",
  ocean: "#38bdf8",
  sunset: "#fb923c",
  midnight: "#818cf8",
  arctic: "#22d3ee",
  rose: "#fb7185",
  forest: "#4ade80",
  phantom: "#a78bfa",
  retro: "#d9a868",
};

interface ThemeDropdownProps {
  value: ThemeName;
  onChange: (t: ThemeName) => void;
}

export function ThemeDropdown({ value, onChange }: ThemeDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111] px-3 py-1.5 text-xs font-medium text-black/60 dark:text-white/60 transition-colors hover:border-black/[0.15] dark:hover:border-white/[0.15] hover:text-black dark:hover:text-white"
      >
        <div
          className="size-2.5 rounded-full"
          style={{ background: THEME_ACCENTS[value] }}
        />
        <span className="capitalize">{value}</span>
        <svg
          className={cn("size-3 transition-transform duration-200", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-[180px] rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161616] shadow-xl py-1.5">
          <div className="px-3 pb-1.5 mb-1.5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-[10px] font-medium uppercase tracking-wider text-black/30 dark:text-white/30">Theme</span>
          </div>
          <div className="px-1.5">
            {themeNames.map((name) => {
              const isActive = name === value;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs capitalize transition-colors",
                    isActive
                      ? "bg-black/[0.04] dark:bg-white/[0.04] text-black dark:text-white font-medium"
                      : "text-black/50 dark:text-white/50 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white"
                  )}
                >
                  <div
                    className="size-2 rounded-full shrink-0"
                    style={{ background: THEME_ACCENTS[name] }}
                  />
                  <span className="flex-1">{name}</span>
                  {isActive && (
                    <svg
                      className="size-3 shrink-0 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export { themeNames };
export type { ThemeName };
