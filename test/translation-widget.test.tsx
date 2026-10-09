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

  it("does not set dir on the root for an RTL or LTR target", () => {
    const { container, rerender } = render(
      <TranslationWidget sourceLocale="en" targetLocale="ar" sourceText="Hello" />,
    );
    expect(container.firstElementChild).not.toHaveAttribute("dir");

    rerender(<TranslationWidget sourceLocale="en" targetLocale="fr" sourceText="Hello" />);
    expect(container.firstElementChild).not.toHaveAttribute("dir");
  });

  it("keeps the source pane before the target pane for an RTL target", () => {
    render(<TranslationWidget sourceLocale="en" targetLocale="ar" sourceText="Hello" />);
    const source = screen.getByRole("textbox", { name: /source text/i });
    const target = screen.getByRole("textbox", { name: /target text/i });
    expect(source.closest("div")?.parentElement?.firstElementChild?.contains(source)).toBe(true);
    expect(source.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("detects RTL from an explicit script subtag", () => {
    const { rerender } = render(
      <TranslationWidget sourceLocale="en" targetLocale="az-Arab" sourceText="Hello" />,
    );
    expect(screen.getByRole("textbox", { name: /target text/i })).toHaveAttribute("dir", "rtl");

    rerender(<TranslationWidget sourceLocale="en" targetLocale="az-Latn" sourceText="Hello" />);
    expect(screen.getByRole("textbox", { name: /target text/i })).toHaveAttribute("dir", "ltr");
  });

  it("does not reverse an RTL row twice", () => {
    const { container } = render(
      <TranslationWidget sourceLocale="en" targetLocale="ar" sourceText="Hello" />,
    );
    const row = container.firstElementChild?.firstElementChild;
    expect(row?.className).toContain("flex");
    expect(row?.className).not.toContain("flex-row-reverse");
  });

  it("keeps the target pane editable when a change handler is provided", async () => {
    const onTargetChange = vi.fn();
    render(
      <TranslationWidget
        sourceLocale="en"
        targetLocale="fr"
        sourceText="Hello"
        targetText="Bonjour"
        onTargetChange={onTargetChange}
      />,
    );
    const target = screen.getByRole("textbox", { name: /target text/i });
    expect(target).not.toHaveAttribute("readonly");

    await userEvent.type(target, "!");
    expect(onTargetChange).toHaveBeenLastCalledWith("Bonjour!");
  });

  it("keeps an uncontrolled target editable without a change handler", async () => {
    render(
      <TranslationWidget
        sourceLocale="en"
        targetLocale="fr"
        sourceText="Hello"
        defaultTargetText="Bonjour"
      />,
    );
    const target = screen.getByRole("textbox", { name: /target text/i });
    expect(target).not.toHaveAttribute("readonly");

    await userEvent.type(target, "!");
    expect(target).toHaveValue("Bonjour!");
  });

  it("makes the target pane read-only when controlled without a handler", () => {
    render(
      <TranslationWidget
        sourceLocale="en"
        targetLocale="fr"
        sourceText="Hello"
        targetText="Bonjour"
      />,
    );
    expect(screen.getByRole("textbox", { name: /target text/i })).toHaveAttribute("readonly");
  });

  it("lets a caller override the direction", () => {
    const { container } = render(
      <TranslationWidget sourceLocale="en" targetLocale="ar" sourceText="Hello" dir="rtl" />,
    );
    expect(container.firstElementChild).toHaveAttribute("dir", "rtl");
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
