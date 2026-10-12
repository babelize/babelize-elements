import { vi } from "vitest";

/** jsdom has no layout: a stand-in for the parts of a DOMRect the hook reads. */
export function rect(top: number, bottom: number): DOMRect {
  return {
    top,
    bottom,
    height: bottom - top,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };
}

/**
 * jsdom has no layout: this gives a listbox a working `scrollTop` and option
 * rectangles that respond to it, so the hook's pinning math runs against
 * realistic geometry. Options are laid out edge to edge at `itemHeight`, and
 * `scrollTop` clamps to the scrollable range exactly like a browser's.
 */
export function fakeScroller(
  listbox: HTMLElement,
  options: HTMLElement[],
  { itemHeight = 40, height = 100 }: { itemHeight?: number; height?: number } = {},
) {
  let scrollTop = 0;
  const maxScrollTop = Math.max(0, options.length * itemHeight - height);

  Object.defineProperty(listbox, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (value: number) => {
      scrollTop = Math.min(Math.max(value, 0), maxScrollTop);
    },
  });
  Object.defineProperty(listbox, "clientHeight", {
    configurable: true,
    get: () => height,
  });
  vi.spyOn(listbox, "getBoundingClientRect").mockImplementation(() => rect(0, height));
  for (const [index, option] of options.entries()) {
    vi.spyOn(option, "getBoundingClientRect").mockImplementation(() => {
      const top = index * itemHeight - scrollTop;
      return rect(top, top + itemHeight);
    });
  }

  return {
    get scrollTop() {
      return scrollTop;
    },
  };
}
