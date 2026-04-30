# 블로그 자동 콘텐츠 파이프라인 — Spec

작성일: 2026-04-30
적용 시점: AI 콘텐츠 모듈 합류 (S17 Astro · S25 Cron) 이후
운영 시간대: **KST (Asia/Seoul)** — 모든 cron 표기 KST 기준

이 문서는 **사람이 손대지 않아도** 블로그가 매일·매주 일정한 품질로
자체 갱신되도록 만드는 워크플로우 스펙이다. 향후 AI 모듈이 합류하면
이 문서를 그대로 instruction 으로 읽고 행동한다.

---

## 1. 발행 스케줄

| Job | 빈도 | 시각 (KST) | 산출물 |
|---|---|---|---|
| daily-article | 매일 | 05:00 | 카테고리 1개 × 본문 1편 |
| weekly-digest | 매주 월 | 05:00 | 한 주 발행물 요약 + 시장 동향 1편 |
| topic-fill | 일 1회 | 04:30 | 다음 7일치 후보 아젠다 큐에 채움 |
| dedup-rebuild | 일 1회 | 03:00 | 임베딩 인덱스 재구축 (중복 차단용) |

cron 표현 (Supabase Cron Edge Function 가정):
```text
30 4 * * *   topic-fill
0  5 * * *   daily-article
0  5 * * 1   weekly-digest      # daily-article 와 5분 격차 두고 직렬
0  3 * * *   dedup-rebuild
```

> **타임존 함정**: Supabase pg_cron 은 UTC 가 기본. KST 05:00 = UTC 20:00
> (전날). 마이그레이션에 `SET timezone = 'Asia/Seoul'` 명시하거나
> UTC 시각으로 변환해 등록할 것. 둘 중 하나만 쓰고 일관성 유지.

---

## 2. 카테고리 정의

블로그 페이지의 `BlogCategory` 와 1:1 매칭. 추가/삭제 시 양쪽 동기화.

| id | 레이블 | 매주 슬롯 | 비고 |
|---|---|---|---|
| `resume` | 이력서 | 월 | ATS · 한 줄 요약 · 한·영 변환 |
| `essay` | 자소서 | 화 | 회사별 톤 · 압박 질문 응답 |
| `interview` | 면접 | 수 | 행동 면접 · 압박 면접 · 모의 |
| `salary` | 협상 | 목 | 협상 시뮬레이션 · 시장 비교 |
| `career-change` | 이직 | 금 | 사이클 회고 · 이직 timing |
| `market` | 시장 동향 | 토 | 한국 + 글로벌 채용 뉴스 |
| `tools` | 자기 정리 도구 | 일 | 메모리 · 경험 · 프로필 활용 |

daily-article 은 **요일별 카테고리**를 우선 슬롯으로 쓴다. 그 카테고리의
큐가 비면 다른 카테고리에서 가장 오래된 후보를 끌어온다.

---

## 3. topic-fill (04:30) — 아젠다 큐 채움

### 3.1 목표
다음 7일치 발행 후보 아젠다 ≥ 7개를 `blog_agenda` 테이블에 항상 유지.

### 3.2 알고리즘
1. 각 카테고리별로 최근 90일 내 게시물 제목 + 본문 임베딩 로드.
2. 카테고리 시드 키워드 (아래) 로 웹 검색 → 후보 주제 30개 추출.
3. 각 후보를 임베딩으로 표현 → `cosine_sim(후보, 최근 90일 게시물)` ≥ 0.85
   인 것은 **중복**으로 폐기.
4. 폐기 후 남은 후보 중 **diversity-aware** 로 5개 선정 (서로 ≥ 0.5 거리).
5. `blog_agenda` 에 status = 'queued', scheduled_for = 다음 빈 슬롯.

### 3.3 시드 키워드 (출발점, AI 가 확장)

```yaml
resume:        ["ATS 이력서", "한 페이지 이력서", "테크 resume", "한·영 동시 작성"]
essay:         ["자소서 reframe", "압박 질문 답변", "회사별 톤", "STAR 기법"]
interview:     ["행동 면접", "압박 면접", "시스템 디자인", "컬처핏"]
salary:        ["연봉 협상", "오퍼 비교", "글로벌 vs 한국 연봉", "지분 협상"]
career-change: ["이직 사이클", "공백기 설명", "도메인 전환", "스타트업 이직"]
market:        ["채용 동향", "정부 채용 정책", "레이오프", "원격 근무 트렌드"]
tools:         ["경험 정리법", "메모리 활용", "회고 템플릿", "포트폴리오"]
```

---

## 4. daily-article (05:00) — 본문 작성

### 4.1 입력
- 오늘의 슬롯에 해당하는 `blog_agenda` 항목 (status = 'queued', 가장 오래된)
- 전날까지 발행된 동일 카테고리의 최근 30개 본문 (중복 회피용)

### 4.2 본문 구조 (가독성 우선)
```markdown
# {제목} — {카테고리 레이블}

> {1-2문장 TL;DR}

## 왜 지금 이 주제가 중요한가
{왜 / 누구에게}

## 핵심 3가지
1. **{포인트1 헤드라인}** — {2-3문장}
2. **{포인트2 헤드라인}** — {2-3문장}
3. **{포인트3 헤드라인}** — {2-3문장}

## 실전 적용 — 30분짜리 액션
- [ ] {바로 해볼 일 1}
- [ ] {바로 해볼 일 2}
- [ ] {바로 해볼 일 3}

## 더 읽기
- {외부 출처 1} — {왜 추천}
- {외부 출처 2} — {왜 추천}

---
*작성: AI · {YYYY-MM-DD KST} · 카테고리: {카테고리}*
```

