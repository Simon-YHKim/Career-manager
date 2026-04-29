# Phase 1 — 기획 (Planning) Audit

**Skill applied**: `office-hours` (Builder mode adapted to audit)
**Inputs scanned**: `/home/user/Career-manager/CLAUDE.md`, `/home/user/Career-manager/README.md`, `/home/user/Career-manager/packages/schema/src/document.ts`, `/home/user/Career-manager/packages/schema/src/career-profile.ts`
**Date**: 2026-04-29

## Summary

- **No product spec exists.** The repo has tech-stack decisions and a 26-sprint plan referenced by name only — no `PRODUCT.md`, no ICP doc, no wedge statement, no "7대 기능" enumeration. The schema is the de-facto spec.
- **Persona A–F is an enum without prose.** `career-profile.ts:6-12` defines six personas as one-line comments. Their day-in-the-life, JTBD, and willingness-to-pay are undocumented. You cannot run office-hours on this without inventing the personas.
- **Wedge is undefined.** The schema lists 13 `DocumentType`s. The plan ships none of them in S1. S2 wires Auth, S6–S16 spans LLM features. No single document type is marked "this is the first useful product."
- **The Korean+Western framing has no demand evidence.** README.md:3 claims "한국·영미권 통합 커리어 플랫폼" but no research doc, no user interviews, and no competitive analysis is referenced or linked.
- **Korean-cultural taxonomy (`KillerClass`: 필살기/빌살기/밉살기) appears in `document.ts:26` with zero documentation.** This looks like the team's secret sauce — but it is uncommented, untested, and unjustified in any artifact.

## 6-question audit

### 1. Demand reality
**Finding**: Zero evidence in the repo that real users want a unified Korean+Western career platform with 13 document types. README.md:3 asserts the framing as fact. No interview log, no waitlist signal, no analog to a "fake door" landing page. The only "user" referenced in code is the schema's `user_id: uuid` column. · **severity**: blocker
**Recommendation**: Before S2 ships Auth, write a one-page `docs/product/00-demand.md` with at minimum: (a) 5 interview notes from real Korean job-seekers, (b) 3 from foreign/Western-track candidates (Persona F), (c) one falsifiable claim per persona that Sprint 1's foundation is built to test. If the team cannot produce these, the 26-sprint plan is built on assumed demand.
**Decided**: report-only

### 2. Status quo
**Finding**: No artifact in the repo names what users do today. The competitive surface for a Korean career-document tool includes at least: Notion templates (free, dominant), 잡코리아·사람인 자기소개서 도우미 (free, weak AI), Wanted (free + paid AI cover letter, 2024–2025 wave), LinkedIn Premium (Western, paid), 잡플래닛, ChatGPT direct prompting (free, what most candidates actually do in 2026). The plan does not declare which of these it displaces vs augments. · **severity**: major
**Recommendation**: Add a "What users do today" section to `docs/product/00-demand.md` per persona. Specifically: if the answer for Persona B (신입) is "ChatGPT + Notion", the wedge must beat that combo on a measurable axis (latency, Korean honorific accuracy, ATS export, JD diff, recruiter-tone calibration). Pick one axis per persona.
**Decided**: report-only

### 3. Desperate specificity (ICP / persona)
**Finding**: `packages/schema/src/career-profile.ts:6-12` lists Persona A–F as Korean labels in a comment block (취린이, 신입, 주니어 이직자, 시니어, 베테랑/임원, 외국계/영미권). None of A–F has a prose definition, age band, salary band, current pain stack, willingness to pay, or acquisition channel. The schema enum lets the runtime accept "A" but the product cannot meaningfully serve "A" because no team member can answer "what does Persona A do on Monday morning?" in writing. · **severity**: blocker
**Recommendation**: Pick **one** persona for S2-S6. My read: **Persona B (신입)** is the wedge — highest Korean job-seeker volume, most desperate for cover-letter quality, most likely to pay 9,900–19,900 KRW/month, smallest English-localization burden. Write a 1-page persona card: morning routine, last failed application, current tools, what would make them switch, what they will not pay for. Defer Persona A, C, D, E, F to post-product-market-fit.
**Decided**: report-only

### 4. Narrowest wedge
**Finding**: 13 `DocumentType`s in `document.ts:9-23`: career_profile, experience_atom, career_description, cover_letter, resume, mock_interview, negotiation_sim, portfolio, application, company_research, jd_analysis, memo, schedule. Sprint 1 implements zero. The README "Out of scope" lists S6–S16 as the LLM workflows window — 11 sprints with no internal prioritization. There is no statement of the form "the first thing a user does that proves the product works is X." · **severity**: blocker
**Recommendation**: Declare the wedge as **`cover_letter` for Persona B**. Rationale: highest baseline pain, fastest to produce a measurable A/B vs ChatGPT (the actual incumbent), naturally pulls in `experience_atom` (the input) and `jd_analysis` (the calibration target) without scope creep. The other 10 document types should be marked "post-wedge" in `docs/product/01-wedge.md`. S6 should ship `cover_letter` end-to-end before S7 starts.
**Decided**: report-only

