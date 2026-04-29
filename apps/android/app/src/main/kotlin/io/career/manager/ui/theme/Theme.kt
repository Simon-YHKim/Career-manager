package io.career.manager.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider

private val LightColors = lightColorScheme(
    primary = LightStageColors.essay.s700,
    onPrimary = LightStageColors.essay.s50,
    secondary = LightStageColors.career.s700,
    onSecondary = LightStageColors.career.s50,
)

private val DarkColors = darkColorScheme(
    primary = LightStageColors.essay.s100,
    onPrimary = LightStageColors.essay.s900,
    secondary = LightStageColors.career.s100,
    onSecondary = LightStageColors.career.s900,
)

@Composable
fun CareerManagerTheme(
    useDarkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    CompositionLocalProvider(LocalStageColors provides LightStageColors) {
        MaterialTheme(
            colorScheme = if (useDarkTheme) DarkColors else LightColors,
            content = content,
        )
    }
}
