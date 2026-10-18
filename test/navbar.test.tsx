import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { NavBar } from "@/registry/components";
import { fakeScroller } from "./fake-geometry";

const links = [
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
];
const locales = [{ code: "en" }, { code: "fr" }];

describe("NavBar", () => {
  it("renders links as plain anchors by default (no router required)", () => {
    render(<NavBar links={links} />);
    const docs = screen.getAllByRole("link", { name: "Docs" })[0];
    expect(docs.tagName).toBe("A");
    expect(docs).toHaveAttribute("href", "/docs");
  });

  it("renders links with an injected link component", () => {
    const Custom = ({ href, children, ...rest }: React.ComponentProps<"a">) => (
      <a href={href} data-custom="yes" {...rest}>
        {children}
      </a>
    );
    render(<NavBar links={links} linkComponent={Custom} />);
    expect(screen.getAllByRole("link", { name: "Docs" })[0]).toHaveAttribute("data-custom", "yes");
  });

  it("reports locale changes through onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<NavBar locales={locales} onValueChange={onValueChange} />);

    await userEvent.click(screen.getAllByRole("button", { name: /Current language/ })[0]);
    await userEvent.click(screen.getAllByRole("option", { name: /Français/ })[0]);

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
          <NavBar locales={locales} value={value} />
        </>
      );
    }
    render(<Harness />);
    expect(
      screen.getAllByRole("button", { name: /Current language: English/ })[0],
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "set fr" }));
    expect(
      screen.getAllByRole("button", { name: /Current language: Français/ })[0],
    ).toBeInTheDocument();
  });

  it("selects a language from the mobile bar", async () => {
    // The desktop and mobile bars are both in the DOM; index 1 is the mobile one.
    const onValueChange = vi.fn();
    render(<NavBar locales={locales} onValueChange={onValueChange} />);

    const triggers = screen.getAllByRole("button", { name: /Current language/ });
    await userEvent.click(triggers[1]);
    const options = screen.getAllByRole("option", { name: /Français/ });
    await userEvent.click(options[options.length - 1]);

    expect(onValueChange).toHaveBeenCalledWith("fr");
  });

  it("exposes a single listbox while the language menu is open", async () => {
    render(<NavBar locales={locales} />);
    await userEvent.click(screen.getAllByRole("button", { name: /Current language/ })[0]);

    expect(screen.getAllByRole("listbox")).toHaveLength(1);
  });

  it("closes the language menu on Escape", async () => {
    render(<NavBar locales={locales} />);
    await userEvent.click(screen.getAllByRole("button", { name: /Current language/ })[0]);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it('defaults to the first locale rather than a hardcoded "en"', () => {
    render(<NavBar locales={[{ code: "fr" }, { code: "de" }]} />);

    expect(
      screen.getAllByRole("button", { name: /Current language: Français/ })[0],
    ).toBeInTheDocument();
  });

  it("gives the menu toggle a button type and an expanded state", async () => {
    render(<NavBar links={links} />);
    const toggle = screen.getByRole("button", { name: "Toggle menu" });

    // Without type="button" the toggle submits any form the nav sits inside.
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("restores the page's own body overflow after the mobile menu closes", async () => {
    document.body.style.overflow = "scroll";
    render(<NavBar links={links} />);
    const toggle = screen.getByRole("button", { name: "Toggle menu" });

    await userEvent.click(toggle);
    expect(document.body.style.overflow).toBe("hidden");
    await userEvent.click(toggle);
    expect(document.body.style.overflow).toBe("scroll");

    document.body.style.overflow = "";
  });

  it("forwards a ref to the nav element and spreads extra props", () => {
    const ref = React.createRef<HTMLElement>();
    render(<NavBar ref={ref} aria-label="Main" />);

    expect(ref.current?.tagName).toBe("NAV");
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });
  it("honors flag and label overrides on the trigger", () => {
    // Regression: the trigger used to ignore per-locale overrides entirely.
    render(
      <NavBar locales={[{ code: "en-US", label: "English (US)", flag: "\u{1F1FA}\u{1F1F8}" }]} />,
    );
    const trigger = screen.getAllByRole("button", {
      name: "Current language: English (US)",
    })[0];
    expect(trigger).toHaveTextContent("\u{1F1FA}\u{1F1F8}");
  });

  it("honors overrides in the option rows", async () => {
    render(
      <NavBar locales={[{ code: "en-US", label: "English (US)", flag: "\u{1F1FA}\u{1F1F8}" }]} />,
    );
    await userEvent.click(screen.getAllByRole("button", { name: /Current language/ })[0]);
    expect(screen.getAllByRole("option", { name: /English \(US\)/ })[0]).toHaveTextContent(
      "\u{1F1FA}\u{1F1F8}",
    );
  });

  it("falls back to the base language for regional codes without overrides", () => {
    // Regression: "en-US" used to render as "EN-US" with a globe emoji.
    render(<NavBar locales={[{ code: "en-US" }]} />);
    const trigger = screen.getAllByRole("button", {
      name: "Current language: English",
    })[0];
    expect(trigger).toHaveTextContent("\u{1F1FA}\u{1F1F8}");
  });
});

describe("NavBar direction", () => {
  it("mirrors the bar when selecting an RTL locale and switches back for LTR", async () => {
    render(<NavBar locales={[{ code: "en" }, { code: "ar" }]} />);
    const bar = screen.getByRole("navigation");
    const trigger = () => screen.getAllByRole("button", { name: /Current language/ })[0];
    expect(bar).toHaveAttribute("dir", "ltr");
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: /العربية/ }));
    expect(bar).toHaveAttribute("dir", "rtl");
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: /English/ }));
    expect(bar).toHaveAttribute("dir", "ltr");
  });

  it.each([
    { code: "en", rtl: true, expected: "rtl" },
    { code: "ar", rtl: false, expected: "ltr" },
    { code: "ar-EG", rtl: undefined, expected: "rtl" },
  ])("resolves $code with rtl=$rtl to $expected", ({ code, rtl, expected }) => {
    render(<NavBar locales={[{ code, rtl }]} />);
    expect(screen.getByRole("navigation")).toHaveAttribute("dir", expected);
  });

  it.each(["ltr", "rtl", "auto"])("honors an explicit dir=%s", (dir) => {
    render(<NavBar locales={[{ code: "ar" }]} dir={dir} />);
    expect(screen.getByRole("navigation")).toHaveAttribute("dir", dir);
  });

  it("follows controlled locale updates", () => {
    const { rerender } = render(<NavBar locales={[{ code: "en" }, { code: "ar" }]} value="en" />);
    rerender(<NavBar locales={[{ code: "en" }, { code: "ar" }]} value="ar" />);
    expect(screen.getByRole("navigation")).toHaveAttribute("dir", "rtl");
  });

  it.each([0, 1])("keeps each option's direction in menu %i", async (triggerIndex) => {
    render(
      <NavBar
        locales={[
          { code: "en" },
          { code: "ar" },
          { code: "fr", rtl: true },
          { code: "he", rtl: false },
        ]}
      />,
    );
    await userEvent.click(
      screen.getAllByRole("button", { name: /Current language/ })[triggerIndex],
    );
    const options = screen.getAllByRole("option");
    expect(options.map((option) => option.getAttribute("dir"))).toEqual([
      "ltr",
      "rtl",
      "rtl",
      "ltr",
    ]);
  });
});

