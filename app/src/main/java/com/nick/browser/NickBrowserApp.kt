package com.nick.browser

import android.app.Application
import android.webkit.CookieManager
import android.webkit.WebView

class NickBrowserApp : Application() {
    override fun onCreate() {
        super.onCreate()
        WebView.setWebContentsDebuggingEnabled(false)
        CookieManager.getInstance().setAcceptThirdPartyCookies(null, false)
    }
}
