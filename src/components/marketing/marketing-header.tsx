"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMarketingLocale } from "./marketing-locale-context";

interface MarketingHeaderProps {
  userEmail?: string | null;
}

export function MarketingHeader({ userEmail }: MarketingHeaderProps) {
  const { locale, setLocale, isAr } = useMarketingLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/templates", labelAr: "التصاميم", labelEn: "Templates" },
    { href: "/pricing", labelAr: "الأسعار", labelEn: "Pricing" },
    { href: "/how-it-works", labelAr: "إزاي بتشتغل", labelEn: "How It Works" },
    { href: "/examples", labelAr: "أمثلة حية", labelEn: "Live Demos" },
    { href: "/made-for-you", labelAr: "سيبوها علينا", labelEn: "Made For You" },
    { href: "/faq", labelAr: "الأسئلة الشائعة", labelEn: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full lm-glass-nav transition-all">
      <div className="lm-market-container-wide flex h-20 items-center justify-between gap-4">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--lm-border)] shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/marketing/logo.png"
              alt="لمّة - LAMMA"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-[var(--lm-ink)] font-sans">
                لمّة
              </span>
              <span className="text-xs font-semibold tracking-widest text-[var(--lm-muted)] uppercase hidden sm:inline-block">
                LAMMA
              </span>
            </div>
            <span className="text-[10px] tracking-wider text-[var(--lm-accent)] font-medium hidden md:inline-block">
              {isAr ? "لحظاتكم تستحق الأجمل" : "YOUR MOMENTS MATTER"}
            </span>
          </div>
        </Link>

        {/* Editorial Navigation Links with Burgundy Underline Indicator */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`lm-nav-link ${isActive ? "is-active" : ""}`}
              >
                {isAr ? link.labelAr : link.labelEn}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="rounded-full border border-[var(--lm-border)] px-3 py-1.5 text-xs font-bold text-[var(--lm-ink)] hover:border-[var(--lm-accent)] hover:text-[var(--lm-accent)] transition-colors"
            title={isAr ? "Switch to English" : "التبديل إلى العربية"}
          >
            {locale === "ar" ? "EN" : "عربي"}
          </button>

          {/* User Sign In / Dashboard */}
          {userEmail ? (
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex text-xs font-bold text-[var(--lm-ink)] hover:text-[var(--lm-accent)] px-3 py-1.5 transition"
            >
              {isAr ? "لوحة التحكم" : "Dashboard"}
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex text-xs font-bold text-[var(--lm-ink-secondary)] hover:text-[var(--lm-accent)] px-3 py-1.5 transition"
            >
              {isAr ? "دخول" : "Sign In"}
            </Link>
          )}

          {/* Single Obvious Primary CTA */}
          <Link
            href="/create"
            className="lm-btn-primary text-xs font-bold py-2.5 px-5 shadow-sm"
          >
            {isAr ? "ابدأ دعوتك" : "Start Free"}
          </Link>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[var(--lm-ink)] hover:bg-[var(--lm-surface-warm)] transition"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--lm-border)] bg-white/98 backdrop-blur-xl px-6 py-6 shadow-xl animate-fade-in">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-bold py-2.5 border-b border-[var(--lm-border-subtle)] ${
                  pathname === link.href
                    ? "text-[var(--lm-accent)]"
                    : "text-[var(--lm-ink)]"
                }`}
              >
                {isAr ? link.labelAr : link.labelEn}
              </Link>
            ))}

            <div className="pt-4 flex items-center justify-between">
              {userEmail ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-[var(--lm-accent)]"
                >
                  {isAr ? "لوحة التحكم" : "Dashboard"}
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-[var(--lm-muted)]"
                >
                  {isAr ? "تسجيل الدخول" : "Sign In"}
                </Link>
              )}
              <Link
                href="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="lm-btn-primary text-xs py-2 px-5"
              >
                {isAr ? "ابدأ دعوتك" : "Start Free"}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
