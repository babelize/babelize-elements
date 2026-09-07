import { describe, expect, it } from "vitest";
import { parseJsonc, resolveAliasToDir, type TsPathsConfig } from "@/cli/paths";

const srcLayout: TsPathsConfig = { baseUrl: ".", paths: { "@/*": ["./src/*"] } };
const rootLayout: TsPathsConfig = { baseUrl: ".", paths: { "@/*": ["./*"] } };

describe("resolveAliasToDir", () => {
  it("maps @/* to src/* — the Next.js default layout", () => {
    expect(resolveAliasToDir("@/components", srcLayout)).toBe("src/components");
    expect(resolveAliasToDir("@/components/ui", srcLayout)).toBe("src/components/ui");
    expect(resolveAliasToDir("@/lib", srcLayout)).toBe("src/lib");
  });

  it("maps @/* to the project root when that is how it is configured", () => {
    expect(resolveAliasToDir("@/components", rootLayout)).toBe("components");
    expect(resolveAliasToDir("@/lib", rootLayout)).toBe("lib");
  });

  it("honours baseUrl", () => {
    const config: TsPathsConfig = { baseUrl: "./app", paths: { "@/*": ["./modules/*"] } };
    expect(resolveAliasToDir("@/components", config)).toBe("app/modules/components");
  });

  it("prefers the most specific pattern", () => {
    const config: TsPathsConfig = {
      baseUrl: ".",
      paths: { "@/*": ["./src/*"], "@/lib/*": ["./packages/shared/*"] },
    };
    expect(resolveAliasToDir("@/lib/utils", config)).toBe("packages/shared/utils");
    expect(resolveAliasToDir("@/components", config)).toBe("src/components");
  });

  it("supports exact, non-wildcard mappings", () => {
    const config: TsPathsConfig = { baseUrl: ".", paths: { "@ui": ["./design/system"] } };
    expect(resolveAliasToDir("@ui", config)).toBe("design/system");
  });

  it("falls back to stripping @/ when there is no tsconfig", () => {
    expect(resolveAliasToDir("@/components", null)).toBe("components");
    expect(resolveAliasToDir("~/components", null)).toBe("~/components");
  });

  it("falls back when no pattern matches the alias", () => {
    expect(resolveAliasToDir("@/components", { baseUrl: ".", paths: { "#/*": ["./x/*"] } })).toBe(
      "components",
    );
  });
});

describe("parseJsonc", () => {
  it("parses plain JSON", () => {
    expect(parseJsonc('{"a":1}')).toEqual({ a: 1 });
  });

  it("tolerates comments and trailing commas, which tsconfig allows", () => {
    const raw = `{
      // a line comment
      "compilerOptions": {
        /* a block comment */
        "baseUrl": ".",
        "paths": { "@/*": ["./src/*"] },
      },
    }`;
    expect(parseJsonc(raw)).toEqual({
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
    });
  });

  it("does not strip comment-like sequences inside strings", () => {
    expect(parseJsonc('{"url":"https://x.dev/a"}')).toEqual({ url: "https://x.dev/a" });
  });

  it("returns null on malformed input instead of throwing", () => {
    expect(parseJsonc("{nope")).toBeNull();
  });
});
