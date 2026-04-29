package io.career.manager.ui.theme

/**
 * Mirror of `apps/web/lib/stages-config.ts` — keeps the Android landing
 * layout in sync with the Web's category grouping. Update both when the
 * taxonomy shifts.
 */

enum class CategoryId { Foundation, Artifacts, Interview }

data class StageCategory(
    val id: CategoryId,
    val title: String,
    val subtitle: String,
    val description: String,
    /** Stage whose 5-shade palette is reused as the category's hue. */
    val anchor: Stage,
    /** Stages in journey order — earliest first, deepest shade last. */
    val stages: List<Stage>,
)

val Categories: List<StageCategory> = listOf(
    StageCategory(
        id = CategoryId.Foundation,
        title = "기반",
        subtitle = "Foundation",
        description = "자기 자신을 정리하는 단계 — 커리어 프로필 · 경험 정리 · 누적 메모리.",
        anchor = Stage.Experience,
        stages = listOf(Stage.Profile, Stage.Experience, Stage.Memory),
    ),
    StageCategory(
        id = CategoryId.Artifacts,
        title = "자료",
        subtitle = "Artifacts",
        description = "지원에 사용하는 문서들 — 이력서부터 포트폴리오까지.",
        anchor = Stage.Career,
        stages = listOf(Stage.Resume, Stage.Career, Stage.Essay, Stage.Portfolio),
    ),
    StageCategory(
        id = CategoryId.Interview,
        title = "면접",
        subtitle = "Interview",
        description = "코칭 → 평가 → 협상까지, 면접 사이클 전체.",
        anchor = Stage.InterviewCoaching,
        stages = listOf(Stage.InterviewCoaching, Stage.InterviewEvaluation, Stage.Salary),
    ),
)

data class QuickAccess(
    val stage: Stage,
    val title: String,
    val tagline: String,
    val description: String,
)

val QuickAccessItems: List<QuickAccess> = listOf(
    QuickAccess(
        stage = Stage.Todo,
        title = "할 일",
        tagline = "채용 일정 + 리마인더",
        description = "지원한 공고의 마감·면접·결과 발표 일정을 한 곳에서. " +
            "캘린더 · 리마인더 · 알람으로 놓치지 않게 관리합니다.",
    ),
    QuickAccess(
        stage = Stage.Blog,
        title = "블로그",
        tagline = "취업에 도움되는 글",
        description = "이력서 · 자소서 · 면접 · 협상까지 — 실전 사례와 가이드를 " +
            "읽으며 다음 단계를 준비합니다.",
    ),
)

/** Shade index by category size. Returns one of {s50, s100, s500, s700, s900}. */
fun shadeForPosition(
    palette: StagePalette,
    position: Int,
    total: Int,
): androidx.compose.ui.graphics.Color = when (total) {
    2 -> when (position) {
        0 -> palette.s500
        else -> palette.s900
    }
    3 -> when (position) {
        0 -> palette.s100
        1 -> palette.s500
        else -> palette.s900
    }
    4 -> when (position) {
        0 -> palette.s100
        1 -> palette.s500
        2 -> palette.s700
        else -> palette.s900
    }
    else -> palette.s500
}

/**
 * Foreground (text) color appropriate for a given background shade —
 * mirrors Web's `isLight ? palette["900"] : palette["50"]` logic.
 */
fun foregroundForShade(
    palette: StagePalette,
    bg: androidx.compose.ui.graphics.Color,
): androidx.compose.ui.graphics.Color =
    if (bg == palette.s50 || bg == palette.s100) palette.s900 else palette.s50
