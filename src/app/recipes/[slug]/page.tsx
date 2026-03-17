import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Flame, Users, ChevronLeft, ShoppingCart, ExternalLink, ChartNoAxesColumn } from "lucide-react";
import {
  getAllRecipes,
  getRecipeBySlug,
  recipeToShareText,
  generateStaticParams as getStaticParams,
  type Utensil,
  type Nutrition,
} from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import ShareButtons from "@/components/ShareButtons";

export { getStaticParams as generateStaticParams };

function getShopLabel(url: string): string {
  if (url.includes("temu.com")) return "Shop on TEMU";
  if (url.includes("amazon.com")) return "Shop on Amazon";
  return "Shop Now";
}

function UtensilsSection({ utensils }: { utensils: Utensil[] }) {
  return (
    <div className="mt-12 border-t border-cream-200 pt-10">
      <div className="mb-5 flex items-center gap-2">
        <ShoppingCart className="size-5 text-terra-600" />
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
          Kitchen Tools You&apos;ll Need
        </h2>
      </div>
      <p className="mb-5 text-sm text-gray-500">
        These are affiliate links — we may earn a small commission at no extra
        cost to you.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {utensils.map((utensil) => (
          <a
            key={utensil.name}
            href={utensil.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3.5 transition-all hover:border-terra-200 hover:bg-terra-50 hover:shadow-sm"
          >
            <span className="text-sm font-semibold text-gray-800 group-hover:text-terra-800">
              {utensil.name}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-terra-600 px-3 py-1 text-xs font-bold text-white transition-colors group-hover:bg-terra-700">
              {getShopLabel(utensil.url)}
              <ExternalLink className="size-3" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function NutritionSection({ nutrition }: { nutrition: Nutrition }) {
  const rows = [
    { label: "Calories", value: String(nutrition.calories), bold: true },
    { label: "Protein", value: nutrition.protein },
    { label: "Total Carbohydrates", value: nutrition.carbs },
    { label: "Total Fat", value: nutrition.fat },
    { label: "Dietary Fiber", value: nutrition.fiber },
    ...(nutrition.sugar ? [{ label: "Total Sugar", value: nutrition.sugar }] : []),
    ...(nutrition.sodium ? [{ label: "Sodium", value: nutrition.sodium }] : []),
  ];

  return (
    <div className="mt-10 border-t border-cream-200 pt-10">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold tracking-tight text-gray-900">
        <ChartNoAxesColumn className="size-5 text-terra-600" />
        Nutrition Facts
      </h2>
      <p className="mb-4 text-xs text-gray-400">Per serving · Estimates only</p>
      <div className="overflow-hidden rounded-2xl border border-cream-200">
        {/* Header bar */}
        <div className="border-b-4 border-gray-900 bg-gray-900 px-5 py-4">
          <p className="text-2xl font-black text-white">Nutrition Facts</p>
          <p className="text-sm text-gray-400">Per serving</p>
        </div>
        <div className="divide-y divide-cream-200 bg-white">
          {rows.map((row) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-5 py-3 ${
                row.bold ? "bg-cream-50" : ""
              }`}
            >
              <span
                className={`text-sm ${
                  row.bold
                    ? "text-2xl font-black text-gray-900"
                    : "text-gray-700"
                }`}
              >
                {row.bold ? `${row.value} kcal` : row.label}
              </span>
              <span
                className={`text-sm font-bold ${
                  row.bold ? "text-lg text-terra-600" : "text-gray-900"
                }`}
              >
                {row.bold ? "Calories" : row.value}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-cream-200 bg-cream-50 px-5 py-3">
          <p className="text-xs text-gray-400">
            * Percent daily values based on a 2,000 calorie diet. Nutritional
            information is estimated and may vary.
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const recipe = await getRecipeBySlug(slug);
    return {
      title: `${recipe.title} — LowKeyCooking`,
      description: recipe.description,
    };
  } catch {
    return { title: "Recipe Not Found" };
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let recipe;
  try {
    recipe = await getRecipeBySlug(slug);
  } catch {
    notFound();
  }

  const allRecipes = getAllRecipes();
  const related = allRecipes.filter((r) => r.slug !== slug).slice(0, 3);

  return (
    <article>
      {/* Hero */}
      <div className="relative h-[480px] w-full overflow-hidden bg-cream-200 md:h-[580px]">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        {/* Back link */}
        <div className="absolute left-0 top-0 w-full px-6 pt-6">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <ChevronLeft className="size-4" />
              All Recipes
            </Link>
          </div>
        </div>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 w-full px-6 pb-12">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl">
              {recipe.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
              {recipe.description}
            </p>
          </div>
        </div>
      </div>

      {/* At-a-glance strip */}
      <div className="border-b border-cream-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-0 divide-x divide-cream-200 px-6">
          <div className="flex flex-1 items-center justify-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-full bg-terra-50">
              <Clock className="size-5 text-terra-600" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Prep Time
              </div>
              <div className="text-base font-bold text-gray-900">
                {recipe.prep_time}
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-full bg-orange-50">
              <Flame className="size-5 text-orange-500" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Cook Time
              </div>
              <div className="text-base font-bold text-gray-900">
                {recipe.cook_time}
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-full bg-cream-100">
              <Users className="size-5 text-terra-500" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Servings
              </div>
              <div className="text-base font-bold text-gray-900">
                {recipe.servings}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div
          className="recipe-content"
          dangerouslySetInnerHTML={{ __html: recipe.contentHtml }}
        />

        {recipe.utensils && recipe.utensils.length > 0 && (
          <UtensilsSection utensils={recipe.utensils} />
        )}

        {recipe.nutrition && (
          <NutritionSection nutrition={recipe.nutrition} />
        )}

        <ShareButtons
          title={recipe.title}
          description={recipe.description}
          image={recipe.image}
          slug={slug}
          shareText={recipeToShareText(recipe)}
        />

        <div className="print-hide mt-14 border-t border-cream-200 pt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-terra-200 px-5 py-2.5 text-sm font-semibold text-terra-700 transition-all hover:border-terra-300 hover:bg-terra-50"
          >
            <ChevronLeft className="size-4" />
            Back to all recipes
          </Link>
        </div>
      </div>

      {/* Related Recipes */}
      {related.length > 0 && (
        <section className="print-hide border-t border-cream-200 bg-cream-100 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-terra-600">
                Keep Cooking
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                You Might Also Like
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RecipeCard key={r.slug} recipe={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
