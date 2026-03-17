import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

// Map every translated heading variant to the icon key
const HEADING_TO_ICON_KEY: Record<string, string> = {
  // English
  ingredients: "ingredients",
  instructions: "instructions",
  // Spanish
  ingredientes: "ingredients",
  instrucciones: "instructions",
  preparación: "instructions",
  preparacion: "instructions",
};

const SECTION_ICONS: Record<string, string> = {
  ingredients: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="recipe-section-icon"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/></svg>`,
  instructions: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="recipe-section-icon"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`,
};

function injectSectionIcons(html: string): string {
  return html.replace(/<h2>(.*?)<\/h2>/gi, (match, title: string) => {
    const iconKey = HEADING_TO_ICON_KEY[title.trim().toLowerCase()];
    const icon = iconKey ? SECTION_ICONS[iconKey] : undefined;
    if (!icon) return match;
    return `<h2>${icon}<span>${title}</span></h2>`;
  });
}

export interface Utensil {
  name: string;
  url: string;
}

export interface Nutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar?: string;
  sodium?: string;
}

export interface RecipeFrontmatter {
  title: string;
  description: string;
  image: string;
  prep_time: string;
  cook_time: string;
  servings: string | number;
  utensils?: Utensil[];
  nutrition?: Nutrition;
}

export interface Recipe extends RecipeFrontmatter {
  slug: string;
  contentHtml: string;
}

export interface RecipeSummary extends RecipeFrontmatter {
  slug: string;
}

function getRecipesDirectory(locale: string): string {
  return path.join(process.cwd(), "recipes", locale);
}

export function getAllRecipes(locale: string = "en"): RecipeSummary[] {
  const dir = getRecipesDirectory(locale);
  if (!fs.existsSync(dir)) return [];
  const fileNames = fs.readdirSync(dir);
  return fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(dir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        ...(data as RecipeFrontmatter),
      };
    });
}

export async function getRecipeBySlug(
  slug: string,
  locale: string = "en",
): Promise<Recipe> {
  const dir = getRecipesDirectory(locale);
  const fullPath = path.join(dir, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(remarkHtml).process(content);
  const contentHtml = injectSectionIcons(processedContent.toString());

  return {
    slug,
    contentHtml,
    ...(data as RecipeFrontmatter),
  };
}

/** Converts a recipe into a clean plain-text string suitable for the Notes app. */
export function recipeToShareText(recipe: Recipe): string {
  const contentText = recipe.contentHtml
    .replace(/<h2[^>]*>[\s\S]*?<\/h2>/gi, (match) => {
      const heading = match.replace(/<[^>]*>/g, "").trim();
      return `\n\n── ${heading.toUpperCase()} ──\n`;
    })
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner: string) => {
      const text = inner.replace(/<[^>]*>/g, "").trim();
      return `• ${text}\n`;
    })
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner: string) => {
      const text = inner.replace(/<[^>]*>/g, "").trim();
      return text ? `${text}\n` : "";
    })
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const lines: string[] = [
    recipe.title,
    "=".repeat(recipe.title.length),
    "",
    recipe.description,
    "",
    `Prep: ${recipe.prep_time}  |  Cook: ${recipe.cook_time}  |  Serves: ${recipe.servings}`,
    "",
    contentText,
  ];

  if (recipe.utensils?.length) {
    lines.push("\n\n── KITCHEN TOOLS ──");
    recipe.utensils.forEach((u) => lines.push(`• ${u.name}`));
  }

  if (recipe.nutrition) {
    lines.push(
      "",
      "── NUTRITION (per serving) ──",
      `Calories: ${recipe.nutrition.calories} kcal`,
      `Protein: ${recipe.nutrition.protein}`,
      `Carbs: ${recipe.nutrition.carbs}`,
      `Fat: ${recipe.nutrition.fat}`,
      `Fiber: ${recipe.nutrition.fiber}`,
    );
  }

  lines.push("", `From LowKeyCooking`);

  return lines.join("\n");
}
