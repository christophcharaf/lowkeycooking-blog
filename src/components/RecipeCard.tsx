import Image from "next/image";
import { Clock, Flame, Users, ArrowRight } from "lucide-react";
import type { RecipeSummary } from "@/lib/recipes";
import { Link } from "@/i18n/navigation";

interface RecipeCardLabels {
  prep: string;
  cook: string;
  viewRecipe: string;
}

interface RecipeCardProps {
  recipe: RecipeSummary;
  labels: RecipeCardLabels;
  index?: number;
}

export default function RecipeCard({ recipe, labels, index }: RecipeCardProps) {
  const isPriority = index !== undefined && index < 3;

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-terra-200 dark:bg-gray-800 dark:ring-white/10 dark:hover:ring-terra-700"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-terra-100 dark:bg-gray-700">
        <Image
          src={recipe.image || "/logo.png"}
          alt={recipe.title}
          fill
          priority={isPriority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

        {/* Category badge */}
        {recipe.category && (
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold capitalize text-gray-700 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200">
            {recipe.category}
          </div>
        )}

        {/* Serves pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200">
          <Users className="size-3" />
          {recipe.servings}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h2 className="mb-2 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-terra-700 dark:text-gray-50 dark:group-hover:text-terra-400">
          {recipe.title}
        </h2>
        <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {recipe.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center gap-4 border-t border-cream-200 pt-4 dark:border-gray-700">
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            <Clock className="size-3.5 text-terra-500" />
            {recipe.prep_time} {labels.prep}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            <Flame className="size-3.5 text-orange-400" />
            {recipe.cook_time} {labels.cook}
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-terra-600 transition-all group-hover:gap-2 dark:text-terra-400">
            {labels.viewRecipe}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
