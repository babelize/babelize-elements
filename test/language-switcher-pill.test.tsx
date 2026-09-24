import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { LanguageSwitcherPill } from "@/registry/components";

const locales = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية", rtl: true },
];

describe("LanguageSwitcherPill", () => {
  it("renders all locales", () => {
    render(<LanguageSwitcherPill locales={locales} />);

    expect(screen.getByRole("radio", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Français" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "العربية" })).toBeInTheDocument();
  });

  it("selects the first locale by default", () => {
    render(<LanguageSwitcherPill locales={locales} />);

    expect(screen.getByRole("radio", { name: "English" })).toHaveAttribute("aria-checked", "true");

    expect(screen.getByRole("radio", { name: "Français" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("honours defaultLocale", () => {
    render(<LanguageSwitcherPill locales={locales} defaultLocale="fr" />);

    expect(screen.getByRole("radio", { name: "Français" })).toHaveAttribute("aria-checked", "true");
  });

  it("falls back to the first locale when the selected locale is unknown", () => {
    render(<LanguageSwitcherPill locales={locales} defaultLocale="unknown" />);

    const english = screen.getByRole("radio", { name: "English" });
    const french = screen.getByRole("radio", { name: "Français" });
    const arabic = screen.getByRole("radio", { name: "العربية" });

    expect(english).toHaveAttribute("aria-checked", "true");
    expect(english).toHaveAttribute("tabindex", "0");

    expect(french).toHaveAttribute("aria-checked", "false");
    expect(french).toHaveAttribute("tabindex", "-1");

    expect(arabic).toHaveAttribute("aria-checked", "false");
    expect(arabic).toHaveAttribute("tabindex", "-1");
  });

  it("calls onLocaleChange when a locale is selected", async () => {
    const onLocaleChange = vi.fn();

    render(<LanguageSwitcherPill locales={locales} onLocaleChange={onLocaleChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "Français" }));

    expect(onLocaleChange).toHaveBeenCalledTimes(1);
    expect(onLocaleChange).toHaveBeenCalledWith("fr");
  });

  it("supports controlled mode", async () => {
    function Harness() {
      const [locale, setLocale] = React.useState("en");

      return (
        <>
          <button type="button" onClick={() => setLocale("fr")}>
            set fr
          </button>

          <LanguageSwitcherPill locales={locales} locale={locale} />
        </>
      );
    }

    render(<Harness />);

    expect(screen.getByRole("radio", { name: "English" })).toHaveAttribute("aria-checked", "true");

    await userEvent.click(screen.getByRole("button", { name: "set fr" }));

    expect(screen.getByRole("radio", { name: "Français" })).toHaveAttribute("aria-checked", "true");
  });

  it("forwards a ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<LanguageSwitcherPill locales={locales} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes unknown props through to the root element", () => {
    render(<LanguageSwitcherPill locales={locales} data-testid="language-switcher-pill" />);

    expect(screen.getByTestId("language-switcher-pill")).toBeInTheDocument();
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<LanguageSwitcherPill locales={locales} />);

    const english = screen.getByRole("radio", { name: "English" });
    const french = screen.getByRole("radio", { name: "Français" });

    english.focus();

    await user.keyboard("{ArrowRight}");

    expect(french).toHaveFocus();
    expect(french).toHaveAttribute("aria-checked", "true");
  });

  it("reverses arrow navigation in RTL", async () => {
    const user = userEvent.setup();

    render(<LanguageSwitcherPill locales={locales} defaultLocale="ar" />);

    const arabic = screen.getByRole("radio", { name: "العربية" });

    const french = screen.getByRole("radio", { name: "Français" });

    arabic.focus();

    await user.keyboard("{ArrowRight}");

    expect(french).toHaveFocus();
    expect(french).toHaveAttribute("aria-checked", "true");
  });

  it("supports Home and End keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<LanguageSwitcherPill locales={locales} />);

    const english = screen.getByRole("radio", { name: "English" });
    const arabic = screen.getByRole("radio", { name: "العربية" });

    english.focus();

    await user.keyboard("{End}");

    expect(arabic).toHaveFocus();
    expect(arabic).toHaveAttribute("aria-checked", "true");

    await user.keyboard("{Home}");

    expect(english).toHaveFocus();
    expect(english).toHaveAttribute("aria-checked", "true");
  });

  it("sets RTL direction for an RTL locale", () => {
    const { container } = render(<LanguageSwitcherPill locales={locales} defaultLocale="ar" />);

    expect(container.firstElementChild).toHaveAttribute("dir", "rtl");
  });

  it("sets LTR direction for an LTR locale", () => {
    const { container } = render(<LanguageSwitcherPill locales={locales} defaultLocale="en" />);

    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");
  });
});
