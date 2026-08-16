"use client";

import { Suspense } from "react";
import { useShiki } from "fumadocs-core/highlight/client";
import type { HighlightOptions } from "fumadocs-core/highlight";

interface CodeBlockProps {
  code: string;
  lang?: string;
  theme?: string;
}

function CodeHighlight({ code, lang, theme }: CodeBlockProps) {
  const result = useShiki(code, {
    lang,
    theme,
  } as HighlightOptions);

  return (
    <div className="custom-code-block [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!overflow-x-auto [&_pre]:!overflow-y-hidden [&_pre]:!max-h-none [&_pre]:![scrollbar-width:none] [&_pre]:[-ms-overflow-style:none] [&_pre]:[&::-webkit-scrollbar]:hidden [&_code]:!text-[13px] [&_code]:!leading-relaxed">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-code-block * {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}} />
      {result}
    </div>
  );
}

export function CodeBlock({ code, lang = "tsx", theme = "github-dark" }: CodeBlockProps) {
  return (
    <Suspense
      fallback={
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code className="text-[#d4d4d4]">{code}</code>
        </pre>
      }
    >
      <CodeHighlight code={code} lang={lang} theme={theme} />
    </Suspense>
  );
}
