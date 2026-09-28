import type { Metadata } from "next";
import { Inter, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

/* Fonts are self-hosted and subset by next/font. The variable names match the
   --font-heading / --font-body / --font-mono tokens in globals.css, which is
   what makes font-heading, font-body and kr-mono resolve to real files.

   `preload: false` on the mono face: it is referenced by the kr-mono utility on
   a single page, so preloading it in the root layout shipped 5 unused woff2
   files to every visitor. The two faces that are used on every page (body and
   headings) keep the default preloading. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Mama Africa Library - African Books & Literature",
  description:
    "Discover and explore authentic African literature, folklore, and cultural stories. Supporting local authors and preserving our heritage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${playfair.variable} ${plexMono.variable} antialiased w-full`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <AuthProvider>{children}</AuthProvider>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
