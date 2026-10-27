import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { PhoneInput, COUNTRIES } from "@/registry/components";

describe("PhoneInput", () => {
  it("defaults to the US dial code", () => {
    render(<PhoneInput />);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("honours defaultCountry", () => {
    render(<PhoneInput defaultCountry="IN" />);
    expect(screen.getByText("+91")).toBeInTheDocument();
  });

  it("reports the number and the selected country on typing", async () => {
    const onValueChange = vi.fn();
    render(<PhoneInput onValueChange={onValueChange} />);

    await userEvent.type(screen.getByRole("textbox"), "5");

    expect(onValueChange).toHaveBeenCalledWith("5", expect.objectContaining({ code: "US" }));
  });

  it("follows an externally changed value prop (controlled mode)", async () => {
    function Harness() {
      const [value, setValue] = React.useState("111");
      return (
        <>
          <button type="button" onClick={() => setValue("222")}>
            set
          </button>
          <PhoneInput value={value} />
        </>
      );
    }
    render(<Harness />);
    expect(screen.getByRole("textbox")).toHaveValue("111");

    await userEvent.click(screen.getByRole("button", { name: "set" }));
    expect(screen.getByRole("textbox")).toHaveValue("222");
  });

  it("forwards a ref to the underlying input and accepts a name", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PhoneInput ref={ref} name="phone" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByRole("textbox")).toHaveAttribute("name", "phone");
  });

  it("exposes a searchable country listbox", async () => {
    render(<PhoneInput />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));

    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/search/i), "Germ");
    expect(screen.getByRole("option", { name: /Germany/ })).toBeInTheDocument();
  });

  it("keeps the forwarded ref on the phone input while the country list is open", async () => {
    // The search box used to share `inputRef`, so opening the list silently
    // repointed the forwarded ref at the wrong element.
    const ref = React.createRef<HTMLInputElement>();
    render(<PhoneInput ref={ref} />);
    expect(ref.current?.type).toBe("tel");

    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    expect(ref.current?.type).toBe("tel");
  });

  it("focuses the number field after a country is picked by click", async () => {
    render(<PhoneInput />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    await userEvent.click(screen.getByRole("option", { name: /India/ }));

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Phone number" }));
  });

  it("focuses the search box when the country list opens", async () => {
    render(<PhoneInput />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));

    expect(document.activeElement).toBe(screen.getByRole("combobox", { name: "Search countries" }));
  });

  it("exports a COUNTRIES table with well-formed entries", () => {
    expect(COUNTRIES.length).toBeGreaterThan(0);

    for (const country of COUNTRIES) {
      expect(country.code).toMatch(/^[A-Z]{2}$/);
      expect(country.dialCode).toMatch(/^\+\d{1,4}$/);
      expect(country.name).not.toBe("");
      expect(country.flag).not.toBe("");
    }

    // Duplicate codes would make the country list ambiguous to select from.
    expect(new Set(COUNTRIES.map((c) => c.code)).size).toBe(COUNTRIES.length);
  });
});

