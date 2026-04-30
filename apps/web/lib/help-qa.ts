/**
 * Q&A corpus — sourced from likely user questions across the 12-stage
 * workflow. Each entry has: category, question, answer, optional
 * deep-link to the relevant page. Used by /help.
 *
 * Editorial rules (mirror DESIGN.md AI Slop 3원칙):
 *  - 단정한 한국어, 존댓말
 *  - 광고성 표현 금지 ("저희 서비스가 최고")
 *  - 사실 확인 가능한 답변만 (Sprint 번호로 시점 명시)
 */

export type HelpCategoryId =
  | "start"
  | "account"
  | "foundation"
  | "artifacts"
  | "interview"
  | "todo"
  | "blog"
  | "export"
  | "billing"
  | "data"
  | "trouble";

export type HelpCategory = {
  id: HelpCategoryId;
  title: string;
  subtitle: string;
};

export const helpCategories: readonly HelpCategory[] = [
  { id: "start", title: "시작하기", subtitle: "Getting started" },
  { id: "account", title: "계정 · 보안", subtitle: "Account & security" },
  { id: "foundation", title: "자기 정리", subtitle: "Profile · 경험 · 메모리" },
  { id: "artifacts", title: "자료 작성", subtitle: "이력서 · 자소서 · 포트폴리오" },
  { id: "interview", title: "면접 · 협상", subtitle: "코칭 · 평가 · 연봉" },
  { id: "todo", title: "할 일 · 캘린더", subtitle: "공고 일정 + 개인 task" },
  { id: "blog", title: "블로그 · 콘텐츠", subtitle: "AI 발행 정책" },
  { id: "export", title: "외부 연동", subtitle: "리멤버 · LinkedIn" },
  { id: "billing", title: "결제 · 요금", subtitle: "Pricing & payment" },
  { id: "data", title: "데이터 · 프라이버시", subtitle: "Storage · export · deletion" },
  { id: "trouble", title: "문제 해결", subtitle: "Troubleshooting" },
];

export type HelpEntry = {
  id: string;
  category: HelpCategoryId;
  q: string;
  a: string;
  href?: string;
};

