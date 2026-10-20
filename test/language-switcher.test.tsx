import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { LanguageSwitcher } from "@/registry/components";
import { fakeScroller } from "./fake-geometry";

const locales = [{ code: "en" }, { code: "fr" }, { code: "ar" }];

describe("LanguageSwitcher", () => {
  it("renders the first locale when no value is given", () => {
    render(<LanguageSwitcher locales={locales} />);
    expect(screen.getByRole("button")).toHaveAccessibleName(/English/);
  });

  it.each(["hy", "lo", "km", "am", "sd"])(
    "renders the native name of %s correctly",
    async (code) => {
      const nativeName = new Intl.DisplayNames([code], { type: "language" }).of(code)!;
      render(<LanguageSwitcher locales={[{ code }]} label="native" />);
      const trigger = screen.getByRole("button", { name: /Current language/ });
      expect(trigger.textContent?.toLocaleLowerCase(code)).toBe(nativeName.toLocaleLowerCase(code));

      await userEvent.click(trigger);
      expect(screen.getByRole("option").textContent?.toLocaleLowerCase(code)).toBe(
        nativeName.toLocaleLowerCase(code),
      );
    },
  );

  it("honours defaultValue and exposes listbox semantics", async () => {
    render(<LanguageSwitcher locales={locales} defaultValue="fr" />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("calls onValueChange exactly once per selection", async () => {
    const onValueChange = vi.fn();
    render(<LanguageSwitcher locales={locales} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("option", { name: /French/ }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("fr");
  });

  it("follows an externally changed value prop (controlled mode)", async () => {
    function Harness() {
      const [value, setValue] = React.useState("en");
      return (
        <>
          <button type="button" onClick={() => setValue("fr")}>
            set fr
          </button>
          <LanguageSwitcher locales={locales} value={value} />
        </>
      );
    }
    render(<Harness />);
    expect(screen.getByRole("button", { name: /Current language: English/ })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "set fr" }));
    expect(screen.getByRole("button", { name: /Current language: French/ })).toBeInTheDocument();
  });

  it("forwards a ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<LanguageSwitcher locales={locales} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes unknown props through to the root element", () => {
    render(<LanguageSwitcher locales={locales} data-testid="switcher" />);
    expect(screen.getByTestId("switcher")).toBeInTheDocument();
  });

  it("gives the search box an accessible name", async () => {
    render(<LanguageSwitcher locales={locales} />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));

    expect(screen.getByRole("combobox", { name: "Search languages" })).toBeInTheDocument();
  });

  it("marks the root rtl for an RTL locale and ltr otherwise", () => {
    const { container, rerender } = render(
      <LanguageSwitcher locales={locales} defaultValue="ar" />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "rtl");

    rerender(<LanguageSwitcher locales={locales} value="en" />);
    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");
  });

  it("lets a caller override the direction", () => {
    const { container } = render(
      <LanguageSwitcher locales={locales} defaultValue="ar" dir="ltr" />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");
  });

  it.each([
    { code: "ckb", label: "Kurdish", rtl: true, direction: "rtl" },
    { code: "ar", label: "Arabic", rtl: false, direction: "ltr" },
  ])("honours rtl=$rtl for $code on the root and options", async ({ direction, ...locale }) => {
    const { container } = render(<LanguageSwitcher locales={[locale]} />);
    expect(container.firstElementChild).toHaveAttribute("dir", direction);

    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));
    expect(screen.getByRole("option", { name: locale.label })).toHaveAttribute("dir", direction);
  });

  it("updates direction when an overridden locale is selected", async () => {
    const { container } = render(
      <LanguageSwitcher locales={[{ code: "en" }, { code: "ckb", label: "Kurdish", rtl: true }]} />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");

    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));
    await userEvent.click(screen.getByRole("option", { name: "Kurdish" }));
    expect(container.firstElementChild).toHaveAttribute("dir", "rtl");
  });

  it("does not reverse an RTL row twice", async () => {
    // `dir="rtl"` already lays a flex row out right-to-left; a flex-row-reverse on
    // top of it put the row back in LTR order.
    render(<LanguageSwitcher locales={locales} defaultValue="ar" showFlags />);
    const trigger = screen.getByRole("button", { name: /Current language/ });
    expect(trigger.className).not.toContain("flex-row-reverse");

    await userEvent.click(trigger);
    const option = screen.getByRole("option", { name: /العربية|Arabic/ });
    expect(option).toHaveAttribute("dir", "rtl");
    expect(option.className).not.toContain("flex-row-reverse");
    expect(option.className).not.toContain("text-right");
    expect(option.className).not.toContain("text-left");
  });
});

