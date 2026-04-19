import type { MetadataRoute } from "next";
import { getAllRecipes } from "@/lib/recipes";
import { routing } from "@/i18n/routing";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lowkeycooking.com";
const LOCALES = routing.locales;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    { url: `${BASE}/${locale}`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/${locale}/recipes`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ]);

  const recipesByLocale = await Promise.all(LOCALES.map((locale) => getAllRecipes(locale)));

  const recipeEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale, i) =>
    recipesByLocale[i].map((recipe) => ({
      url: `${BASE}/${locale}/recipes/${recipe.slug}`,
      lastModified: recipe.lastModified ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );

  return [...staticEntries, ...recipeEntries];
}
