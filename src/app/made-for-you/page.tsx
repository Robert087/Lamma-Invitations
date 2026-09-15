import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { MadeForYouClient } from "./made-for-you-client";

export const metadata: Metadata = {
  title: "خدمة سيبها علينا (Concierge VIP) | لمّة (LAMMA)",
  description:
    "مش فاضي لتجهيز وتنسيق دعوتك؟ فريق التصميم في منصة لمّة يتولى صياغة وتجهيز دعوتك الرقمية بالكامل من الألف للياء.",
};

export default function MadeForYouPage() {
  return (
    <MarketingLayout>
      <MadeForYouClient />
    </MarketingLayout>
  );
}
