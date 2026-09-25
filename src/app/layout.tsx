import type { Metadata } from "next";
import { Alexandria, Plus_Jakarta_Sans, Cormorant_Garamond, Cairo } from "next/font/google";

import { appConfig } from "@/config/app";

import "./globals.css";
import "@/styles/marketing.css";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-alexandria",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    <html
      lang={appConfig.defaultLocale}
      dir={appConfig.defaultDirection}
      className={`${alexandria.variable} ${jakarta.variable} ${cormorant.variable} ${cairo.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
