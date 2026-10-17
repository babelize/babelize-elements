import * as React from "react";
import { Star, GitFork, GitPullRequest } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GitHubStats } from "@/lib/github";

export type GitHubMetric = "stars" | "forks" | "prs";

export interface GitHubCounterProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  metric?: GitHubMetric;
  count?: number | null;
  hideCountOnMobile?: boolean;
}

/**
 * Format a raw GitHub count into a friendly bucket followed by `+`.
 * - Numbers below 10 (or missing/0) return `null` so no count is shown.
 * - 10-99 round down to the nearest 10 (e.g. 10+, 40+).
 * - 100-999 round down to the nearest 50 (e.g. 150+, 500+, 950+).
 * - 1000+ use Intl.NumberFormat compact notation rounded down to 1 decimal place (e.g. 1k+, 1.2k+, 12.5k+).
 */
export function formatGitHubCount(count?: number | null): string | null {
  if (count == null || count < 10) {
    return null;
  }
  if (count < 100) {
    const bucket = Math.floor(count / 10) * 10;
    return `${bucket}+`;
  }
  if (count < 1000) {
    const bucket = Math.floor(count / 50) * 50;
    return `${bucket}+`;
  }
  const rounded = Math.floor(count / 100) * 100;
  const formatted = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(rounded)
    .toLowerCase();
  return `${formatted}+`;
}

const metricConfig = {
  stars: {
    label: "Star babelize-elements on GitHub",
    noun: "stars",
    href: "https://github.com/babelize/babelize-elements",
    icon: Star,
  },
  forks: {
    label: "Fork babelize-elements on GitHub",
    noun: "forks",
    href: "https://github.com/babelize/babelize-elements/forks",
    icon: GitFork,
  },
  prs: {
    label: "Pull requests for babelize-elements on GitHub",
    noun: "PRs",
    href: "https://github.com/babelize/babelize-elements/pulls",
    icon: GitPullRequest,
  },
} as const;

export function GitHubCounter({
  metric = "stars",
  count,
  hideCountOnMobile = false,
  className,
  ...props
}: GitHubCounterProps) {
  const config = metricConfig[metric] ?? metricConfig.stars;
  const formattedCount = formatGitHubCount(count);
  const MetricIcon = config.icon;

  const ariaLabel = formattedCount
    ? `${config.label} (${formattedCount} ${config.noun})`
    : config.label;

  return (
    <a
      href={props.href ?? config.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "group inline-flex h-9 items-center rounded-full border border-white/[0.1] bg-white/[0.03] text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white",
        className,
      )}
      {...props}
    >
      {/* Left: GitHub logo */}
      <span className="flex items-center justify-center pl-3 pr-2.5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="size-4 text-white/80 transition-colors group-hover:text-white"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </span>

      {/* 1px vertical divider */}
      <span className="h-3.5 w-px bg-white/[0.1]" aria-hidden="true" />

      {/* Right: Count and metric icon */}
      <span className="flex items-center gap-1.5 pl-2.5 pr-3">
        {formattedCount && (
          <span
            className={cn(
              "text-xs font-medium sm:text-sm",
              hideCountOnMobile && "hidden sm:inline",
            )}
          >
            {formattedCount}
          </span>
        )}
        <MetricIcon
          size={14}
          className="text-white/70 transition-colors group-hover:text-white"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}

export interface RotatingGitHubCounterProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> {
  stats?: GitHubStats;
  intervalMs?: number;
  className?: string;
}

/**
 * Navbar GitHub counter that smoothly cycles between available traction metrics:
 * stars → forks → PRs → stars (every 3 seconds).
 *
 * Features:
 * - Client component; data fetched on server and passed via props.
 * - Short fade/slide transition between metrics.
 * - Link (href) and aria-label follow the currently visible metric.
 * - Pauses rotation on hover and focus.
 * - Respects prefers-reduced-motion: no rotation, stays on stars.
 * - No aria-live (avoids screen reader announcement spam every 3s).
 * - Fixed width across metrics to prevent navbar layout shifts.
 * - Skips metrics with no count (< 10 or null). If none have a count, renders static stars pill.
 */
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(callback);
    return () => mediaQuery.removeListener(callback);
  }
  return () => {};
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function RotatingGitHubCounter({
  stats,
  intervalMs = 3000,
  className,
  ...props
}: RotatingGitHubCounterProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const prefersReducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  // Filter metrics that have a valid formatted count (>= 10)
  // Preserves strict cycle order: stars -> forks -> prs
  const availableMetrics = React.useMemo(() => {
    const list: GitHubMetric[] = [];
    if (formatGitHubCount(stats?.stars) !== null) list.push("stars");
    if (formatGitHubCount(stats?.forks) !== null) list.push("forks");
    if (formatGitHubCount(stats?.prs) !== null) list.push("prs");
    return list;
  }, [stats?.stars, stats?.forks, stats?.prs]);

  const hasValidCounts = availableMetrics.length > 0;

  // Rotation timer: cycle every 3s, pause on hover/focus, no rotation on reduced motion
  React.useEffect(() => {
    if (prefersReducedMotion || isPaused || availableMetrics.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % availableMetrics.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [prefersReducedMotion, isPaused, availableMetrics.length, intervalMs]);

  // If none have a count, show the static stars pill
  if (!hasValidCounts) {
    return <GitHubCounter metric="stars" count={null} className={className} {...props} />;
  }

  // Active metric: force stars if prefers-reduced-motion is true
  const activeMetric: GitHubMetric = prefersReducedMotion
    ? "stars"
    : availableMetrics[currentIndex % availableMetrics.length];

  const config = metricConfig[activeMetric] ?? metricConfig.stars;
  const rawCount = stats?.[activeMetric] ?? null;
  const formattedCount = formatGitHubCount(rawCount);
  const MetricIcon = config.icon;

  const ariaLabel = formattedCount
    ? `${config.label} (${formattedCount} ${config.noun})`
    : config.label;

  return (
    <a
      href={props.href ?? config.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        "group inline-flex h-9 w-[136px] items-center justify-between rounded-full border border-white/[0.1] bg-white/[0.03] text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white",
        className,
      )}
      {...props}
    >
      {/* Left: GitHub logo */}
      <span className="flex items-center justify-center pl-3 pr-2.5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="size-4 text-white/80 transition-colors group-hover:text-white"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      </span>

      {/* 1px vertical divider */}
      <span className="h-3.5 w-px bg-white/[0.1]" aria-hidden="true" />

      {/* Right: Count and metric icon with fade/slide transition */}
      <span className="flex flex-1 items-center justify-center gap-1.5 pl-2 pr-3 overflow-hidden">
        <span
          key={activeMetric}
          className="inline-flex items-center gap-1.5 motion-safe:animate-counter-in"
        >
          {formattedCount && (
            <span className="text-xs font-medium sm:text-sm">{formattedCount}</span>
          )}
          <MetricIcon
            size={14}
            className="text-white/70 transition-colors group-hover:text-white"
            aria-hidden="true"
          />
        </span>
      </span>
    </a>
  );
}
