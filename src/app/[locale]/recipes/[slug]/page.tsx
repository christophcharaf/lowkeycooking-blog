import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Clock,
  Flame,
  Users,
  ChevronLeft,
  ShoppingCart,
  ExternalLink,
  ChartNoAxesColumn,
} from "lucide-react";
import {
  getAllRecipes,
  getRecipeBySlug,
  recipeToShareText,
  type Utensil,
  type Nutrition,
} from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import ShareButtons from "@/components/ShareButtons";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function generateStaticParams() {
  const locales = ["en", "es"];
  return locales.flatMap((locale) =>
    getAllRecipes(locale).map((r) => ({ locale, slug: r.slug })),
  );
}

function getShopLabel(
  url: string,
  labels: { temu: string; amazon: string; now: string },
): string {
  if (url.includes("temu.com")) return labels.temu;
  if (url.includes("amazon.com")) return labels.amazon;
  return labels.now;
}

function UtensilsSection({
  utensils,
  labels,
}: {
  utensils: Utensil[];
  labels: { heading: string; disclaimer: string; temu: string; amazon: string; now: string };
}) {
  return (
    <div className="mt-12 border-t border-cream-200 pt-10 dark:border-gray-700">
      <div className="mb-5 flex items-center gap-2">
        <ShoppingCart className="size-5 text-terra-600" />
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          {labels.heading}
        </h2>
      </div>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        {labels.disclaimer}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {utensils.map((utensil) => (
          <a
            key={utensil.name}
            href={utensil.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3.5 transition-all hover:border-terra-200 hover:bg-terra-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-terra-700 dark:hover:bg-terra-900/20"
          >
            <span className="text-sm font-semibold text-gray-800 group-hover:text-terra-800 dark:text-gray-200 dark:group-hover:text-terra-400">
              {utensil.name}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-terra-600 px-3 py-1 text-xs font-bold text-white transition-colors group-hover:bg-terra-700">
              {getShopLabel(utensil.url, labels)}
              <ExternalLink className="size-3" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function NutritionSection({
  nutrition,
  labels,
}: {
  nutrition: Nutrition;
  labels: {
    heading: string;
    perServing: string;
    disclaimer: string;
    kcal: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar: string;
    sodium: string;
    perServingShort: string;
  };
}) {
  const rows = [
    { label: labels.calories, value: String(nutrition.calories), bold: true },
    { label: labels.protein, value: nutrition.protein },
    { label: labels.carbs, value: nutrition.carbs },
    { label: labels.fat, value: nutrition.fat },
    { label: labels.fiber, value: nutrition.fiber },
    ...(nutrition.sugar ? [{ label: labels.sugar, value: nutrition.sugar }] : []),
    ...(nutrition.sodium ? [{ label: labels.sodium, value: nutrition.sodium }] : []),
  ];

  return (
    <div className="mt-10 border-t border-cream-200 pt-10 dark:border-gray-700">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
        <ChartNoAxesColumn className="size-5 text-terra-600" />
        {labels.heading}
      </h2>
      <p className="mb-4 text-xs text-gray-400 dark:text-gray-500">{labels.perServing}</p>
      <div className="overflow-hidden rounded-2xl border border-cream-200 dark:border-gray-700">
        {/* Header bar */}
        <div className="border-b-4 border-gray-900 bg-gray-900 px-5 py-4">
          <p className="text-2xl font-black text-white">{labels.heading}</p>
          <p className="text-sm text-gray-400">{labels.perServingShort}</p>
        </div>
        <div className="divide-y divide-cream-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {rows.map((row) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-5 py-3 ${
                row.bold ? "bg-cream-50 dark:bg-gray-750" : ""
              }`}
            >
              <span
                className={`text-sm ${
                  row.bold
                    ? "text-2xl font-black text-gray-900 dark:text-gray-50"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {row.bold ? `${row.value} ${labels.kcal}` : row.label}
              </span>
              <span
                className={`text-sm font-bold ${
                  row.bold
                    ? "text-lg text-terra-600"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {row.bold ? labels.calories : row.value}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-cream-200 bg-cream-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {labels.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  try {
    const recipe = await getRecipeBySlug(slug, locale);
    const images = recipe.image
      ? [{ url: recipe.image, width: 1200, height: 800, alt: recipe.title }]
      : [];
    return {
      title: `${recipe.title} — LowKeyCooking`,
      description: recipe.description,
      alternates: {
        canonical: `/${locale}/recipes/${slug}`,
        languages: {
          en: `/en/recipes/${slug}`,
          es: `/es/recipes/${slug}`,
        },
      },
      openGraph: {
        title: recipe.title,
        description: recipe.description,
        url: `/${locale}/recipes/${slug}`,
        siteName: "LowKeyCooking",
        type: "article",
        images,
      },
      twitter: {
        card: "summary_large_image",
        title: recipe.title,
        description: recipe.description,
        images: recipe.image ? [recipe.image] : [],
      },
    };
  } catch {
    return { title: "Recipe Not Found" };
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let recipe;
  try {
    recipe = await getRecipeBySlug(slug, locale);
  } catch {
    notFound();
  }

  const allRecipes = getAllRecipes(locale);
  const related = allRecipes.filter((r) => r.slug !== slug).slice(0, 3);
  const t = await getTranslations({ locale, namespace: "RecipePage" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: recipe.image || undefined,
    prepTime: `PT${recipe.prep_time}`,
    cookTime: `PT${recipe.cook_time}`,
    recipeYield: String(recipe.servings),
    recipeCategory: recipe.category,
    author: { "@type": "Organization", name: "LowKeyCooking" },
    ...(recipe.nutrition && {
      nutrition: {
        "@type": "NutritionInformation",
        calories: `${recipe.nutrition.calories} calories`,
        proteinContent: recipe.nutrition.protein,
        carbohydrateContent: recipe.nutrition.carbs,
        fatContent: recipe.nutrition.fat,
        fiberContent: recipe.nutrition.fiber,
        ...(recipe.nutrition.sugar && { sugarContent: recipe.nutrition.sugar }),
        ...(recipe.nutrition.sodium && { sodiumContent: recipe.nutrition.sodium }),
      },
    }),
  };

  const utensilLabels = {
    heading: t("kitchenTools"),
    disclaimer: t("affiliateDisclaimer"),
    temu: t("shopTemu"),
    amazon: t("shopAmazon"),
    now: t("shopNow"),
  };

  const nutritionLabels = {
    heading: t("nutritionFacts"),
    perServing: t("perServing"),
    disclaimer: t("nutritionDisclaimer"),
    kcal: t("kcal"),
    calories: t("calories"),
    protein: t("protein"),
    carbs: t("carbs"),
    fat: t("fat"),
    fiber: t("fiber"),
    sugar: t("sugar"),
    sodium: t("sodium"),
    perServingShort: t("perServingShort"),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <div className="relative h-[480px] w-full overflow-hidden bg-cream-200 md:h-[580px]">
        <Image
          src={recipe.image || "/logo.png"}
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
              {t("backToAll")}
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
      <div className="border-b border-cream-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-cream-200 px-6 dark:divide-gray-700">
          <div className="flex flex-col items-center justify-center gap-1.5 py-4 sm:flex-row sm:gap-3 sm:py-5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-terra-50 dark:bg-terra-900/30 sm:size-10">
              <Clock className="size-4 text-terra-600 sm:size-5" />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 sm:text-xs">
                {t("prepTime")}
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-base">
                {recipe.prep_time}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 py-4 sm:flex-row sm:gap-3 sm:py-5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/20 sm:size-10">
              <Flame className="size-4 text-orange-500 sm:size-5" />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 sm:text-xs">
                {t("cookTime")}
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-base">
                {recipe.cook_time}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 py-4 sm:flex-row sm:gap-3 sm:py-5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream-100 dark:bg-gray-700 sm:size-10">
              <Users className="size-4 text-terra-500 sm:size-5" />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 sm:text-xs">
                {t("servings")}
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-50 sm:text-base">
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
          <UtensilsSection utensils={recipe.utensils} labels={utensilLabels} />
        )}

        {recipe.nutrition && (
          <NutritionSection
            nutrition={recipe.nutrition}
            labels={nutritionLabels}
          />
        )}

        <ShareButtons
          title={recipe.title}
          description={recipe.description}
          image={recipe.image}
          slug={slug}
          shareText={recipeToShareText(recipe)}
        />

        <div className="print-hide mt-14 border-t border-cream-200 pt-10 dark:border-gray-700">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-terra-200 px-5 py-2.5 text-sm font-semibold text-terra-700 transition-all hover:border-terra-300 hover:bg-terra-50 dark:border-terra-700 dark:text-terra-400 dark:hover:bg-terra-900/30"
          >
            <ChevronLeft className="size-4" />
            {t("backLink")}
          </Link>
        </div>
      </div>

      {/* Related Recipes */}
      {related.length > 0 && (
        <section className="print-hide border-t border-cream-200 bg-cream-100 px-6 py-20 dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-terra-600">
                {t("keepCooking")}
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                {t("youMightAlsoLike")}
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
