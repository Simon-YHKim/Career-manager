# 외부 프로필 동기화 파이프라인 — Spec

작성일: 2026-04-30
대상: 리멤버 (Remember) · LinkedIn
적용 시점: 1차는 셀프 작성 + 클립보드 복사 (현재). AI 자동 작성은 S?+
이후. 자동 동기화 (OAuth) 는 협의 진행 후 합류.

이 문서는 **리멤버 / LinkedIn 의 실제 필드 셋** 과 **본 서비스 내부
데이터 (프로필 · 경험 · 자료) 가 어떻게 매핑되는지** 를 정의한다.
향후 AI 모듈이 이 문서를 instruction 으로 읽고 자동 작성한다.

---

## 1. 단계별 활성화 (출시 plan)

| 단계 | 시점 | 사용자 경험 | 내부 |
|---|---|---|---|
| **A. 셀프 작성** | 현재 (S?+) | 사용자 직접 입력 → localStorage 저장 → 섹션별 복사 | `lib/profile-export.ts` |
| **B. AI 자동 작성** | S?+ (Claude API 합류 후) | "내 데이터로 채우기" 한 번 누르면 본인 경험·프로필에서 양식 자동 생성 | Claude system prompt + 본 spec |
| **C. AI 동기화 (Remember)** | OAuth 협의 후 | Career Manager 데이터 변경 시 리멤버 프로필 자동 업데이트 | Remember OAuth + webhook |
| **D. AI 동기화 (LinkedIn)** | LinkedIn API 검토 후 (또는 무기한 보류) | 동일하게 자동 업데이트 | LinkedIn Profile API |

**원칙**: 자동 동기화가 막혀도 (B) 까지는 항상 동작. (C) (D) 는
별도 sprint, 막히면 (B) 의 복사·붙여넣기로 우회.

---

## 2. 리멤버 (Remember) 매핑

### 2.1 리멤버 커리어 프로필 필드 셋

(2026-04 리서치 기준 — support.rememberapp.co.kr + now.rememberapp.co.kr)

| 섹션 | 필드 | 필수 | 비고 |
|---|---|---|---|
| 프로필 사진 | photo | ✅ | image |
| 기본 정보 | name, currentCompany, department, title | name·currentCompany·title 필수 |
| 자기소개 | summary | ✅ | **≥ 50자** (스카웃 노출 조건) |
| 경력 요약 | totalYears | ✅ | int (years) |
| 경력 사항 | company, department, title, startDate, endDate, current, description | ✅ ≥1 | repeatable |
| 학력 | school, major, degree, startYear, endYear | ✅ ≥1 | repeatable |
| 전문분야/스킬 | skills | ✅ | tags · 인접 키워드 함께 |
| 직무 | jobFunction | ✅ | enum (single) |
| 자격증 | name, issuer, date | optional | repeatable |
| 수상 및 기타이력 | title, date, description | optional | repeatable |
| 외국어 | language, proficiency | optional | best-effort, 화면에서 노출 가변 |
| 블로그/홈페이지 | links | optional | URL[] |
| 연락처 | email, phone | optional | 명함과 별도 노출 제어 |

### 2.2 본 서비스 ↔ 리멤버 매핑

```yaml
career_profile_minimal:           # 우리 'profile' 데이터
  full_name           → name
  current_role.title  → title
  current_role.company → currentCompany
  current_role.dept   → department
  thesis              → summary           # 50자 미만이면 expand 필요
  total_career_years  → totalYears

experiences[]:                    # 우리 'experience' 데이터
  company             → experiences[].company
  title               → experiences[].title
  department          → experiences[].department
  start               → experiences[].startDate (YYYY-MM)
  end                 → experiences[].endDate / current
  bullets[]           → experiences[].description (• 로 join)

educations[]:
  school              → educations[].school
  major               → educations[].major
  degree              → educations[].degree
  start_year          → educations[].startYear
  end_year            → educations[].endYear

skills:
  primary[]           → skills[]
  adjacent[]          → skills[]          # 함께 추가 (검색 노출 ↑)

links:
  github / portfolio / blog → links[]

contact:
  email               → email
  phone               → phone
```

### 2.3 AI 작성 룰 (자동 채우기 모드)

