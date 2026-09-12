"use client";

import { useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodePanel } from "./code-panel";

interface PreviewShellProps {
  /** Raw source, used by the copy button. */
  code: string;
  /** Server-highlighted markup for `code`. */
  highlighted: ReactNode;
  /** Skip the centered padding — for components that span the full width, like NavBar. */
  fullBleed?: boolean;
  children: ReactNode;
}

export function PreviewShell({ code, highlighted, fullBleed, children }: PreviewShellProps) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [previewDark, setPreviewDark] = useState(true);

  return (
    <div className="not-prose mt-3 overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <div className="flex items-center gap-0.5 rounded-lg bg-black/5 p-0.5 dark:bg-white/5">
          {(["preview", "code"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                view === v
                  ? "bg-white text-black/80 shadow-sm dark:bg-[#111] dark:text-white/80"
                  : "text-black/40 hover:text-black/60 dark:text-white/40 dark:hover:text-white/60",
              )}
            >
              {v === "preview" ? "Preview" : "Code"}
            </button>
          ))}
        </div>

        {view === "preview" && (
          <button
            type="button"
            onClick={() => setPreviewDark((d) => !d)}
            aria-label={`Preview in ${previewDark ? "light" : "dark"} mode`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-black/5 px-2.5 py-1.5 text-xs font-medium text-black/50 transition-colors hover:bg-black/10 hover:text-black dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {previewDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            {previewDark ? "Light" : "Dark"}
          </button>
        )}
      </div>

      {view === "preview" ? (
        <div
          className={cn(
            "relative overflow-visible border-t border-black/10 transition-colors dark:border-white/10",
            // `light` is what turns the stage back off inside the dark site shell —
            // the absence of `dark` is not enough, see the `@variant` in globals.css.
            previewDark ? "dark" : "light",
            "bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
          )}
        >
          {fullBleed ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center gap-8 px-6 py-16 sm:px-12">
              {children}
            </div>
          )}
        </div>
      ) : (
        <CodePanel code={code} highlighted={highlighted} />
      )}
    </div>
  );
}
