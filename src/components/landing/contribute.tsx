import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./reveal";

export function Contribute() {
  return (
    <section className="relative border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.12] via-white/[0.02] to-transparent p-10 md:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                <Sparkles size={14} />
                Contribute
              </div>
              <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Built by the community, for every localized app.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Join the Babelize Elements contributors. Pick an open issue,
                build a component, and ship it to developers around the world.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/docs/contributing"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-medium text-black transition-all hover:bg-emerald-400 active:scale-[0.98]"
                >
                  Read the contribution guide
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://github.com/babelize/babelize-elements/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.12] px-6 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Browse open issues
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
