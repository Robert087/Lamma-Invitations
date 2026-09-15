import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { HomeSections } from "@/components/marketing/home-sections";

export const metadata: Metadata = {
  title: "لمّة (LAMMA) | دعوة فرح رقمية تليق بيومكم الكبير",
  description:
    "اصنعوا دعوة زفاف رقمية فاخرة تجمع صوركم، حكايتكم، ومكان الفرح في لينك واحد شيك على واتساب. ابدأوا الآن مجانًا بدون تسجيل دخول.",
};

export default function Home() {
  return (
    <MarketingLayout>
      <HomeSections />
    </MarketingLayout>
  );
}
