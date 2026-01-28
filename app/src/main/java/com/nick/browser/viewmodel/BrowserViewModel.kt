package com.nick.browser.viewmodel

import android.content.Context
import android.webkit.CookieManager
import android.webkit.WebStorage
import android.webkit.WebView
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class BrowserViewModel : ViewModel() {
    private val _url = MutableLiveData<String>()
    val url: LiveData<String> = _url

    private val _incognito = MutableLiveData(false)
    val incognito: LiveData<Boolean> = _incognito

    private val _desktopMode = MutableLiveData(false)
    val desktopModeLive: LiveData<Boolean> = _desktopMode

    val tabs = mutableListOf("https://github.com")
    var currentWebView: WebView? = null

    val isIncognito get() = _incognito.value == true
    val desktopMode get() = _desktopMode.value == true

    fun loadUrl(url: String) {
        _url.value = url
    }

    fun addTab() {
        tabs.add("https://duckduckgo.com")
    }

    fun setIncognito(value: Boolean) {
        _incognito.value = value
    }

    fun setDesktopMode(value: Boolean) {
        _desktopMode.value = value
    }

    fun clearData(context: Context) {
        CookieManager.getInstance().removeAllCookies(null)
        CookieManager.getInstance().flush()
        WebStorage.getInstance().deleteAllData()
        context.cacheDir.deleteRecursively()
        context.filesDir.deleteRecursively()
    }

    fun userAgent(desktop: Boolean): String {
        return if (desktop) {
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        } else {
            "Mozilla/5.0 (Linux; Android 14; Pixel) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        }
    }
}
