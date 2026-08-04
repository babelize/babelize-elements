import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodePreview } from "./code-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <a
            href="https://github.com/babelize/babelize-elements"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/15"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Fully Open Source
          </a>

          <h1 className="mt-6 max-w-[16ch] text-balance text-[clamp(2.4rem,5.5vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-white">
            Localization UIs,
            <br />
            <span className="inline-block mt-1 text-emerald-400 [text-shadow:0_18px_70px_rgba(0,189,125,0.25)]">
              built for copy & paste.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg text-white/70">
            Open-source localization UI components for React and Tailwind CSS.
            Ship language switchers and locale UIs faster — with the community.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/docs/getting-started"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-medium text-black transition-all hover:bg-emerald-400 active:scale-[0.98]"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://github.com/babelize/babelize-elements"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.12] px-6 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div
          className="mt-14 w-full max-w-[860px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, white 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, white 70%, transparent 100%)",
          }}
        >
          <CodePreview />
        </div>
      </div>
    </section>
  );
}
