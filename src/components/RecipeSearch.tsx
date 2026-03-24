"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import type { RecipeSummary } from "@/lib/recipes";
import { useTranslations } from "next-intl";

interface RecipeSearchProps {
  recipes: RecipeSummary[];
}

const CATEGORIES = ["all", "breakfast", "lunch", "dinner", "dessert"] as const;
type Category = (typeof CATEGORIES)[number];
const PAGE_SIZE = 12;

export default function RecipeSearch({ recipes }: RecipeSearchProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [page, setPage] = useState(1);
  const t = useTranslations("RecipeSearch");

  const categoryLabels: Record<Category, string> = {
    all: t("filterAll"),
    breakfast: t("filterBreakfast"),
    lunch: t("filterLunch"),
    dinner: t("filterDinner"),
    dessert: t("filterDessert"),
  };

  const filtered = recipes.filter((recipe) => {
    const matchesCategory =
      activeCategory === "all" || recipe.category === activeCategory;
    const q = query.toLowerCase();
    const matchesQuery =
      recipe.title.toLowerCase().includes(q) ||
      recipe.description.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat);
    setPage(1);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  return (
    <div>
      {/* Category filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              activeCategory === cat
                ? "bg-terra-600 text-white shadow-sm"
                : "bg-cream-100 text-gray-600 hover:bg-cream-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Search box */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={t("placeholder")}
          className="w-full rounded-2xl border border-cream-200 bg-white py-4 pl-12 pr-12 text-base text-gray-800 shadow-sm outline-none ring-0 transition placeholder:text-gray-400 focus:border-terra-300 focus:ring-2 focus:ring-terra-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-terra-600 dark:focus:ring-terra-900"
        />
        {query && (
          <button
            onClick={() => handleQueryChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label={t("clearSearch")}
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Results count */}
      {query && (
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {filtered.length === 0
            ? t("noResultsFor")
            : t("resultsFound", { count: filtered.length })}{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            &ldquo;{query}&rdquo;
          </span>
        </p>
      )}

      {/* Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="mb-4 text-5xl">🍳</span>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {t("noResults")}
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            {t("tryDifferent")}
          </p>
          <button
            onClick={() => {
              handleQueryChange("");
              handleCategoryChange("all");
            }}
            className="mt-6 rounded-full bg-terra-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-terra-700"
          >
            {t("clearSearch")}
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-cream-200 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t("prev")}
          </button>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t("page", { current: page, total: totalPages })}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-full border border-cream-200 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
}
