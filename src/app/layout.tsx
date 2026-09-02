import type { Metadata } from "next";

import { appConfig } from "@/config/app";

import "./globals.css";

export const metadata: Metadata = {
  title: appConfig.name,
  description: "Digital invitations for every occasion.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={appConfig.defaultLocale} dir={appConfig.defaultDirection}>
      <body>{children}</body>
    </html>
  );
}
