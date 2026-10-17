import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  GitHubCounter,
  RotatingGitHubCounter,
  formatGitHubCount,
} from "../src/components/landing/github-counter";

describe("formatGitHubCount", () => {
  it("formats counts according to friendly bucket rules", () => {
    // Edge cases and boundaries specified in Issue #36
    expect(formatGitHubCount(0)).toBeNull();
    expect(formatGitHubCount(9)).toBeNull();
    expect(formatGitHubCount(10)).toBe("10+");
    expect(formatGitHubCount(150)).toBe("150+");
    expect(formatGitHubCount(999)).toBe("950+");
    expect(formatGitHubCount(1000)).toBe("1k+");
    expect(formatGitHubCount(1234)).toBe("1.2k+");
    expect(formatGitHubCount(12500)).toBe("12.5k+");
  });

  it("returns null for missing, zero, or negative counts", () => {
    expect(formatGitHubCount(null)).toBeNull();
    expect(formatGitHubCount(undefined)).toBeNull();
    expect(formatGitHubCount(-1)).toBeNull();
  });

  it("handles numbers between 10 and 99 by rounding down to tens", () => {
    expect(formatGitHubCount(15)).toBe("10+");
    expect(formatGitHubCount(42)).toBe("40+");
    expect(formatGitHubCount(99)).toBe("90+");
  });

  it("handles numbers between 100 and 999 by rounding down to 50s", () => {
    expect(formatGitHubCount(120)).toBe("100+");
    expect(formatGitHubCount(199)).toBe("150+");
    expect(formatGitHubCount(500)).toBe("500+");
    expect(formatGitHubCount(549)).toBe("500+");
    expect(formatGitHubCount(570)).toBe("550+");
  });
});

describe("GitHubCounter Component", () => {
  it("renders default stars metric with count and accessible label", () => {
    render(<GitHubCounter metric="stars" count={500} />);
    const link = screen.getByRole("link");

    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(link.getAttribute("aria-label")).toBe("Star babelize-elements on GitHub (500+ stars)");
    expect(screen.getByText("500+")).toBeTruthy();
  });

  it("renders fallback with no count when count is null, 0, or below threshold", () => {
    const { container } = render(<GitHubCounter metric="stars" count={0} />);
    const link = screen.getByRole("link");

    expect(link.getAttribute("aria-label")).toBe("Star babelize-elements on GitHub");
    // Never show 0 or 0+
    expect(screen.queryByText("0")).toBeNull();
    expect(screen.queryByText("0+")).toBeNull();
    // Segmented pill structure is still intact
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders forks metric with proper URL and label", () => {
    render(<GitHubCounter metric="forks" count={150} />);
    const link = screen.getByRole("link");

    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements/forks");
    expect(link.getAttribute("aria-label")).toBe("Fork babelize-elements on GitHub (150+ forks)");
    expect(screen.getByText("150+")).toBeTruthy();
  });

  it("renders prs metric with proper URL and label", () => {
    render(<GitHubCounter metric="prs" count={12} />);
    const link = screen.getByRole("link");

    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements/pulls");
    expect(link.getAttribute("aria-label")).toBe(
      "Pull requests for babelize-elements on GitHub (10+ PRs)",
    );
    expect(screen.getByText("10+")).toBeTruthy();
  });

  it("marks all decorative icons and dividers as aria-hidden", () => {
    const { container } = render(<GitHubCounter count={100} />);
    const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenElements.length).toBeGreaterThanOrEqual(2);
  });

  it("allows custom className and forwarded props", () => {
    render(<GitHubCounter count={100} className="custom-pill" data-testid="gh-counter" />);
    const link = screen.getByTestId("gh-counter");
    expect(link.className).toContain("custom-pill");
  });
});