### 5. Observation
**Finding**: `KillerClass` enum (`document.ts:26`) — `필살기 / 빌살기 / 밉살기 / unknown` — is the most product-original artifact in the entire repo. It implies the team has a non-obvious framework for classifying career narratives (killer story / borrowed-killer / hated-killer). This is exactly the kind of "thing the team knows that nobody else knows" that office-hours probes for. But it is undocumented: no comment, no test, no doc, no algorithm for assignment. The same goes for `EngineId: G/S/L/AB/AD` — five engines with no rubric for when each fires. · **severity**: major
**Recommendation**: Write `docs/product/02-killer-class.md` and `docs/product/03-engines.md` before S6. These are the "secret weapons" the audit cannot evaluate without prose. If the team cannot articulate the rubric, the LLM features in S6–S16 will silently lose the differentiator. Test: a non-team-member should be able to read these docs and correctly classify 8/10 sample cover letters.
**Decided**: report-only

### 6. Future-fit
**Finding**: README.md:3-5 frames the product as a "26-sprint master plan" but does not state why 2026 is the moment, what enabler unlocked it, or what the world looks like at S26. The schema's bilingual fields (`title` + `title_en` in `career-profile.ts:19-21`, `Language: ko | en`) signal a bet on Korean→Western career migration becoming a high-volume corridor. That bet is unstated and unsourced. · **severity**: major
**Recommendation**: Add a "Why now" paragraph to README.md or a new `docs/product/04-thesis.md`. Candidate enablers worth checking: (a) Korean white-collar wage stagnation 2023–2025, (b) Korean-Western remote-work normalization post-2024, (c) GPT-4-class translation reaching Korean honorific competence in 2025, (d) Wanted/Saramin's AI features still gating behind paywalls in 2026. Pick the 2 strongest, cite sources, declare the hypothesis falsifiable.
**Decided**: report-only

## Gaps surfaced

- **No `docs/product/` directory.** The entire product layer is implicit in the schema.
- **No `PRODUCT.md` or equivalent spec file.**
- **Persona A–F undefined in prose.** Only one-line Korean comments in `career-profile.ts:6-12`.
- **"7대 기능" referenced in README.md:64 and CLAUDE.md but never enumerated.** Which 7 of the 13 `DocumentType`s? Mapping to S6–S16 sprints is missing.
- **`KillerClass` (필살기/빌살기/밉살기) is undocumented** — the most differentiated concept in the repo has no spec.
- **`EngineId` (G/S/L/AB/AD) is undocumented** — five engines, zero rubric for selection.
- **No competitive analysis** — Wanted, Saramin, LinkedIn, Notion, ChatGPT all uncited.
- **No demand evidence** — zero user interviews, waitlist data, or fake-door tests referenced.
- **No wedge statement** — 13 document types listed flat, no "ship this first" marker.
- **No ICP** — `salary_floor_krw` and `salary_floor_usd` (`career-profile.ts:27-28`) imply an ICP exists but it is not written down.
- **No "why now" thesis** — the 2026 timing is asserted, not justified.

## Recommended fixes

| Severity | Fix | Type | Owner |
|---|---|---|---|
| blocker | Define Persona A–F in prose (1 page each, JTBD + day-in-life + WTP) | report-only | user |
| blocker | Declare the narrowest wedge (recommend: `cover_letter` × Persona B) and write `docs/product/01-wedge.md` | report-only | user |
| blocker | Write `docs/product/00-demand.md` with ≥8 user-interview notes before S2 ships Auth | report-only | user |
| major | Enumerate "7대 기능" — which 7 of 13 `DocumentType`s, mapped to S6–S16 sprints | report-only | user |
| major | Document `KillerClass` rubric in `docs/product/02-killer-class.md` (with 10 worked examples) | report-only | user |
| major | Document `EngineId` rubric in `docs/product/03-engines.md` (when each engine fires, why) | report-only | user |
| major | Write `docs/product/04-thesis.md` with "why now" + 2 cited enablers | report-only | user |
| major | Competitive analysis vs Wanted, Saramin, LinkedIn, Notion-template, ChatGPT-direct (one table) | report-only | user |
| minor | Cross-link `docs/product/*` from README.md "Layout" section | report-only | user |
| minor | Add prose docstring to Persona enum in `career-profile.ts` linking to persona cards | fix-now | user |

## Decision queue (handoff to user)

- [ ] Confirm wedge: is it `cover_letter × Persona B`, or another pair? If team disagrees, what's the alternative and why?
- [ ] Confirm "7대 기능" identity — which 7 `DocumentType`s? Document the answer; do not leave it tribal.
- [ ] Decide whether demand evidence (user interviews) is a hard gate before S2 Auth ships, or runs in parallel.
- [ ] Decide whether `KillerClass` and `EngineId` rubrics are public spec or proprietary — either way, write them down internally.
- [ ] Decide on the "why now" thesis — pick 2 enablers from the candidate list, kill the rest.
- [ ] Decide whether Persona A, C, D, E, F are deferred until post-PMF or are co-tier-1 with B (recommend: deferred).
