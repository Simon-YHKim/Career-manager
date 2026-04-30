import { Breadcrumb } from "@/components/Breadcrumb";
import { Card } from "@/components/ui";

type QA = {
  q: string;
  a: string;
};

/**
 * Personal-manual / Q&A — written long-form to onboard a single user
 * landing for the first time. The content is a stub; S?? wires this to
 * a markdown-driven CMS so the team can update without redeploys.
 */
const QAS: readonly QA[] = [
  {
    q: "Career Manager 는 어떤 서비스인가요?",
    a: "한국 + 글로벌 채용을 한 워크플로우로 관리합니다. 자기 정리(프로필·경험·메모리) → 자료 만들기(이력서·경력기술서·자소서·포트폴리오) → 면접(코칭·평가·연봉협상) 의 12 단계를 한 곳에서 진행합니다.",
  },
  {
    q: "어디서부터 시작해야 하나요?",
    a: "로그인 후 대시보드 상단 '리멤버' 또는 '링크드인' 버튼으로 기존 프로필을 가져오면 자동으로 경험·프로필이 채워집니다. 자동 연동이 막히면 복사·붙여넣기 페이지로 동일하게 진행할 수 있습니다.",
  },
  {
    q: "할 일 (Todo) 는 어떻게 구성되어 있나요?",
    a: "두 가지로 분리되어 있습니다. (1) 지원 중인 공고의 단계별 체크리스트 — D-day 카드를 클릭하면 펼쳐집니다. (2) 공고와 무관한 개인 일정 — 좌측 하단 '내 할 일' 목록.",
  },
  {
    q: "데이터는 어디에 저장되나요?",
    a: "Supabase Postgres + Row-Level Security 로 사용자 본인만 접근합니다. 백업은 일 단위 자동, 외부 모델 호출 시 PII 마스킹을 거칩니다.",
  },
  {
    q: "결제는 언제부터인가요?",
    a: "S18 부터 Toss · Iamport 결제 모듈이 붙습니다. 그 전까지는 모든 기능을 무료로 사용할 수 있습니다.",
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb category={null} current="Q&A · 사용 안내" />
      <header className="mt-6 border-l-2 border-stage-resume-900 pl-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
          help · q&amp;a
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Q&amp;A · 사용 안내
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stage-resume-700">
          자주 묻는 질문과 사용 매뉴얼. 새 항목이 필요하면 GitHub Issue 로 알려주세요.
        </p>
      </header>

      <section className="mt-8 space-y-3">
        {QAS.map((qa, i) => (
          <Card key={i}>
            <p className="text-base font-semibold text-stage-resume-900">
              Q. {qa.q}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stage-resume-700">
              {qa.a}
            </p>
          </Card>
        ))}
      </section>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-widest text-stage-resume-700">
        S?: 마크다운 기반 CMS 로 분리 + 검색
      </p>
    </main>
  );
}
