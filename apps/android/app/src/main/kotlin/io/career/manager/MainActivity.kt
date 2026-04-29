package io.career.manager

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import io.career.manager.ui.screens.CareerProfileScreen
import io.career.manager.ui.theme.CareerManagerTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CareerManagerTheme {
                CareerProfileScreen()
            }
        }
    }
}