1. **자기소개** 가 50자 미만이면 본인 thesis + 가장 최근 경력 1개를
   조합하여 60-120자로 확장. 광고성 표현 금지.
2. **경력 description** 은 우리 experience.bullets 를 그대로 붙이지 말고
   리멤버 톤 (성과 + 임팩트) 으로 1회 reframe. 단위·년도 누락 금지.
3. **스킬** 은 직무 카테고리에 인접한 키워드 2-3개를 함께 추가
   (예: "온라인 마케팅" + "디지털 마케팅"). 단, 임의 추가 금지 — 본인
   경험에 근거가 있어야 함.
4. **외국어 능숙도** 는 본인 자기 평가만 사용. AI 가 추정하지 않음.

---

## 3. LinkedIn 매핑

### 3.1 LinkedIn 필드 셋

(2026-04 리서치 — LinkedIn Help Center + 공개 프로필 편집기)

| 섹션 | 주요 필드 | 제한 |
|---|---|---|
| Top intro | firstName, lastName, headline, country, city, industry, pronouns | firstName ≤ 20, lastName ≤ 40, **headline ≤ 220** |
| About | about | **≤ 2,600 chars** |
| Experience | title, company, employmentType, locationType, location, startDate, endDate, isCurrent, description, skills | title ≤ 100, company ≤ 100, **description ≤ 2,000** |
| Education | school, degree, fieldOfStudy, startYear, endYear, grade, activities, description | activities ≤ 500, description ≤ 1,000 |
| Skills | tags | up to **50** total, each ≤ 80 chars |
| Licenses & Certifications | name, issuer, issueDate, expirationDate, credentialId, credentialUrl | name ≤ 255 |

**section order** (LinkedIn 표시 순서): Top intro → Open to → Featured →
About → Activity → Experience → Education → Licenses & Certifications →
Volunteer → Skills → Recommendations → Projects → Publications → Patents
→ Courses → Honors → Test Scores → Languages → Organizations.

### 3.2 본 서비스 ↔ LinkedIn 매핑

```yaml
career_profile_minimal:
  given_name          → firstName
  family_name         → lastName
  pronouns_pref       → pronouns
  thesis              → headline           # 220자로 trim
  current_role.industry → industry
  location.country    → country
  location.city       → city

about:                                    # 본 서비스에는 free-form 'about' 없음
  source = thesis + top 3 experiences summary, 영문 reframe (en),
  cap 2500 chars

experiences[]:
  company             → experiences[].company
  title               → experiences[].title
  employment_type     → experiences[].employmentType  # 매핑 ↓
  remote              → experiences[].locationType
  location            → experiences[].location
  start               → experiences[].startDate
  end                 → experiences[].endDate / isCurrent
  bullets[]           → experiences[].description (영문 reframe)

educations[]:                             # 우리 'education' 데이터
  ...                 → educations[].*    # 1:1
```

employment_type 매핑:
```yaml
정규직   → Full-time
계약직   → Contract
인턴     → Internship
프리랜서 → Freelance
자영업   → Self-employed
```

### 3.3 AI 작성 룰

1. **headline** 은 한국어 직무 + 영문 keyword 한 줄. "Backend Engineer
   · Payments — building reliable APIs at Toss" 형식.
2. **About** 은 1인칭, 한 문단 = 한 메시지. 첫 문단 = 핵심 임팩트, 다음
   = 도메인·스택, 마지막 = 협업 톤. 2,500자 이하 (2,600 한도 여유).
3. **Experience description** 은 결과 → 방법 → 규모 순서. 숫자 단위 명시.
4. **Skills** 은 가장 강한 5-10개를 우선. 50개 한도 안에서 채우되 너무
   broad 하지 않게.
5. 한국 회사명은 영문 표기 + 괄호 한국명 (예: Toss (토스)). 검색
   노출에 도움.

---

## 4. AI 자동 작성 워크플로우 (B 단계)

### 4.1 트리거
- 사용자가 "내 데이터로 채우기" 버튼을 누르면 시작
- 또는 사용자가 본인의 ‘경험’ 을 추가/수정한 시점에 background 갱신

