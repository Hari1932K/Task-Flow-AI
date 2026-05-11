import { create } from "zustand";
import { supabase, isSupabaseConfigured } from "./supabase";

export type User = { id: string; name: string; email: string };

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  init: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

function toUser(
  supaUser: {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown>;
  } | null,
): User | null {
  if (!supaUser) return null;
  const metaName =
    (supaUser.user_metadata?.name as string | undefined) ??
    (supaUser.user_metadata?.full_name as string | undefined);
  const email = supaUser.email ?? "";
  return {
    id: supaUser.id,
    email,
    name: metaName ?? email.split("@")[0] ?? "User",
  };
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  init: async () => {
    if (!isSupabaseConfigured) {
      set({ initialized: true });
      return;
    }
    const { data } = await supabase.auth.getSession();
    set({ user: toUser(data.session?.user ?? null), initialized: true });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: toUser(session?.user ?? null) });
    });
  },

  signIn: async (email, password) => {
    if (!isSupabaseConfigured)
      throw new Error(
        "Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.",
      );
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: toUser(data.user) });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (name, email, password) => {
    if (!isSupabaseConfigured)
      throw new Error(
        "Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.",
      );
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo:
            typeof window !== "undefined"
              ? window.location.origin
              : undefined,
        },
      });
      if (error) throw error;
      set({ user: toUser(data.user) });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  resetPassword: async (email) => {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : undefined,
    });
    if (error) throw error;
  },
}));
