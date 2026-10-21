"use client";

import * as React from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useIsPresent,
  type HTMLMotionProps,
} from "motion/react";
import { ArrowRightIcon, CheckIcon, ChevronDownIcon, GlobeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/use-controllable-state";
import { useListboxNavigation } from "@/lib/use-listbox-navigation";
import type { Locale } from "./types";
import { getFlag, getLanguageName, isRtl } from "./locale-data";

export type { Locale };

export interface NavLink {
  /** Visible link text */
  label: string;
  /** Destination passed to `linkComponent` as `href` */
  href: string;
}

/** Built-in UI text. Every key is optional in `labels`; omitted keys keep the English default. */
export interface NavBarLabels {
  /** Accessible label for the language list (default: "Select language") */
  listbox: string;
  /** Accessible label for the language menu triggers (default: "Current language: {name}") */
  current: (name: string) => string;
  /** Accessible label for the mobile menu button (default: "Toggle menu") */
  toggleMenu: string;
  /** Accessible label for the GitHub icon link (default: "GitHub") */
  github: string;
}

const DEFAULT_LABELS: NavBarLabels = {
  listbox: "Select language",
  current: (name) => `Current language: ${name}`,
  toggleMenu: "Toggle menu",
  github: "GitHub",
};

/** Per-part class overrides, merged after the defaults with `cn`. */
export interface NavBarClassNames {
  /** The `<nav>` element (same as `className`) */
  root?: string;
  /** The bar itself — the full-width row, or the floating card */
  container?: string;
  /** The desktop link group */
  links?: string;
  /** Each link, on desktop and in the mobile menu */
  link?: string;
  /** The desktop group holding the language menu, GitHub link and CTA */
  actions?: string;
  /** The call-to-action button, on desktop and in the mobile menu */
  cta?: string;
  /** The language menu triggers */
  languageTrigger?: string;
  /** The language menu panel */
  languageContent?: string;
  /** Each language option */
  languageItem?: string;
  /** The mobile menu panel */
  mobileMenu?: string;
}

export interface NavBarProps extends Omit<
  React.ComponentPropsWithoutRef<"nav">,
  "defaultValue" | "onChange"
> {
  /** Brand mark rendered at the start of the bar */
  logo?: React.ReactNode;
  /** Navigation links */
  links?: NavLink[];
  /** `href` of the current page. The matching link gets `aria-current="page"` and a highlight. */
  activeHref?: string;
  /** Locales offered by the built-in language menu */
  locales?: Locale[];
  /** Selected locale code. Provide this to control the component. */
  value?: string;
  /** Initial selected locale code when uncontrolled (default: first locale's code) */
  defaultValue?: string;
  /** Callback when the locale changes */
  onValueChange?: (code: string) => void;
  /** Primary call-to-action button */
  cta?: { label: string; href: string };
  /** Show a GitHub icon link. Needs `githubUrl`; without one, nothing renders. */
  showGitHub?: boolean;
  /**
   * Target of the GitHub icon link: a full URL, or `"owner"` / `"owner/repo"`
   * shorthand for a github.com profile or repository.
   */
  githubUrl?: string;
  /** Pin the bar to the top of the viewport (default: true) */
  sticky?: boolean;
  /**
   * Bar style (default: "default"). `"default"` spans the full width with a
   * bottom border; `"floating"` is a rounded card inset from the top edge.
   */
  variant?: "default" | "floating";
  /** Show flag emojis in the language menu (default: true) */
  showFlags?: boolean;
  /** Max height of the scrolling language menu, before it scrolls (default: "15rem") */
  maxHeight?: number | string;
  /**
   * Component used to render internal links. Defaults to `"a"` so the
   * component works in any React app; pass your router's link (e.g.
   * `next/link`) to get client-side navigation.
   */
  linkComponent?: React.ElementType;
  /** Override the built-in English UI text — any key you omit keeps its default */
  labels?: Partial<NavBarLabels>;
  /** Per-part class overrides */
  classNames?: NavBarClassNames;
}

function getLocaleInfo(code: string, override?: Locale) {
  // Per-locale `label`/`flag` props win; otherwise fall back to the shared
  // locale data, which resolves regional codes via the base language subtag.
  return {
    label: override?.label ?? getLanguageName(code) ?? code.toUpperCase(),
    flag: override?.flag ?? getFlag(code),
  };
}

/**
 * A panel that animates out. While it plays its exit animation it is still
 * mounted, so it leaves the accessibility tree first: a closing menu is not a menu.
 */
const Panel = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(function Panel(props, ref) {
  const isPresent = useIsPresent();
  return (
    <motion.div
      ref={ref}
      aria-hidden={isPresent ? undefined : true}
      {...props}
      // Set on render rather than animated: a panel reopened mid-exit is the
      // same element, and must take clicks again immediately.
      style={{ ...props.style, pointerEvents: isPresent ? undefined : "none" }}
    />
  );
});

const FOCUS_RING = "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

const GHOST_BUTTON = cn(
  "inline-flex items-center justify-center rounded-md text-sm font-medium text-muted-foreground transition-colors no-underline select-none",
  "hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
  "dark:hover:bg-accent/50",
  FOCUS_RING,
);

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Expands `"owner"` / `"owner/repo"` shorthand to a github.com URL. Anything else,
 * full URLs included, passes through unchanged.
 */
function resolveGitHubUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed)) return trimmed;
  const path = trimmed.replace(/^(www\.)?github\.com\//i, "").replace(/^\/+|\/+$/g, "");
  return /^[A-Za-z\d-]+(\/[\w.-]+)?$/.test(path) ? `https://github.com/${path}` : trimmed;
}

