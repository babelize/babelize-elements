import { describe, expect, it } from "vitest";
import type * as PageTree from "fumadocs-core/page-tree";
import { localizedHref, localizeTree } from "@/lib/localized-href";

describe("localizedHref", () => {
  it("prefixes docs links with the page's language", () => {
    expect(localizedHref("/docs/components", "ja")).toBe("/ja/docs/components");
    expect(localizedHref("/docs", "ar")).toBe("/ar/docs");
    expect(localizedHref("/docs#install", "es")).toBe("/es/docs#install");
  });

  it("leaves English, external, anchor and non-docs links alone", () => {
    expect(localizedHref("/docs/components", "en")).toBe("/docs/components");
    expect(localizedHref("https://github.com/babelize", "ja")).toBe("https://github.com/babelize");
    expect(localizedHref("#component-template", "ja")).toBe("#component-template");
    expect(localizedHref("/docsy", "ja")).toBe("/docsy");
    expect(localizedHref("/", "ja")).toBe("/");
    expect(localizedHref(undefined, "ja")).toBeUndefined();
  });
});

describe("localizeTree", () => {
  it("localizes every docs link in the sidebar, including meta.json links and folder indexes", () => {
    const tree: PageTree.Root = {
      name: "Docs",
      children: [
        { type: "page", name: "Overview", url: "/docs/components" },
        { type: "page", name: "GitHub", url: "https://github.com", external: true },
        {
          type: "folder",
          name: "Get Started",
          index: { type: "page", name: "Intro", url: "/ja/docs/getting-started" },
          children: [{ type: "page", name: "Install", url: "/docs/getting-started/install" }],
        },
      ],
    };
    const ja = localizeTree(tree, "ja");
    expect(ja.children[0]).toMatchObject({ url: "/ja/docs/components" });
    expect(ja.children[1]).toMatchObject({ url: "https://github.com" });
    expect(ja.children[2]).toMatchObject({
      index: { url: "/ja/docs/getting-started" },
      children: [{ url: "/ja/docs/getting-started/install" }],
    });
    expect(localizeTree(tree, "en")).toBe(tree);
  });
});