/**
 * Every entry in `LANG_TO_FLAG` must render a flag that decodes to a real
 * ISO 3166-1 region. The table is read from the source so that entries added
 * later are covered automatically — a language code is not a country code
 * (`ml` is Malayalam, not Mali), and pairs like `ZO` render as letters.
 */
const switcherSource = readFileSync(
  resolve(process.cwd(), "src/registry/components/locale-data.ts"),
  "utf8",
);
const flagTableBlock = switcherSource.slice(
  switcherSource.indexOf("const LANG_TO_FLAG"),
  switcherSource.indexOf("};", switcherSource.indexOf("const LANG_TO_FLAG")),
);
const FLAG_TABLE_CODES = [...flagTableBlock.matchAll(/^ {2}([a-z]+):/gm)].map((m) => m[1]);

/** Decodes a flag emoji to its ISO 3166-1 region, or null if it isn't a pair. */
function decodeRegion(flag: string): string | null {
  const codepoints = Array.from(flag);
  if (codepoints.length !== 2) return null;
  const letters = codepoints.map((c) => {
    const cp = c.codePointAt(0)!;
    if (cp < 0x1f1e6 || cp > 0x1f1ff) return null;
    return String.fromCharCode(cp - 0x1f1e6 + 65);
  });
  if (letters.some((l) => l === null)) return null;
  return letters.join("");
}

/** Renders one switcher with every given code and returns its flags in order. */
async function renderFlags(codes: string[]): Promise<string[]> {
  render(<LanguageSwitcher locales={codes.map((code) => ({ code }))} showFlags />);
  const trigger = screen.getByRole("button", { name: /Current language/ });
  await userEvent.click(trigger);
  const options = screen.getAllByRole("option");
  expect(options).toHaveLength(codes.length);
  const flags = options.map((option) => option.querySelector("span")?.textContent ?? "");
  expect(trigger.querySelector("span")?.textContent).toBe(flags[0]);
  return flags;
}

describe("LanguageSwitcher flags", () => {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  it("collects the whole flag table from the source", () => {
    expect(FLAG_TABLE_CODES.length).toBeGreaterThan(80);
    expect(FLAG_TABLE_CODES).toContain("en");
  });

  it("renders a valid ISO 3166-1 region flag for every language in the table", async () => {
    const flags = await renderFlags(FLAG_TABLE_CODES);

    FLAG_TABLE_CODES.forEach((code, i) => {
      const region = decodeRegion(flags[i]);
      expect(
        region,
        `${code} rendered "${flags[i]}", which is not a regional-indicator pair`,
      ).not.toBeNull();
      const name = regionNames.of(region!);
      // Intl.DisplayNames falls back to the raw code for unknown regions.
      expect(name, `${code} maps to invalid region ${region}`).toBeTruthy();
      expect(name, `${code} maps to invalid region ${region}`).not.toBe(region);
    });
  });

  it("maps languages whose codes collide with another country to the right flag", async () => {
    const expected: Record<string, string> = {
      ml: "IN", // Malayalam, not Mali
      or: "IN", // Odia, not Norway
      am: "ET", // Amharic, not Armenia
      si: "LK", // Sinhala, not Slovakia
      ta: "IN", // Tamil, not Timor-Leste
      te: "IN", // Telugu, not Tajikistan
      mr: "IN", // Marathi, not Mauritania
      pa: "IN", // Punjabi, not Panama
      as: "IN", // Assamese, not American Samoa
      ur: "PK", // Urdu, not U.S. Outlying Islands
      ps: "AF", // Pashto, not Palestinian Territories
      sd: "PK", // Sindhi, not Saudi Arabia
      bs: "BA", // Bosnian, not Bahamas
      af: "ZA", // Afrikaans, not Azerbaijan
      sm: "WS", // Samoan, not Somalia
      ha: "NG", // Hausa, not Heard & McDonald Islands
      ca: "ES", // Catalan, not American Samoa
      eu: "ES", // Basque, not Argentina
      gl: "ES", // Galician, not Argentina
      la: "VA", // Latin, not Laos
      cy: "GB", // Welsh, invalid region ZO
      haw: "US", // Hawaiian, invalid region HW
      my: "MM", // Burmese, broken pair
      kk: "KZ", // Kazakh, invalid region KK
      yo: "NG", // Yoruba, invalid region YN
      ig: "NG", // Igbo, invalid region IG
      zu: "ZA", // Zulu, invalid region ZN
    };
    const codes = Object.keys(expected);
    const flags = await renderFlags(codes);

    codes.forEach((code, i) => {
      expect(decodeRegion(flags[i])).toBe(expected[code]);
    });
  });

  it("falls back to the globe for languages without a canonical country", async () => {
    const flags = await renderFlags(["yi", "eo"]);
    expect(flags).toEqual(["\u{1F310}", "\u{1F310}"]);
  });

  it("renders the flags reported as wrong in issue #24", async () => {
    const flags = await renderFlags(["ml", "am", "cy"]);
    expect(flags).toEqual(["\u{1F1EE}\u{1F1F3}", "\u{1F1EA}\u{1F1F9}", "\u{1F1EC}\u{1F1E7}"]);
  });

  it("resolves regional flags when a 2-letter region subtag is present (issue #26)", async () => {
    const regionalCodes = ["en-GB", "pt-PT", "es-MX", "fr-CA", "zh-TW"];
    const flags = await renderFlags(regionalCodes);

    expect(decodeRegion(flags[0])).toBe("GB"); // en-GB -> GB, not US
    expect(decodeRegion(flags[1])).toBe("PT"); // pt-PT -> PT, not BR
    expect(decodeRegion(flags[2])).toBe("MX"); // es-MX -> MX, not ES
    expect(decodeRegion(flags[3])).toBe("CA"); // fr-CA -> CA, not FR
    expect(decodeRegion(flags[4])).toBe("TW"); // zh-TW -> TW, not CN
  });

  it("falls back to the base language for script-only subtags (issue #26)", async () => {
    const flags = await renderFlags(["zh-Hant", "sr-Latn"]);
    expect(decodeRegion(flags[0])).toBe("CN"); // falls back to zh -> CN
    expect(decodeRegion(flags[1])).toBe("RS"); // falls back to sr -> RS
  });
});

