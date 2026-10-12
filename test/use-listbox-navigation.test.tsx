import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { fakeScroller } from "./fake-geometry";
import { useListboxNavigation } from "@/lib/use-listbox-navigation";
import type { ListboxStrategy } from "@/lib/use-listbox-navigation";

/**
 * The component suites cover the navigation keys end to end. These tests pin the
 * hook's own edge cases: an empty option list, a list that shrinks under the
 * highlight, and the two focus strategies.
 */
function Harness({
  count,
  strategy,
  open = true,
  initialIndex,
}: {
  count: number;
  strategy?: ListboxStrategy;
  open?: boolean;
  initialIndex?: number;
}) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const nav = useListboxNavigation({
    count,
    open,
    strategy,
    initialIndex,
    onClose: () => {},
    onSelect: () => {},
    triggerRef: () => triggerRef.current,
  });

  return (
    <div onKeyDown={nav.onKeyDown}>
      <button ref={triggerRef} type="button">
        trigger
      </button>
      <input aria-label="search" {...nav.comboboxProps} />
      <div role="listbox" aria-label="options" {...nav.listboxProps}>
        {Array.from({ length: count }, (_, index) => (
          <button key={index} role="option" aria-selected="false" {...nav.optionProps(index)}>
            {`Option ${index}`}
          </button>
        ))}
      </div>
    </div>
  );
}

describe("useListboxNavigation", () => {
  const searchBox = () => screen.getByRole("combobox", { name: "search" });

  it("keeps the navigation keys harmless on an empty option list", async () => {
    render(<Harness count={0} />);
    searchBox().focus();

    await userEvent.keyboard("{ArrowDown}{ArrowUp}{Home}{End}{Enter}");

    expect(searchBox()).not.toHaveAttribute("aria-activedescendant");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("keeps the highlight in range when the option list shrinks", async () => {
    const { rerender } = render(<Harness count={3} />);
    searchBox().focus();

    await userEvent.keyboard("{End}");
    expect(searchBox()).toHaveAttribute(
      "aria-activedescendant",
      screen.getAllByRole("option")[2].id,
    );

    rerender(<Harness count={1} />);
    expect(searchBox()).toHaveAttribute(
      "aria-activedescendant",
      screen.getAllByRole("option")[0].id,
    );
  });

  it("keeps options out of the tab order under activedescendant focus", () => {
    render(<Harness count={2} />);

    for (const option of screen.getAllByRole("option")) {
      expect(option).toHaveAttribute("tabindex", "-1");
    }
  });

  it("moves real focus onto the active option under roving focus", async () => {
    render(<Harness count={3} strategy="roving" />);
    screen.getByRole("button", { name: "trigger" }).focus();

    await userEvent.keyboard("{ArrowDown}");

    expect(document.activeElement).toBe(screen.getAllByRole("option")[1]);
    expect(screen.getAllByRole("option")[1]).toHaveAttribute("tabindex", "0");
    expect(screen.getAllByRole("option")[0]).toHaveAttribute("tabindex", "-1");
  });

  it("exposes a stable id per option and on the listbox", () => {
    render(<Harness count={2} />);
    const listbox = screen.getByRole("listbox");

    expect(searchBox()).toHaveAttribute("aria-controls", listbox.id);
    for (const [index, option] of screen.getAllByRole("option").entries()) {
      expect(option.id).toBe(`${listbox.id}-option-${index}`);
    }
  });

  describe("pinning the highlight", () => {
    function scrollHarness(count = 8) {
      const view = render(<Harness count={count} />);
      const listbox = screen.getByRole("listbox");
      const scroller = fakeScroller(listbox, screen.getAllByRole("option"));
      searchBox().focus();
      return { scroller, rerender: (next: React.ReactElement) => view.rerender(next) };
    }

    it("keeps the highlight on its opening row while the list scrolls beneath it", async () => {
      const { scroller } = scrollHarness();

      await userEvent.keyboard("{ArrowDown}");
      expect(scroller.scrollTop).toBe(40);
      await userEvent.keyboard("{ArrowDown}");
      expect(scroller.scrollTop).toBe(80); // the third row now sits on the anchor...
      await userEvent.keyboard("{ArrowDown}");
      expect(scroller.scrollTop).toBe(120); // ...and stays there as the list moves
    });

    it("sticks to the ends of the list instead of scrolling past them", async () => {
      const { scroller } = scrollHarness();

      await userEvent.keyboard("{End}");
      expect(scroller.scrollTop).toBe(220); // content 320px, viewport 100px

      await userEvent.keyboard("{Home}");
      expect(scroller.scrollTop).toBe(0);
    });

    it("never scrolls the page", async () => {
      scrollHarness();

      await userEvent.keyboard("{End}{Home}{End}");

      expect(document.documentElement.scrollTop).toBe(0);
      expect(document.body.scrollTop).toBe(0);
    });

    it("starts a new option list unscrolled", async () => {
      const { scroller, rerender } = scrollHarness();
      await userEvent.keyboard("{End}");
      expect(scroller.scrollTop).toBe(220);

      rerender(<Harness count={1} />);

      expect(scroller.scrollTop).toBe(0);
    });

    it("reveals a selection below the fold, pinned to the last visible row", async () => {
      // The popup mounts when it opens, so the fake geometry can go first.
      const view = render(<Harness count={8} initialIndex={6} open={false} />);
      const scroller = fakeScroller(screen.getByRole("listbox"), screen.getAllByRole("option"));
      view.rerender(<Harness count={8} initialIndex={6} />);

      // Row 6 would sit 240px down, past a 100px viewport: it is scrolled up
      // onto the anchor row instead of being pinned out of sight.
      expect(scroller.scrollTop).toBe(180);
      searchBox().focus();

      await userEvent.keyboard("{ArrowDown}");
      expect(scroller.scrollTop).toBe(220); // clamped — the last row sticks to the bottom

      await userEvent.keyboard("{Home}");
      expect(scroller.scrollTop).toBe(0); // ...and the first row to the top
      expect(document.documentElement.scrollTop).toBe(0);
      expect(document.body.scrollTop).toBe(0);
    });

    it("re-highlights on hover without scrolling the list", async () => {
      const { scroller } = scrollHarness();
      const option = screen.getAllByRole("option")[6];

      await userEvent.hover(option);

      expect(option).toHaveAttribute("data-active", "true");
      expect(scroller.scrollTop).toBe(0);
    });
  });
});
