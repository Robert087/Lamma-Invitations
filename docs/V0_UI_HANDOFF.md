# Lamma v0 UI handoff

## Scope

v0 may redesign presentation components, layouts, CSS, responsive behavior, typography, colors, visual tokens, navigation, homepage, sign-in, dashboard, event pages, Invitation Studio, `InvitationRenderer` presentation, visual variants, template previews, and reusable UI primitives.

v0 must not change database schema or migrations, Supabase RLS, auth/proxy/session logic, ownership checks, server authorization, public invitation RPC security, publishing server actions, AI provider architecture, AI usage tracking, environment secrets, or data contracts unless a change is explicitly approved. Preserve existing server-action signatures wherever possible.

## Routes

| Route | Audience |
| --- | --- |
| `/` | Marketing / entry page |
| `/sign-in` | Authentication |
| `/dashboard` | Authenticated owner |
| `/dashboard/events/new` | Authenticated owner |
| `/dashboard/events/[id]` | Event owner |
| `/dashboard/events/[id]/invitation` | Event owner builder |
| `/dashboard/events/[id]/preview` | Event owner preview |
| `/i/[slug]` | Public guest invitation |

Owner routes require authentication. `/i/[slug]` is guest-facing and must never show dashboard or editor UI.

## Existing contracts

- Event: occasion, title, date, venue, location, status, and slug.
- Invitation content: `host_names`, `headline`, and `invitation_text`.
- Design: variant, palette, typography, `textScale`, and cover style.
- Sections: use the existing registered section IDs. Only implemented sections are interactive; coming-soon sections must remain non-functional.

Consume these contracts; do not create parallel models.

## Variants and future templates

The visual engine currently supports `editorial`, `statement`, `split`, `framed`, `soft-organic`, and `dark-modern`. v0 may redesign them completely and add presentation-only template previews. Future templates must map to the existing trusted structured configuration; do not add template database storage.

## AI Creator boundary

The flow is: user description → validated AI proposal → real renderer preview → explicit Apply. The proposal uses the same structured invitation state as manual controls.

v0 may redesign the prompt, proposal, loading, Apply, Try Again, and Cancel presentation. It must not move provider calls to the browser, expose secrets, bypass validation, or persist raw AI output directly.

`AI_PROVIDER=mock` enables local, deterministic, zero-cost visual testing without `OPENAI_API_KEY` or OpenAI network calls. `AI_PROVIDER=openai` requires server-side OpenAI configuration.

## Not implemented

Payments, plans/entitlements, media uploads, photos, video, music, gallery, RSVP, and guest management are not implemented. Do not add fake functionality.
