import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { ExamplesClient } from "./examples-client";

export const metadata: Metadata = {
  title: "أمثلة حية لدعوات الزفاف الرقمية | لمّة (LAMMA)",
  description:
    "شاهد نماذج وأمثلة حية تفاعلية لدعوات الزفاف على منصة لمّة. اختبر تجربة فتح الغلاف، ومعرض الصور، والعد التنازلي على الهاتف.",
};

export default function ExamplesPage() {
  return (
    <MarketingLayout>
      <ExamplesClient />
    </MarketingLayout>
  );
}
