import type { Metadata } from "next";
import Link from "next/link";

import { AppFrame } from "@/components/layout/app-frame";
import { getCurrentUser } from "@/features/events/data";
import { GuestCreationFlow } from "@/features/events/guest-creation-flow";

export const metadata: Metadata = {
  title: "ابدأ دعوتك | Lamma",
  description: "اصنع دعوة رقمية لمناسبتك بدون تعقيد وبدون تسجيل دخول.",
};

type CreatePageProps = {
  searchParams: Promise<{ claim?: string; continuation?: string }>;
};

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const { claim, continuation } = await searchParams;
  const user = await getCurrentUser();
  const shouldAutoClaim = claim === "true" || continuation === "claim-draft";

  return (
    <AppFrame
      action={
        user ? (
          <Link className="lm-link text-xs font-semibold" href="/dashboard">
            لوحة التحكم
          </Link>
        ) : (
          <Link className="lm-link text-xs font-semibold" href="/sign-in?continuation=claim-draft">
            تسجيل الدخول
          </Link>
        )
      }
    >
      <main className="w-full max-w-7xl mx-auto px-4 pb-16 pt-6 sm:px-6">
        <GuestCreationFlow
          isAuthenticated={Boolean(user)}
          shouldAutoClaim={shouldAutoClaim}
        />
      </main>
    </AppFrame>
  );
}
