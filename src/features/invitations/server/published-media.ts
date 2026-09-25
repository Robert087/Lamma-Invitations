import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnvironment } from "@/lib/supabase/env";

import { invitationMediaBucket } from "../media";
import type { InvitationMedia } from "../types";

type AuthorizedMediaPath = { storage_path: string; alt_text: string | null; media_position: number };

function createPublishedMediaClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) return null;
  const { url } = getSupabaseEnvironment();
  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });
}

export async function resolvePublishedInvitationMedia(slug: string): Promise<InvitationMedia[]> {
  const supabase = createPublishedMediaClient();
  if (!supabase) {
    console.error("Published media signing is unavailable", { reason: "missing_secret_key" });
    return [];
  }

  const { data, error } = await supabase.rpc("get_published_invitation_media", { p_slug: slug });
  if (error || !Array.isArray(data)) {
    console.error("Published media projection failed", { code: error?.code, message: error?.message });
    return [];
  }

  const paths = data.filter((item): item is AuthorizedMediaPath => {
    if (!item || typeof item !== "object") return false;
    const row = item as Record<string, unknown>;
    return typeof row.storage_path === "string" && typeof row.alt_text !== "undefined" && Number.isInteger(row.media_position) && (row.alt_text === null || typeof row.alt_text === "string");
  });

  const media = await Promise.all(paths.map(async (item) => {
    let { data: signed, error: signingError } = await supabase.storage.from(invitationMediaBucket).createSignedUrl(item.storage_path, 60 * 30, {
      transform: { width: 1280, quality: 80 },
    });
    if ((signingError || !signed?.signedUrl) && signingError) {
      const fallback = await supabase.storage.from(invitationMediaBucket).createSignedUrl(item.storage_path, 60 * 30);
      if (!fallback.error && fallback.data?.signedUrl) {
        signed = fallback.data;
        signingError = null;
      }
    }
    if (signingError || !signed?.signedUrl) {
      console.error("Published media signing failed", { code: signingError?.name, message: signingError?.message });
      return null;
    }
    return { url: signed.signedUrl, altText: item.alt_text, position: item.media_position };
  }));

  return media.filter((item): item is InvitationMedia => item !== null);
}
