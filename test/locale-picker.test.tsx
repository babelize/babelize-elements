import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToString } from "react-dom/server";
import { LocalePicker } from "@/registry/components";

const regions = ["IN", "US", "GB", "DE", "JP"];

/** The samples the component's previews are built from. */
const SAMPLE_AMOUNT = 1234567.89;
const SAMPLE_DATE = new Date(2026, 0, 15);

/** Text of the summary-card value paired with a term. */
function summaryValue(term: string): string {
  return screen.getByText(term).nextElementSibling?.textContent ?? "";
}

/** Localized name of the weekday the given locale's week starts on. */
function firstWeekday(locale: string): string {
  const tag = new Intl.Locale(locale) as Intl.Locale & {
    getWeekInfo?(): { firstDay: number };
    weekInfo?: { firstDay: number };
  };
  const firstDay = tag.getWeekInfo?.().firstDay ?? tag.weekInfo?.firstDay ?? 1;
  const offset = firstDay === 7 ? 0 : firstDay;
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(new Date(2026, 0, 4 + offset));
}

const trigger = () => screen.getByRole("button", { name: /Current region/ });
const searchBox = () => screen.getByRole("combobox", { name: "Search regions" });

describe("LocalePicker", () => {
  it("renders the first region when no value is given", () => {
    render(<LocalePicker regions={regions} />);
    expect(trigger()).toHaveAccessibleName("Current region: India");
  });

  it("shows the derived preferences of the selected locale", () => {
    render(<LocalePicker regions={regions} defaultValue="en-IN" />);

    expect(summaryValue("Currency")).toContain("INR");
    expect(summaryValue("Currency")).toContain(
      new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(SAMPLE_AMOUNT),
    );
    expect(summaryValue("Date format")).toBe(
      new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(SAMPLE_DATE),
    );
    expect(summaryValue("Number format")).toBe(
      new Intl.NumberFormat("en-IN").format(SAMPLE_AMOUNT),
    );
    expect(summaryValue("Week starts on")).toBe(firstWeekday("en-IN"));
  });

  it("shows an em dash for regions without a currency mapping", () => {
    render(<LocalePicker regions={["AQ"]} defaultValue="en-AQ" />);
    expect(summaryValue("Currency")).toBe("—");
  });

  it("honours defaultValue and exposes listbox semantics", async () => {
    render(<LocalePicker regions={regions} defaultValue="en-GB" />);
    expect(trigger()).toHaveAccessibleName("Current region: United Kingdom");
    expect(trigger()).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger());
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox", { name: "Select region" })).toBeInTheDocument();
  });

  it("shows the region flag by default and hides it on request", async () => {
    const { rerender } = render(<LocalePicker regions={regions} defaultValue="en-IN" />);
    expect(trigger().textContent).toContain("\u{1F1EE}\u{1F1F3}");

    rerender(<LocalePicker regions={regions} defaultValue="en-IN" showFlags={false} />);
    expect(trigger().textContent).not.toContain("\u{1F1EE}\u{1F1F3}");
    await userEvent.click(trigger());
    expect(screen.getByRole("option", { name: /India/ }).textContent).not.toContain(
      "\u{1F1EE}\u{1F1F3}",
    );
  });

  it("tags each option with the locale tag it selects", async () => {
    render(<LocalePicker regions={regions} defaultValue="en-IN" />);
    await userEvent.click(trigger());

    expect(screen.getByRole("option", { name: /United States/ })).toHaveAttribute(
      "data-locale",
      "en-US",
    );
    expect(screen.getByRole("option", { name: /Japan/ })).toHaveAttribute("data-locale", "en-JP");
  });

  it("calls onValueChange exactly once per selection with the new locale tag", async () => {
    const onValueChange = vi.fn();
    render(<LocalePicker regions={regions} defaultValue="en-IN" onValueChange={onValueChange} />);

    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: /Germany/ }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("en-DE");
  });

  it("keeps the language subtag when the region changes", async () => {
    const onValueChange = vi.fn();
    render(<LocalePicker regions={regions} defaultValue="fr-JP" onValueChange={onValueChange} />);

    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: /Germany/ }));

    expect(onValueChange).toHaveBeenCalledWith("fr-DE");
  });

  it("follows an externally changed value prop (controlled mode)", async () => {
    function Harness() {
      const [value, setValue] = React.useState("en-IN");
      return (
        <>
          <button type="button" onClick={() => setValue("de-DE")}>
            set de-DE
          </button>
          <LocalePicker regions={regions} value={value} />
        </>
      );
    }
    render(<Harness />);
    expect(trigger()).toHaveAccessibleName("Current region: India");
    expect(summaryValue("Currency")).toContain("INR");

    await userEvent.click(screen.getByRole("button", { name: "set de-DE" }));

    expect(trigger()).toHaveAccessibleName("Current region: Germany");
    expect(summaryValue("Currency")).toContain("EUR");
    expect(summaryValue("Date format")).toBe(
      new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(SAMPLE_DATE),
    );
  });

  it("forwards a ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<LocalePicker regions={regions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes unknown props through to the root element", () => {
    render(<LocalePicker regions={regions} data-testid="picker" />);
    expect(screen.getByTestId("picker")).toBeInTheDocument();
  });

  it("gives the search box an accessible name", async () => {
    render(<LocalePicker regions={regions} />);
    await userEvent.click(trigger());
    expect(searchBox()).toBeInTheDocument();
  });

  it("marks the root rtl for an RTL locale and ltr otherwise", () => {
    const { container, rerender } = render(
      <LocalePicker regions={["SA", "US"]} defaultValue="ar-SA" />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "rtl");

    rerender(<LocalePicker regions={["SA", "US"]} value="en-US" />);
    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");
  });

  it("lets a caller override the direction", () => {
    const { container } = render(
      <LocalePicker regions={["SA", "US"]} defaultValue="ar-SA" dir="ltr" />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");
  });

  it("displays region names in English by default and in the selected locale on request", async () => {
    const { rerender } = render(<LocalePicker regions={regions} defaultValue="de-DE" />);
    expect(trigger()).toHaveAccessibleName("Current region: Germany");

    rerender(<LocalePicker regions={regions} defaultValue="de-DE" label="native" />);
    expect(trigger()).toHaveAccessibleName("Current region: Deutschland");

    await userEvent.click(trigger());
    expect(screen.getByRole("option", { name: /Vereinigte Staaten/ })).toBeInTheDocument();
  });

  it("filters by English name and by code", async () => {
    render(<LocalePicker regions={regions} defaultValue="en-IN" />);
    await userEvent.click(trigger());

    await userEvent.type(searchBox(), "ger");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /Germany/ })).toBeInTheDocument();

    await userEvent.clear(searchBox());
    await userEvent.type(searchBox(), "jp");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /Japan/ })).toBeInTheDocument();
  });

  it("filters by the localized name when label is native", async () => {
    render(<LocalePicker regions={regions} defaultValue="de-DE" label="native" />);
    await userEvent.click(trigger());

    await userEvent.type(searchBox(), "deutsch");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /Deutschland/ })).toBeInTheDocument();
  });

  it("renders deterministic markup for the server", () => {
    const html = renderToString(<LocalePicker regions={regions} defaultValue="en-IN" />);

    expect(html).toContain(
      new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(SAMPLE_DATE),
    );
    expect(html).toContain("Week starts on");
  });
});

