import { notFound } from "next/navigation";
import {
  getRecipeBySlug,
  getAllRecipes,
} from "@/lib/recipes";
import PrintPreview from "@/components/PrintPreview";

export async function generateStaticParams() {
  return getAllRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const recipe = await getRecipeBySlug(slug);
    return { title: `Print: ${recipe.title} — LowKeyCooking` };
  } catch {
    return { title: "Print Recipe" };
  }
}

export default async function PrintPage({
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

  return <PrintPreview recipe={recipe} slug={slug} />;
}
