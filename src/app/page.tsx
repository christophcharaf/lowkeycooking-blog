import { getAllRecipes } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const recipes = getAllRecipes();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-16 md:py-28">
        {/* Blurred background video */}
        <div className="absolute inset-0 scale-110">
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="h-full w-full object-cover object-center blur-sm"
          >
            <source src="/videos/cooking-bg.mp4" type="video/mp4" />
            <source src="/videos/cooking-bg.webm" type="video/webm" />
          </video>
        </div>

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/65" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            <Leaf className="size-3.5" />
            Fresh &amp; Homemade
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            Recipes that bring
            <span className="block text-terra-300">people together</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/75">
            From quick weeknight dinners to indulgent weekend bakes — discover
            hand-crafted recipes made with simple ingredients and a lot of love.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-terra-500 hover:shadow-lg"
            >
              Browse Recipes
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#recipes"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              What&apos;s Cooking?
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center md:mt-16 md:flex md:flex-wrap md:justify-center md:gap-10">
            {[
              { value: `${recipes.length}`, label: "Recipes" },
              { value: "100%", label: "Homemade" },
              { value: "0", label: "Preservatives" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-white drop-shadow">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-sm font-medium text-white/60">
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
