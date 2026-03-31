import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/src/lib/supabase";

type AuthContextValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signUp: (params: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function emailToUsername(email: string) {
  const atIndex = email.indexOf("@");
  if (atIndex <= 0) return null;
  return email.slice(0, atIndex);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { data, error } = await supabase.auth.getSession();
      if (!cancelled) {
        if (error) {
          setSession(null);
        } else {
          setSession(data.session);
        }
        setLoading(false);
      }
    }

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleAppStateChange(nextAppState: AppStateStatus) {
      if (nextAppState === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    }

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    handleAppStateChange(AppState.currentState);

    return () => {
      subscription.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  const signIn = useCallback(
    async (params: { email: string; password: string }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });
      if (error) throw error;
    },
    []
  );

  const signUp = useCallback(
    async (params: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
      });
      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) return;

      const username = emailToUsername(params.email);
      const { error: profileError } = await supabase.from("profile").upsert({
        id: userId,
        updated_at: new Date().toISOString(),
        username,
      });

      if (profileError) {
        console.warn("[profile upsert failed]", profileError);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      signIn,
      signUp,
      signOut,
    }),
    [loading, session, signIn, signOut, signUp]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
