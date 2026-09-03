import type { Metadata } from "next";
import { Geist, Noto_Sans_Arabic } from "next/font/google";

import { appConfig } from "@/config/app";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-arabic", display: "swap" });

export const metadata: Metadata = {
  title: "لمّة — دعوات بتتحس",
  description: "اعمل دعوة تشبه مناسبتك. احكيها، لمّة تعملها.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={appConfig.defaultLocale} dir={appConfig.defaultDirection} className={`${geist.variable} ${arabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
