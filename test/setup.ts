import "@testing-library/jest-dom/vitest";
import { MotionGlobalConfig } from "motion/react";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

// Animations would hold closed popups in the DOM while they fade out; tests
// assert on the settled state.
MotionGlobalConfig.skipAnimations = true;
