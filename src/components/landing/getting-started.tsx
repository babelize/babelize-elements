import Link from "next/link";
import { Reveal } from "./reveal";

const steps = [
  {
    step: "01",
    title: "Pick a component",
    description:
      "Browse the docs or the GitHub repo, find the i18n component you need — language switcher, locale picker, or RTL layout — and copy its source.",
    code: `import { LanguageSwitcher } from "@/components/babelize/language-switcher"

export default function App() {
  return (
    <LanguageSwitcher
      locale="en"
      onLocaleChange={setLocale}
    />
  )
}`,
    gradient: "from-emerald-500/8 via-transparent to-transparent",
  },
  {
    step: "02",
    title: "Drop it in your app",
    description:
      "Import the React component and pass your locale data. Works with next-intl, react-i18next, react-intl, or your own i18n setup.",
    code: `<LanguageSwitcher
  locale={locale}
  onLocaleChange={(newLocale) => {
    router.push(\`/\${newLocale}\`)
    setLocale(newLocale)
  }}
  variants={["pill", "dropdown", "segmented"]}
/>`,
    gradient: "from-blue-500/8 via-transparent to-transparent",
  },
  {
    step: "03",
    title: "Contribute it back",
    description:
      "Built something the community needs? Open a pull request and get your component merged for everyone.",
    code: `# Fork, branch, and submit
git checkout -b feat/my-new-component
git commit -m "feat: add DateRangePicker"
git push origin feat/my-new-component
# Open a PR on GitHub`,
    gradient: "from-purple-500/8 via-transparent to-transparent",
  },
];

export function GettingStarted() {
  return (
    <section className="relative border-t border-white/[0.06] py-24">
      {/* Dot field background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
              From zero to <span className="text-emerald-400">localized</span> in minutes
            </h2>
            <p className="mt-4 text-lg text-white/50">
              Copy-paste React i18n components — no packages to install, no
              config to wire up. Works with Next.js, Remix, and any React app.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.1}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:border-emerald-500/30">
                {/* Gradient overlay */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative p-5">
                  <span className="font-mono text-sm text-emerald-500">
                    {step.step}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {step.description}
                  </p>
                </div>

                {/* Code snippet */}
                <div className="relative mx-4 mb-4 mt-auto overflow-hidden rounded-xl border border-white/[0.06] bg-[#080808]">
                  <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
                    <span className="size-1.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-1.5 rounded-full bg-[#febc2e]" />
                    <span className="size-1.5 rounded-full bg-[#28c840]" />
                  </div>
                  <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-white/60">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/docs/getting-started"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-medium text-black transition-all hover:bg-emerald-400 active:scale-[0.98]"
            >
              Read the getting-started guide
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
