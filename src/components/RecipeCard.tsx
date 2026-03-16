import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, Users, ArrowRight } from "lucide-react";
import type { RecipeSummary } from "@/lib/recipes";

interface RecipeCardProps {
  recipe: RecipeSummary;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-terra-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

        {/* Serves pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
          <Users className="size-3" />
          {recipe.servings}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h2 className="mb-2 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-terra-700">
          {recipe.title}
        </h2>
        <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500">
          {recipe.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center gap-4 border-t border-cream-200 pt-4">
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Clock className="size-3.5 text-terra-500" />
            {recipe.prep_time} prep
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Flame className="size-3.5 text-orange-400" />
            {recipe.cook_time} cook
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-terra-600 transition-all group-hover:gap-2">
            View Recipe
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
