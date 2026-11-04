import { describe, expect, it } from "vitest";
import { languageAlternates, pathInLocale } from "@/lib/locale-path";

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

describe("languageAlternates", () => {
  it("lists every language and English as x-default", () => {
    expect(languageAlternates("/docs/components")).toEqual({
      en: "/docs/components",
      es: "/es/docs/components",
      ja: "/ja/docs/components",
      ar: "/ar/docs/components",
      "x-default": "/docs/components",
    });
  });

  it("lists only the languages a page exists in, from any language's URL", () => {
    expect(languageAlternates("/ja", ["en", "ja"])).toEqual({
      en: "/",
      ja: "/ja",
      "x-default": "/",
    });
  });
});
