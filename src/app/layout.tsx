import type { Metadata } from "next";
import { Cormorant_Garamond, Cairo } from "next/font/google";

import { appConfig } from "@/config/app";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: appConfig.name,
  description: "Digital invitations for every occasion.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={appConfig.defaultLocale} dir={appConfig.defaultDirection} className={`${cormorant.variable} ${cairo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
