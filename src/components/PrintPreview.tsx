"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Flame, Users, Printer, ChevronLeft, ImageIcon } from "lucide-react";
import type { Recipe, Nutrition } from "@/lib/recipes";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function NutritionRow({
  label,
  value,
  bold,
  kcalLabel,
  caloriesLabel,
}: {
  label: string;
  value: string;
  bold?: boolean;
  kcalLabel: string;
  caloriesLabel: string;
}) {
  return (
    <div
      className={`flex justify-between border-b border-gray-100 px-4 py-2 text-sm ${bold ? "font-black" : ""}`}
    >
      <span className={bold ? "text-lg" : "text-gray-700"}>
        {bold ? `${value} ${kcalLabel}` : label}
      </span>
      <span
        className={bold ? "text-lg text-terra-600" : "font-semibold text-gray-900"}
      >
        {bold ? caloriesLabel : value}
      </span>
    </div>
  );
}

function NutritionBlock({
  nutrition,
  t,
}: {
  nutrition: Nutrition;
  t: ReturnType<typeof useTranslations<"PrintPreview">>;
}) {
  const rows = [
    { label: t("calories"), value: String(nutrition.calories), bold: true },
    { label: t("protein"), value: nutrition.protein },
    { label: t("carbs"), value: nutrition.carbs },
    { label: t("fat"), value: nutrition.fat },
    { label: t("fiber"), value: nutrition.fiber },
    ...(nutrition.sugar ? [{ label: t("sugar"), value: nutrition.sugar }] : []),
    ...(nutrition.sodium
      ? [{ label: t("sodium"), value: nutrition.sodium }]
      : []),
  ];

  return (
    <div className="mt-10">
      <h2 className="mb-3 text-lg font-extrabold tracking-tight text-gray-900">
        {t("nutritionFacts")}
      </h2>
      <p className="mb-3 text-xs text-gray-400">{t("perServing")}</p>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="border-b-4 border-gray-900 bg-gray-900 px-4 py-3">
          <p className="text-xl font-black text-white">{t("nutritionFacts")}</p>
          <p className="text-xs text-gray-400">{t("perServing")}</p>
        </div>
        <div className="bg-white">
          {rows.map((row) => (
            <NutritionRow
              key={row.label}
              {...row}
              kcalLabel="kcal"
              caloriesLabel={t("calories")}
            />
          ))}
        </div>
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-400">
          {t("nutritionDisclaimer")}
        </div>
      </div>
    </div>
  );
}

interface PrintPreviewProps {
  recipe: Recipe;
  slug: string;
}

export default function PrintPreview({ recipe, slug }: PrintPreviewProps) {
  const [showImage, setShowImage] = useState(true);
  const [showNutrition, setShowNutrition] = useState(true);
  const t = useTranslations("PrintPreview");

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top action bar (hidden when printing) ── */}
      <div className="print-hide sticky top-0 z-50 border-b border-gray-200 bg-gray-50 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
          {/* Left: back + toggles */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/recipes/${slug}`}
              className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <ChevronLeft className="size-4" />
              {t("goBack")}
            </Link>

            <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              <div
                className={`relative flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${showImage ? "border-terra-600 bg-terra-600" : "border-gray-300 bg-white"}`}
              >
                {showImage && (
                  <svg
                    viewBox="0 0 12 10"
                    className="h-3 w-3 fill-none stroke-white stroke-2"
                  >
                    <polyline points="1,5 4,8 11,1" />
                  </svg>
                )}
                <input
                  type="checkbox"
                  checked={showImage}
                  onChange={(e) => setShowImage(e.target.checked)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
              <ImageIcon className="size-4 text-gray-500" />
              {t("recipeImage")}
            </label>

            {recipe.nutrition && (
              <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                <div
                  className={`relative flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${showNutrition ? "border-terra-600 bg-terra-600" : "border-gray-300 bg-white"}`}
                >
                  {showNutrition && (
                    <svg
                      viewBox="0 0 12 10"
                      className="h-3 w-3 fill-none stroke-white stroke-2"
                    >
                      <polyline points="1,5 4,8 11,1" />
                    </svg>
                  )}
                  <input
                    type="checkbox"
                    checked={showNutrition}
                    onChange={(e) => setShowNutrition(e.target.checked)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
                {t("nutritionFacts")}
              </label>
            )}
          </div>

          {/* Right: print button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full bg-terra-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-terra-700 active:scale-95"
          >
            <Printer className="size-4" />
            {t("print")}
          </button>
        </div>
      </div>

      {/* ── Recipe content ── */}
      <div className="mx-auto max-w-3xl px-8 py-10">
        {/* Hero image */}
        {showImage && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80 print:rounded-none">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {/* Title + description */}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900">
          {recipe.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-gray-500">
          {recipe.description}
        </p>

        {/* At-a-glance stats */}
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-y border-gray-200 py-5">
          <div className="flex items-center gap-2.5">
            <Clock className="size-5 shrink-0 text-terra-600" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {t("prepTime")}
              </div>
              <div className="text-sm font-bold text-gray-900">
                {recipe.prep_time}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Flame className="size-5 shrink-0 text-orange-500" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {t("cookTime")}
              </div>
              <div className="text-sm font-bold text-gray-900">
                {recipe.cook_time}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Users className="size-5 shrink-0 text-terra-500" />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {t("servings")}
              </div>
              <div className="text-sm font-bold text-gray-900">
                {recipe.servings}
              </div>
            </div>
          </div>
          {recipe.nutrition?.calories && (
            <div className="flex items-center gap-2.5">
              <div className="flex size-5 shrink-0 items-center justify-center">
                <span className="text-base font-black text-terra-600">~</span>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {t("calories")}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {recipe.nutrition.calories} kcal
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ingredients + Instructions (from markdown) */}
        <div
          className="recipe-content mt-8"
          dangerouslySetInnerHTML={{ __html: recipe.contentHtml }}
        />

        {/* Nutrition facts */}
        {recipe.nutrition && showNutrition && (
          <NutritionBlock nutrition={recipe.nutrition} t={t} />
        )}

        {/* Footer attribution */}
        <div className="mt-12 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          {t("recipeFrom")}{" "}
          <span className="font-semibold text-terra-600">LowKeyCooking</span>
        </div>
      </div>
    </div>
  );
}
