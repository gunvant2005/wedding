import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gatherly — Luxury Wedding & Event Planning Atelier",
  description:
    "An opulent, bespoke wedding and luxury event planning atelier with AI copilot, curated budgets, vendor coordination, and timelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} dark h-full`}>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[#C5A059]/30 selection:text-[#FCFBF7]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-[#C5A059] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0D0D11] focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <div id="main-content">{children}</div>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: "#17171A",
              border: "1px solid rgba(197, 160, 89, 0.35)",
              color: "#F6F3ED",
            },
          }}
        />
      </body>
    </html>
  );
}
