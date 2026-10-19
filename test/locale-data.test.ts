import { describe, expect, it } from "vitest";
import { getFlag, getLanguageName, isRtl } from "@/registry/components/locale-data";

describe("isRtl", () => {
  it.each(["ar", "he", "fa", "ur", "ps", "sd", "yi"])("treats %s as RTL", (code) => {
    expect(isRtl(code)).toBe(true);
  });

  it.each(["en", "fr", "ja", "hi", "zh"])("treats %s as LTR", (code) => {
    expect(isRtl(code)).toBe(false);
  });

  it("resolves region subtags through the base language", () => {
    expect(isRtl("ar-EG")).toBe(true);
    expect(isRtl("en-US")).toBe(false);
  });

  it("lets an explicit script subtag decide", () => {
    expect(isRtl("pa-Arab")).toBe(true);
    expect(isRtl("az-Arab-IR")).toBe(true);
    expect(isRtl("sd-Deva")).toBe(false);
    expect(isRtl("uz-Latn")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(isRtl("AR")).toBe(true);
    expect(isRtl("pa-ARAB")).toBe(true);
  });
});

describe("getLanguageName", () => {
  it("returns native and English names from the built-in table", () => {
    expect(getLanguageName("fr", "native")).toBe("Français");
    expect(getLanguageName("fr", "english")).toBe("French");
  });

  it("defaults to the native name", () => {
    expect(getLanguageName("de")).toBe("Deutsch");
  });

  it("resolves region subtags through the base language", () => {
    expect(getLanguageName("pt-BR", "english")).toBe(getLanguageName("pt", "english"));
  });

  it("falls back to Intl.DisplayNames for languages missing from the table", () => {
    // Cherokee is not in the built-in table.
    expect(getLanguageName("chr", "english")).toBe("Cherokee");
    expect(getLanguageName("chr", "native")).toBe(
      new Intl.DisplayNames(["chr"], { type: "language" }).of("chr"),
    );
  });

  it("returns undefined for codes no runtime knows", () => {
    expect(getLanguageName("qqq", "english")).toBeUndefined();
    expect(getLanguageName("not a code", "english")).toBeUndefined();
  });
});

describe("getFlag", () => {
  it("maps a language to its primary country's flag", () => {
    expect(getFlag("ja")).toBe("\u{1F1EF}\u{1F1F5}");
  });

  it("falls back to the globe for languages with no single country", () => {
    expect(getFlag("eo")).toBe("\u{1F310}");
  });
});
