"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, InputField, useToast } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { getSupabase, isAuthConfigured } from "@/lib/supabase";

type Tab = "signin" | "signup";
type ProviderId = "google" | "apple" | "kakao" | "naver" | "linkedin";

const providers: readonly { id: ProviderId; label: string; sprint: string; native: boolean }[] = [
  { id: "google", label: "Google", sprint: "S2", native: true },
  { id: "apple", label: "Apple", sprint: "S2", native: true },
  { id: "kakao", label: "Kakao", sprint: "S3", native: true },
  { id: "naver", label: "Naver", sprint: "S3", native: false },
  { id: "linkedin", label: "LinkedIn", sprint: "S3", native: true },
];

export function AuthModal({
  open,
  onClose,
  initialTab = "signin",
}: {
  open: boolean;
  onClose: () => void;
  initialTab?: Tab;
}) {
  const { state } = useAuth();
  const { show } = useToast();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const configured = isAuthConfigured();
  const tabLabel: Record<Tab, string> = { signin: "로그인", signup: "회원가입" };

  if (state.status === "authenticated") {
    return null;
  }

  async function handleOAuth(providerId: ProviderId) {
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
      show({
        kind: "success",
        message: `${email} 으로 ${tab === "signup" ? "가입" : "로그인"} 링크를 보냈습니다.`,
      });
      onClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={tabLabel[tab]}
      description={
        tab === "signin"
          ? "이미 계정이 있다면 로그인합니다."
          : "이메일 또는 소셜 계정으로 빠르게 시작합니다."
      }
    >
      <div role="tablist" className="mb-4 flex gap-2 border-b border-stage-resume-100">
        {(["signin", "signup"] as const).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${
                active
                  ? "border-stage-resume-900 text-stage-resume-900"
                  : "border-transparent text-stage-resume-700 hover:text-stage-resume-900"
              }`}
            >
              {tabLabel[t]}
            </button>
          );
        })}
      </div>

      {!configured && (
        <p className="mb-4 rounded-md border border-stage-resume-100 bg-stage-resume-50 p-3 text-xs text-stage-resume-700">
          Supabase 환경 변수가 설정되면 아래 버튼이 동작합니다. 현재는 시각 시안.
        </p>
      )}

      <div className="space-y-2">
        {providers.map((p) => (
          <Button
            key={p.id}
            variant="ghost"
            className="w-full justify-between"
            disabled={!configured || pending !== null}
            onClick={() => handleOAuth(p.id)}
          >
            <span>{p.label}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
              {p.native ? p.sprint : `${p.sprint} · OIDC`}
            </span>
          </Button>
        ))}
      </div>

      <div className="my-4 flex items-center gap-3 text-[11px] text-stage-resume-500">
        <span className="h-px flex-1 bg-stage-resume-100" aria-hidden="true" />
        <span className="font-mono uppercase tracking-widest">또는</span>
        <span className="h-px flex-1 bg-stage-resume-100" aria-hidden="true" />
      </div>

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
          {pending === "magic"
            ? "전송 중..."
            : tab === "signin"
              ? "로그인 링크 받기"
              : "가입 링크 받기"}
        </Button>
      </form>
    </Modal>
  );
}
