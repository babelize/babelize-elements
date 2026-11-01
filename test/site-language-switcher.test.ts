import { describe, expect, it } from "vitest";
import { pathInLocale } from "@/components/site-language-switcher";

describe("pathInLocale", () => {
  it("adds the language prefix, keeping the page", () => {
    expect(pathInLocale("/", "ja")).toBe("/ja");
    expect(pathInLocale("/docs/getting-started/install", "ar")).toBe(
      "/ar/docs/getting-started/install",
    );
  });

  it("swaps one language prefix for another, and drops it for English", () => {
    expect(pathInLocale("/es/docs/components", "ja")).toBe("/ja/docs/components");
    expect(pathInLocale("/ja", "en")).toBe("/");
    expect(pathInLocale("/ar/docs", "en")).toBe("/docs");
  });

  it("doesn't mistake a path segment for a language", () => {
    expect(pathInLocale("/docs/es-module", "ja")).toBe("/ja/docs/es-module");
  });
});
