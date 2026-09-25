# Cinematic Wedding Experience Blueprint

## 1. Reference experience analysis

The Makarious & Sarah reference is a bespoke static invitation experience. Its quality comes from treating the page as a sequence of authored scenes, not a list of reusable cards. Each scene has one emotional job, a distinct composition, and a restrained transition into the next.

The implementation has a locked full-viewport stationery cover, an explicit open action, a short personal-note interlude, and then a continuous invitation journey. It uses a serif/display/sans typography hierarchy, a tight ivory/wine/gold visual system, paper and floral assets, deliberate whitespace, fine rules, and large type at selected emotional beats. The experience is intentionally mobile-first: its cover card is constrained to a phone-friendly width, touch gestures own the gallery, and desktop expands the same scenes rather than merely centering a mobile column.

The reference does not contain a separate textual story timeline. Its media sequence is the story: a childhood print crossfades into a present-day portrait, a curated ribbon presents smaller moments, then a full-bleed cinematic image interrupts the rhythm before wishes.

## 2. Actual guest journey

1. **Locked opening cover** — guest sees an invitation as an object, with names, date, and one clear open action.
2. **Opening transition** — cover content recedes, then the cover dissolves; scrolling remains at the true top.
3. **Personal note interlude** — a brief optional-feeling greeting makes the reveal feel addressed to the guest rather than automatic.
4. **Formal invitation suite** — names, invitation copy, date composition, event moments, and location are grouped as one stationery scene.
5. **Countdown and calendar** — time becomes a dedicated event with a live counter and a marked calendar date.
6. **Venue emphasis** — the celebration venue gets a distinct, concise destination moment with a map CTA.
7. **Media narrative** — personal imagery establishes history, then a tactile horizontal ribbon encourages exploration, followed by a cinematic visual pause.
8. **Guest wishes** — a stationery-note interaction and a compact, readable existing-wishes feed invite participation.
9. **Closing** — a calm final scene repeats the emotional promise and date rather than ending abruptly after a utility action.

Transitions work because they change the guest's task and visual rhythm: open, receive, remember, anticipate, navigate, reminisce, participate, and depart. Small transition marks and generous spacing make each scene feel related without making every section identical.

## 3. Reusable principles vs. bespoke choices

| Category | Reusable experience principle | Configurable design choice | Bespoke-only content to exclude |
| --- | --- | --- | --- |
| Opening | Explicit guest-controlled reveal before the journey | Paper, image, or typography opening; reveal intensity | Exact cover copy, monogram, names, date |
| Invitation | Formal invitation is a single composed moment | Centered/split composition; divider/decoration language | Family line, personal phrase, ceremony schedule |
| Countdown | Countdown plus calendar turns a date into an occasion | Calendar, typography, or minimal treatment | Exact date/time/copy |
| Location | Venue gets a destination moment, not a generic link | Quiet, formal, or celebratory location scene | Exact venue, city, maps URL |
| Story/media | Images and milestones establish narrative progression | Chapters, crossfade, ribbon, editorial grid | Personal photos and specific life history |
| Wishes | Guest contribution gets a contained emotional space | Stationery note, card wall, or quote list | Existing messages and names |
| Closing | A deliberate final emotional beat | Simple, emotional, or media-led closing | Personal signature and date treatment |

## 4. Existing Lamma data mapping

| Experience need | Existing Lamma source | Notes |
| --- | --- | --- |
| Occasion, names, date, venue, maps URL, timezone | `events` | Reusable across occasions; no wedding-only schema needed. |
| Headline and invitation copy | `event_content` | Language-agnostic invitation content remains the source. |
| Selected experience/theme | `event_experience.theme_config` | Trusted variant, palette, typography, cover, and text-scale fields already exist. |
| Section order/visibility | `event_sections` | The experience must respect enabled sections and their order. |
| Timeline moments | `event_story_items` | Supports a textual chapters treatment now. |
| Owner/public renderer contract | `InvitationModel`, `InvitationRenderer`, published RPC | One normalized model must drive preview and public rendering. |
| Assisted choices | AI Creator proposal schema | AI must select trusted identifiers, never markup or CSS. |

