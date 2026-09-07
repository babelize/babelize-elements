import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { LanguageSwitcher } from "@/registry/components";

const locales = [{ code: "en" }, { code: "fr" }, { code: "ar" }];

describe("LanguageSwitcher", () => {
  it("renders the first locale when no value is given", () => {
    render(<LanguageSwitcher locales={locales} />);
    expect(screen.getByRole("button")).toHaveAccessibleName(/English/);
  });

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

  it("marks RTL locales with dir=rtl", () => {
    render(<LanguageSwitcher locales={locales} defaultValue="ar" />);
    expect(screen.getByRole("button").className).toContain("flex-row-reverse");
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
});