describe("LanguageSwitcher keyboard navigation", () => {
  const searchBox = () => screen.getByRole("combobox", { name: "Search languages" });
  const activeOptionId = () => searchBox().getAttribute("aria-activedescendant");

  it("opens on ArrowDown from the trigger with the first option active", async () => {
    render(<LanguageSwitcher locales={locales} />);
    const trigger = screen.getByRole("button", { name: /Current language/ });
    trigger.focus();

    await userEvent.keyboard("{ArrowDown}");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(document.activeElement).toBe(searchBox());
    expect(searchBox()).toHaveAttribute("aria-expanded", "true");
    expect(searchBox()).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /English/ }).id);
  });

  it("lands on the current selection when opened with the mouse", async () => {
    render(<LanguageSwitcher locales={locales} defaultValue="fr" />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));

    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /French/ }).id);
  });

  it("moves the active option with ArrowDown and ArrowUp, wrapping at both ends", async () => {
    render(<LanguageSwitcher locales={locales} />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));
    // Opening by mouse starts on the current selection: English, index 0.
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /English/ }).id);

    await userEvent.keyboard("{ArrowDown}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /French/ }).id);

    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /Arabic/ }).id);

    await userEvent.keyboard("{ArrowDown}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /English/ }).id);
  });

  it("jumps to the first and last option with Home and End", async () => {
    render(<LanguageSwitcher locales={locales} />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));

    await userEvent.keyboard("{End}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /Arabic/ }).id);

    await userEvent.keyboard("{Home}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /English/ }).id);
  });

  it("selects the active option with Enter, closes, and returns focus to the trigger", async () => {
    const onValueChange = vi.fn();
    render(<LanguageSwitcher locales={locales} onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button", { name: /Current language/ });
    await userEvent.click(trigger);

    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("fr");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<LanguageSwitcher locales={locales} />);
    const trigger = screen.getByRole("button", { name: /Current language/ });
    await userEvent.click(trigger);

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("ignores Enter while an IME composition is in progress", async () => {
    const onValueChange = vi.fn();
    render(<LanguageSwitcher locales={locales} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));

    // The Enter that commits a composition is not a request to select.
    fireEvent.keyDown(searchBox(), { key: "Enter", isComposing: true });
    // Legacy browsers never set `isComposing` and only report the 229 keyCode.
    fireEvent.keyDown(searchBox(), { key: "Enter", keyCode: 229 });

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // A real Enter still selects.
    await userEvent.keyboard("{ArrowDown}");
    fireEvent.keyDown(searchBox(), { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("fr");
  });

  it("restarts the highlight at the top when the filter changes", async () => {
    render(<LanguageSwitcher locales={locales} />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));
    await userEvent.keyboard("{ArrowDown}"); // French

    await userEvent.type(searchBox(), "ar");

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /Arabic/ }).id);
  });

  it("keeps the navigation keys harmless when the filter matches nothing", async () => {
    const onValueChange = vi.fn();
    render(<LanguageSwitcher locales={locales} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));
    await userEvent.type(searchBox(), "zzz");

    expect(screen.queryAllByRole("option")).toHaveLength(0);
    await userEvent.keyboard("{ArrowDown}{ArrowUp}{Home}{End}{Enter}");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("pins the highlight and scrolls the menu beneath it, never the page", async () => {
    render(<LanguageSwitcher locales={locales} />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));
    // jsdom has no layout, so fake a viewport the three options overflow by 20px.
    const scroller = fakeScroller(screen.getByRole("listbox"), screen.getAllByRole("option"));

    await userEvent.keyboard("{End}");
    expect(scroller.scrollTop).toBe(20); // pinned at the last row, clamped there

    await userEvent.keyboard("{Home}");
    expect(scroller.scrollTop).toBe(0); // ...and back on the first

    // `scrollIntoView` used to be called here, which also scrolled the document.
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);
  });

  it("honours maxHeight on the scrolling option list", async () => {
    render(<LanguageSwitcher locales={locales} maxHeight={200} />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));

    expect(screen.getByRole("listbox").style.maxHeight).toBe("200px");
  });
});

