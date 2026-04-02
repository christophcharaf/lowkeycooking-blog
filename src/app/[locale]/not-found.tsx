import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Home, ChefHat } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found — LowKeyCooking" },
  robots: { index: false },
};

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "NotFound" });

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <ChefHat className="mb-6 size-16 text-terra-300" />
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
        {t("heading")}
      </h1>
      <p className="mb-8 max-w-md text-base text-gray-500 dark:text-gray-400">
        {t("description")}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-terra-700"
        >
          <Home className="size-4" />
          {t("goHome")}
        </Link>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 rounded-full border border-cream-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-cream-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {t("browseRecipes")}
        </Link>
      </div>
    </div>
  );
}
