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

  it("still accepts the deprecated currentLocale and onLocaleChange props", async () => {
    const onLocaleChange = vi.fn();
    render(<NavBar locales={locales} currentLocale="fr" onLocaleChange={onLocaleChange} />);

    expect(
      screen.getAllByRole("button", { name: /Current language: Français/ })[0],
    ).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("button", { name: /Current language/ })[0]);
    await userEvent.click(screen.getAllByRole("option", { name: /English/ })[0]);

    expect(onLocaleChange).toHaveBeenCalledWith("en");
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

  it("forwards a ref to the nav element and spreads extra props", () => {
    const ref = React.createRef<HTMLElement>();
    render(<NavBar ref={ref} aria-label="Main" />);

    expect(ref.current?.tagName).toBe("NAV");
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });
});
