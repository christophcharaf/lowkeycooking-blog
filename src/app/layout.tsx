import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LowKeyCooking — Delicious Recipes for Everyone",
  description:
    "Discover hand-crafted recipes from around the world. Simple ingredients, incredible flavors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-cream-200 bg-cream-100 py-12">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="text-2xl font-extrabold tracking-tight text-gray-900">
              LowKeyCooking
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Homemade recipes for every occasion.
            </p>
            <p className="mt-6 text-xs text-gray-400">
              © {new Date().getFullYear()} RecipeBlog. Made with love and good food.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
