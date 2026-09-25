"use client";

import { useState, type ReactNode } from "react";

import type { Locale } from "@/types/locale";

import type { InvitationModel } from "../../types";
import { CinematicOpening } from "./opening";

export function CinematicRevealBoundary({ invitation, locale, preview, children }: { invitation: InvitationModel; locale: Locale; preview: boolean; children: ReactNode }) {
  const [opened, setOpened] = useState(preview);
  return <div className={`lm-cinematic-reveal ${opened ? "is-revealed" : ""}`}><CinematicOpening invitation={invitation} locale={locale} preview={preview} opened={opened} onOpen={() => setOpened(true)} />{children}</div>;
}
