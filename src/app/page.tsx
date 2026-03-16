import { getAllRecipes } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const recipes = getAllRecipes();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-100 px-6 py-28">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-32 -top-32 size-[500px] rounded-full bg-terra-100/70" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 size-[400px] rounded-full bg-cream-200/80" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-terra-100 px-4 py-1.5 text-sm font-semibold text-terra-700">
            <Leaf className="size-3.5" />
            Fresh &amp; Homemade
          </div>

          <h1 className="mb-6 text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Recipes that bring
            <span className="block text-terra-600">people together</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-500">
            From quick weeknight dinners to indulgent weekend bakes — discover
            hand-crafted recipes made with simple ingredients and a lot of love.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#recipes"
              className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-terra-700 hover:shadow-lg"
            >
              Browse Recipes
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#recipes"
              className="inline-flex items-center gap-2 rounded-full border border-terra-200 bg-white px-7 py-3 text-sm font-semibold text-terra-700 shadow-sm transition-all hover:border-terra-300 hover:bg-terra-50"
            >
              What&apos;s Cooking?
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-center">
            {[
              { value: `${recipes.length}`, label: "Recipes" },
              { value: "100%", label: "Homemade" },
              { value: "0", label: "Preservatives" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-sm font-medium text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section id="recipes" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-terra-600">
              The Collection
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              All Recipes
            </h2>
          </div>
          <span className="rounded-full bg-cream-100 px-4 py-1.5 text-sm font-semibold text-gray-500">
            {recipes.length} recipes
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </section>
    </div>
  );
}
