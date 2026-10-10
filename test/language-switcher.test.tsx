import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { LanguageSwitcher } from "@/registry/components";

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

    expect(screen.getByRole("textbox", { name: "Search languages" })).toBeInTheDocument();
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
  resolve(process.cwd(), "src/registry/components/language-switcher.tsx"),
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
});
