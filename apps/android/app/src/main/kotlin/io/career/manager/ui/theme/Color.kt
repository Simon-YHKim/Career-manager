package io.career.manager.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

/**
 * Per-stage shade palette mirroring `@career/design-tokens.stages`.
 *
 * Source of truth lives in `packages/design-tokens/src/stages.ts`. Keep
 * the hex values in sync until codegen replaces this file in a later
 * sprint. The order of shades (50, 100, 500, 700, 900) is intentional.
 */
@Immutable
data class StagePalette(
    val s50: Color,
    val s100: Color,
    val s500: Color,
    val s700: Color,
    val s900: Color,
)

@Immutable
data class StageColors(
    val profile: StagePalette,
    val experience: StagePalette,
    val career: StagePalette,
    val essay: StagePalette,
    val resume: StagePalette,
    val portfolio: StagePalette,
    val interviewCoaching: StagePalette,
    val interviewEvaluation: StagePalette,
    val salary: StagePalette,
    val todo: StagePalette,
    val memory: StagePalette,
    val blog: StagePalette,
)

val LightStageColors = StageColors(
    profile = StagePalette(
        s50 = Color(0xFFF3E5F5),
        s100 = Color(0xFFE1BEE7),
        s500 = Color(0xFF7E57C2),
        s700 = Color(0xFF5E35B1),
        s900 = Color(0xFF311B92),
    ),
    experience = StagePalette(
        s50 = Color(0xFFFFEBE2),
        s100 = Color(0xFFFFCBB3),
        s500 = Color(0xFFD55E00),
        s700 = Color(0xFFA14600),
        s900 = Color(0xFF5C2700),
    ),
    career = StagePalette(
        s50 = Color(0xFFE0F5EE),
        s100 = Color(0xFFA8E5CF),
        s500 = Color(0xFF009E73),
        s700 = Color(0xFF006C4E),
        s900 = Color(0xFF003B2A),
    ),
    essay = StagePalette(
        s50 = Color(0xFFE1F0FA),
        s100 = Color(0xFFB0D8F0),
        s500 = Color(0xFF0072B2),
        s700 = Color(0xFF004F7C),
        s900 = Color(0xFF002A43),
    ),
    resume = StagePalette(
        s50 = Color(0xFFECEFF1),
        s100 = Color(0xFFCFD8DC),
        s500 = Color(0xFF5D6D7E),
        s700 = Color(0xFF37474F),
        s900 = Color(0xFF102027),
    ),
    portfolio = StagePalette(
        s50 = Color(0xFFFFFDE7),
        s100 = Color(0xFFFFF59D),
        s500 = Color(0xFFF0E442),
        s700 = Color(0xFFB8AC22),
        s900 = Color(0xFF605700),
    ),
    interviewCoaching = StagePalette(
        s50 = Color(0xFFE3F4FC),
        s100 = Color(0xFFB2E0F4),
        s500 = Color(0xFF56B4E9),
        s700 = Color(0xFF1976A1),
        s900 = Color(0xFF003F5E),
    ),
    interviewEvaluation = StagePalette(
        s50 = Color(0xFFE8EAEF),
        s100 = Color(0xFFB5BCC9),
        s500 = Color(0xFF1F2A3D),
        s700 = Color(0xFF101724),
        s900 = Color(0xFF05080F),
    ),
    salary = StagePalette(
        s50 = Color(0xFFFFF8E1),
        s100 = Color(0xFFFFE082),
        s500 = Color(0xFFB8860B),
        s700 = Color(0xFF7E5C00),
        s900 = Color(0xFF3D2C00),
    ),
    todo = StagePalette(
        s50 = Color(0xFFFFF4E0),
        s100 = Color(0xFFFFD9A8),
        s500 = Color(0xFFE69F00),
        s700 = Color(0xFFA36F00),
        s900 = Color(0xFF5C3F00),
    ),
    memory = StagePalette(
        s50 = Color(0xFFEDE7F6),
        s100 = Color(0xFFD1C4E9),
        s500 = Color(0xFFB39DDB),
        s700 = Color(0xFF7E57C2),
        s900 = Color(0xFF311B92),
    ),
    blog = StagePalette(
        s50 = Color(0xFFE8EAF6),
        s100 = Color(0xFF9FA8DA),
        s500 = Color(0xFF3F51B5),
        s700 = Color(0xFF283593),
        s900 = Color(0xFF0F1648),
    ),
)

val LocalStageColors = staticCompositionLocalOf { LightStageColors }
