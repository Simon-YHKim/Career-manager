package io.career.manager.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import io.career.manager.R
import io.career.manager.ui.theme.Categories
import io.career.manager.ui.theme.LocalStageColors
import io.career.manager.ui.theme.QuickAccess
import io.career.manager.ui.theme.QuickAccessItems
import io.career.manager.ui.theme.Stage
import io.career.manager.ui.theme.StageCategory
import io.career.manager.ui.theme.StagePalette
import io.career.manager.ui.theme.foregroundForShade
import io.career.manager.ui.theme.paletteFor
import io.career.manager.ui.theme.shadeForPosition

@Composable
fun CareerProfileScreen() {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background,
    ) {
        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp),
            modifier = Modifier.fillMaxSize(),
        ) {
            item { Header() }
            item { QuickAccessRow() }
            items(Categories) { category -> CategorySection(category) }
        }
    }
}

@Composable
private fun Header() {
    val resume = LocalStageColors.current.resume
    Column {
        Text(
            text = stringResource(R.string.landing_kicker),
            style = MaterialTheme.typography.labelMedium,
            color = resume.s700,
        )
        Spacer(Modifier.height(4.dp))
        Text(
            text = stringResource(R.string.landing_title),
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = stringResource(R.string.landing_subtitle),
            style = MaterialTheme.typography.bodyMedium,
            color = resume.s700,
        )
    }
}

@Composable
private fun QuickAccessRow() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        QuickAccessItems.forEach { item ->
            QuickAccessCard(item, modifier = Modifier.weight(1f))
        }
    }
}

@Composable
private fun RowScope.QuickAccessCard(item: QuickAccess, modifier: Modifier = Modifier) {
    val palette = LocalStageColors.current.paletteFor(item.stage)
    val resume = LocalStageColors.current.resume
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(Color.White)
            .border(1.dp, Color.Black.copy(alpha = 0.1f), RoundedCornerShape(16.dp))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = item.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = palette.s900,
            )
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(999.dp))
                    .background(palette.s100)
                    .padding(horizontal = 8.dp, vertical = 2.dp),
            ) {
                Text(
                    text = item.tagline,
                    style = MaterialTheme.typography.labelSmall,
                    color = palette.s900,
                )
            }
        }
        Text(
            text = item.description,
            style = MaterialTheme.typography.bodySmall,
            color = resume.s700,
        )
        Spacer(Modifier.height(4.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(4.dp)
                .clip(RoundedCornerShape(2.dp))
                .background(palette.s500),
        )
    }
}

@Composable
private fun CategorySection(category: StageCategory) {
    val anchor = LocalStageColors.current.paletteFor(category.anchor)
    val resume = LocalStageColors.current.resume
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text(
                text = category.title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold,
            )
            Text(
                text = category.subtitle.uppercase(),
                style = MaterialTheme.typography.labelSmall,
                color = anchor.s700,
            )
        }
        Text(
            text = category.description,
            style = MaterialTheme.typography.bodySmall,
            color = resume.s700,
        )
        StageCardRow(category, anchor)
    }
}

@Composable
private fun StageCardRow(category: StageCategory, anchor: StagePalette) {
    val total = category.stages.size
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        category.stages.forEachIndexed { i, stage ->
            val bg = shadeForPosition(anchor, i, total)
            val fg = foregroundForShade(anchor, bg)
            CategoryCard(
                stage = stage,
                bg = bg,
                fg = fg,
                modifier = Modifier.weight(1f),
            )
        }
    }
}

@Composable
private fun RowScope.CategoryCard(
    stage: Stage,
    bg: Color,
    fg: Color,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .height(112.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(bg)
            .border(1.dp, Color.Black.copy(alpha = 0.1f), RoundedCornerShape(12.dp))
            .padding(12.dp),
        verticalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(
            text = stage.name.lowercase(),
            style = MaterialTheme.typography.labelSmall,
            color = fg.copy(alpha = 0.7f),
        )
        Column {
            Text(
                text = stage.displayKo,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                color = fg,
            )
            Text(
                text = stage.displayEn,
                style = MaterialTheme.typography.labelSmall,
                color = fg.copy(alpha = 0.7f),
            )
        }
    }
}
