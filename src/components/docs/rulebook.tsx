import { Fragment, type ReactNode } from "react";
import { ArrowRight, Download } from "lucide-react";

const RULEBOOK_PDF = "/contributors-rulebook.pdf";

interface FlowStep {
  label: string;
  icon: ReactNode;
}

/** A row of icon chips joined by arrows, e.g. Check → Discuss → Claim → Code. */
export function Flow({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="not-prose my-6 flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <Fragment key={step.label}>
          {i > 0 && <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-emerald-500" />}
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-fd-foreground uppercase [&_svg]:size-4 [&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-400">
            {step.icon}
            {step.label}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

/** The one-line lesson that closes each rule. */
export function Takeaway({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="not-prose my-6 border-l-2 border-emerald-500 py-1 pl-4">
      <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">{title}</p>
      <p className="mt-1 text-sm text-fd-muted-foreground">{children}</p>
    </div>
  );
}

export function RulebookDownload() {
  return (
    <div className="not-prose my-6 flex flex-col gap-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-fd-foreground">Before you code, read the rules.</p>
        <p className="mt-1 text-sm text-fd-muted-foreground">
          Eight rules for contributing to Babelize Elements. Also available as a PDF.
        </p>
      </div>
      <a
        href={RULEBOOK_PDF}
        download
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 dark:text-black dark:hover:bg-emerald-400"
      >
        <Download aria-hidden="true" className="size-4" />
        Download PDF
      </a>
    </div>
  );
}
