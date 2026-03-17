import { getAllRecipes } from "@/lib/recipes";
import RecipeSearch from "@/components/RecipeSearch";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("recipesTitle"),
    description: t("recipesDescription"),
  };
}

export default async function RecipesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const recipes = getAllRecipes(locale);
  const t = await getTranslations({ locale, namespace: "RecipesPage" });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-terra-600">
          {t("collectionLabel")}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          {t("heading")}
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          {t("subheading", { count: recipes.length })}
        </p>
      </div>

      <RecipeSearch recipes={recipes} />
    </div>
  );
}
