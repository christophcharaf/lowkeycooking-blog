"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-5xl">🍳</p>
      <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
        Something went wrong
      </h2>
      <p className="mb-8 max-w-md text-sm text-gray-500 dark:text-gray-400">
        An unexpected error occurred in the kitchen. You can try again or head back to the recipes.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-terra-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-terra-700"
        >
          Try again
        </button>
        <Link
          href="/recipes"
          className="rounded-full border border-terra-200 px-6 py-2.5 text-sm font-semibold text-terra-700 transition-colors hover:bg-terra-50 dark:border-terra-700 dark:text-terra-400 dark:hover:bg-terra-900/30"
        >
          Browse Recipes
        </Link>
      </div>
    </div>
  );
}