export const helpEntries: readonly HelpEntry[] = [
  // 시작하기
  { id: "s1", category: "start", q: "Career Manager 는 어떤 서비스인가요?",
    a: "한국 + 글로벌 채용을 한 워크플로우로 관리합니다. 자기 정리(프로필·경험·메모리) → 자료 만들기(이력서·경력기술서·자소서·포트폴리오) → 면접(코칭·평가·연봉협상) 의 12 단계를 한 곳에서 진행합니다." },
  { id: "s2", category: "start", q: "어디서부터 시작해야 하나요?",
    a: "로그인 후 대시보드 상단 ‘리멤버’ 또는 ‘LinkedIn’ 버튼으로 기존 프로필을 가져오면 자동으로 경험·프로필이 채워집니다. 자동 연동이 막히면 복사·붙여넣기 페이지로 동일하게 진행할 수 있습니다.",
    href: "/profile/export/remember" },
  { id: "s3", category: "start", q: "데모만 둘러볼 수 있나요?",
    a: "네. URL 끝에 `?demo=1` 을 붙이면 비로그인으로 대시보드 미리보기가 가능합니다. 모든 데이터는 mock 이며 로그인 시 본인 데이터로 전환됩니다." },
  { id: "s4", category: "start", q: "12 단계 전체 흐름은 어떻게 되나요?",
    a: "기반(프로필→경험→메모리) → 자료(이력서·경력→자소서→포트폴리오) → 면접(코칭→평가→연봉협상) → 할 일/블로그가 옆에서 보조합니다. 각 단계는 독립적으로 사용 가능합니다." },
  { id: "s5", category: "start", q: "Android 앱은 언제 출시되나요?",
    a: "Web 과 Android 를 동시에 개발 중이며 동일 디자인 토큰을 공유합니다. 정식 배포 시점은 S20 이후 Supabase Auth 연동이 끝난 뒤에 공지합니다." },

  // 계정 · 보안
  { id: "a1", category: "account", q: "어떤 로그인 방법을 지원하나요?",
    a: "S2 에서 Google · Apple · 이메일 매직 링크가 우선 지원됩니다. S3 에서 Kakao · Naver · LinkedIn 이 합류합니다." },
  { id: "a2", category: "account", q: "비밀번호 없이도 로그인할 수 있나요?",
    a: "네. 이메일 매직 링크는 비밀번호 없이 메일에 도착한 1회용 링크로 로그인합니다. 가장 권장되는 방식입니다." },
  { id: "a3", category: "account", q: "2단계 인증 (2FA) 을 지원하나요?",
    a: "Supabase Auth 의 TOTP 2FA 를 S?+ 에서 활성화할 예정입니다. 현재는 OAuth 제공자의 2FA 를 그대로 따릅니다." },
  { id: "a4", category: "account", q: "로그아웃은 어디서 하나요?",
    a: "헤더 우측 ‘로그아웃’ 버튼. 모든 기기에서 동시에 로그아웃하려면 설정 > 보안 (S?+) 에서 ‘모든 세션 종료’ 를 사용하세요." },
  { id: "a5", category: "account", q: "Naver 로그인이 왜 ‘OIDC’ 라고 표시되나요?",
    a: "Supabase 의 네이티브 OAuth 제공자에 Naver 가 포함되어 있지 않아 custom OIDC 어댑터를 통해 연결합니다. 사용자 경험은 Google·Apple 과 동일합니다." },

  // 자기 정리
  { id: "f1", category: "foundation", q: "프로필 · 경험 · 메모리 는 어떻게 다른가요?",
    a: "프로필 = 한 줄 thesis 와 핵심 메타데이터 (10초 안에 파악). 경험 = 프로젝트 단위로 atom 화한 사례. 메모리 = 누적된 자기 이해 (임베딩 기반 검색용, S24+).", href: "/profile" },
  { id: "f2", category: "foundation", q: "경험은 어느 정도 자세히 써야 하나요?",
    a: "한 atom 당 ‘상황·역할·행동·결과·배운 점’ 5요소를 3-5문장으로. 너무 길면 자료 작성 단계에서 reframe 이 어려워집니다.", href: "/experience" },
  { id: "f3", category: "foundation", q: "메모리는 언제 활용되나요?",
    a: "이력서·자소서·면접 답변을 작성할 때 과거 경험·회고를 임베딩 검색으로 자동 회수합니다. S24 (pgvector) 합류 후 활성화됩니다.", href: "/memory" },
  { id: "f4", category: "foundation", q: "한국어와 영어 둘 다 입력할 수 있나요?",
    a: "네. 경험은 언어 태그를 가지며, 자료 작성 시 대상 언어에 맞춰 자동 변환됩니다. 글로벌 채용을 염두에 둔 핵심 설계입니다." },

  // 자료 작성
  { id: "ar1", category: "artifacts", q: "이력서와 경력기술서는 무엇이 다른가요?",
    a: "이력서 = 한 페이지 요약, 7초 안에 파악되도록. 경력기술서 = 업무 단위 deep-dive 로 면접 단계에서 대화 재료가 되는 문서.", href: "/resume" },
  { id: "ar2", category: "artifacts", q: "자소서를 회사별로 매번 새로 써야 하나요?",
    a: "처음부터 다시 쓰지 않습니다. 베이스 자소서 1개 + 회사별 reframe 가이드를 따라 3-5문단만 교체하는 워크플로우입니다.", href: "/essay" },
  { id: "ar3", category: "artifacts", q: "포트폴리오에 GitHub 링크와 자체 사이트 중 어느 게 좋나요?",
    a: "엔지니어링 직군은 GitHub + README 정독률이 높고, 디자인·데이터 직군은 자체 사이트 · 사례 페이지의 클릭률이 높습니다. 두 개를 함께 두되 직무별로 우선순위를 바꾸세요.", href: "/portfolio" },
  { id: "ar4", category: "artifacts", q: "ATS-friendly 이력서가 무엇인가요?",
    a: "Applicant Tracking System (자동 스캔 시스템) 이 파싱 가능한 형식. 표·이미지·아이콘 최소화, 표준 폰트, 헤딩 명확. 한국 대기업·미국 대기업 모두 사용합니다." },
  { id: "ar5", category: "artifacts", q: "한국 회사 자소서와 영문 cover letter 톤이 다른가요?",
    a: "다릅니다. 한국 자소서는 ‘성장 과정 + 지원 동기 + 입사 후 포부’ 의 서술형이 많고, 영문은 ‘회사 X 에 기여할 구체 능력’ 을 1페이지 이내로 직관적으로 씁니다." },

  // 면접 · 협상
  { id: "i1", category: "interview", q: "코칭 모드와 평가 모드 차이가 뭔가요?",
    a: "코칭 = LLM 이 피드백·힌트를 주며 함께 답을 다듬어 가는 모드. 평가 = 점수와 개선점을 받아보는 모의 면접. 코칭 → 평가 순서로 사용하기를 권장합니다.", href: "/interview-coaching" },
  { id: "i2", category: "interview", q: "압박 면접은 어떻게 대비하나요?",
    a: "코칭 모드에서 ‘압박 질문 5개 답안’ 체크리스트를 따라가면 자주 나오는 질문에 대한 사전 답변을 정리할 수 있습니다.", href: "/interview-coaching" },
  { id: "i3", category: "interview", q: "연봉 협상은 어떻게 시뮬레이션하나요?",
    a: "오퍼 정보 (총액·base·bonus·equity) 를 입력하면 시장 비교 → 협상 카운터 시나리오 3개 → 메일 템플릿까지 생성됩니다.", href: "/salary" },
  { id: "i4", category: "interview", q: "면접 직후에 무엇을 기록해야 하나요?",
    a: "어떤 질문에 막혔는지 + 답변 요지 + 면접관 반응. ‘메모리’ 에 저장되어 다음 면접의 코칭·평가에 자동 활용됩니다.", href: "/memory" },

  // 할 일 · 캘린더
  { id: "t1", category: "todo", q: "할 일 (Todo) 는 어떻게 구성되어 있나요?",
    a: "두 가지로 분리됩니다. (1) 지원 중인 공고의 단계별 체크리스트 — D-day 카드를 클릭하면 펼쳐집니다. (2) 공고와 무관한 개인 일정 — 좌측 하단 ‘내 할 일’ 목록.", href: "/todo" },
  { id: "t2", category: "todo", q: "공고를 어떻게 추가하나요?",
    a: "/todo 페이지의 ‘+ 채용 공고 추가’ 로 직접 입력하거나, ‘검색으로 추가’ 로 mock 공고 검색에서 선택할 수 있습니다. S?+ 에서 5개 채널 nightly 스크레이퍼가 합류합니다.", href: "/todo" },
  { id: "t3", category: "todo", q: "단계가 진행되면 체크리스트가 어떻게 바뀌나요?",
    a: "지원 → 서류합격 → 1차/2차 면접 → 오퍼 → 수락 의 phase 가 바뀔 때마다 그 단계 고유의 체크리스트가 자동으로 펼쳐집니다." },
  { id: "t4", category: "todo", q: "개인 할 일은 공고 체크리스트와 어떻게 다른가요?",
    a: "개인 할 일 = 공고와 무관한 내 reminder (시장 조사·회고·프로필 동기화). 공고 체크리스트 = 특정 회사·단계의 액션. 데이터 구조 단계에서 분리되어 있습니다." },
  { id: "t5", category: "todo", q: "캘린더 알림은 언제 활성화되나요?",
    a: "S20 에서 Supabase + 웹 푸시 + iCal 동기화가 합류하면 D-day 임박 시 알림이 발송됩니다." },

  // 블로그
  { id: "b1", category: "blog", q: "블로그 글은 누가 작성하나요?",
    a: "AI 가 매일 새벽 5시 (KST) 에 카테고리 1개씩 본문을 발행합니다. 매주 월 새벽 5시는 새주 요약. 발행 정책은 docs/specs/blog-content-pipeline.md 에 정리됨.", href: "/blog" },
  { id: "b2", category: "blog", q: "블로그 카테고리는 어떻게 분류되어 있나요?",
    a: "이력서 · 자소서 · 면접 · 협상 · 이직 · 시장 동향 · 자기 정리 도구 7개. 요일별 우선 카테고리가 정해져 있어 한 달이면 모든 카테고리에서 콘텐츠가 나옵니다." },
  { id: "b3", category: "blog", q: "비슷한 주제가 반복되지 않나요?",
    a: "발행 직전 임베딩 cosine similarity 로 최근 90일 글과 비교하여 0.85 이상이면 폐기, 다른 후보로 대체합니다. 같은 카테고리에서 후보가 고갈되면 시장 뉴스 모드로 전환됩니다." },
  { id: "b4", category: "blog", q: "블로그를 RSS · 메일로 받을 수 있나요?",
    a: "S17 (Astro 블로그 합류) 부터 RSS 피드와 주간 다이제스트 메일을 지원할 예정입니다." },

  // 외부 연동
  { id: "e1", category: "export", q: "리멤버 자동 연동이 가능한가요?",
    a: "현재는 자동 연동 미지원. 리멤버 OAuth 협의가 끝나면 자동 동기화로 전환됩니다. 그 전까지는 셀프 작성 + 복사·붙여넣기 페이지를 사용하세요.", href: "/profile/export/remember" },
  { id: "e2", category: "export", q: "LinkedIn 자동 연동이 가능한가요?",
    a: "LinkedIn Profile API 는 third-party 에 매우 제한적이라 자동 동기화는 어렵습니다. 영문 섹션 단위로 복사·붙여넣어 사용하세요.", href: "/profile/export/linkedin" },
  { id: "e3", category: "export", q: "어떤 정보가 LinkedIn / 리멤버 양식에 들어가나요?",
    a: "리멤버 = 사진·자기소개·경력·총 경력연수·스킬·학력 (필수). LinkedIn = Headline·About·Experience·Education·Skills·Certifications. 셀프 작성 페이지가 같은 필드 구조를 따릅니다." },
  { id: "e4", category: "export", q: "기존 이력서·경험을 다시 입력해야 하나요?",
    a: "아니요. AI 모듈 합류 이후 (S?+) 본인의 ‘경험’ 데이터를 기반으로 양 플랫폼용 양식을 자동 생성합니다. 현재는 셀프 작성 모드만 활성화되어 있습니다." },

  // 결제
  { id: "p1", category: "billing", q: "결제는 언제부터 시작되나요?",
    a: "S18 부터 Toss · Iamport 결제 모듈이 붙습니다. 그 전까지는 모든 기능을 무료로 사용할 수 있습니다." },
  { id: "p2", category: "billing", q: "구독 모델은 어떻게 되나요?",
    a: "월 / 년 구독. 무료 등급 + Pro (무제한 모의 면접 · pgvector 검색 · 우선순위 콘텐츠) 로 분리될 예정. 가격은 S18 진입 시점에 공지합니다." },
  { id: "p3", category: "billing", q: "환불 정책은?",
    a: "결제일로부터 7일 이내, 사용 횟수가 무료 등급 한도 이하인 경우 전액 환불. S18 에 정식 정책이 게시됩니다." },

  // 데이터 · 프라이버시
  { id: "d1", category: "data", q: "데이터는 어디에 저장되나요?",
    a: "Supabase Postgres + Row-Level Security 로 사용자 본인만 접근합니다. 백업은 일 단위 자동, 외부 모델 호출 시 PII 마스킹을 거칩니다." },
  { id: "d2", category: "data", q: "내 데이터를 export 할 수 있나요?",
    a: "프로필 · 경험 · 메모리 · 자료 모두 JSON / Markdown 으로 다운로드 가능 (S?+). 폐쇄 시 30일 grace period 후 영구 삭제." },
  { id: "d3", category: "data", q: "AI 모델 학습에 내 데이터가 사용되나요?",
    a: "사용되지 않습니다. 외부 LLM 호출은 inference 만 수행하며, 학습용 데이터로 재사용되지 않도록 모델 제공자와 계약합니다 (Claude API · zero-retention 옵션)." },
  { id: "d4", category: "data", q: "한국 개인정보보호법 준수 여부?",
    a: "PIPC (Personal Information Protection Commission) 가이드 기준으로 수집·보관·삭제 정책을 작성. S18 결제 모듈 합류 시 정식 개인정보처리방침이 게시됩니다." },

  // 문제 해결
  { id: "tr1", category: "trouble", q: "로그인 버튼을 눌렀는데 데모 페이지로 가요. 왜죠?",
    a: "Supabase 환경 변수가 아직 설정되지 않은 빌드 (예: GitHub Pages 미리보기) 에서는 로그인 버튼이 데모 모드로 라우팅됩니다. 정식 배포에서는 정상 로그인 플로우가 동작합니다." },
  { id: "tr2", category: "trouble", q: "공고를 추가했는데 캘린더에 안 떠요.",
    a: "마감일 (deadline) 이 미입력이거나 오늘 이전 날짜로 입력된 경우 캘린더 마커가 표시되지 않습니다. /todo 에서 마감일을 확인해보세요." },
  { id: "tr3", category: "trouble", q: "‘리멤버’ 페이지에서 복사 버튼이 안 눌려요.",
    a: "브라우저의 클립보드 권한이 막혀 있을 수 있습니다. 본문을 직접 선택해 복사하거나, 사이트 권한 설정에서 클립보드 쓰기를 허용해주세요.", href: "/profile/export/remember" },
  { id: "tr4", category: "trouble", q: "404 가 나옵니다.",
    a: "GitHub Pages URL 은 대소문자를 구분합니다. ‘Career-manager’ (C 대문자) 가 정확한 경로입니다. 또한 일부 페이지는 후속 sprint 에 합류 예정이라 stage placeholder 만 표시될 수 있습니다." },
  { id: "tr5", category: "trouble", q: "버그를 어떻게 신고하나요?",
    a: "GitHub Issue (https://github.com/Simon-YHKim/Career-manager/issues) 에 재현 절차 + 스크린샷을 남겨주세요. S?+ 에서 인앱 피드백 폼이 추가됩니다." },
];