describe("PhoneInput country control and detection", () => {
  const numberField = () => screen.getByRole<HTMLInputElement>("textbox", { name: "Phone number" });

  it("follows an externally changed country prop", async () => {
    function Harness() {
      const [code, setCode] = React.useState("IN");
      return (
        <>
          <button type="button" onClick={() => setCode("GB")}>
            set
          </button>
          <PhoneInput country={code} />
        </>
      );
    }
    render(<Harness />);
    expect(screen.getByText("+91")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "set" }));
    expect(screen.getByText("+44")).toBeInTheDocument();
  });

  it("reports a picked country through onCountryChange, and only on a real change", async () => {
    const onCountryChange = vi.fn();
    render(<PhoneInput onCountryChange={onCountryChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    await userEvent.click(screen.getByRole("option", { name: /India/ }));

    expect(onCountryChange).toHaveBeenCalledTimes(1);
    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ code: "IN" }));

    // Re-picking the country that is already selected is not a change.
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    await userEvent.click(screen.getByRole("option", { name: /India/ }));
    expect(onCountryChange).toHaveBeenCalledTimes(1);
  });

  it("does not report a change for a lowercase country code's own country", async () => {
    const onCountryChange = vi.fn();
    render(<PhoneInput defaultCountry="gb" onCountryChange={onCountryChange} />);
    expect(screen.getByText("+44")).toBeInTheDocument();

    // "gb" resolves to GB for display — re-picking GB is not a transition.
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    await userEvent.click(screen.getByRole("option", { name: /United Kingdom/ }));
    expect(onCountryChange).not.toHaveBeenCalled();

    // A country that actually differs still reports.
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    await userEvent.click(screen.getByRole("option", { name: /France/ }));
    expect(onCountryChange).toHaveBeenCalledTimes(1);
    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ code: "FR" }));
  });

  it("does not report a change when picking the country an unknown code falls back to", async () => {
    const onCountryChange = vi.fn();
    render(<PhoneInput defaultCountry="XX" onCountryChange={onCountryChange} />);
    // An unknown code displays the first offered country.
    expect(screen.getByText("+1")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    await userEvent.click(screen.getByRole("option", { name: /United States/ }));
    expect(onCountryChange).not.toHaveBeenCalled();
  });

  it("keeps a fixed controlled country when the parent ignores onCountryChange", async () => {
    const onCountryChange = vi.fn();
    render(<PhoneInput country="IN" onCountryChange={onCountryChange} />);
    expect(screen.getByText("+91")).toBeInTheDocument();

    await userEvent.click(numberField());
    await userEvent.paste("+44 20 7946 0958");

    // The parent owns the country, so the trigger stays put — but detection
    // still strips the prefix and reports the country it intended.
    expect(screen.getByText("+91")).toBeInTheDocument();
    expect(numberField()).toHaveValue("20 7946 0958");
    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ code: "GB" }));
  });

  it("selects GB when a +44 number is pasted, stripping the prefix", async () => {
    const onValueChange = vi.fn();
    const onCountryChange = vi.fn();
    render(<PhoneInput onValueChange={onValueChange} onCountryChange={onCountryChange} />);

    await userEvent.click(numberField());
    await userEvent.paste("+44 20 7946 0958");

    expect(numberField()).toHaveValue("20 7946 0958");
    expect(screen.getByText("+44")).toBeInTheDocument();
    expect(onCountryChange).toHaveBeenCalledTimes(1);
    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ code: "GB" }));
    expect(onValueChange).toHaveBeenLastCalledWith(
      "20 7946 0958",
      expect.objectContaining({ code: "GB" }),
    );
  });

  it("detects a dial code typed character by character", async () => {
    render(<PhoneInput />);

    await userEvent.type(numberField(), "+919876543210");

    expect(screen.getByText("+91")).toBeInTheDocument();
    expect(numberField()).toHaveValue("9876543210");
  });

  it("drops a dash typed right after the dial code is stripped", async () => {
    render(<PhoneInput />);

    await userEvent.type(numberField(), "+91-9876543210");

    expect(screen.getByText("+91")).toBeInTheDocument();
    expect(numberField()).toHaveValue("9876543210");
  });

  it("drops a dot typed right after the dial code is stripped", async () => {
    render(<PhoneInput />);

    await userEvent.type(numberField(), "+91.9876543210");

    expect(screen.getByText("+91")).toBeInTheDocument();
    expect(numberField()).toHaveValue("9876543210");
  });

  it("drops a space typed right after the dial code is stripped", async () => {
    render(<PhoneInput />);

    await userEvent.type(numberField(), "+91 9876543210");

    expect(screen.getByText("+91")).toBeInTheDocument();
    expect(numberField()).toHaveValue("9876543210");
  });

  it("trims only the separator directly after a pasted dial code", async () => {
    const onCountryChange = vi.fn();
    render(<PhoneInput onCountryChange={onCountryChange} />);

    await userEvent.click(numberField());
    await userEvent.paste("+44-20-7946");

    // The dash after +44 is consumed with the code; the one inside the number
    // is the user's formatting and stays.
    expect(screen.getByText("+44")).toBeInTheDocument();
    expect(numberField()).toHaveValue("20-7946");
    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ code: "GB" }));
  });

  it("leaves anything that is not whitespace, dash or dot after the dial code", async () => {
    render(<PhoneInput />);

    await userEvent.click(numberField());
    await userEvent.paste("+1 (416) 555");

    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(numberField()).toHaveValue("(416) 555");
  });

  it("keeps CA when a +1 number is pasted while CA is selected", async () => {
    const onValueChange = vi.fn();
    const onCountryChange = vi.fn();
    render(
      <PhoneInput
        defaultCountry="CA"
        onValueChange={onValueChange}
        onCountryChange={onCountryChange}
      />,
    );

    await userEvent.click(numberField());
    await userEvent.paste("+1 416 555 0123");

    // The shared +1 code keeps Canada — the flag in the trigger says so.
    expect(screen.getByText("\u{1F1E8}\u{1F1E6}")).toBeInTheDocument();
    expect(onCountryChange).not.toHaveBeenCalled();
    expect(onValueChange).toHaveBeenLastCalledWith(
      "416 555 0123",
      expect.objectContaining({ code: "CA" }),
    );
  });

  it("switches away from a manually picked country when the pasted prefix says otherwise", async () => {
    render(<PhoneInput defaultCountry="GB" />);

    await userEvent.click(numberField());
    await userEvent.paste("+91 98765 43210");

    expect(screen.getByText("+91")).toBeInTheDocument();
    expect(numberField()).toHaveValue("98765 43210");
  });

  it("matches the longest dial code when the offered list has overlapping codes", async () => {
    const overlapping = [
      { code: "AA", dialCode: "+1", name: "Alpha", flag: "\u{1F1E6}\u{1F1E7}" },
      { code: "BB", dialCode: "+123", name: "Beta", flag: "\u{1F1E7}\u{1F1E8}" },
    ];
    const onCountryChange = vi.fn();
    render(
      <PhoneInput countries={overlapping} defaultCountry="AA" onCountryChange={onCountryChange} />,
    );

    await userEvent.click(numberField());
    await userEvent.paste("+12345");

    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ code: "BB" }));
    expect(screen.getByText("+123")).toBeInTheDocument();
    expect(numberField()).toHaveValue("45");
  });

  it("ignores a pasted dial code that is not among the offered countries", async () => {
    const subset = COUNTRIES.filter((c) => ["US", "CA"].includes(c.code));
    const onCountryChange = vi.fn();
    render(<PhoneInput countries={subset} onCountryChange={onCountryChange} />);

    await userEvent.click(numberField());
    await userEvent.paste("+44 20 7946 0958");

    expect(screen.getByText("\u{1F1FA}\u{1F1F8}")).toBeInTheDocument();
    expect(onCountryChange).not.toHaveBeenCalled();
    expect(numberField()).toHaveValue("+44 20 7946 0958");
  });

  it("does not consume digits that were already in the field when + is typed", async () => {
    const onValueChange = vi.fn();
    const onCountryChange = vi.fn();
    render(
      <PhoneInput
        defaultValue="9192"
        defaultCountry="IN"
        onValueChange={onValueChange}
        onCountryChange={onCountryChange}
      />,
    );

    const input = numberField();
    await userEvent.click(input);
    input.setSelectionRange(0, 0);
    await userEvent.keyboard("+");

    // The 91 under the caret is part of the number, not a declared code: the
    // value and the country must both stay put until the code is typed in full.
    expect(input).toHaveValue("+9192");
    expect(onCountryChange).not.toHaveBeenCalled();
    expect(onValueChange).toHaveBeenLastCalledWith(
      "+9192",
      expect.objectContaining({ code: "IN" }),
    );
  });

  it("switches to US when +1 is typed in front of an existing number", async () => {
    const onValueChange = vi.fn();
    const onCountryChange = vi.fn();
    render(
      <PhoneInput
        defaultValue="9192"
        defaultCountry="IN"
        onValueChange={onValueChange}
        onCountryChange={onCountryChange}
      />,
    );

    const input = numberField();
    await userEvent.click(input);
    input.setSelectionRange(0, 0);
    // "+" alone changes nothing, then "1" completes a code the user typed.
    await userEvent.keyboard("+1");

    expect(input).toHaveValue("9192");
    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(onCountryChange).toHaveBeenCalledTimes(1);
    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ code: "US" }));
    expect(onValueChange).toHaveBeenLastCalledWith("9192", expect.objectContaining({ code: "US" }));
  });

  it("never lets a typed code span digits that were already there", async () => {
    const onCountryChange = vi.fn();
    render(
      <PhoneInput defaultValue="9192" defaultCountry="IN" onCountryChange={onCountryChange} />,
    );

    const input = numberField();
    await userEvent.click(input);
    input.setSelectionRange(0, 0);
    // "+4" would read as +49 (Germany) only by borrowing the old 9 — refused.
    await userEvent.keyboard("+4");
    expect(input).toHaveValue("+49192");
    expect(onCountryChange).not.toHaveBeenCalled();

    // A second 4 makes it +44 with both digits typed after the "+" — GB, and
    // the pre-existing tail survives the strip.
    await userEvent.keyboard("4");
    expect(input).toHaveValue("9192");
    expect(onCountryChange).toHaveBeenCalledTimes(1);
    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ code: "GB" }));
  });

  it("leaves a + typed at the end of the number alone", async () => {
    const onCountryChange = vi.fn();
    render(
      <PhoneInput defaultValue="9192" defaultCountry="IN" onCountryChange={onCountryChange} />,
    );

    const input = numberField();
    await userEvent.click(input);
    input.setSelectionRange(input.value.length, input.value.length);
    await userEvent.keyboard("+");

    expect(input).toHaveValue("9192+");
    expect(onCountryChange).not.toHaveBeenCalled();
  });
});

