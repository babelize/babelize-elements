import { readHighlighted } from "./source";
import { PreviewShell } from "./preview-shell";

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
  children: React.ReactNode;
}

export async function PreviewComponents({
  registryName,
  demo,
  fullBleed,
  children,
}: PreviewComponentsProps) {
  const { code, highlighted } = await readHighlighted(
    demo ?? `components/docs/${registryName}-demo.tsx`,
  );

  return (
    <PreviewShell code={code} highlighted={highlighted} fullBleed={fullBleed}>
      {children}
    </PreviewShell>
  );
}
