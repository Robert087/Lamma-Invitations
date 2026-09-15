import { CinematicScene } from "./scene";
import { cinematicCopy, safeLocationUrl, type CinematicSceneProps } from "./types";

export function LocationScene({ invitation, locale }: CinematicSceneProps) {
  const locationUrl = safeLocationUrl(invitation.event.location_url);
  if (!invitation.event.venue_name && !locationUrl) return null;
  const copy = cinematicCopy(locale);
  return <CinematicScene className="lm-cinematic-location"><p className="lm-cinematic-eyebrow">{copy.location}</p><h2 dir="auto">{invitation.event.venue_name || copy.map}</h2><p>{locale === "ar" ? "هنا نلتقي لنحتفل بهذه اللحظة." : "This is where we will gather to celebrate."}</p>{locationUrl ? <a href={locationUrl} target="_blank" rel="noopener noreferrer">{copy.map}<span aria-hidden="true">↗</span></a> : null}</CinematicScene>;
}
