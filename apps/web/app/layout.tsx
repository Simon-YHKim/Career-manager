import type { Metadata, Viewport } from "next";
import { pretendard } from "./fonts";
import { AppHeader } from "@/components/AppHeader";
import { ToastProvider } from "@/components/ui";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Career Manager",
    template: "%s · Career Manager",
  },
  description: "한국·영미권 통합 커리어 플랫폼",
  applicationName: "Career Manager",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["en_US"],
    siteName: "Career Manager",
    title: "Career Manager",
    description: "한국·영미권 통합 커리어 플랫폼",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Manager",
    description: "한국·영미권 통합 커리어 플랫폼",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f17" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={pretendard.className}>
        <ToastProvider>
          <AppHeader />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
