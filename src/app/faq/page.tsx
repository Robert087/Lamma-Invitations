import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { FaqClient } from "./faq-client";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة ومركز المساعدة | لمّة (LAMMA)",
  description:
    "إجابات على جميع الأسئلة الشائعة حول منصة لمّة: إنشاء الدعوة، المعاينة الحية، إضافة الصور، تتبع الحضور، والباقات المتاحة.",
};

export default function FaqPage() {
  return (
    <MarketingLayout>
      <FaqClient />
    </MarketingLayout>
  );
}
