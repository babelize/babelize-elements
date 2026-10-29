"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Check, ChevronDown, Moon, Palette, RotateCcw, Sun } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";
import { cn } from "@/lib/utils";
import { PREVIEW_THEMES, usePreviewPrefs } from "./preview-themes";

const SITE_URL = "https://elements.babelize.co";

interface PreviewCardProps {
  /** Registry item name, used by the "Open in" actions. */
  registryName: string;
  /** Skip the centered padding — for components that span the full width, like NavBar. */
  fullBleed?: boolean;
  /** Additional classes for the stage container. */
  stageClassName?: string;
  children: ReactNode;
}

const TOOL_BUTTON =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring";

function V0Logo() {
  return (
    <svg viewBox="0 0 40 20" aria-hidden="true" className="h-3.5 w-auto" fill="currentColor">
      <path d="M23.39 0h9.53A7 7 0 0 1 39.9 7v9.08H36V7c0-.1 0-.19-.01-.28l-9.53 9.36h9.54v3.7h-9.44a7.08 7.08 0 0 1-7.08-7.03V3.69h3.91v9.06c0 .17.01.35.04.52l9.74-9.57a3.4 3.4 0 0 0-.25-.01h-9.53V0Z" />
      <path d="M13.77 19.1 0 3.69h5.54l8.08 9.04V3.69h4.13v13.88c0 2.1-2.59 3.09-3.98 1.53Z" />
    </svg>
  );
}

function openWith(target: "v0" | "lovable" | "bolt", registryName: string) {
  const itemUrl = `${SITE_URL}/r/${registryName}.json`;
  const prompt = encodeURIComponent(
    `Install the shadcn registry component at ${itemUrl} into a new React + Tailwind project and render its demo. Keep the component source and its classes exactly as published.`,
  );
  const url =
    target === "v0"
      ? `https://v0.dev/chat/api/open?url=${encodeURIComponent(itemUrl)}`
      : target === "lovable"
        ? `https://lovable.dev/?autosubmit=true#prompt=${prompt}`
        : `https://bolt.new/?prompt=${prompt}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function PreviewCard({
  registryName,
  fullBleed,
  stageClassName,
  children,
}: PreviewCardProps) {
  const { theme, dark, setTheme, setDark } = usePreviewPrefs();
  const [replayKey, setReplayKey] = useState(0);
  const [themeOpen, setThemeOpen] = useState(false);
  const [openInOpen, setOpenInOpen] = useState(false);

  return (
    <div className="not-prose overflow-hidden rounded-xl border bg-fd-card">
      <div className="flex items-center justify-between gap-2 border-b px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          <Popover open={themeOpen} onOpenChange={setThemeOpen}>
            <PopoverTrigger className={TOOL_BUTTON} aria-label="Preview theme">
              <Palette className="size-3.5" />
              <span
                aria-hidden="true"
                className="size-3 rounded-full ring-1 ring-black/10 dark:ring-white/20"
                style={{ background: theme.swatch }}
              />
              <span className="hidden sm:inline">{theme.label}</span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-44 p-1">
              {PREVIEW_THEMES.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => {
                    setTheme(t.name);
                    setThemeOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="size-3.5 rounded-full ring-1 ring-black/10 dark:ring-white/20"
                    style={{ background: t.swatch }}
                  />
                  {t.label}
                  {t.name === theme.name && <Check className="ms-auto size-3.5" />}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <button
            type="button"
            onClick={() => setDark(!dark)}
            className={TOOL_BUTTON}
            aria-label={`Preview in ${dark ? "light" : "dark"} mode`}
          >
            {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className={TOOL_BUTTON}
            aria-label="Reset preview"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => openWith("v0", registryName)}
            aria-label="Open in v0"
            className="inline-flex h-7 items-center gap-1.5 rounded-s-md bg-foreground px-2.5 text-xs font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
          >
            <span className="hidden sm:inline">Open in</span>
            <V0Logo />
          </button>
          <Popover open={openInOpen} onOpenChange={setOpenInOpen}>
            <PopoverTrigger
              aria-label="More ways to open"
              className="inline-flex h-7 items-center rounded-e-md border-s border-background/25 bg-foreground px-1.5 text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
            >
              <ChevronDown className="size-3.5" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-1">
              {(
                [
                  ["lovable", "Lovable"],
                  ["bolt", "Bolt"],
                ] as const
              ).map(([target, label]) => (
                <button
                  key={target}
                  type="button"
                  onClick={() => {
                    openWith(target, registryName);
                    setOpenInOpen(false);
                  }}
                  className="flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
                >
                  Open in {label}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* `light` is what turns the stage back off inside the dark site shell —
          the absence of `dark` is not enough, see the `@variant` in globals.css. */}
      <div
        className={cn(
          dark ? "dark" : "light",
          "relative bg-background text-foreground transition-colors",
          "bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_1px)] [background-size:18px_18px]",
        )}
        style={(dark ? theme.dark : theme.light) as CSSProperties}
      >
        <div key={replayKey}>
          {fullBleed ? (
            <div className={cn("min-h-[22rem]", stageClassName)}>{children}</div>
          ) : (
            <div
              className={cn(
                "flex min-h-[420px] flex-col items-center justify-center gap-8 px-4 py-14 sm:px-10",
                stageClassName,
              )}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
