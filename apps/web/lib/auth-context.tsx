"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isAuthConfigured } from "@/lib/supabase";

type AuthState =
  | { status: "loading"; user: null }
  | { status: "unconfigured"; user: null } // NEXT_PUBLIC_SUPABASE_* not set
  | { status: "anonymous"; user: null }
  | { status: "authenticated"; user: User };

type Ctx = {
  state: AuthState;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() =>
    isAuthConfigured()
      ? { status: "loading", user: null }
      : { status: "unconfigured", user: null },
  );

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    let mounted = true;

    sb.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setState(sessionToState(data.session));
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setState(sessionToState(session));
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const ctx = useMemo<Ctx>(
    () => ({
      state,
      signOut: async () => {
        const sb = getSupabase();
        if (!sb) return;
        await sb.auth.signOut();
      },
    }),
    [state],
  );

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}

export function useAuth(): Ctx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

function sessionToState(session: Session | null): AuthState {
  if (session?.user) {
    return { status: "authenticated", user: session.user };
  }
  return { status: "anonymous", user: null };
}
