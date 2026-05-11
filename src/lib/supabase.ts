import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  // Don't throw at import — let the UI surface a friendly message.
  // eslint-disable-next-line no-console
  console.warn(
    "[TaskFlow] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "Auth and data features will be disabled until you set them in Vercel env vars.",
  );
}

export const supabase: SupabaseClient = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
