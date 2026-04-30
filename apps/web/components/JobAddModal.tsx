"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Button, InputField, useToast } from "@/components/ui";
import { addDaysISO, type Application } from "@/lib/mock-applications";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Caller decides where the new application lands. */
  onAdd: (app: Application) => void;
};

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function JobAddModal({ open, onClose, onAdd }: Props) {
  const { show } = useToast();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [postingUrl, setPostingUrl] = useState("");
  const [deadline, setDeadline] = useState(addDaysISO(14));

  function reset() {
    setCompany("");
    setRole("");
    setPostingUrl("");
    setDeadline(addDaysISO(14));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      show({ kind: "error", message: "회사 · 직무는 필수입니다." });
      return;
    }
    onAdd({
      id: uid(),
      company: company.trim(),
      role: role.trim(),
      postingUrl: postingUrl.trim() || undefined,
      deadline,
      status: "draft",
    });
    show({ kind: "success", message: `${company} 추가됨.` });
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="채용 공고 추가"
      description="직접 입력하거나 검색으로 찾아 추가합니다."
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <InputField
          label="회사"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="예: 토스"
          required
        />
        <InputField
          label="직무"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="예: Backend Engineer"
          required
        />
        <InputField
          label="공고 URL (선택)"
          type="url"
          value={postingUrl}
          onChange={(e) => setPostingUrl(e.target.value)}
          placeholder="https://..."
        />
        <InputField
          label="마감일"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
        <div className="flex items-center justify-between gap-2 pt-2">
          <Link
            href="/jobs/search"
            className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700 underline-offset-4 hover:underline hover:text-stage-resume-900"
            onClick={onClose}
          >
            ↗ 검색으로 찾기
          </Link>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" variant="primary">
              추가
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
