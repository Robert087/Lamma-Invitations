import type { User } from "@supabase/supabase-js";

export function getUserDisplayName(user: User) {
  const displayName = user.user_metadata.display_name ?? user.user_metadata.full_name ?? user.user_metadata.name;

  return typeof displayName === "string" && displayName.trim() ? displayName : user.email;
}
