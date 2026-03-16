import { getAllRecipes } from "@/lib/recipes";
import RecipeSearch from "@/components/RecipeSearch";

export const metadata = {
  title: "All Recipes — LowKeyCooking",
  description: "Browse and search all our homemade recipes.",
};

export default function RecipesPage() {
  const recipes = getAllRecipes();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-terra-600">
          The Collection
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          All Recipes
        </h1>
        <p className="mt-3 text-base text-gray-500">
          {recipes.length} homemade recipes — search by name or description.
        </p>
      </div>

      <RecipeSearch recipes={recipes} />
    </div>
  );
}
