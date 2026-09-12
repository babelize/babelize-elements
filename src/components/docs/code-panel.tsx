"use client";

import { useState, type ReactNode } from "react";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodePanelProps {
  /** Shown in the file bar. Omit to drop the bar and float the copy button instead. */
  fileName?: string;
  /** Raw source, used by the copy button and the line count. */
  code: string;
  /** Server-highlighted markup for `code`. */
  highlighted: ReactNode;
  /** Rounded + bordered on its own, for use outside the preview shell. */
  standalone?: boolean;
  className?: string;
}

/*
 * Keep these in step with the type in `.custom-code-block` (globals.css): 13px at
 * line-height 1.5 is 19.5px per line, and the panel adds `py-3` top and bottom.
 * A snippet that would clip must be expandable, or it scrolls with no affordance.
 */
const LINE_HEIGHT_PX = 19.5;
const VERTICAL_PADDING_PX = 24;
const COLLAPSED_HEIGHT_PX = 352; // 22rem
const COLLAPSED_HEIGHT = `${COLLAPSED_HEIGHT_PX}px`;
const VISIBLE_LINES = Math.floor((COLLAPSED_HEIGHT_PX - VERTICAL_PADDING_PX) / LINE_HEIGHT_PX);

function CopyButton({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy code"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-medium backdrop-blur transition-colors",
        copied
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-black/10 bg-black/5 text-black/50 hover:bg-black/10 hover:text-black dark:border-white/10 dark:bg-white/10 dark:text-white/50 dark:hover:bg-white/15 dark:hover:text-white",
      )}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function CodePanel({
  fileName,
  code,
  highlighted,
  standalone = false,
  className,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lineCount = code.trimEnd().split("\n").length;
  const expandable = lineCount > VISIBLE_LINES;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "not-prose bg-[#FAFAFA] dark:bg-[#0A0A0A]",
        standalone
          ? "mt-3 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
          : "border-t border-black/10 dark:border-white/10",
        className,
      )}
    >
      {fileName && (
        <div className="flex items-center gap-2 border-b border-black/5 px-4 py-2 dark:border-white/5">
          <span className="size-2.5 rounded-full bg-black/10 dark:bg-white/15" />
          <span className="size-2.5 rounded-full bg-black/10 dark:bg-white/15" />
          <span className="size-2.5 rounded-full bg-black/10 dark:bg-white/15" />
          <span className="ml-2 font-mono text-[11px] tracking-tight text-black/40 dark:text-white/40">
            {fileName}
          </span>
          <span className="ml-auto font-mono text-[11px] text-black/30 dark:text-white/30">
            {lineCount} lines
          </span>
          <CopyButton copied={copied} onCopy={copy} />
        </div>
      )}

      <div className="relative">
        {!fileName && (
          <div className="absolute right-3 top-3 z-10">
            <CopyButton copied={copied} onCopy={copy} />
          </div>
        )}

        <div
          className="code-scroll px-4 py-3"
          style={{ maxHeight: expanded ? "72vh" : COLLAPSED_HEIGHT }}
        >
          <div className="custom-code-block">{highlighted}</div>
        </div>

        {expandable && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAFAFA] to-transparent dark:from-[#0A0A0A]" />
        )}
      </div>

      {expandable && (
        <div className="flex justify-center border-t border-black/5 px-4 py-2 dark:border-white/5">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
          >
            {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            {expanded ? "Collapse" : "Expand code"}
          </button>
        </div>
      )}
    </div>
  );
}
