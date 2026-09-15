import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { HowItWorksClient } from "./how-it-works-client";

export const metadata: Metadata = {
  title: "إزاي بتشتغل المنصة | لمّة (LAMMA)",
  description:
    "تعرف على طريقة عمل منصة لمّة خطوة بخطوة. من أول اختيار القالب وإضافة تفاصيلكم وصوركم حتى مشاركة الرابط مع المعازيم على واتساب.",
};

export default function HowItWorksPage() {
  return (
    <MarketingLayout>
      <HowItWorksClient />
    </MarketingLayout>
  );
}
