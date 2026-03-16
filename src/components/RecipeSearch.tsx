"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import type { RecipeSummary } from "@/lib/recipes";

interface RecipeSearchProps {
  recipes: RecipeSummary[];
}

export default function RecipeSearch({ recipes }: RecipeSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = recipes.filter((recipe) => {
    const q = query.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(q) ||
      recipe.description.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Search box */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes by name or ingredient..."
          className="w-full rounded-2xl border border-cream-200 bg-white py-4 pl-12 pr-12 text-base text-gray-800 shadow-sm outline-none ring-0 transition placeholder:text-gray-400 focus:border-terra-300 focus:ring-2 focus:ring-terra-100"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Results count */}
      {query && (
        <p className="mb-6 text-sm text-gray-500">
          {filtered.length === 0
            ? "No recipes found for"
            : `${filtered.length} recipe${filtered.length === 1 ? "" : "s"} found for`}{" "}
          <span className="font-semibold text-gray-800">&ldquo;{query}&rdquo;</span>
        </p>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="mb-4 text-5xl">🍳</span>
          <p className="text-lg font-semibold text-gray-700">No recipes found</p>
          <p className="mt-1 text-sm text-gray-400">
            Try a different search term
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-6 rounded-full bg-terra-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-terra-700"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
