"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button, Card, InputField, useToast } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { getSupabase, isAuthConfigured } from "@/lib/supabase";

type Provider = {
  id: "google" | "apple" | "kakao" | "naver" | "linkedin";
  label: string;
  /** Sprint where the provider goes live. */
  sprint: string;
  /** Whether Supabase has native support; Naver requires custom OIDC. */
  native: boolean;
};

const providers: readonly Provider[] = [
  { id: "google", label: "Google", sprint: "S2", native: true },
  { id: "apple", label: "Apple", sprint: "S2", native: true },
  { id: "kakao", label: "Kakao", sprint: "S3", native: true },
  { id: "naver", label: "Naver", sprint: "S3", native: false },
  { id: "linkedin", label: "LinkedIn", sprint: "S3", native: true },
];

export default function SignInPage() {
  const router = useRouter();
  const { state } = useAuth();
  const { show } = useToast();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const configured = isAuthConfigured();

  // Redirect already-authed users home.
  if (state.status === "authenticated") {
    if (typeof window !== "undefined") {
      router.replace("/");
    }
    return null;
  }

  async function handleOAuth(providerId: Provider["id"]) {
    const sb = getSupabase();
    if (!sb) {
      show({ kind: "info", message: "Supabase 환경 변수가 아직 설정되지 않았습니다." });
      return;
    }
    if (providerId === "naver") {
      show({
        kind: "info",
        message: "Naver 는 Supabase 네이티브 미지원 — S3 에서 custom OIDC.",
      });
      return;
    }
    setPending(providerId);
    const redirectTo = `${window.location.origin}/Career-manager/auth/callback/`;
    const { error } = await sb.auth.signInWithOAuth({
      provider: providerId,
      options: { redirectTo },
    });
    if (error) {
      show({ kind: "error", message: error.message });
      setPending(null);
    }
  }

  async function handleMagicLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) {
      show({ kind: "info", message: "Supabase 환경 변수가 아직 설정되지 않았습니다." });
      return;
    }
    if (!email) return;
    setPending("magic");
    const redirectTo = `${window.location.origin}/Career-manager/auth/callback/`;
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setPending(null);
    if (error) {
      show({ kind: "error", message: error.message });
    } else {
      show({ kind: "success", message: `${email} 으로 로그인 링크를 보냈습니다.` });
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <Breadcrumb category={null} current="로그인" />

      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight">로그인</h1>
        <p className="mt-2 text-sm text-stage-resume-700">
          계정을 만들거나 기존 계정으로 들어옵니다.
        </p>
      </header>

      {!configured && (
        <Card className="mt-6 border-stage-salary-500">
          <p className="text-xs font-medium uppercase tracking-widest text-stage-salary-900">
            S2 wiring 대기
          </p>
          <p className="mt-1 text-sm text-stage-resume-900">
            Supabase 프로젝트 환경 변수
            (<code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,
            <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>)
            가 설정되면 아래 버튼이 동작합니다. 현재는 시각 시안입니다.
          </p>
        </Card>
      )}

      <Card className="mt-6 space-y-3">
        {providers.map((p) => (
          <Button
            key={p.id}
            variant="ghost"
            className="w-full justify-between"
            disabled={!configured || pending !== null}
            onClick={() => handleOAuth(p.id)}
          >
            <span>{p.label} 로 계속하기</span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
              {p.native ? p.sprint : `${p.sprint} · OIDC`}
            </span>
          </Button>
        ))}
      </Card>

      <Card className="mt-4 space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-stage-resume-700">
          또는 이메일 매직 링크
        </p>
        <form onSubmit={handleMagicLink} className="space-y-3">
          <InputField
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@career.kr"
            required
            disabled={!configured || pending !== null}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!configured || pending !== null || !email}
          >
            {pending === "magic" ? "전송 중..." : "로그인 링크 받기"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S2: Google · Apple · Email   ·   S3: Kakao · Naver · LinkedIn
      </p>
    </main>
  );
}
