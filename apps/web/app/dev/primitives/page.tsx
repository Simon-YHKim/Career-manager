"use client";

import {
  Button,
  Card,
  InputField,
  SelectField,
  Skeleton,
  Tag,
  TextareaField,
  useToast,
} from "@/components/ui";

export default function PrimitivesDemo() {
  const { show } = useToast();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 space-y-12">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          /_dev — primitives demo
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">UI Primitives</h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
          DESIGN.md 기반 컴포넌트 — 모든 페이지가 여기에서 단위를 가져갑니다.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Button</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Field</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="이름" placeholder="홍길동" hint="실명을 권장합니다." />
          <InputField label="이메일" type="email" placeholder="you@career.kr" />
          <SelectField label="Persona" defaultValue="B">
            <option value="A">A — 신입 (학생/취준)</option>
            <option value="B">B — 1-3년차</option>
            <option value="C">C — 4-9년차</option>
            <option value="D">D — 10년+</option>
            <option value="E">E — 이직 준비</option>
            <option value="F">F — 해외 진출</option>
          </SelectField>
          <InputField
            label="잘못된 입력 예시"
            defaultValue="invalid"
            error="이메일 형식이 아닙니다."
          />
        </div>
        <TextareaField
          label="Career thesis"
          hint="280자 이내. 한 문장으로."
          placeholder="예: AI 시스템을 안전하게 운영하는 인프라 엔지니어로 성장한다."
          rows={3}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tag</h2>
        <div className="flex flex-wrap gap-2">
          <Tag stage="profile">Profile</Tag>
          <Tag stage="experience">Experience</Tag>
          <Tag stage="career">Career</Tag>
          <Tag stage="essay">Essay</Tag>
          <Tag stage="resume">Resume</Tag>
          <Tag stage="portfolio">Portfolio</Tag>
          <Tag stage="interviewCoaching">Coaching</Tag>
          <Tag stage="salary">Salary</Tag>
          <Tag stage="todo">Todo</Tag>
          <Tag stage="blog">Blog</Tag>
          <Tag stage="memory" variant="outline">
            Memory · outline
          </Tag>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Card</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <p className="text-sm font-semibold">Static card</p>
            <p className="mt-1 text-sm text-stage-resume-700">
              hover/포커스 효과 없음. 정보 컨테이너로 사용.
            </p>
          </Card>
          <Card interactive href="/_dev/primitives" ariaLabel="자기 자신 링크">
            <p className="text-sm font-semibold">Interactive (link)</p>
            <p className="mt-1 text-sm text-stage-resume-700">
              hover · focus ring · 키보드 접근. 카드 전체가 클릭 영역.
            </p>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Skeleton</h2>
        <div className="space-y-2 max-w-md">
          <Skeleton className="w-32" />
          <Skeleton className="w-56" />
          <Skeleton className="w-40" />
          <Skeleton variant="block" className="h-24 w-full" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Toast</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => show({ kind: "success", message: "저장됐습니다." })}>
            Success
          </Button>
          <Button
            variant="destructive"
            onClick={() => show({ kind: "error", message: "다시 시도해 주세요." })}
          >
            Error
          </Button>
          <Button
            variant="ghost"
            onClick={() => show({ kind: "info", message: "S2 에서 연결됩니다." })}
          >
            Info
          </Button>
        </div>
      </section>
    </main>
  );
}