export const NavBar = React.forwardRef<HTMLElement, NavBarProps>(function NavBar(
  {
    logo,
    links = [],
    activeHref,
    locales = [],
    value,
    defaultValue,
    onValueChange,
    cta,
    showGitHub = false,
    githubUrl,
    sticky = true,
    variant = "default",
    className,
    classNames,
    dir,
    showFlags = true,
    maxHeight = "15rem",
    linkComponent: Link = "a",
    labels,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const [locale, setLocale] = useControllableState(
    value,
    defaultValue ?? locales[0]?.code ?? "en",
    onValueChange,
  );
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // Which bar opened the language menu, rather than a single boolean. The desktop
  // and mobile bars are both always in the DOM — only CSS hides one — so a shared
  // boolean mounted two listboxes into the accessibility tree at once.
  const [langOpen, setLangOpen] = React.useState<"desktop" | "mobile" | null>(null);
  // The link under the pointer or keyboard focus; the highlight follows it and
  // settles back on the active link when it leaves.
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);
  const langRef = React.useRef<HTMLDivElement>(null);
  const mobileLangRef = React.useRef<HTMLDivElement>(null);
  const desktopTriggerRef = React.useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = React.useRef<HTMLButtonElement>(null);
  const menuId = React.useId();

  const activeLocale = locales.find((l) => l.code === locale);
  const direction = dir ?? ((activeLocale?.rtl ?? isRtl(locale)) ? "rtl" : "ltr");
  const currentLocaleInfo = getLocaleInfo(locale, activeLocale);
  const text: NavBarLabels = {
    listbox: labels?.listbox ?? DEFAULT_LABELS.listbox,
    current: labels?.current ?? DEFAULT_LABELS.current,
    toggleMenu: labels?.toggleMenu ?? DEFAULT_LABELS.toggleMenu,
    github: labels?.github ?? DEFAULT_LABELS.github,
  };
  const floating = variant === "floating";
  const highlightedHref = hoveredHref ?? activeHref ?? null;

  /**
   * The trigger that owns the interaction: whichever bar is open, or — while the
   * menu is closed — whichever one the keyboard event landed on.
   */
  const getTrigger = () =>
    langOpen === "mobile"
      ? mobileTriggerRef.current
      : langOpen === "desktop"
        ? desktopTriggerRef.current
        : document.activeElement === mobileTriggerRef.current
          ? mobileTriggerRef.current
          : desktopTriggerRef.current;

  // No search field lives in this menu, so the highlight moves real DOM focus
  // onto the active option instead — `aria-activedescendant` is not valid on a
  // `<button>` trigger, and the trigger keeps its button role.
  const nav = useListboxNavigation({
    count: locales.length,
    open: langOpen !== null,
    strategy: "roving",
    initialIndex: locales.findIndex((item) => item.code === locale),
    onClose: () => setLangOpen(null),
    onOpen: () => setLangOpen(getTrigger() === mobileTriggerRef.current ? "mobile" : "desktop"),
    onSelect: (index) => {
      const picked = locales[index];
      if (picked) setLocale(picked.code);
    },
    triggerRef: getTrigger,
  });

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      // Both containers have to be checked. Guarding only the desktop one made a
      // mousedown inside the mobile dropdown count as "outside", which closed the
      // menu before the option's click event could land — so picking a language
      // on mobile did nothing at all.
      if (langRef.current?.contains(target) || mobileLangRef.current?.contains(target)) return;
      setLangOpen(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { close: closeLanguageMenu } = nav;

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      closeLanguageMenu();
      setMobileOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeLanguageMenu]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    // Restore whatever the host page had set rather than assuming it was empty.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const flagOrGlobe = (flag: string, className?: string) =>
    showFlags ? (
      <span className={cn("text-base leading-none", className)}>{flag}</span>
    ) : (
      <GlobeIcon aria-hidden="true" className={cn("size-4 shrink-0", className)} />
    );

  const langDropdown = (
    <Panel
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, ease: EASE }}
      className={cn(
        "absolute end-0 top-full z-50 mt-2 min-w-44 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg",
        classNames?.languageContent,
      )}
    >
      {/* The listbox owns the options only, and scrolls on its own: a long list
          never drags the page along with it. */}
      <div
        className="overflow-y-auto overscroll-contain p-1"
        style={{ maxHeight }}
        role="listbox"
        aria-label={text.listbox}
        {...nav.listboxProps}
      >
        {locales.map((item, index) => {
          const info = getLocaleInfo(item.code, item);
          const isCurrent = item.code === locale;
          return (
            <button
              key={item.code}
              type="button"
              role="option"
              dir={(item.rtl ?? isRtl(item.code)) ? "rtl" : "ltr"}
              aria-selected={isCurrent}
              onClick={() => nav.select(index)}
              {...nav.optionProps(index)}
              className={cn(
                "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-none select-none",
                "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
                classNames?.languageItem,
              )}
            >
              {showFlags && <span className="text-base leading-none">{info.flag}</span>}
              <span className="flex-1 truncate">{item.label ?? info.label}</span>
              <CheckIcon
                aria-hidden="true"
                className={cn(
                  "size-4 shrink-0 text-primary",
                  isCurrent ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>
    </Panel>
  );

  const githubHref = resolveGitHubUrl(githubUrl);
  // `showGitHub` alone used to link to this library's own repository. Now it
  // renders nothing, so say why instead of failing silently.
  const missingGitHubUrl = showGitHub && !githubHref;
  React.useEffect(() => {
    if (missingGitHubUrl) {
      console.warn(
        'NavBar: `showGitHub` needs `githubUrl` (a URL or "owner/repo"); the GitHub link is hidden.',
      );
    }
  }, [missingGitHubUrl]);
  const hasGitHub = showGitHub && !!githubHref;

  const githubLink = (
    <a
      href={githubHref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(GHOST_BUTTON, "size-9")}
      aria-label={text.github}
    >
      <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    </a>
  );

  const ctaClass = cn(
    "group inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium whitespace-nowrap text-primary-foreground no-underline shadow-xs transition-colors hover:bg-primary/90",
    FOCUS_RING,
    classNames?.cta,
  );

  const ctaArrow = (
    <ArrowRightIcon
      aria-hidden="true"
      className="-me-0.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
    />
  );

  return (
    <MotionConfig reducedMotion="user">
      <nav
        ref={forwardedRef}
        {...rest}
        dir={direction}
        onKeyDown={(event) => {
          nav.onKeyDown(event);
          onKeyDown?.(event);
        }}
        className={cn(
          "z-50 w-full text-foreground",
          sticky ? "sticky top-0" : "relative",
          floating
            ? "px-3 pt-3 sm:px-4 sm:pt-4"
            : "border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60",
          classNames?.root,
          className,
        )}
      >
        <div
          className={cn(
            floating &&
              "mx-auto max-w-5xl rounded-2xl border bg-background/80 shadow-lg shadow-black/5 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 dark:shadow-black/20",
            classNames?.container,
          )}
        >
          {/* Desktop */}
          <div
            className={cn(
              "mx-auto hidden h-16 max-w-6xl items-center justify-between gap-6 md:flex",
              floating ? "h-14 ps-5 pe-2.5" : "px-6",
            )}
          >
            {logo && <div className="flex shrink-0 items-center">{logo}</div>}

            {links.length > 0 && (
              <div
                className={cn("flex items-center gap-1", classNames?.links)}
                onMouseLeave={() => setHoveredHref(null)}
              >
                {links.map((link) => {
                  const isActive = link.href === activeHref;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onMouseEnter={() => setHoveredHref(link.href)}
                      onFocus={() => setHoveredHref(link.href)}
                      onBlur={() => setHoveredHref(null)}
                      className={cn(
                        "relative rounded-md px-3 py-1.5 text-sm font-medium no-underline transition-colors",
                        isActive || hoveredHref === link.href
                          ? "text-foreground"
                          : "text-muted-foreground",
                        FOCUS_RING,
                        classNames?.link,
                      )}
                    >
                      {highlightedHref === link.href && (
                        <motion.span
                          aria-hidden="true"
                          layoutId={`${menuId}-link-highlight`}
                          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                          className="absolute inset-0 rounded-md bg-accent dark:bg-accent/60"
                        />
                      )}
                      <span className="relative">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className={cn("flex items-center gap-1", classNames?.actions)}>
              {locales.length > 0 && (
                <div ref={langRef} className="relative">
                  <button
                    ref={desktopTriggerRef}
                    type="button"
                    onClick={() => setLangOpen(langOpen === "desktop" ? null : "desktop")}
                    className={cn(GHOST_BUTTON, "h-9 gap-1.5 px-2.5", classNames?.languageTrigger)}
                    aria-expanded={langOpen === "desktop"}
                    aria-haspopup="listbox"
                    aria-label={text.current(currentLocaleInfo.label)}
                  >
                    {flagOrGlobe(currentLocaleInfo.flag)}
                    <span>{currentLocaleInfo.label}</span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 shrink-0 opacity-60 transition-transform duration-200",
                        langOpen === "desktop" && "rotate-180",
                      )}
                    />
                  </button>
                  <AnimatePresence>{langOpen === "desktop" && langDropdown}</AnimatePresence>
                </div>
              )}

              {hasGitHub && githubLink}

              {cta && (
                <Link href={cta.href} className={cn(ctaClass, "ms-1")}>
                  {cta.label}
                  {ctaArrow}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile */}
          <div
            className={cn(
              "flex h-14 items-center justify-between md:hidden",
              floating ? "ps-4 pe-2" : "px-4",
            )}
          >
            {logo && <div className="flex shrink-0 items-center">{logo}</div>}

            <div className="flex items-center gap-1">
              {locales.length > 0 && (
                <div ref={mobileLangRef} className="relative">
                  <button
                    ref={mobileTriggerRef}
                    type="button"
                    onClick={() => setLangOpen(langOpen === "mobile" ? null : "mobile")}
                    className={cn(GHOST_BUTTON, "size-9", classNames?.languageTrigger)}
                    aria-expanded={langOpen === "mobile"}
                    aria-haspopup="listbox"
                    aria-label={text.current(currentLocaleInfo.label)}
                  >
                    {flagOrGlobe(currentLocaleInfo.flag)}
                  </button>
                  <AnimatePresence>{langOpen === "mobile" && langDropdown}</AnimatePresence>
                </div>
              )}

              <button
                type="button"
                className={cn(GHOST_BUTTON, "relative size-9 text-foreground")}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={text.toggleMenu}
                aria-expanded={mobileOpen}
                aria-controls={mobileOpen ? menuId : undefined}
              >
                {/* Two bars that cross into an X. */}
                <span aria-hidden="true" className="relative block h-3 w-4">
                  <motion.span
                    className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-current"
                    initial={false}
                    animate={mobileOpen ? { y: 5, rotate: 45 } : { y: 1, rotate: 0 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  />
                  <motion.span
                    className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-current"
                    initial={false}
                    animate={mobileOpen ? { y: 5, rotate: -45 } : { y: 9, rotate: 0 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Mobile menu panel */}
          <AnimatePresence initial={false}>
            {mobileOpen && (
              <Panel
                id={menuId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={cn(
                  "overflow-hidden md:hidden",
                  !floating && "border-t",
                  classNames?.mobileMenu,
                )}
              >
                <div className={cn("flex flex-col gap-1 p-3", floating && "pt-0")}>
                  {links.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.03 * index, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        aria-current={link.href === activeHref ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground no-underline transition-colors",
                          "hover:bg-accent hover:text-accent-foreground aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground",
                          FOCUS_RING,
                          classNames?.link,
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  {(cta || hasGitHub) && (
                    <motion.div
                      className="mt-2 flex items-center gap-2 border-t pt-3"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.03 * links.length, ease: EASE }}
                    >
                      {cta && (
                        <Link
                          href={cta.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(ctaClass, "flex-1")}
                        >
                          {cta.label}
                          {ctaArrow}
                        </Link>
                      )}
                      {hasGitHub && githubLink}
                    </motion.div>
                  )}
                </div>
              </Panel>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </MotionConfig>
  );
});
