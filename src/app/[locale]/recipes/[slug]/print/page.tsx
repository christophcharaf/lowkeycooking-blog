import { notFound } from "next/navigation";
import { getAllRecipes, getRecipeBySlug } from "@/lib/recipes";
import PrintPreview from "@/components/PrintPreview";

export async function generateStaticParams() {
  const locales = ["en", "es"];
  return locales.flatMap((locale) =>
    getAllRecipes(locale).map((r) => ({ locale, slug: r.slug })),
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
    return { title: `Print: ${recipe.title} — LowKeyCooking` };
  } catch {
    return { title: "Print Recipe" };
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
