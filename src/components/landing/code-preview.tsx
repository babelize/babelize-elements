const code = `import { LanguageSwitcher } from "@/components/elements/language-switcher";

export function Header() {
  return (
    <LanguageSwitcher
      locales={[
        { code: "en", label: "English" },
        { code: "fr", label: "Français" },
        { code: "hi", label: "हिन्दी" },
        { code: "ar", label: "العربية" },
      ]}
      onLocaleChange={(code) => i18n.changeLanguage(code)}
      dir="rtl-ready"
    />
  );
}`;

function highlight(code: string) {
  const tokens: { text: string; className: string }[] = [];
  const regex =
    /(\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:import|from|export|function|return|const)\b)|(#\w+)/g;
  let last = 0;
  for (const match of code.matchAll(regex)) {
    const idx = match.index ?? 0;
    if (idx > last) tokens.push({ text: code.slice(last, idx), className: "" });
    const [full, comment, str, kw] = match;
    if (comment) tokens.push({ text: full, className: "text-emerald-600/80 italic" });
    else if (str) tokens.push({ text: full, className: "text-emerald-300" });
    else if (kw) tokens.push({ text: full, className: "text-white font-medium" });
    else tokens.push({ text: full, className: "text-white" });
    last = idx + full.length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), className: "" });
  return tokens;
}

export function CodePreview() {
  return (
    <div className="relative w-full">
      <div className="absolute -inset-10 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_50%,rgba(0,189,125,0.14),rgba(0,0,0,0)_70%)] blur-2xl" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-white/40">
            language-switcher.tsx
          </span>
        </div>
        <pre className="overflow-x-auto p-5 text-left font-mono text-[13px] leading-relaxed text-white/70">
          <code>
            {highlight(code).map((token, i) =>
              token.className ? (
                <span key={i} className={token.className}>
                  {token.text}
                </span>
              ) : (
                <span key={i}>{token.text}</span>
              ),
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
