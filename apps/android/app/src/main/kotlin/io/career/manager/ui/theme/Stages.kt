package io.career.manager.ui.theme

/**
 * Twelve stage keys mirrored from `@career/design-tokens.stageKeys`.
 * Used to drive a uniform iteration over the palette without hardcoding
 * order at every UI call site.
 */
enum class Stage(val displayKo: String, val displayEn: String) {
    Profile("Career Profile", "Career Profile"),
    Experience("경험 정리", "Experience"),
    Career("경력기술서", "Career Description"),
    Essay("자소서", "Cover Letter"),
    Resume("이력서", "Resume"),
    Portfolio("포트폴리오", "Portfolio"),
    InterviewCoaching("모의면접 (코칭)", "Mock Interview (Coaching)"),
    InterviewEvaluation("모의면접 (평가)", "Mock Interview (Evaluation)"),
    Salary("연봉 협상", "Salary Negotiation"),
    Todo("할 일", "To-do"),
    Memory("메모리", "Memory"),
    Blog("블로그", "Blog"),
}

fun StageColors.paletteFor(stage: Stage): StagePalette = when (stage) {
    Stage.Profile -> profile
    Stage.Experience -> experience
    Stage.Career -> career
    Stage.Essay -> essay
    Stage.Resume -> resume
    Stage.Portfolio -> portfolio
    Stage.InterviewCoaching -> interviewCoaching
    Stage.InterviewEvaluation -> interviewEvaluation
    Stage.Salary -> salary
    Stage.Todo -> todo
    Stage.Memory -> memory
    Stage.Blog -> blog
}
