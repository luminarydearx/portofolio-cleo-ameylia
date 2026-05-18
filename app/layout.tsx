import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cleo Ameylia Salsabila — Startup Founder & Builder",
    template: "%s | Cleo Ameylia Salsabila",
  },
  description:
    "Building AI-powered products that empower teams and transform industries. Startup founder, engineer, and product builder.",
  keywords: [
    "startup founder",
    "AI engineer",
    "product builder",
    "SaaS founder",
    "tech entrepreneur",
  ],
  authors: [{ name: "Cleo Ameylia Salsabila" }],
  creator: "Cleo Ameylia Salsabila",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cleo-ameylia-portofolio.vercel.app",
    title: "Cleo Ameylia Salsabila — Startup Founder & Builder",
    description:
      "Building AI-powered products that empower teams and transform industries.",
    siteName: "Cleo Ameylia Salsabila Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleo Ameylia Salsabila — Startup Founder & Builder",
    description:
      "Building AI-powered products that empower teams and transform industries.",
    creator: "@cleoameylia",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
