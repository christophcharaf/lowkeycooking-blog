"use client";

import { Menu, X, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("Navbar");

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-200 bg-white/95 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group">
          {mounted && resolvedTheme === "dark" ? (
            <Image
              src="/logo.png"
              alt="LowKeyCooking"
              width={280}
              height={120}
              className="h-[7.5rem] w-[17.5rem] object-contain"
              priority
            />
          ) : (
            <Image
              src="/logo-dark.png"
              alt="LowKeyCooking"
              width={280}
              height={120}
              className="h-[7.5rem] w-[17.5rem] object-contain"
              priority
            />
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 sm:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            {t("home")}
          </Link>
          <Link
            href="/#recipes"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            {t("recipes")}
          </Link>
          <Link
            href="/recipes"
            className="rounded-full bg-terra-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-terra-700 hover:shadow-md"
          >
            {t("browseAll")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
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

          {/* Mobile hamburger */}
          <button
            className="flex size-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("toggleMenu")}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="border-t border-cream-200 bg-white px-6 pb-4 pt-3 dark:border-gray-700 dark:bg-gray-900 sm:hidden">
          <div className="flex flex-col gap-3">
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
              className="inline-flex w-full items-center justify-center rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-terra-700"
            >
              {t("browseAll")}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
