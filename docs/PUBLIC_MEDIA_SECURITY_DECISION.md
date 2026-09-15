# Public Media Security Decision

## Decision

Adopt **Option A: private Supabase Storage with a dedicated, server-only privileged signing boundary**.

`invitation-media` remains private. Owner upload, reordering, and deletion continue to use the normal authenticated Supabase client and Storage RLS. Anonymous guests never receive Storage credentials, raw object paths, direct `storage.objects` access, or a public bucket URL.

The server-only signer is justified because published invitations intentionally disclose a tightly selected set of personal images to unauthenticated guests, while draft images must remain inaccessible. Supabase requires `storage.objects SELECT` to create signed URLs; an anonymous public-request client therefore cannot sign a private object without an anonymous SELECT policy. [Supabase signed URL requirements](https://supabase.com/docs/reference/python/storage-from-createsignedurl)

The privileged credential is a narrow implementation tool, not an authorization system. It must be held only by a dedicated `server-only` published-media module. It must never be placed in browser code, a client component, owner UI, generic Supabase helper, or arbitrary Server Action.

## Exact authorization and signing sequence

1. A guest requests `/i/[slug]`.
2. Trusted Next.js server code calls the existing anonymous published-invitation projection, which enforces `events.status = 'published'` and receives only sanitized invitation data.
3. The sanitized projection contains no `storage_path`, event ID, owner ID, or media ID.
4. The server calls a second, server-only published-media projection using the privileged client. That projection receives only the already verified slug and independently rechecks: published event, enabled Gallery section, and matching media rows.
5. The second projection returns only the exact internal paths, alt text, and positions for that verified invitation to the server process.
6. The dedicated signer creates a batch of short-lived signed, transformed delivery URLs for those exact paths.
7. The signer converts these to `{ url, altText, position }` and discards internal paths.
8. Only the sanitized `InvitationModel` is serialized to React and the browser.

The signer must accept a slug or a server-created projection result, never a client-supplied path, event ID, media ID, or arbitrary URL.

## RPC and projection boundary

The anonymous `public.get_published_invitation(text)` RPC must stop returning `gallery.storage_path`. An anon-executable RPC is directly callable by a browser, so raw paths inside its return value are not an internal server-only value.

Add a separate server-only RPC, conceptually `public.get_published_invitation_media_paths(p_slug text)`, that:

- uses `SECURITY DEFINER` and `set search_path = ''`;
- independently enforces published event status and an enabled `gallery` section;
- returns only `storage_path`, `alt_text`, and `position` to the trusted server process;
- is revoked from `public`, `anon`, and `authenticated`;
- is granted only to the database role used by the server-only privileged credential (verify the project role before granting; this is commonly the service role).

The public RPC remains the guest authorization/projection boundary. The server-only RPC repeats the same restrictive checks as defense in depth. The privileged client does not make a publication decision and never performs a direct unscoped `event_media` query.

## Why Option A wins

It preserves draft confidentiality, supports intentional publication, uses Storage's CDN rather than routing every byte through the Next.js deployment, and keeps the privileged capability small and auditable. Private buckets are designed to be served through signed URLs, while signed URL creation requires `SELECT` on the object. [Supabase bucket access model](https://supabase.com/docs/guides/storage/buckets/fundamentals)

The secret key's blast radius is substantial if misused: it can bypass RLS. The mitigation is architectural, not procedural: one server-only module, no generic export, server-created inputs only, a server-only RPC that rechecks publication, and no serialization of internal paths or credentials.

## Why Option B loses: a media gateway

A Next.js `/media/[reference]` proxy could authorize every request and stop newly fetched objects immediately after unpublish. It is not the best V1 choice because every image request adds Vercel function/edge execution, proxy bandwidth, another cache layer, latency, and operational complexity. A 15-image gallery multiplies this hot path. It also risks turning the application deployment into the media egress bottleneck while Supabase Storage already provides CDN delivery.

Use a gateway later only if Lamma needs immediate per-request revocation, watermarking, highly personalized media authorization, or transformations not available at Storage.

## Why Option C loses: public Storage with unguessable paths

An unguessable URL is not authorization. Once an image URL is shared, saved, cached, or indexed by a recipient, unpublishing the invitation does not revoke it. Public bucket objects intentionally bypass retrieval access control. This is unsuitable as the default for personal wedding photos. [Supabase public bucket behavior](https://supabase.com/docs/guides/storage/buckets/fundamentals)

## Signed URL and caching policy

Use a **30-minute signed URL expiry** for V1. This covers a normal 10–30 minute invitation session and avoids Gallery images failing while a guest scrolls slowly or returns to a tab.

This limits new access after unpublish because the server stops issuing URLs immediately. It cannot revoke URLs already delivered to a browser; neither screenshots/downloads nor browser caches can be revoked. Configure a short object browser `cacheControl` value (recommended: 300 seconds) for personal invitation media so CDN/browser staleness is bounded as practically as possible.

Signed token expiry and response cache TTL are independent. Supabase notes that an edge-cached response can remain available for its cache duration even after token expiry, and deleting an object is the strong cutoff mechanism. [Supabase signed URL and CDN caching](https://supabase.com/docs/guides/storage/cdn/smart-cdn)

## V1 image delivery

The 5 MB limit is an upload guardrail, not a delivery target. Fifteen original uploads at that limit could total 75 MB and are not suitable for mobile invitation viewing.

For V1, retain originals privately and have the server-only signer issue Supabase transformed signed URLs at the required display size:

- feature/gallery lead image: approximately 1440 px maximum width;
- strip/card images: approximately 640 px maximum width;
- lazy-load all Gallery images below the fold and reserve layout with fixed aspect ratios.

Supabase Storage supports signed URLs with embedded image transformation options; enable and budget for this only if the selected Supabase plan supports image transformations. [Supabase image transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)

Prefer direct signed Supabase transformed URLs over a Vercel proxy or default `next/image` optimization in V1. Re-signing produces tokenized source URLs and reduces shared cache reuse; adding Vercel optimization introduces another billable transformation/cache layer. Reassess after real gallery traffic and image-delivery metrics.

## Cost implications

- **Option A:** one server-side media projection/signing operation per invitation render plus Supabase Storage egress and, if enabled, Supabase image transformation usage. CDN serves bytes close to guests, but unique signed tokens reduce shared cache reuse.
- **Option B:** adds Vercel runtime/edge bandwidth and cache cost on top of Supabase reads/egress; it is the costliest and most operationally complex option at this stage.
- **Option C:** has the strongest shared CDN cache characteristics and least signing overhead, but its irrecoverable public exposure is unacceptable for Lamma's default wedding-photo privacy posture.

## Unpublish behavior

After unpublish, the public invitation projection returns no row and the server-only media projection returns no paths. No newly signed URL is issued. Previously issued URLs remain usable until token expiry and may be served from browser/CDN cache for the configured cache duration; this residual window is a documented signed-URL tradeoff, not a reason to make the bucket public.

## Future compatibility

The same two-projection plus server-only signing architecture supports hero, story, gallery, and closing images. Add media roles/settings later without changing the public trust boundary.

Audio can use the same private signed-URL model, with careful cache and duration controls. Video should use the same authorization boundary but will need a separate streaming, range-request, transcoding, and cost decision; it should not inherit the image implementation automatically. Guest uploads remain a separate abuse, moderation, and quota design.

## Required future migration changes

Before applying Gallery media support:

1. Keep the bucket private and keep no anonymous `storage.objects SELECT` policy.
2. Keep owner-only event-media and Storage RLS policies, including the event/user/UUID/extension path checks, 5 MB bucket restriction, and 15-item advisory-lock trigger.
3. Change `public.get_published_invitation(text)` to remove raw `storage_path` from its return type and JSON projection.
4. Add the restricted server-only media-path projection described above; revoke it from `public`, `anon`, and `authenticated`, then grant it only to the verified privileged server database role.
5. Do not expose `event_media` to anonymous roles and do not add anonymous Storage listing, read, upload, update, or delete policies.

## Risks requiring attention

- A server-only secret key is powerful and must never be imported outside the dedicated signing boundary.
- The server-only projection must not accept a client path or skip its published/enabled checks.
- Signed URLs are bearer URLs; recipients can share them until expiry.
- Browser/CDN caching means unpublish prevents future discovery, not recovery of already delivered bytes.
- Image transformations and signed URL cache behavior should be measured before choosing long-term caching or delivery settings.
