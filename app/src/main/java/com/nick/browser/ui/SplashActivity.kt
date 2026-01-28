package com.nick.browser.ui

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import com.nick.browser.databinding.ActivitySplashBinding
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class SplashActivity : ComponentActivity() {
    private lateinit var binding: ActivitySplashBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)

        lifecycleScope.launch {
            delay(1200)
            startActivity(Intent(this@SplashActivity, MainActivity::class.java))
            finish()
        }
    }
}
