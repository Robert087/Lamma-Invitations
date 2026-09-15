/* eslint-disable @next/next/no-img-element -- signed Storage URLs with explicit lazy loading are used for private media. */
import { CinematicScene } from "./scene";
import { type CinematicSceneProps } from "./types";

export function GalleryScene({ invitation, locale }: CinematicSceneProps) {
  if (!invitation.media.length) return null;
  const [featured, ...remaining] = invitation.media;
  return <CinematicScene className="lm-cinematic-gallery"><div className="lm-cinematic-gallery-heading"><p className="lm-cinematic-eyebrow">{locale === "ar" ? "بين لحظاتنا" : "Between our moments"}</p><h2>{locale === "ar" ? "مشاهد من الحكاية" : "Scenes from our story"}</h2></div><figure><img alt={featured.altText || ""} decoding="async" src={featured.url} /><figcaption>{locale === "ar" ? "ذكرى نحتفظ بها" : "A memory to keep"}</figcaption></figure>{remaining.length ? <div className="lm-cinematic-gallery-strip">{remaining.map((image) => <img alt={image.altText || ""} decoding="async" key={image.position} loading="lazy" src={image.url} />)}</div> : null}</CinematicScene>;
}