describe("LocalePicker keyboard navigation", () => {
  const activeOptionId = () => searchBox().getAttribute("aria-activedescendant");

  it("opens on ArrowDown from the trigger with the first option active", async () => {
    render(<LocalePicker regions={regions} defaultValue="en-GB" />);
    trigger().focus();

    await userEvent.keyboard("{ArrowDown}");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(document.activeElement).toBe(searchBox());
    expect(searchBox()).toHaveAttribute("aria-expanded", "true");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /India/ }).id);
  });

  it("lands on the current selection when opened with the mouse", async () => {
    render(<LocalePicker regions={regions} defaultValue="en-DE" />);
    await userEvent.click(trigger());

    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /Germany/ }).id);
  });

  it("moves the active option with ArrowDown and ArrowUp, wrapping at both ends", async () => {
    render(<LocalePicker regions={regions} defaultValue="en-IN" />);
    await userEvent.click(trigger());
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /India/ }).id);

    await userEvent.keyboard("{ArrowDown}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /United States/ }).id);

    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /Japan/ }).id);

    await userEvent.keyboard("{ArrowDown}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /India/ }).id);
  });

  it("jumps to the first and last option with Home and End", async () => {
    render(<LocalePicker regions={regions} />);
    await userEvent.click(trigger());

    await userEvent.keyboard("{End}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /Japan/ }).id);

    await userEvent.keyboard("{Home}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /India/ }).id);
  });

  it("selects the active option with Enter, closes, and returns focus to the trigger", async () => {
    const onValueChange = vi.fn();
    render(<LocalePicker regions={regions} defaultValue="en-IN" onValueChange={onValueChange} />);
    await userEvent.click(trigger());

    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("en-US");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<LocalePicker regions={regions} />);
    await userEvent.click(trigger());

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("ignores Enter while an IME composition is in progress", async () => {
    const onValueChange = vi.fn();
    render(<LocalePicker regions={regions} defaultValue="en-IN" onValueChange={onValueChange} />);
    await userEvent.click(trigger());

    // The Enter that commits a composition is not a request to select.
    fireEvent.keyDown(searchBox(), { key: "Enter", isComposing: true });
    // Legacy browsers never set `isComposing` and only report the 229 keyCode.
    fireEvent.keyDown(searchBox(), { key: "Enter", keyCode: 229 });

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // A real Enter still selects.
    await userEvent.keyboard("{ArrowDown}");
    fireEvent.keyDown(searchBox(), { key: "Enter" });
    expect(onValueChange).toHaveBeenCalledWith("en-US");
  });

  it("restarts the highlight at the top when the filter changes", async () => {
    render(<LocalePicker regions={regions} defaultValue="en-IN" />);
    await userEvent.click(trigger());
    await userEvent.keyboard("{ArrowDown}"); // United States

    await userEvent.type(searchBox(), "ger");

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /Germany/ }).id);
  });

  it("keeps the navigation keys harmless when the filter matches nothing", async () => {
    const onValueChange = vi.fn();
    render(<LocalePicker regions={regions} onValueChange={onValueChange} />);
    await userEvent.click(trigger());
    await userEvent.type(searchBox(), "zzz");

    expect(screen.queryAllByRole("option")).toHaveLength(0);
    await userEvent.keyboard("{ArrowDown}{ArrowUp}{Home}{End}{Enter}");

    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("LocalePicker first day of week", () => {
  it("names the weekday in the selected locale", async () => {
    render(<LocalePicker regions={regions} defaultValue="de-DE" />);
    // Germany's week starts on Monday, named in German.
    expect(summaryValue("Week starts on")).toBe("Montag");

    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: /United States/ }));
    // The region drives the week start (Sunday in the US); the surviving
    // `de` language subtag names the weekday in German.
    expect(summaryValue("Week starts on")).toBe("Sonntag");
  });
});