describe("PhoneInput keyboard navigation", () => {
  const searchBox = () => screen.getByRole("combobox", { name: "Search countries" });
  const activeOptionId = () => searchBox().getAttribute("aria-activedescendant");

  it("opens on ArrowDown from the country trigger with the first country active", async () => {
    render(<PhoneInput defaultCountry="IN" />);
    const trigger = screen.getByRole("button", { name: "Select country" });
    trigger.focus();

    await userEvent.keyboard("{ArrowDown}");

    expect(document.activeElement).toBe(searchBox());
    expect(searchBox()).toHaveAttribute("aria-expanded", "true");
    expect(searchBox()).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /United States/ }).id);
  });

  it("lands on the current country when opened with the mouse", async () => {
    render(<PhoneInput defaultCountry="IN" />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));

    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /India/ }).id);
  });

  it("ignores ArrowDown typed into the number field", async () => {
    render(<PhoneInput />);
    screen.getByRole("textbox", { name: "Phone number" }).focus();

    await userEvent.keyboard("{ArrowDown}");

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("moves the active option with ArrowDown and ArrowUp, wrapping at both ends", async () => {
    render(<PhoneInput />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    // Opening by mouse starts on the current selection: United States, index 0.
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /United States/ }).id);

    await userEvent.keyboard("{ArrowDown}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /United Kingdom/ }).id);

    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /Belgium/ }).id);

    await userEvent.keyboard("{ArrowDown}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /United States/ }).id);
  });

  it("jumps to the first and last option with Home and End", async () => {
    render(<PhoneInput />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));

    await userEvent.keyboard("{End}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /Belgium/ }).id);

    await userEvent.keyboard("{Home}");
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /United States/ }).id);
  });

  it("selects the active country with Enter, closes, and focuses the number field", async () => {
    const onValueChange = vi.fn();
    render(<PhoneInput onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));

    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("", expect.objectContaining({ code: "GB" }));
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Phone number" }));
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<PhoneInput />);
    const trigger = screen.getByRole("button", { name: "Select country" });
    await userEvent.click(trigger);

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("keeps number-field keys out of the open country menu", async () => {
    const onValueChange = vi.fn();
    render(<PhoneInput onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button", { name: "Select country" });
    const numberField = screen.getByRole("textbox", { name: "Phone number" });
    await userEvent.click(trigger);
    // The number field stays visible and focusable inside the container, so a
    // click there does not dismiss the menu.
    await userEvent.click(numberField);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // Arrows, Home / End, and Enter belong to the field, not the country list.
    await userEvent.keyboard("{ArrowDown}{End}{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();

    // Escape still closes the menu and returns to the trigger.
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("restarts the highlight at the top when the filter changes", async () => {
    render(<PhoneInput />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    await userEvent.keyboard("{ArrowDown}"); // United Kingdom

    await userEvent.type(searchBox(), "Germ");

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(activeOptionId()).toBe(screen.getByRole("option", { name: /Germany/ }).id);
  });

  it("honours maxHeight on the scrolling country list", async () => {
    render(<PhoneInput maxHeight={240} />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));

    expect(screen.getByRole("listbox").style.maxHeight).toBe("240px");
  });

  it("restricts and orders the menu with the countries prop", async () => {
    const subset = COUNTRIES.filter((c) => ["DE", "FR", "IN"].includes(c.code)).reverse();
    render(<PhoneInput countries={subset} defaultCountry="FR" />);
    expect(screen.getByText("+33")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(
      subset.map((c) => `${c.flag}${c.name}${c.dialCode}`),
    );
  });

  it("falls back to the first given country when defaultCountry is not offered", () => {
    const subset = COUNTRIES.filter((c) => c.code === "IN");
    render(<PhoneInput countries={subset} defaultCountry="US" />);
    expect(screen.getByText("+91")).toBeInTheDocument();
  });

  it("uses custom search placeholder and empty message", async () => {
    render(<PhoneInput searchPlaceholder="Find a country" emptyMessage="Nothing here" />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));

    await userEvent.type(screen.getByPlaceholderText("Find a country"), "zzzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("clears the search with the clear button", async () => {
    render(<PhoneInput />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    await userEvent.type(searchBox(), "Germ");
    expect(screen.getAllByRole("option")).toHaveLength(1);

    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(searchBox()).toHaveValue("");
    expect(screen.getAllByRole("option")).toHaveLength(COUNTRIES.length);
  });

  it("merges classNames onto each part", async () => {
    render(
      <PhoneInput
        className="root-x"
        classNames={{ field: "field-x", trigger: "trigger-x", input: "input-x", list: "list-x" }}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Phone number" });
    expect(input).toHaveClass("input-x");
    expect(input.parentElement).toHaveClass("field-x");
    expect(input.parentElement?.parentElement).toHaveClass("root-x");
    expect(screen.getByRole("button", { name: "Select country" })).toHaveClass("trigger-x");

    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    expect(screen.getByRole("listbox")).toHaveClass("list-x");
  });

  it("applies the size prop to the field height", () => {
    render(<PhoneInput size="lg" />);
    expect(screen.getByRole("textbox").parentElement).toHaveClass("h-10");
  });

  it("does not open the menu while disabled", async () => {
    render(<PhoneInput disabled />);
    const trigger = screen.getByRole("button", { name: "Select country" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});

describe("PhoneInput labels", () => {
  it("renders custom labels in place of the English defaults", async () => {
    render(
      <PhoneInput
        labels={{
          trigger: "Choisir un pays",
          searchPlaceholder: "Rechercher des pays…",
          searchLabel: "Rechercher un pays",
          clearSearch: "Effacer la recherche",
          emptyMessage: "Aucun pays trouvé",
          listbox: "Liste des pays",
        }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Choisir un pays" }));

    const search = screen.getByRole("combobox", { name: "Rechercher un pays" });
    expect(search).toHaveAttribute("placeholder", "Rechercher des pays…");
    expect(screen.getByRole("listbox", { name: "Liste des pays" })).toBeInTheDocument();

    await userEvent.type(search, "zzz");
    expect(screen.getByText("Aucun pays trouvé")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Effacer la recherche" })).toBeInTheDocument();
  });

  it("shows and searches country names in displayLocale", async () => {
    const onValueChange = vi.fn();
    render(<PhoneInput displayLocale="fr" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));

    expect(screen.getByRole("option", { name: /Allemagne/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Germany/ })).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole("combobox"), "Allem");
    expect(screen.getAllByRole("option")).toHaveLength(1);

    // The reported country keeps its stable English `name`.
    await userEvent.click(screen.getByRole("option", { name: /Allemagne/ }));
    expect(onValueChange).toHaveBeenCalledWith(
      "",
      expect.objectContaining({ code: "DE", name: "Germany" }),
    );
  });

  it("falls back to English country names for a malformed displayLocale", async () => {
    render(<PhoneInput displayLocale="not a locale" />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));

    expect(screen.getByRole("option", { name: /Germany/ })).toBeInTheDocument();
  });

  it("matches searches with the display locale's case rules", async () => {
    render(<PhoneInput displayLocale="tr" />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    await userEvent.type(screen.getByRole("combobox"), "israil");

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /İsrail/ })).toBeInTheDocument();
  });

  it("matches country codes without the display locale's case rules", async () => {
    render(<PhoneInput displayLocale="tr" />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));
    await userEvent.type(screen.getByRole("combobox"), "id");

    expect(screen.getByRole("option", { name: /Endonezya/ })).toBeInTheDocument();
  });
});
