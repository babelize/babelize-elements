"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewComponentsProps {
  registryName: string;
  children: React.ReactNode;
}

export function PreviewComponents({ registryName, children }: PreviewComponentsProps) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [source, setSource] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (view !== "code" || source) return;
    fetch(`/r/${registryName}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((item) => {
        setSource(
          item?.files?.[0]?.content ??
            `// No source available for "${registryName}".`,
        );
      })
      .catch(() => setSource(`// Could not load source for "${registryName}".`));
  }, [view, registryName, source]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = source;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <div className="flex items-center gap-0.5 rounded-lg bg-black/5 dark:bg-white/5 p-0.5">
          {(["preview", "code"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                view === v
                  ? "bg-white dark:bg-[#111] text-black/80 dark:text-white/80 shadow-sm"
                  : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60",
              )}
            >
              {v === "preview" ? "Preview" : "Code"}
            </button>
          ))}
        </div>

        {view === "code" && (
          <button
            type="button"
            onClick={copy}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1.5 text-xs font-medium transition-colors",
              copied
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-black/50 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white",
            )}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy code"}
          </button>
        )}
      </div>

      {view === "preview" ? (
        <div>{children}</div>
      ) : (
        <div className="overflow-hidden bg-[#0A0A0A] p-4">
          <p className="mb-2 font-mono text-xs text-white/40">{registryName}.tsx</p>
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-white/70">
            <code>{source || "Loading source..."}</code>
          </pre>
        </div>
      )}
    </div>
  );
}