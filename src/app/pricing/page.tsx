import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "باقات الأسعار والخطط | لمّة (LAMMA)",
  description:
    "تعرف على باقات منصة لمّة للدعوات الرقمية الفاخرة. ادفع مرة واحدة فقط عند النشر، وعاين دعوتك كاملة مجانًا بدون اشتراكات.",
};

export default function PricingPage() {
  return (
    <MarketingLayout>
      <PricingClient />
    </MarketingLayout>
  );
}
