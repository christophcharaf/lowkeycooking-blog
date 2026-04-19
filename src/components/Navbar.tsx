"use client";

import { Menu, X, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

/** Extra px past overflow before switching to hamburger (avoid subpixel / flex flutter). */
const COLLAPSE_OVERFLOW_PX = 14;
/** Tighter “available” when deciding to show inline nav again (must fit comfortably). */
const EXPAND_AVAILABLE_SLACK_PX = 28;
/** After an overflow collapse, require this much extra row width before inline can return. */
const REEXPAND_MIN_ROW_GROWTH_PX = 36;
/** If nav fits with this much spare width, re-expand even if row hasn’t grown (locale, fonts). */
const EXPAND_CONFIDENT_SLACK_PX = 56;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  /** Inline nav hidden (hamburger); start true so narrow viewports match before measure. */
  const [navCollapses, setNavCollapses] = useState(true);
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("Navbar");

  const rowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  /** Row width when we last collapsed due to overflow; stabilizes expand vs. hamburger. */
  const collapsedAtRowWidthRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  // Derived: menu can only be open when the hamburger is visible
  const isMenuOpen = navCollapses && open;

  useLayoutEffect(() => {
    const row = rowRef.current;
    const nav = navRef.current;
    const logo = logoRef.current;
    const tools = toolsRef.current;
    if (!row || !nav || !logo || !tools) return;

    const measure = () => {
      setNavCollapses((collapsed) => {
        const rowW = row.clientWidth;
        const rowRect = row.getBoundingClientRect();
        const logoRect = logo.getBoundingClientRect();
        const toolsRect = tools.getBoundingClientRect();
        const needed = Math.ceil(nav.scrollWidth);
        const halfNeeded = needed / 2;
        const centerX = rowRect.left + rowRect.width / 2;
        const spaceLeft = centerX - logoRect.right;
        const spaceRight = toolsRect.left - centerX;
        const collapsePad = COLLAPSE_OVERFLOW_PX / 2;
        const expandPad = EXPAND_AVAILABLE_SLACK_PX / 2;
        const confidentPad = EXPAND_CONFIDENT_SLACK_PX / 2;

        if (!collapsed) {
          const overflows =
            halfNeeded > spaceLeft - collapsePad ||
            halfNeeded > spaceRight - collapsePad;
          if (overflows) {
            collapsedAtRowWidthRef.current = rowW;
            return true;
          }
          return false;
        }

        const fitsComfortably =
          halfNeeded <= spaceLeft - expandPad &&
          halfNeeded <= spaceRight - expandPad;
        const confident =
          halfNeeded <= spaceLeft - confidentPad &&
          halfNeeded <= spaceRight - confidentPad;
        const anchor = collapsedAtRowWidthRef.current;
        const grewEnough =
          anchor === null || rowW >= anchor + REEXPAND_MIN_ROW_GROWTH_PX;

        if (fitsComfortably && (confident || grewEnough)) {
          collapsedAtRowWidthRef.current = null;
          return false;
        }
        return true;
      });
    };

    const schedule = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(measure);
      });
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(row);
    ro.observe(nav);
    ro.observe(logo);
    ro.observe(tools);
    schedule();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Default to light logo until mounted to avoid empty src on SSR
  const logoSrc = mounted && resolvedTheme === "dark" ? "/logo.png" : "/logo-dark.png";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-200 bg-white/95 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95">
      <div
        ref={rowRef}
        className="relative mx-auto flex h-[75px] max-w-6xl items-center gap-3 px-6 py-2 sm:gap-4"
      >
        <Link ref={logoRef} href="/" className="group relative z-10 shrink-0">
          <Image
            src={logoSrc}
            alt="LowKeyCooking"
            width={150}
            height={45}
            className="h-14 w-[150px] object-contain"
            priority
          />
        </Link>

        <div className="min-h-0 min-w-0 flex-1" aria-hidden />

        <div
          className={cn(
            "absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            navCollapses
              ? "pointer-events-none opacity-0 motion-reduce:opacity-0"
              : "opacity-100 motion-reduce:opacity-100",
          )}
          aria-hidden={navCollapses}
        >
          <nav
            ref={navRef}
            className={cn(
              "flex w-max items-center justify-center gap-[40px] p-0 text-lg transition-[transform,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              navCollapses
                ? "translate-y-1 scale-[0.97] blur-[2px] motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:blur-none"
                : "translate-y-0 scale-100 blur-0",
            )}
          >
            <Link
              href="/"
              className="shrink-0 whitespace-nowrap text-lg font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              {t("home")}
            </Link>
            <Link
              href="/#recipes"
              className="shrink-0 whitespace-nowrap text-lg font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              {t("recipes")}
            </Link>
            <Link
              href="/recipes"
              className="shrink-0 whitespace-nowrap rounded-full bg-terra-600 px-5 py-2 text-lg font-semibold text-white shadow-sm transition-all hover:bg-terra-700 hover:shadow-md"
            >
              {t("browseAll")}
            </Link>
          </nav>
        </div>

        <div
          ref={toolsRef}
          className="relative z-10 flex shrink-0 items-center gap-2"
        >
          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label={t("toggleTheme")}
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="size-4.5" />
            ) : (
              <Moon className="size-4.5" />
            )}
          </button>

          {/* Shown only when inline nav does not fit */}
          <button
            type="button"
            className={cn(
              "size-9 items-center justify-center rounded-lg text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
              navCollapses ? "flex" : "hidden",
            )}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-label={t("toggleMenu")}
          >
            <span className="relative block size-5">
              <Menu
                className={cn(
                  "absolute inset-0 size-5 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                  isMenuOpen ? "scale-75 opacity-0" : "scale-100 opacity-100",
                )}
                aria-hidden
                focusable={false}
              />
              <X
                className={cn(
                  "absolute inset-0 size-5 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                  isMenuOpen ? "scale-100 opacity-100" : "scale-75 opacity-0",
                )}
                aria-hidden
                focusable={false}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Menu panel when nav is collapsed — height + content fade */}
      {navCollapses && (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <nav
              className="border-t border-cream-200 bg-white px-6 pb-4 pt-3 dark:border-gray-700 dark:bg-gray-900"
              aria-hidden={!isMenuOpen}
              inert={!isMenuOpen ? true : undefined}
            >
              <div
                className={cn(
                  "flex flex-col gap-3 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  isMenuOpen
                    ? "translate-y-0 opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-0",
                )}
              >
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
                >
                  {t("home")}
                </Link>
                <Link
                  href="/#recipes"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
                >
                  {t("recipes")}
                </Link>
                <Link
                  href="/recipes"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-terra-700"
                >
                  {t("browseAll")}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
