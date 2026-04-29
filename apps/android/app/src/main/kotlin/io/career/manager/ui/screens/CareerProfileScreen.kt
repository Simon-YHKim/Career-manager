package io.career.manager.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import io.career.manager.ui.theme.LocalStageColors
import io.career.manager.ui.theme.Stage
import io.career.manager.ui.theme.StagePalette
import io.career.manager.ui.theme.paletteFor

@Composable
fun CareerProfileScreen() {
    Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
        LazyVerticalGrid(
            columns = GridCells.Adaptive(minSize = 280.dp),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize(),
        ) {
            item(span = { GridItemSpan(maxLineSpan) }) {
                Header()
            }
            items(Stage.entries) { stage ->
                val palette = LocalStageColors.current.paletteFor(stage)
                StageSwatchCard(stage = stage, palette = palette)
            }
        }
    }
}

@Composable
private fun Header() {
    Column(modifier = Modifier.padding(bottom = 8.dp)) {
        Text(
            text = stringResource(R.string.landing_kicker),
            style = MaterialTheme.typography.labelMedium,
            color = LocalStageColors.current.resume.s700,
        )
        Spacer(Modifier.height(4.dp))
        Text(
            text = stringResource(R.string.landing_title),
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
        )
        Spacer(Modifier.height(4.dp))
        Text(
            text = stringResource(R.string.landing_subtitle),
            style = MaterialTheme.typography.bodyMedium,
            color = LocalStageColors.current.resume.s700,
        )
        Spacer(Modifier.height(16.dp))
        Text(
            text = stringResource(R.string.landing_section_title),
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold,
        )
    }
}

@Composable
private fun StageSwatchCard(stage: Stage, palette: StagePalette) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surface),
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(96.dp)
                .background(palette.s500),
            contentAlignment = Alignment.BottomStart,
        ) {
            Text(
                text = stage.displayKo,
                style = MaterialTheme.typography.labelMedium,
                color = palette.s900,
                modifier = Modifier
                    .padding(12.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(Color.White.copy(alpha = 0.85f))
                    .padding(horizontal = 8.dp, vertical = 4.dp),
            )
        }
        Row(modifier = Modifier.fillMaxWidth().height(40.dp)) {
            ShadeChip(palette.s50, "50", textColor = Color(0xFF0B0F17), modifier = Modifier.weight(1f))
            ShadeChip(palette.s100, "100", textColor = Color(0xFF0B0F17), modifier = Modifier.weight(1f))
            ShadeChip(palette.s500, "500", textColor = Color.White, modifier = Modifier.weight(1f))
            ShadeChip(palette.s700, "700", textColor = Color.White, modifier = Modifier.weight(1f))
            ShadeChip(palette.s900, "900", textColor = Color.White, modifier = Modifier.weight(1f))
        }
    }
}

@Composable
private fun RowScope.ShadeChip(
    color: Color,
    label: String,
    textColor: Color,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier
            .fillMaxHeight()
            .background(color),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = textColor,
        )
    }
}
