import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { NavBar } from "@/registry/components";

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
