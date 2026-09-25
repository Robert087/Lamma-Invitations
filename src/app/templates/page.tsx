import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { TemplatesClient } from "./templates-client";

export const metadata: Metadata = {
  title: "تصاميم وقوالب الدعوات الرقمية | لمّة (LAMMA)",
  description:
    "استكشف تصاميم وقوالب دعوات الزفاف الرقمية الفاخرة على منصة لمّة. عاين القوالب السينمائية وابدأ تصميم دعوتك مجانًا.",
};

export default function TemplatesPage() {
  return (
    <MarketingLayout>
      <TemplatesClient />
    </MarketingLayout>
  );
}