describe("RotatingGitHubCounter Component", () => {
  const createMatchMediaMock = (matches: boolean) => {
    return (query: string): MediaQueryList => ({
      matches: query.includes("prefers-reduced-motion") ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockImplementation(createMatchMediaMock(false));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("cycles stars → forks → PRs → stars every 3 seconds", () => {
    const stats = { stars: 500, forks: 150, prs: 20 };
    render(<RotatingGitHubCounter stats={stats} />);

    const link = screen.getByRole("link");

    // 0s: starts on stars
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(link.getAttribute("aria-label")).toBe("Star babelize-elements on GitHub (500+ stars)");
    expect(screen.getByText("500+")).toBeTruthy();

    // 3s: advances to forks
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements/forks");
    expect(link.getAttribute("aria-label")).toBe("Fork babelize-elements on GitHub (150+ forks)");
    expect(screen.getByText("150+")).toBeTruthy();

    // 6s: advances to PRs
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements/pulls");
    expect(link.getAttribute("aria-label")).toBe(
      "Pull requests for babelize-elements on GitHub (20+ PRs)",
    );
    expect(screen.getByText("20+")).toBeTruthy();

    // 9s: wraps back to stars
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(link.getAttribute("aria-label")).toBe("Star babelize-elements on GitHub (500+ stars)");
    expect(screen.getByText("500+")).toBeTruthy();
  });

  it("pauses rotation on hover and resumes on mouse leave", () => {
    const stats = { stars: 500, forks: 150, prs: 20 };
    render(<RotatingGitHubCounter stats={stats} />);
    const link = screen.getByRole("link");

    // Hover pauses
    fireEvent.mouseEnter(link);
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(screen.getByText("500+")).toBeTruthy();

    // Mouse leave resumes
    fireEvent.mouseLeave(link);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements/forks");
    expect(screen.getByText("150+")).toBeTruthy();
  });

  it("pauses rotation on focus and resumes on blur", () => {
    const stats = { stars: 500, forks: 150, prs: 20 };
    render(<RotatingGitHubCounter stats={stats} />);
    const link = screen.getByRole("link");

    // Focus pauses
    fireEvent.focus(link);
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(screen.getByText("500+")).toBeTruthy();

    // Blur resumes
    fireEvent.blur(link);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements/forks");
    expect(screen.getByText("150+")).toBeTruthy();
  });

  it("respects prefers-reduced-motion and shows stars only without rotation", () => {
    window.matchMedia = vi.fn().mockImplementation(createMatchMediaMock(true));
    const stats = { stars: 500, forks: 150, prs: 20 };
    render(<RotatingGitHubCounter stats={stats} />);
    const link = screen.getByRole("link");

    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(screen.getByText("500+")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(9000);
    });
    // Remains strictly on stars
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(screen.getByText("500+")).toBeTruthy();
  });

  it("skips metrics with no count or below threshold", () => {
    // forks has count < 10 (null formatted), so it should be skipped
    const stats = { stars: 500, forks: 5, prs: 20 };
    render(<RotatingGitHubCounter stats={stats} />);
    const link = screen.getByRole("link");

    // 0s: stars
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(screen.getByText("500+")).toBeTruthy();

    // 3s: skips forks and advances directly to PRs
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements/pulls");
    expect(screen.getByText("20+")).toBeTruthy();

    // 6s: back to stars
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(screen.getByText("500+")).toBeTruthy();
  });

  it("does not rotate when only one metric has a count", () => {
    const stats = { stars: 500, forks: null, prs: null };
    render(<RotatingGitHubCounter stats={stats} />);
    const link = screen.getByRole("link");

    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(screen.getByText("500+")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(9000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(screen.getByText("500+")).toBeTruthy();
  });

  it("renders static stars pill when none of the metrics have a count", () => {
    const stats = { stars: null, forks: null, prs: null };
    render(<RotatingGitHubCounter stats={stats} />);
    const link = screen.getByRole("link");

    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
    expect(link.getAttribute("aria-label")).toBe("Star babelize-elements on GitHub");
    expect(screen.queryByText("+")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(link.getAttribute("href")).toBe("https://github.com/babelize/babelize-elements");
  });

  it("does not set aria-live to avoid screen reader spam", () => {
    const stats = { stars: 500, forks: 150, prs: 20 };
    render(<RotatingGitHubCounter stats={stats} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("aria-live")).toBeNull();
  });

  it("maintains fixed width to prevent navbar layout shift", () => {
    const stats = { stars: 500, forks: 150, prs: 20 };
    render(<RotatingGitHubCounter stats={stats} />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("w-[136px]");
  });
});
