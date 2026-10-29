import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { PreviewCard } from "./preview-card";

interface PreviewComponentsProps {
  /** Registry item name — also picks the demo file when `demo` is omitted. */
  registryName: string;
  /**
   * Demo source shown in the Code tab, relative to `src/`.
   * Defaults to `components/docs/<registryName>-demo.tsx`.
   */
  demo?: string;
  /** Skip the centered padding around the demo — for full-width components. */
  fullBleed?: boolean;
  /** Additional classes for the preview stage container. */
  stageClassName?: string;
  children: React.ReactNode;
}

/**
 * Sources in this repo import components from `@/registry/components/*`; consumers
 * get them at the path shadcn installs to, so rewrite the specifier before display.
 */
function rewriteImports(source: string): string {
  return source.replace(/@\/registry\/components\//g, "@/components/ui/");
}

export function PreviewComponents({
  registryName,
  demo,
  fullBleed,
  stageClassName,
  children,
}: PreviewComponentsProps) {
  const path = demo ?? `components/docs/${registryName}-demo.tsx`;
  const code = rewriteImports(
    readFileSync(join(process.cwd(), "src", ...path.split("/")), "utf8").trimEnd(),
  );

  return (
    <Tabs items={["Preview", "Code"]} className="border-none bg-transparent">
      <Tab value="Preview" className="mt-3 border-none bg-transparent p-0">
        <PreviewCard
          registryName={registryName}
          fullBleed={fullBleed}
          stageClassName={stageClassName}
        >
          {children}
        </PreviewCard>
      </Tab>
      <Tab value="Code" className="mt-3 border-none bg-transparent p-0">
        {/* Wrapped: Fumadocs strips the border off a code block that is a tab's only child. */}
        <div>
          <ServerCodeBlock
            code={code}
            lang="tsx"
            codeblock={{ title: path.split("/").pop(), className: "preview-code my-0" }}
          />
        </div>
      </Tab>
    </Tabs>
  );
}
