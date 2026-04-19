import { notFound } from "next/navigation";
import { getAllRecipes, getRecipeBySlug } from "@/lib/recipes";
import PrintPreview from "@/components/PrintPreview";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const { locales } = routing;
  const recipesByLocale = await Promise.all(locales.map((locale) => getAllRecipes(locale)));
  return locales.flatMap((locale, i) =>
    recipesByLocale[i].map((r) => ({ locale, slug: r.slug })),
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
    return {
      title: { absolute: `Print: ${recipe.title} — LowKeyCooking` },
      robots: { index: false, follow: false },
    };
  } catch {
    return {
      title: { absolute: "Print Recipe — LowKeyCooking" },
      robots: { index: false, follow: false },
    };
  }
}

export default async function PrintPage({
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

  return <PrintPreview recipe={recipe} slug={slug} />;
}
