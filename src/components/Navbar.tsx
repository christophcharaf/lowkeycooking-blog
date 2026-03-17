"use client";

import Link from "next/link";
import { UtensilsCrossed, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cream-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-terra-600 transition-colors group-hover:bg-terra-700">
            <UtensilsCrossed className="size-4.5 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-tight text-gray-900">
              LowKeyCooking
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-terra-600">
              Homemade with love
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 sm:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            href="/#recipes"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            Recipes
          </Link>
          <Link
            href="/recipes"
            className="rounded-full bg-terra-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-terra-700 hover:shadow-md"
          >
            Browse All
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex size-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="border-t border-cream-200 bg-white px-6 pb-4 pt-3 sm:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/#recipes"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Recipes
            </Link>
            <Link
              href="/recipes"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full bg-terra-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-terra-700"
            >
              Browse All
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