describe("NavBar keyboard navigation", () => {
  const triggers = () => screen.getAllByRole("button", { name: /Current language/ });
  // Index 0 is the desktop bar, index 1 the mobile one — both live in the DOM.
  const desktopTrigger = () => triggers()[0];
  const mobileTrigger = () => triggers()[1];

  it("opens on ArrowDown with focus on the first option", async () => {
    render(<NavBar locales={locales} />);
    desktopTrigger().focus();

    await userEvent.keyboard("{ArrowDown}");

    const options = screen.getAllByRole("option");
    expect(screen.getAllByRole("listbox")).toHaveLength(1);
    expect(document.activeElement).toBe(options[0]);
    // Roving tabindex: the active option joins the tab order, the rest skip it.
    expect(options[0]).toHaveAttribute("tabindex", "0");
    expect(options[1]).toHaveAttribute("tabindex", "-1");
  });

  it("moves focus with ArrowDown and ArrowUp, wrapping at both ends", async () => {
    render(<NavBar locales={locales} />);
    await userEvent.click(desktopTrigger());
    const options = screen.getAllByRole("option");

    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(options[1]);

    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(options[0]);

    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(options[1]);
  });

  it("jumps to the first and last option with Home and End", async () => {
    render(<NavBar locales={locales} />);
    await userEvent.click(desktopTrigger());

    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getAllByRole("option")[1]);

    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getAllByRole("option")[0]);
  });

  it("picks the active language with Enter, closes, and returns focus to the trigger", async () => {
    const onValueChange = vi.fn();
    render(<NavBar locales={locales} onValueChange={onValueChange} />);
    const trigger = desktopTrigger();
    trigger.focus();

    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("fr");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("navigates and returns focus to the mobile trigger for the mobile bar", async () => {
    render(<NavBar locales={locales} />);
    const trigger = mobileTrigger();
    trigger.focus();

    await userEvent.keyboard("{ArrowDown}");
    const options = screen.getAllByRole("option");
    expect(screen.getAllByRole("listbox")).toHaveLength(1);
    expect(document.activeElement).toBe(options[0]);

    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(options[options.length - 1]);

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("keeps focus on the trigger when the menu is opened with the mouse", async () => {
    render(<NavBar locales={locales} />);
    const trigger = desktopTrigger();
    await userEvent.click(trigger);

    expect(document.activeElement).toBe(trigger);
    expect(screen.getAllByRole("option")[0]).toHaveAttribute("data-active", "true");
  });

  it("does not steal focus when Escape arrives while the menu is closed", async () => {
    render(<NavBar locales={locales} />);
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    toggle.focus();

    await userEvent.keyboard("{Escape}");

    expect(document.activeElement).toBe(toggle);
  });

  it("keeps the language menu inside its own scroll container", async () => {
    render(<NavBar locales={locales} />);
    await userEvent.click(desktopTrigger());

    // Without its own scroll area a long menu made the page scroll instead.
    const listbox = screen.getByRole("listbox");
    expect(listbox.className).toContain("overflow-y-auto");
    expect(listbox.style.maxHeight).toBe("15rem");
  });

  it("honours maxHeight on the language menu", async () => {
    render(<NavBar locales={locales} maxHeight="60vh" />);
    await userEvent.click(desktopTrigger());

    expect(screen.getByRole("listbox").style.maxHeight).toBe("60vh");
  });

  it("pins the highlight and scrolls the menu, not the page, under roving focus", async () => {
    render(<NavBar locales={locales} />);
    await userEvent.click(desktopTrigger());
    // jsdom has no layout, so fake two 80px rows overflowing a 100px viewport.
    const scroller = fakeScroller(screen.getByRole("listbox"), screen.getAllByRole("option"), {
      itemHeight: 80,
    });

    await userEvent.keyboard("{ArrowDown}");

    expect(screen.getAllByRole("option")[1]).toHaveAttribute("data-active", "true");
    expect(scroller.scrollTop).toBe(60); // clamped: 160px of content, 100px viewport
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);
  });
});
