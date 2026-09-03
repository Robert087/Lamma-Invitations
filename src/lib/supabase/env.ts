const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://eknwwvpyibbomtihwovs.supabase.co";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_mkSP9k8Iq8hz6AGMT1vqIQ_4LIwTo9W";

export function getSupabaseEnvironment() {
  if (!supabaseUrl) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabasePublishableKey) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  return {
    url: supabaseUrl,
    publishableKey: supabasePublishableKey,
  };
}
