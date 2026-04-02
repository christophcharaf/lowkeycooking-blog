import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

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
            <main>{children}</main>
            <LocaleFooter locale={locale} />
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
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