### 4.2 입력
- `career_profile_minimal` (Zod 스키마)
- `experiences[]` (각 atom 의 STAR 5요소)
- `educations[]`
- `memory` (S24 합류 시 임베딩 검색 결과)

### 4.3 LLM 호출 패턴
```pseudo
prompt = render(
  template="profile-export-{platform}-fill",
  context={
    user_data: career_profile + experiences,
    target_schema: REMEMBER_SCHEMA | LINKEDIN_SCHEMA,
    constraints: char_limits + style_rules (위 §2.3 / §3.3),
    locale: ko-KR | en-US,
  }
)

result = claude.complete(prompt, model="claude-opus-4-7")
parsed = zod.parse(result, schema=REMEMBER | LINKEDIN)
```

### 4.4 검증 단계
- 모든 필수 필드 채워졌는지 (Remember `requiredCount.total`, LinkedIn
  `requiredCount.total` 와 동일하게)
- 글자 수 제한 위반 시 자동 trim 한 번, 그래도 over → 사용자에게 표시
- 임의로 만든 사실 (없는 자격증, 부풀린 경력) 검출 — 우리 데이터에
  없는 entity 가 본문에 등장하면 reject

### 4.5 결과 저장
- `lib/profile-export.ts` 의 localStorage 키에 동일 shape 으로 저장
- (S?+) Supabase `profile_exports` 테이블로 마이그레이션

---

## 5. 자동 동기화 (C / D 단계) — 미래 검토

### 5.1 Remember (C 단계)
- OAuth 미공개 — 협의 진행 중
- 합류 시 우리 데이터 변경 → webhook → 리멤버 API 호출 → 프로필 갱신
- 사용자에게 "동기화됨" 토스트 + 마지막 동기 시각 표시

### 5.2 LinkedIn (D 단계)
- LinkedIn Marketing Developer Platform 인증 필요
- Profile API v2 는 third-party 에 매우 제한적 — Sign in with LinkedIn,
  Share on LinkedIn 정도만 공개적으로 사용 가능
- **현실적 대안**: Career Manager 가 LinkedIn 양식 markdown 을
  자동 생성하고, 사용자가 직접 붙여넣는 ‘반자동’ 흐름. 클립보드 +
  바로 LinkedIn 편집 페이지로 deep-link.

---

## 6. UI 약속

- 셀프 작성 페이지 (현재 출시본) 는 **자동 저장** + **섹션별 복사**.
- AI 자동 작성 (B) 합류 시 페이지 상단에 "내 데이터로 채우기" 버튼.
- 동기화 (C/D) 합류 시 동일 위치에 "리멤버 동기화 / LinkedIn 동기화"
  버튼 + 마지막 동기 시각 + 동기화 사유 (변경된 필드 요약).

---

## 7. 안티-패턴 (하지 말 것)

- ❌ 사용자가 입력하지 않은 자격증·학교·회사를 AI 가 만들어 채움
- ❌ 헤드라인에 광고성 카피 ("Top 1% engineer", "Award-winning")
- ❌ Skill 50개 한도 무시
- ❌ description 에 마크다운 헤더 (LinkedIn 은 plain text 만 인식)
- ❌ 자기소개 50자 padding 으로 의미 없는 단어 채움
- ❌ 사용자 동의 없이 동기화 트리거

---

## 8. 검증 (이 spec 합류 후 완료 여부)

- [ ] Remember 셀프 작성 페이지 — 모든 필드 입력 → 복사 → 리멤버 앱
      붙여넣기 성공
- [ ] LinkedIn 셀프 작성 페이지 — 동일하게 linkedin.com 에 붙여넣기
- [ ] AI 자동 작성 (B) 합류 후 ‘내 데이터로 채우기’ 1회 — 8/8 필수
      필드 자동 채워짐
- [ ] anti-패턴 §7 자동 검증 (lint 단계)

---

## 9. 출처

- [리멤버 프로필 작성하기](https://support.rememberapp.co.kr/hc/ko/articles/360000347961)
- [스카웃 받는 프로필 작성 TIP 4가지](https://now.rememberapp.co.kr/2022/05/28/18621/)
- [LinkedIn Help Center — Profile sections](https://www.linkedin.com/help/linkedin)
- LinkedIn 공개 프로필 편집기 (linkedin.com/in/edit/)
