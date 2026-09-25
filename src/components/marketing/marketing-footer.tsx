"use client";

import Link from "next/link";
import Image from "next/image";
import { useMarketingLocale } from "./marketing-locale-context";

export function MarketingFooter() {
  const { isAr } = useMarketingLocale();

  return (
    <footer className="border-t border-[var(--lm-border)] bg-[#FAF8F5] pt-16 pb-12 text-[var(--lm-ink)]">
      <div className="lm-market-container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--lm-border)]">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[var(--lm-border)] shadow-sm">
                <Image
                  src="/marketing/logo.png"
                  alt="لمّة - LAMMA"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[var(--lm-ink)] font-sans">
                  لمّة
                </span>
                <span className="text-xs font-semibold tracking-widest text-[var(--lm-muted)] uppercase">
                  LAMMA
                </span>
              </div>
            </Link>
            <p className="text-sm text-[var(--lm-muted)] max-w-sm leading-relaxed">
              {isAr
                ? "دعوات زفاف رقمية فاخرة بتفاصيل أنيقة، تجمع صوركم وحكايتكم ومكان الفرح في لينك واحد شيك يوصل على واتساب."
                : "Bespoke digital wedding invitations crafted with editorial care. Delivering your story to loved ones in one refined WhatsApp link."}
            </p>
            <div className="pt-2">
              <Link
                href="/create"
                className="lm-btn-primary text-xs py-2.5 px-6 inline-flex"
              >
                {isAr ? "ابدأ دعوتك مجانًا" : "Start Your Invitation"}
              </Link>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--lm-ink)]">
              {isAr ? "المنتج" : "Product"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/templates" className="text-[var(--lm-muted)] hover:text-[var(--lm-accent)] transition">
                  {isAr ? "التصاميم والقوالب" : "Templates"}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[var(--lm-muted)] hover:text-[var(--lm-accent)] transition">
                  {isAr ? "باقات وتجارب الدعوة" : "Experiences & Pricing"}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[var(--lm-muted)] hover:text-[var(--lm-accent)] transition">
                  {isAr ? "إزاي بتشتغل" : "How It Works"}
                </Link>
              </li>
              <li>
                <Link href="/examples" className="text-[var(--lm-muted)] hover:text-[var(--lm-accent)] transition">
                  {isAr ? "أمثلة حية" : "Live Demos"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--lm-ink)]">
              {isAr ? "الخدمات والدعم" : "Services & Support"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/made-for-you" className="text-[var(--lm-muted)] hover:text-[var(--lm-accent)] transition">
                  {isAr ? "خدمة سيبوها علينا" : "Made For You Concierge"}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[var(--lm-muted)] hover:text-[var(--lm-accent)] transition">
                  {isAr ? "الأسئلة الشائعة" : "FAQ"}
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-[var(--lm-muted)] hover:text-[var(--lm-accent)] transition">
                  {isAr ? "تجهيز الدعوة السريع" : "Start Creating"}
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-[var(--lm-muted)] hover:text-[var(--lm-accent)] transition">
                  {isAr ? "تسجيل الدخول" : "Sign In"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Occasion */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--lm-ink)]">
              {isAr ? "الخصوصية والراحة" : "Trust & Elegance"}
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--lm-muted)]">
              <li>
                <span>{isAr ? "تخزين آمن لصوركم" : "Private Media Storage"}</span>
              </li>
              <li>
                <span>{isAr ? "بدون رسوم خفية" : "Transparent Pricing"}</span>
              </li>
              <li>
                <span>{isAr ? "تعديل فوري في أي وقت" : "Instant Live Updates"}</span>
              </li>
              <li>
                <span>{isAr ? "مصممة للموبايل وواتساب" : "Mobile & WhatsApp First"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--lm-muted)]">
          <p>
            {isAr
              ? `© 2026 لمّة (LAMMA). جميع الحقوق محفوظة.`
              : `© 2026 LAMMA. All rights reserved.`}
          </p>
          <div className="flex items-center gap-6">
            <span>{isAr ? "صُنعت بكل حب لأجمل ليالي العمر" : "Crafted with love for real celebrations"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
