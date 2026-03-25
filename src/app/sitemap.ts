import type { MetadataRoute } from "next";
import { getAllRecipes } from "@/lib/recipes";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lowkeycooking.com";
const LOCALES = ["en", "es"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    { url: `${BASE}/${locale}`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/${locale}/recipes`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ]);

  const recipeEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    getAllRecipes(locale).map((recipe) => ({
      url: `${BASE}/${locale}/recipes/${recipe.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );

  return [...staticEntries, ...recipeEntries];
}