### 4.3 룰
- **분량**: 본문 800-1200 단어. 너무 길면 가독성 떨어짐.
- **출처**: 외부 인용은 반드시 URL 명시. 5년 이상 된 자료는 보조 용도로만.
- **사실 확인**: 통계·연도·이름은 cross-reference 2개 이상.
- **톤**: 단정한 한국어, 존댓말, 회사 홍보·과장 금지.
- **이모지·과한 emoji**: 금지 (DESIGN.md AI Slop 3원칙 정렬).
- **광고**: 본문 안에 자기 서비스 노출 금지 (헤더의 "AI 작성" 마크만).

### 4.4 중복 방지 (재확인)
발행 직전 한 번 더 임베딩 cosine ≥ 0.88 체크 → 통과 못 하면 재작성 1회,
그래도 실패면 fallback (§6) 으로 전환.

---

## 5. weekly-digest (월 05:00) — 새주 요약

### 5.1 본문 구조
```markdown
# {YYYY-MM-DD} 주간 요약 — Career Manager 블로그

## 지난 주 발행 (n개)
- **{카테고리}** · {제목} — {1줄 요약} → {링크}
- ...

## 이번 주 추천 액션
1. {월요일 적합 액션 1}
2. {수요일 적합 액션 2}
3. {금요일 적합 액션 3}

## 시장 한 줄
{지난 주 가장 중요한 채용 시장 뉴스 1개, 출처 포함}

---
*작성: AI · 매주 월 05:00 KST 자동 발행*
```

### 5.2 룰
- 지난 주 발행 글 7개의 **헤드라인만** 모아 요약 (본문 재진술 X).
- 시장 한 줄은 §6 의 시장 카테고리 풀에서 가장 핫한 1개.

---

## 6. 포화 fallback — 시장 뉴스 모드

같은 카테고리에서 **3주 연속** 새로운 후보 주제가 나오지 않으면
(임베딩 신선도 < 임계치), 다음 daily-article 슬롯을 **시장 카테고리**로
대체한다.

### 6.1 시장 뉴스 소스 (우선순위)

```yaml
한국:
  - 잡코리아 채용 트렌드 리포트
  - 사람인 HR 인사이트
  - 원티드 채용 데이터
  - 정부24 (고용노동부 / 산업부 채용 정책)
  - 벤처비트 / 마이리얼트립 / 토스 등 기업 블로그

글로벌:
  - LinkedIn News (Workforce trends)
  - layoffs.fyi (레이오프 추적)
  - The Pragmatic Engineer
  - Levels.fyi salary reports
  - WSJ / Bloomberg Tech 채용 섹션
```

### 6.2 시장 글 구조
§4.2 동일하지만 "더 읽기" 섹션이 **출처 5개 이상** 으로 확장.
모든 통계는 보고일 + 출처 명시.

---

## 7. 데이터 모델 (Supabase 가정)

```sql
create table blog_agenda (
  id            uuid primary key default gen_random_uuid(),
  category      text not null,            -- ↑ §2 id
  title_draft   text not null,
  seed_keywords text[],
  embedding     vector(1536),             -- pgvector, S24
  status        text not null default 'queued', -- queued | drafted | published | rejected
  scheduled_for date,
  created_at    timestamptz default now(),
  published_at  timestamptz
);

create table blog_post (
  id            uuid primary key default gen_random_uuid(),
  agenda_id     uuid references blog_agenda(id),
  category      text not null,
  title         text not null,
  body_md       text not null,
  body_html     text,                     -- 캐시
  embedding     vector(1536),
  sources       jsonb,                    -- [{url, title, retrieved_at}]
  word_count    int,
  ai_model      text,                     -- "claude-opus-4-7" 등
  published_at  timestamptz default now(),
  unique(category, title)
);

create index on blog_post using ivfflat (embedding vector_cosine_ops);
create index on blog_agenda using ivfflat (embedding vector_cosine_ops);
```

RLS: blog_post 는 모두에게 select 허용. insert/update 는 service_role 만.
blog_agenda 는 service_role 전용.

---

## 8. 운영 체크리스트

- [ ] cron 실패 알림 → Slack/Discord webhook (3일 연속 실패 시 paging)
- [ ] AI 모델 비용 추적 → 일 한도 초과 시 다음날 skip + 알림
- [ ] 발행 글 reader analytics — 30일간 클릭 0인 카테고리는 시드 키워드 재검토
- [ ] 분기 1회 사람이 5개 글 샘플 리뷰 → 품질 지표 유지

---

## 9. 안티-패턴 (하지 말 것)

- ❌ 같은 글을 카테고리만 바꿔 재발행
- ❌ AI 가 사실을 모르겠다고 답하면 "추측"으로 채우는 것
- ❌ 광고성 표현 ("우리 서비스를 사용하세요")
- ❌ 영어 원문을 한국어로 단순 번역만 하고 출처 가리기
- ❌ 통계의 단위·연도 누락
- ❌ 발행 시각이 KST 가 아닌 UTC 로 보이는 것

---

## 10. 다음 단계 (이 spec 합류 후 해야 할 일)

1. S17 Astro 블로그 페이지 — 본문은 markdown 정적 export.
2. S24 pgvector 적용 — embedding 기반 중복 차단 가능해짐.
3. S25 Cron Edge Function — 위 4개 cron job 등록.
4. AI 콘텐츠 모듈 (Claude API) — 이 spec 을 system prompt 로 주입.
5. 시장 뉴스 스크레이퍼 — §6.1 소스에서 RSS/HTML 수집.
