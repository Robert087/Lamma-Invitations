import { invitationSections, type InvitationSectionId } from "@/config/invitation-sections";
import { typographyTokens } from "@/config/invitation-design";
import type { Locale } from "@/types/locale";

import type { InvitationModel } from "../../types";
import { ClosingScene } from "./closing-scene";
import { CountdownScene } from "./countdown-scene";
import { GalleryScene } from "./gallery-scene";
import { InvitationScene } from "./invitation-scene";
import { LocationScene } from "./location-scene";
import { CinematicRevealBoundary } from "./reveal-boundary";
import { StoryScene } from "./story-scene";

type Props = { invitation: InvitationModel; locale: Locale; preview: boolean };

export function CinematicWeddingStory({ invitation, locale, preview }: Props) {
  const enabled = [...invitation.sections]
    .filter((section) => section.enabled && invitationSections[section.section_type]?.implemented)
    .sort((a, b) => a.position - b.position);
  const enabledTypes = new Set(enabled.map((section) => section.section_type));
  const renderScene = (section: InvitationSectionId) => {
    if (section === "hero" || section === "invitation-text" || section === "event-details") {
      return <InvitationScene invitation={invitation} locale={locale} showMessage={enabledTypes.has("invitation-text")} showDetails={enabledTypes.has("event-details")} />;
    }
    if (section === "countdown") return <CountdownScene invitation={invitation} locale={locale} />;
    if (section === "story") return <StoryScene invitation={invitation} locale={locale} />;
    if (section === "gallery") return <GalleryScene invitation={invitation} locale={locale} />;
    if (section === "location") return <LocationScene invitation={invitation} locale={locale} />;
    return null;
  };

  const seen = new Set<string>();
  const scenes = enabled.map((section) => {
    const scene = renderScene(section.section_type);
    const key = section.section_type === "hero" || section.section_type === "invitation-text" || section.section_type === "event-details" ? "invitation" : section.section_type;
    if (!scene || seen.has(key)) return null;
    seen.add(key);
    return <div key={section.id}>{scene}</div>;
  });

  return <article className={`lm-cinematic-experience lm-cinematic-palette-${invitation.themeConfig.palette} ${typographyTokens[invitation.themeConfig.typography]}`} dir={locale === "ar" ? "rtl" : "ltr"}><CinematicRevealBoundary invitation={invitation} locale={locale} preview={preview}><div className="lm-cinematic-journey"><main>{scenes}</main><ClosingScene invitation={invitation} locale={locale} /></div></CinematicRevealBoundary></article>;
}
