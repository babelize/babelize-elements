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
});
