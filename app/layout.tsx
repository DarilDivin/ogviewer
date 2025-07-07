import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OG Viewer",
    template: "%s | OG Viewer",
  },
  description: "OG Viewer est un outil pour visualiser et déboguer les balises Open Graph de vos pages web.",
  keywords: [
    "Open Graph",
    "OG",
    "SEO",
    "Meta Tags",
    "Visualiseur",
    "Débogueur",
    "Next.js",
    "React",
    "Web",
    "Social Media",
  ],
  authors: [
    { name: "Daril DJODJO KOUTON", url: "https://daril.fr" },
  ],
  creator: "Daril DJODJO KOUTON",
  openGraph: {
    title: "OG Viewer",
    description: "Visualisez et déboguez facilement les balises Open Graph de vos pages web.",
    url: "https://ogviewer.daril.fr",
    siteName: "OG Viewer",
    images: [
      {
        url: "https://ogviewer.daril.fr/og.png",
        width: 1200,
        height: 630,
        alt: "Aperçu OG Viewer",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OG Viewer",
    description: "Visualisez et déboguez facilement les balises Open Graph de vos pages web.",
    images: ["https://ogviewer.daril.fr/og.png"],
    creator: "@darilfr",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          // enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
