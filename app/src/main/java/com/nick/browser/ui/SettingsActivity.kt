package com.nick.browser.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import com.nick.browser.databinding.ActivitySettingsBinding
import com.nick.browser.viewmodel.BrowserViewModel

class SettingsActivity : ComponentActivity() {
    private lateinit var binding: ActivitySettingsBinding
    private val viewModel: BrowserViewModel by lazy { BrowserViewModel() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.incognitoSwitch.isChecked = viewModel.isIncognito
        binding.desktopSwitch.isChecked = viewModel.desktopMode

        binding.incognitoSwitch.setOnCheckedChangeListener { _, isChecked -> viewModel.setIncognito(isChecked) }
        binding.desktopSwitch.setOnCheckedChangeListener { _, isChecked -> viewModel.setDesktopMode(isChecked) }
        binding.clearDataButton.setOnClickListener { viewModel.clearData(this) }
    }
}
