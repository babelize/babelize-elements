import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MotionGlobalConfig } from "motion/react";
import { LanguageSwitcher, NavBar, PhoneInput } from "@/registry/components";

/**
 * A menu reopened while its exit animation is still running is the same element
 * coming back. Its exit sets `pointer-events: none`, so the enter animation has
 * to restore it, or the reopened menu ignores every click. These tests run real
 * animations, which the shared setup otherwise skips.
 */
describe("menus reopened mid-exit stay clickable", () => {
  beforeEach(() => {
    MotionGlobalConfig.skipAnimations = false;
  });
  afterEach(() => {
    MotionGlobalConfig.skipAnimations = true;
  });

  it("LanguageSwitcher", async () => {
    render(<LanguageSwitcher locales={[{ code: "en" }, { code: "fr" }]} />);
    const trigger = screen.getByRole("button", { name: /Current language/ });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("option", { name: /French/ }));
    expect(trigger).toHaveAccessibleName(/French/);
  });

  it("PhoneInput", async () => {
    render(<PhoneInput defaultCountry="US" />);
    const trigger = screen.getByRole("button", { name: /Select country/ });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("option", { name: /India/ }));
    expect(trigger).toHaveTextContent("+91");
  });

  it("NavBar language menu", async () => {
    render(<NavBar locales={[{ code: "en" }, { code: "fr" }]} />);
    const trigger = () => screen.getAllByRole("button", { name: /Current language/ })[0];
    await userEvent.click(trigger());
    await userEvent.click(trigger());
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: /Français/ }));
    expect(trigger()).toHaveAccessibleName(/Français/);
  });
});
