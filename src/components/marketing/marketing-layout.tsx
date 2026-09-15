import React from "react";
import { getCurrentUser } from "@/features/events/data";
import { MarketingLocaleProvider } from "./marketing-locale-context";
import { MarketingHeader } from "./marketing-header";
import { MarketingFooter } from "./marketing-footer";

export async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <MarketingLocaleProvider>
      <div className="min-h-screen flex flex-col bg-[var(--lm-cream)] text-[var(--lm-obsidian)] selection:bg-[var(--lm-terracotta-soft)] selection:text-[var(--lm-terracotta-dark)]">
        <MarketingHeader userEmail={user?.email} />
        <main className="flex-1 w-full">{children}</main>
        <MarketingFooter />
      </div>
    </MarketingLocaleProvider>
  );
}
