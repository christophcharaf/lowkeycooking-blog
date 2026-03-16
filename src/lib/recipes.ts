import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const recipesDirectory = path.join(process.cwd(), "recipes");

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

export function getAllRecipes(): RecipeSummary[] {
  const fileNames = fs.readdirSync(recipesDirectory);
  return fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(recipesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        ...(data as RecipeFrontmatter),
      };
    });
}

export async function getRecipeBySlug(slug: string): Promise<Recipe> {
  const fullPath = path.join(recipesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(remarkHtml).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...(data as RecipeFrontmatter),
  };
}

export function generateStaticParams(): { slug: string }[] {
  const fileNames = fs.readdirSync(recipesDirectory);
  return fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => ({ slug: fileName.replace(/\.md$/, "") }));
}