describe("LanguageSwitcher labels", () => {
  it("renders custom labels in place of the English defaults", async () => {
    render(
      <LanguageSwitcher
        locales={locales}
        labels={{
          searchPlaceholder: "Rechercher…",
          searchLabel: "Rechercher une langue",
          clearSearch: "Effacer la recherche",
          emptyMessage: "Aucun résultat",
          listbox: "Choisir la langue",
          current: (name) => `Langue actuelle : ${name}`,
        }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Langue actuelle : English" }));

    const search = screen.getByRole("combobox", { name: "Rechercher une langue" });
    expect(search).toHaveAttribute("placeholder", "Rechercher…");
    expect(screen.getByRole("listbox", { name: "Choisir la langue" })).toBeInTheDocument();

    await userEvent.type(search, "zzz");
    expect(screen.getByText("Aucun résultat")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Effacer la recherche" })).toBeInTheDocument();
  });

  it("keeps the English default for any label left out", async () => {
    render(<LanguageSwitcher locales={locales} labels={{ emptyMessage: "Aucun résultat" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Current language: English" }));

    expect(screen.getByRole("combobox", { name: "Search languages" })).toHaveAttribute(
      "placeholder",
      "Search languages...",
    );
    expect(screen.getByRole("listbox", { name: "Select language" })).toBeInTheDocument();
  });

  it("lets searchPlaceholder and emptyMessage win over labels", async () => {
    render(
      <LanguageSwitcher
        locales={locales}
        searchPlaceholder="Find a language"
        emptyMessage="Nothing here"
        labels={{ searchPlaceholder: "Rechercher…", emptyMessage: "Aucun résultat" }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));

    const search = screen.getByRole("combobox", { name: "Search languages" });
    expect(search).toHaveAttribute("placeholder", "Find a language");
    await userEvent.type(search, "zzz");
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("keeps the English default for a label passed as undefined", async () => {
    render(
      <LanguageSwitcher locales={locales} labels={{ current: undefined, listbox: undefined }} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Current language: English" }));

    expect(screen.getByRole("listbox", { name: "Select language" })).toBeInTheDocument();
  });

  it("renders nothing for emptyMessage={null}", async () => {
    render(<LanguageSwitcher locales={locales} emptyMessage={null} />);
    await userEvent.click(screen.getByRole("button", { name: /Current language/ }));
    await userEvent.type(screen.getByRole("combobox"), "zzz");

    expect(screen.queryByText("No languages found.")).not.toBeInTheDocument();
  });
});
