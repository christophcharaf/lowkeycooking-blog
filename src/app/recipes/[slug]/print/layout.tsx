import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Print Recipe — LowKeyCooking",
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Suppress the global navbar and footer on the print-preview page */}
      <style>{`
        body > div > nav,
        body > div > footer,
        header[role="banner"],
        nav { display: none !important; }
        main { padding-top: 0 !important; margin-top: 0 !important; }
      `}</style>
      {children}
    </>
  );
}