## 5. Current gaps and later tasks

**Ready for Phase 1:** opening, invitation composition, event details, countdown, location, textual story, closing, current palette/typography controls, and section visibility/order.

**Task 011B media prerequisites:** secure storage, owner upload/delete, media metadata, public projection of published media only, and normalized media slots.

**Task 011C interaction prerequisites:** narrow published-invitation public-write boundary, server validation/rate controls, owner visibility/moderation, and RSVP/guestbook data contracts.

**Later:** music with explicit consent and accessibility controls, video, guest media, and personalized guest links. None are prerequisites for the core experience architecture.

## 6. First generalized Experience

Internal ID: `cinematic-wedding-story`.

This is an Experience Blueprint, not a copied page and not a color/font skin. It resolves normalized invitation data into a directed sequence:

```text
Opening → personal reveal → invitation suite → countdown/calendar
→ destination moment → chapters/media → wishes/RSVP → closing
```

It is wedding-first in presentation language, but its contract remains occasion-neutral. A graduation or anniversary can use the same scene model with different copy, media, and trusted configuration choices.

## 7. Architecture rules: Experience vs. Theme vs. Section settings

- **Experience** controls opening interaction, scene order/composition, motion choreography, content emphasis, responsive art direction, media treatment, and closing behavior.
- **Theme** controls palette, typography, decorative language, accent treatment, and motion intensity. It must contain identifiers only, never CSS.
- **Section settings** control a single section's trusted presentation choice, such as calendar vs. typography countdown or chapters vs. timeline story.
- **Content/data** remains in its existing normalized Lamma source. An experience never owns couple names, dates, media URLs, or guest messages.

The renderer resolves the selected experience first, then passes the unchanged `InvitationModel` plus parsed trusted theme and section settings to scene components. No experience performs Supabase queries.

## 8. Trusted customization schema

The following is a proposed additive, versioned extension to the existing validated `theme_config`; it is a specification only and must be validated through the same registry pattern as existing fields.

```ts
type CinematicExperienceSettings = {
  experience: "cinematic-wedding-story";
  opening: "quiet-cover" | "typography-reveal" | "image-reveal";
  decoration: "none" | "floral-light" | "geometric" | "organic";
  motion: "calm" | "cinematic" | "expressive";
  countdownStyle: "calendar" | "typography" | "minimal";
  storyStyle: "chapters" | "timeline" | "editorial";
  galleryStyle: "cinematic-strip" | "editorial-grid" | "carousel";
  closing: "simple" | "emotional" | "media-led";
};
```

Existing `palette` and `typography` remain canonical trusted preset IDs. Future AI and the manual Builder choose exactly the same identifiers. Unknown values normalize to the experience defaults; arbitrary CSS, HTML, URLs, and class names are never accepted.

## 9. Opening system

The opening is a client boundary nested within a server-rendered experience. It should be an accessible button, preserve the initial server-rendered cover, and reveal the journey only after guest action. The default `quiet-cover` uses text, trusted decorative treatment, names, and date; it does not require media. `image-reveal` remains unavailable until secure media exists.

Motion must be skippable through `prefers-reduced-motion`, keyboard-operable, and never block a guest from reading the invitation. Audio, when later introduced, must be opt-in after the opening action and have an explicit toggle.

## 10. Section presentation system

| Moment | Phase 1 presentation | Future hook |
| --- | --- | --- |
| Invitation suite | One formal composition for headline, names, copy, date, and venue | Multiple event moments when scheduling data supports it |
| Countdown | Dedicated anticipation scene; live timer plus optional calendar treatment | Event-time-aware behavior when a start time is added |
| Location | Destination scene with venue emphasis and safe external maps CTA | Optional non-paid embed only if reliably supported |
| Story | Textual chapters from `event_story_items` | Story media slot and chapter media treatment |
| Gallery | No fake UI before media exists | Curated media narrative, ribbon, grid, or carousel |
| Wishes/RSVP | No fake write controls before public-write security exists | Contained interaction scene and owner moderation summaries |
| Closing | Deliberate end using existing names/date/copy | Closing media slot |

## 11. Motion system

Reference findings:

