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
  { id: "blog", title: "블로그 · 콘텐츠", subtitle: "Articles" },
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
    a: "로그인 후 ‘리멤버’ 또는 ‘LinkedIn’ 페이지에서 기존 프로필 양식을 채워두면, 자기 정리·자료·면접 단계로 자연스럽게 이어집니다. 직접 입력 외에도 본인이 정리한 ‘경험’ 으로 양식을 자동 작성하는 기능이 합류 예정입니다.",
    href: "/profile/export/remember" },
  { id: "s3", category: "start", q: "12 단계 전체 흐름은 어떻게 되나요?",
    a: "기반(프로필→경험→메모리) → 자료(이력서·경력→자소서→포트폴리오) → 면접(코칭→평가→연봉협상) → 할 일/블로그가 옆에서 보조합니다. 각 단계는 독립적으로 사용 가능합니다." },
  { id: "s4", category: "start", q: "Android 앱은 언제 출시되나요?",
    a: "Web 과 Android 를 동시에 개발 중이며 동일 디자인 토큰을 공유합니다. 모바일에서는 Web 화면이 그대로 잘 보이도록 반응형으로 설계되어 있습니다." },

  // 계정 · 보안
  { id: "a1", category: "account", q: "어떤 로그인 방법을 지원하나요?",
    a: "Google · Apple · 이메일 매직 링크가 우선 제공됩니다. Kakao · Naver · LinkedIn 도 단계적으로 합류합니다." },
  { id: "a2", category: "account", q: "비밀번호 없이도 로그인할 수 있나요?",
    a: "네. 이메일 매직 링크는 비밀번호 없이 메일에 도착한 1회용 링크로 로그인합니다. 가장 권장되는 방식입니다." },
  { id: "a3", category: "account", q: "2단계 인증 (2FA) 을 지원하나요?",
    a: "TOTP 2FA 를 활성화할 계획입니다. 현재는 사용 중인 소셜 로그인 (Google · Apple 등) 의 2FA 가 그대로 적용됩니다." },
  { id: "a4", category: "account", q: "로그아웃은 어디서 하나요?",
    a: "헤더 우측 ‘로그아웃’ 버튼. 모든 기기에서 동시에 로그아웃하려면 설정 > 보안 에서 ‘모든 세션 종료’ 를 사용하세요." },
  { id: "a5", category: "account", q: "Naver 로 로그인이 왜 ‘OIDC’ 로 표시되나요?",
    a: "Naver 는 일반 OAuth 가 아닌 OpenID Connect 방식으로 연결됩니다. 사용자 경험 자체는 Google · Apple 과 동일합니다." },

  // 자기 정리
  { id: "f1", category: "foundation", q: "프로필 · 경험 · 메모리 는 어떻게 다른가요?",
    a: "프로필 = 한 줄 thesis 와 핵심 메타데이터 (10초 안에 파악). 경험 = 프로젝트 단위로 atom 화한 사례. 메모리 = 누적된 자기 이해 (임베딩 기반 검색용, S24+).", href: "/profile" },
  { id: "f2", category: "foundation", q: "경험은 어느 정도 자세히 써야 하나요?",
    a: "한 atom 당 ‘상황·역할·행동·결과·배운 점’ 5요소를 3-5문장으로. 너무 길면 자료 작성 단계에서 reframe 이 어려워집니다.", href: "/experience" },
  { id: "f3", category: "foundation", q: "메모리는 언제 활용되나요?",
    a: "이력서·자소서·면접 답변을 작성할 때 과거 경험·회고를 자동으로 회수해 옵니다. ‘기억할 만한데 어디에 썼는지 모르겠는 그것’ 을 자료 작성 단계에서 다시 만나는 게 핵심입니다.", href: "/memory" },
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
    a: "/todo 페이지의 ‘+ 채용 공고 추가’ 로 직접 입력하거나 ‘검색으로 추가’ 로 통합 검색에서 선택합니다. 원티드 · 점핏 · 사람인 · LinkedIn 5개 채널의 통합 검색이 단계적으로 합류합니다.", href: "/todo" },
  { id: "t3", category: "todo", q: "단계가 진행되면 체크리스트가 어떻게 바뀌나요?",
    a: "지원 → 서류합격 → 1차/2차 면접 → 오퍼 → 수락 의 phase 가 바뀔 때마다 그 단계 고유의 체크리스트가 자동으로 펼쳐집니다." },
  { id: "t4", category: "todo", q: "개인 할 일은 공고 체크리스트와 어떻게 다른가요?",
    a: "개인 할 일 = 공고와 무관한 내 reminder (시장 조사·회고·프로필 동기화). 공고 체크리스트 = 특정 회사·단계의 액션. 데이터 구조 단계에서 분리되어 있습니다." },
  { id: "t5", category: "todo", q: "캘린더 알림은 어떻게 동작하나요?",
    a: "마감일 D-3 부터 화면에 강조 표시되며, 웹 푸시 알림과 iCal 동기화가 합류 예정입니다. 알림은 본인 계정 설정에서 카테고리별로 켜고 끌 수 있습니다." },

  // 블로그
  { id: "b1", category: "blog", q: "블로그에는 어떤 글이 올라오나요?",
    a: "이력서 · 자소서 · 면접 · 연봉 협상 · 이직 사이클 · 시장 동향 · 자기 정리 도구 7개 카테고리의 실전 가이드와 사례입니다. 출퇴근길에 5-10분 안에 읽을 수 있도록 짧고 정리된 형식으로 작성됩니다.", href: "/blog" },
  { id: "b2", category: "blog", q: "글은 얼마나 자주 올라오나요?",
    a: "매일 새벽 1편씩, 월요일 아침에는 한 주 요약이 함께 올라옵니다. 카테고리 안에서 새 주제가 떨어지면 채용 시장 뉴스 (정부 채용 정책 · 글로벌 레이오프 · 시장 보고서) 로 전환합니다." },
  { id: "b3", category: "blog", q: "비슷한 주제가 반복되지 않나요?",
    a: "이미 다룬 주제와 비슷한 글은 게시 전에 자동으로 걸러집니다. 같은 카테고리에서 새 주제가 고갈되면 시장 뉴스 모드로 자동 전환됩니다." },
  { id: "b4", category: "blog", q: "블로그를 RSS · 메일로 받을 수 있나요?",
    a: "RSS 피드와 주간 다이제스트 메일은 합류 예정입니다. 그 전까지는 /blog 에서 카테고리 필터로 원하는 주제만 모아 볼 수 있습니다." },

  // 외부 연동
  { id: "e1", category: "export", q: "리멤버 / LinkedIn 에 자동으로 업로드해 줄 수 있나요?",
    a: "둘 다 ‘자동 업로드’ 자체는 정식 API 가 닫혀 있어 한 번에 풀 수 있는 문제가 아닙니다. 현실적으로는 (1) OAuth 가능 시점에 점진 동기화, (2) 그 전까지는 본인이 한 번 클릭하면 클립보드에 섹션별로 정확히 들어가는 형태로 제공합니다. 자세한 옵션 비교는 다음 두 항목을 참고하세요.", href: "/profile/export/linkedin" },
  { id: "e2", category: "export", q: "리멤버 자동 연동이 어떻게 진행되나요?",
    a: "리멤버는 third-party 자동 업로드 API 를 공개하지 않아 OAuth/파트너십 협의가 필요합니다. 협의 진행 전까지는 셀프 작성 페이지에서 섹션별로 한 번에 복사 → 리멤버 앱에 붙여넣는 방식이 가장 안정적입니다.", href: "/profile/export/remember" },
  { id: "e3", category: "export", q: "LinkedIn 자동 연동이 어려운 이유가 무엇인가요?",
    a: "LinkedIn 의 Profile WRITE API 는 Marketing Developer Platform 파트너에게만 열려 있어 일반 앱에서 자동 업로드가 불가합니다. 로그인 (OpenID Connect) 은 가능하지만 글을 직접 써넣는 권한은 별도입니다. 그래서 1차로는 영문 섹션 단위 복사 방식, 향후에는 사용자가 직접 설치하는 브라우저 확장 형태가 현실적인 후보입니다.", href: "/profile/export/linkedin" },
  { id: "e4", category: "export", q: "어떤 정보가 LinkedIn / 리멤버 양식에 들어가나요?",
    a: "리멤버 = 사진·자기소개(50자 이상)·경력·총 경력연수·스킬·학력 이 검색 노출 최소 조건. LinkedIn = Headline·About·Experience·Education·Skills·Certifications 6개 핵심 섹션. 셀프 작성 페이지가 같은 필드 구조를 따라 그대로 옮길 수 있습니다." },
  { id: "e5", category: "export", q: "리멤버 / LinkedIn 외에 다른 형태의 프로필도 만들 수 있나요?",
    a: "이력서 · 자소서 · 포트폴리오는 각 카테고리에서 직접 관리합니다. 한 가지 ‘경험’ 데이터로 여러 양식 (한국 대기업용 · 스타트업용 · 영문 cover letter 등) 을 분기해서 두는 다중 버전 빌더는 합류 예정입니다." },
  { id: "e6", category: "export", q: "내가 입력한 내용을 편집할 수 있나요?",
    a: "네. 리멤버 / LinkedIn 페이지의 입력은 모두 자동으로 본인 브라우저에 저장됩니다. 같은 페이지에 다시 들어오면 입력 그대로 남아있고, 필드별로 자유롭게 수정 가능합니다. 다른 기기로의 동기화는 로그인 후 활성화됩니다." },

  // 결제
  { id: "p1", category: "billing", q: "결제는 언제부터 시작되나요?",
    a: "현재는 모든 기능을 무료로 사용할 수 있습니다. 유료 등급은 추후 공지 후 도입됩니다." },
  { id: "p2", category: "billing", q: "구독 모델은 어떻게 되나요?",
    a: "월 / 년 구독을 검토 중이며, 무료 등급 + Pro (무제한 모의 면접 · 메모리 검색 · 우선순위 콘텐츠) 로 분리될 예정입니다. 가격은 도입 시점에 공지합니다." },
  { id: "p3", category: "billing", q: "환불 정책은 어떻게 되나요?",
    a: "결제일로부터 7일 이내, 사용 횟수가 무료 등급 한도 이하인 경우 전액 환불을 원칙으로 합니다. 정식 정책은 결제 도입 시점에 게시됩니다." },

  // 데이터 · 프라이버시
  { id: "d1", category: "data", q: "데이터는 어디에 저장되나요?",
    a: "Supabase Postgres + Row-Level Security 로 사용자 본인만 접근합니다. 백업은 일 단위 자동, 외부 모델 호출 시 PII 마스킹을 거칩니다." },
  { id: "d2", category: "data", q: "내 데이터를 export 할 수 있나요?",
    a: "프로필 · 경험 · 메모리 · 자료 모두 JSON / Markdown 으로 다운로드 가능합니다. 계정 폐쇄 시 30일 유예 후 영구 삭제됩니다." },
  { id: "d3", category: "data", q: "AI 모델 학습에 내 데이터가 사용되나요?",
    a: "사용되지 않습니다. 외부 LLM 호출은 답변 생성만 수행하며, 학습 데이터로 재사용되지 않도록 모델 제공자와 zero-retention 옵션으로 계약합니다." },
  { id: "d4", category: "data", q: "한국 개인정보보호법을 준수하나요?",
    a: "개인정보보호위원회 (PIPC) 가이드 기준으로 수집·보관·삭제 정책을 작성합니다. 정식 개인정보처리방침은 결제 모듈 도입 시점에 게시됩니다." },

  // 문제 해결
  { id: "tr2", category: "trouble", q: "공고를 추가했는데 캘린더에 안 떠요.",
    a: "마감일 (deadline) 이 미입력이거나 오늘 이전 날짜로 입력된 경우 캘린더 마커가 표시되지 않습니다. /todo 에서 마감일을 확인해보세요." },
  { id: "tr3", category: "trouble", q: "‘리멤버’ 페이지에서 복사 버튼이 안 눌려요.",
    a: "브라우저의 클립보드 권한이 막혀 있을 수 있습니다. 본문을 직접 선택해 복사하거나, 사이트 권한 설정에서 클립보드 쓰기를 허용해주세요.", href: "/profile/export/remember" },
  { id: "tr4", category: "trouble", q: "내가 입력한 내용이 사라졌어요.",
    a: "리멤버 / LinkedIn / 빌더 입력은 본인 브라우저의 로컬 저장소에 저장됩니다. 시크릿 창에서 작업 중이거나 사이트 데이터를 정리하면 사라질 수 있습니다. 로그인 후에는 계정에 동기화되어 다른 기기에서도 이어 쓸 수 있습니다." },
  { id: "tr5", category: "trouble", q: "버그를 어떻게 신고하나요?",
    a: "GitHub Issue (https://github.com/Simon-YHKim/Career-manager/issues) 에 재현 절차 + 스크린샷을 남겨주세요. S?+ 에서 인앱 피드백 폼이 추가됩니다." },
];
