package com.nick.browser.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import com.nick.browser.databinding.ActivityAboutBinding

class AboutActivity : ComponentActivity() {
    private lateinit var binding: ActivityAboutBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAboutBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }
}