- Opening has staged timing: type fades first, cover follows, destination scene arrives after.
- Scroll reveals are one-time `IntersectionObserver` events with a short vertical rise.
- Handwritten/live-copy effects are a progressive character reveal, only when visible.
- Calendar marking draws only when sufficiently in view.
- Countdown changes use a restrained rolling transition and align to the next second.
- Media scenes use scroll-bound crossfade/parallax only while near the viewport.
- Gallery auto-movement pauses immediately for touch, wheel, keyboard, visibility loss, and reduced motion.
- Every major animation has a reduced-motion static fallback.

Reusable motion language:

1. Use one reveal vocabulary per experience: fade + short rise, a soft material dissolve, and one line/mark drawing accent.
2. Trigger scene reveals once; do not animate continuously on every scroll.
3. Limit scroll-bound effects to media scenes and schedule work with `requestAnimationFrame` only while visible.
4. Give the guest control over motion-heavy interactions.
5. Treat reduced motion as a designed static path, not a broken animation path.

## 12. Responsive art direction

At mobile widths, each scene is a focused vertical moment: full-viewport opening, large readable names, one-column details, four compact countdown units, safe map CTA, and readable chapters. Touch should own horizontal gallery exploration when it exists.

At tablet widths, spacing and type scale increase while the scene sequence remains intact. At desktop widths, scenes may become two-column or sticky compositions only where that strengthens the narrative: invitation suite can use a formal two-column event composition; story can alternate/chapter; gallery can become a wider ribbon. Desktop must add composition, not empty margins around a phone page.

## 13. Future media slots

The experience should consume normalized future media references rather than storage paths directly:

- `heroMedia`: optional image/video-free image asset for `image-reveal`.
- `storyMedia`: optional per-story-item media.
- `gallery`: ordered media collection with alt text and aspect metadata.
- `closingMedia`: optional final image.

Task 011B must define secure storage, owner write rules, published-only public reads, file validation, deletion, and projection. This experience specification does not introduce storage.

## 14. Future guest interaction integration

When Task 011C introduces safe public writes, `cinematic-wedding-story` reserves two visual moments:

- **Wishes:** a short note form plus a bounded, readable wishes feed.
- **RSVP:** a concise attendance response before or alongside the location moment.

Future guest photos and voice messages belong to their own opt-in interaction scenes. They must not share the wishes data contract or bypass published-only authorization.

## 15. AI and Manual Builder compatibility

The manual Builder should expose curated experience controls as labels and visual previews. AI should choose the same validated IDs through its proposal schema. Both paths write only structured values into the existing theme/section state. Neither path writes rendered markup, CSS, arbitrary image URLs, or executable behavior.

## 16. Recommended component architecture

```text
src/features/invitations/
  renderer.tsx                         # resolve experience from validated model
  templates/
    cinematic-wedding-story/
      index.tsx                        # scene sequence; no data fetching
      opening.tsx                      # small client boundary
      invitation-suite.tsx             # server presentation
      countdown-moment.tsx             # composes existing focused timer
      location-moment.tsx              # server presentation
      story-moment.tsx                 # server presentation
      closing-moment.tsx               # server presentation
      motion.tsx                       # optional focused observer boundary
```

Scene components receive normalized model data and trusted settings. They do not query Supabase and do not duplicate owner/public data loading.

## 17. Phased implementation plan

### Phase 1 — current Lamma capabilities

1. Add and validate the experience identifier and its trusted settings registry.
2. Add renderer resolution and a focused client opening/reveal boundary.
3. Compose existing invitation content, details, countdown, story, location, and closing as distinct scenes.
4. Add reduced-motion-safe, one-time scene reveal behavior.
5. Add Builder selection and preview through existing design actions.
6. Test mobile first at 360px, 390px, and 430px; then tablet and desktop.

### Phase 2 — Task 011B media

Add secure media slots and gallery treatments after storage architecture is approved.

### Phase 3 — Task 011C guest interaction

Add wishes and RSVP scenes only after narrow published-invitation public-write boundaries are implemented.

### Phase 4 — later

Consider opt-in music, video, guest memories, and additional experiences after their data, consent, accessibility, and security models exist.