/**
 * Every entry in `REGION_CURRENCY` must be a real ISO 4217 code attached to a
 * real ISO 3166-1 region. The table is read from the source so entries added
 * later are covered automatically — an unknown code renders as itself through
 * `Intl.DisplayNames`, which is exactly the failure a hand-picked typo would
 * hide.
 */
const pickerSource = readFileSync(
  resolve(process.cwd(), "src/registry/components/locale-picker.tsx"),
  "utf8",
);
const currencyTableBlock = pickerSource.slice(
  pickerSource.indexOf("const REGION_CURRENCY"),
  pickerSource.indexOf("};", pickerSource.indexOf("const REGION_CURRENCY")),
);
const CURRENCY_TABLE = Object.fromEntries(
  [...currencyTableBlock.matchAll(/^ {2}([A-Z]{2}): "([A-Z]{3})",?$/gm)].map((match) => [
    match[1],
    match[2],
  ]),
);

describe("LocalePicker currency table", () => {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const currencyNames = new Intl.DisplayNames(["en"], { type: "currency" });

  it("collects the whole table from the source", () => {
    expect(Object.keys(CURRENCY_TABLE).length).toBeGreaterThan(80);
    expect(CURRENCY_TABLE).toMatchObject({
      IN: "INR",
      US: "USD",
      DE: "EUR",
      JP: "JPY",
      GB: "GBP",
      // Bulgaria adopted the euro on 1 January 2026 — was BGN.
      BG: "EUR",
    });
  });

  it("maps every region to a valid ISO 3166-1 region", () => {
    for (const region of Object.keys(CURRENCY_TABLE)) {
      const name = regionNames.of(region);
      // Intl.DisplayNames falls back to the raw code for unknown regions.
      expect(name, `${region} is not a valid region`).toBeTruthy();
      expect(name, `${region} is not a valid region`).not.toBe(region);
    }
  });

  it("maps every region to a valid ISO 4217 currency", () => {
    for (const [region, code] of Object.entries(CURRENCY_TABLE)) {
      const name = currencyNames.of(code);
      expect(name, `${region} maps to invalid currency ${code}`).toBeTruthy();
      expect(name, `${region} maps to invalid currency ${code}`).not.toBe(code);
    }
  });
});
