import { Navbar } from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import { LinkConfig, SiteConfig } from "@/config/sites";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const title = SiteConfig.metaTitle;
const description = SiteConfig.desc;

export const metadata: Metadata = {
  metadataBase: new URL(LinkConfig.site),
  title,
  description,
  keywords: [
    "searchgpt",
    "topaitools",
    "ai",
    "chatgpt",
    "discov-ai",
    "discover ai",
    "search engine",
    "top ai traffic",
    "ai search engine",
  ],
  openGraph: {
    title,
    description,
    images: "/og.png",
    url: new URL(LinkConfig.site),
    type: "website",
    siteName: SiteConfig.name,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@ruiyanghim",
    images: "/og.png",
    site: LinkConfig.site,
  },
  icons: ["/favicon.svg"],
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("antialiased", GeistSans.className)}>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Toaster />
            </ThemeProvider>
          </Providers>
          <Script
            defer
            src="https://ryan-umami-mamimami.vercel.app/script.js"
            data-website-id="5bcb1ea9-c57e-44fb-9a8b-d1f4af19c179"
          ></Script>
        </body>
      </html>
    </>
  );
}
