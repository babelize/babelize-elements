import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { TranslationWidget } from "@/registry/components";

describe("TranslationWidget", () => {
  it("renders the source text and an empty target", () => {
    render(<TranslationWidget sourceLocale="en" targetLocale="fr" sourceText="Hello, world!" />);
    expect(screen.getByRole("textbox", { name: /source text/i })).toHaveValue("Hello, world!");
    expect(screen.getByRole("textbox", { name: /target text/i })).toHaveValue("");
  });

  it("honours defaultTargetText", () => {
    render(
      <TranslationWidget
        sourceLocale="en"
        targetLocale="fr"
        sourceText="Hello"
        defaultTargetText="Bonjour"
      />,
    );
    expect(screen.getByRole("textbox", { name: /target text/i })).toHaveValue("Bonjour");
  });

  it("calls onTargetChange when the target is edited", async () => {
    const onTargetChange = vi.fn();
    render(
      <TranslationWidget
        sourceLocale="en"
        targetLocale="fr"
        sourceText="Hello"
        onTargetChange={onTargetChange}
      />,
    );

    await userEvent.type(screen.getByRole("textbox", { name: /target text/i }), "Bonjour");

    expect(onTargetChange).toHaveBeenCalled();
    expect(onTargetChange).toHaveBeenLastCalledWith("Bonjour");
  });

  it("follows an externally changed targetText prop (controlled mode)", async () => {
    function Harness() {
      const [text, setText] = React.useState("Hello");
      return (
        <>
          <button type="button" onClick={() => setText("Bonjour")}>
            translate
          </button>
          <TranslationWidget
            sourceLocale="en"
            targetLocale="fr"
            sourceText="Hello"
            targetText={text}
          />
        </>
      );
    }
    render(<Harness />);
    expect(screen.getByRole("textbox", { name: /target text/i })).toHaveValue("Hello");

    await userEvent.click(screen.getByRole("button", { name: "translate" }));
    expect(screen.getByRole("textbox", { name: /target text/i })).toHaveValue("Bonjour");
  });

  it("keeps the source pane read-only without onSourceChange", () => {
    render(<TranslationWidget sourceLocale="en" targetLocale="fr" sourceText="Hello" />);
    expect(screen.getByRole("textbox", { name: /source text/i })).toHaveAttribute("readonly");
  });

  it("makes the source pane editable when onSourceChange is provided", async () => {
    const onSourceChange = vi.fn();
    render(
      <TranslationWidget
        sourceLocale="en"
        targetLocale="fr"
        sourceText="Hello"
        onSourceChange={onSourceChange}
      />,
    );
    const source = screen.getByRole("textbox", { name: /source text/i });
    expect(source).not.toHaveAttribute("readonly");

    await userEvent.type(source, "!");
    expect(onSourceChange).toHaveBeenLastCalledWith("Hello!");
  });

  it("lets readOnlySource force the source pane read-only", () => {
    render(
      <TranslationWidget
        sourceLocale="en"
        targetLocale="fr"
        sourceText="Hello"
        onSourceChange={() => {}}
        readOnlySource
      />,
    );
    expect(screen.getByRole("textbox", { name: /source text/i })).toHaveAttribute("readonly");
  });

  it("marks the target pane rtl and ltr otherwise", () => {
    const { rerender } = render(
      <TranslationWidget sourceLocale="en" targetLocale="ar" sourceText="Hello" />,
    );
    expect(screen.getByRole("textbox", { name: /target text/i })).toHaveAttribute("dir", "rtl");

    rerender(<TranslationWidget sourceLocale="en" targetLocale="fr" sourceText="Hello" />);
    expect(screen.getByRole("textbox", { name: /target text/i })).toHaveAttribute("dir", "ltr");
  });

  it("sets lang on each pane", () => {
    render(<TranslationWidget sourceLocale="en" targetLocale="ja" sourceText="Hello" />);
    expect(screen.getByRole("textbox", { name: /source text/i })).toHaveAttribute("lang", "en");
    expect(screen.getByRole("textbox", { name: /target text/i })).toHaveAttribute("lang", "ja");
  });

  it("flips the widget direction for an RTL target and not for LTR", () => {
    const { container, rerender } = render(
      <TranslationWidget sourceLocale="en" targetLocale="ar" sourceText="Hello" />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "rtl");

    rerender(<TranslationWidget sourceLocale="en" targetLocale="fr" sourceText="Hello" />);
    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");
  });

  it("does not reverse an RTL row twice", () => {
    const { container } = render(
      <TranslationWidget sourceLocale="en" targetLocale="ar" sourceText="Hello" />,
    );
    const row = container.firstElementChild?.firstElementChild;
    expect(row?.className).toContain("flex");
    expect(row?.className).not.toContain("flex-row-reverse");
  });

  it("lets a caller override the direction", () => {
    const { container } = render(
      <TranslationWidget sourceLocale="en" targetLocale="ar" sourceText="Hello" dir="ltr" />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "ltr");
  });

  it("forwards a ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<TranslationWidget sourceLocale="en" targetLocale="fr" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes unknown props through to the root element", () => {
    render(<TranslationWidget sourceLocale="en" targetLocale="fr" data-testid="widget" />);
    expect(screen.getByTestId("widget")).toBeInTheDocument();
  });

  it("gives both panes distinct accessible names", () => {
    render(<TranslationWidget sourceLocale="en" targetLocale="fr" />);
    expect(screen.getByRole("textbox", { name: "Source text (English)" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Target text (French)" })).toBeInTheDocument();
  });

  it("lets a caller override the pane labels", () => {
    render(
      <TranslationWidget
        sourceLocale="en"
        targetLocale="fr"
        sourceLabel="Original"
        targetLabel="Translation"
      />,
    );
    expect(screen.getByRole("textbox", { name: "Original (English)" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Translation (French)" })).toBeInTheDocument();
  });
});
