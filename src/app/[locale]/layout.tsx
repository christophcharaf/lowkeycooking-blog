import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const GA_ID = "G-KHHC5R4WBJ";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lowkeycooking.com";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: {
      template: `%s — LowKeyCooking`,
      default: t("siteTitle"),
    },
    description: t("siteDescription"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  const messages = await getMessages();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LowKeyCooking",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/${locale}/recipes?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-terra-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main id="main-content">{children}</main>
            <LocaleFooter locale={locale} />
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId={GA_ID} />
      </body>
    </html>
  );
}

async function LocaleFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Layout" });
  return (
    <footer className="border-t border-cream-200 bg-cream-100 py-12 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
          LowKeyCooking
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t("footerTagline")}
        </p>
        <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
          {t("footerCopyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
