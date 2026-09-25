"use client";

import { GuestDraftProvider, useGuestDraft } from "./guest-draft-context";
import { GuestOnboarding } from "./guest-onboarding";
import { GuestStudio } from "./guest-studio";

interface GuestCreationFlowProps {
  isAuthenticated?: boolean;
  shouldAutoClaim?: boolean;
}

function GuestCreationFlowInner({ isAuthenticated = false, shouldAutoClaim = false }: GuestCreationFlowProps) {
  const { draft, isHydrated, locale } = useGuestDraft();

  const isAr = locale === "ar";

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--lm-accent)] border-r-transparent" />
        <p className="mt-4 text-sm font-semibold text-[var(--lm-muted)]">
          {isAr ? "جاري تحميل مسودتك المحلية..." : "Loading your local draft..."}
        </p>
      </div>
    );
  }

  if (!draft.onboarding_completed) {
    return <GuestOnboarding />;
  }

  return (
    <GuestStudio
      isAuthenticated={isAuthenticated}
      shouldAutoClaim={shouldAutoClaim}
    />
  );
}

export function GuestCreationFlow({ isAuthenticated, shouldAutoClaim }: GuestCreationFlowProps) {
  return (
    <GuestDraftProvider>
      <GuestCreationFlowInner
        isAuthenticated={isAuthenticated}
        shouldAutoClaim={shouldAutoClaim}
      />
    </GuestDraftProvider>
  );
}
