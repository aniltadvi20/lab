package com.nick.browser.ui

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.inputmethod.EditorInfo
import android.webkit.CookieManager
import android.webkit.DownloadListener
import android.webkit.MimeTypeMap
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.view.isVisible
import androidx.lifecycle.ViewModelProvider
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.google.android.material.snackbar.Snackbar
import com.nick.browser.databinding.ActivityMainBinding
import com.nick.browser.viewmodel.BrowserViewModel

class MainActivity : ComponentActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var viewModel: BrowserViewModel
    private var fileChooserCallback: android.webkit.ValueCallback<Array<Uri>>? = null

    private val filePicker = registerForActivityResult(ActivityResultContracts.OpenMultipleDocuments()) { uris ->
        fileChooserCallback?.onReceiveValue(uris?.toTypedArray())
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)

        viewModel = ViewModelProvider(this)[BrowserViewModel::class.java]

        setupWebView(viewModel.isIncognito)
        setupUi()
        bindViewModel()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView(incognito: Boolean) {
        val webView = WebView(this)
        val params = SwipeRefreshLayout.LayoutParams(
            SwipeRefreshLayout.LayoutParams.MATCH_PARENT,
            SwipeRefreshLayout.LayoutParams.MATCH_PARENT
        )
        webView.layoutParams = params
        binding.webContainer.removeAllViews()
        binding.webContainer.addView(webView)

        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.userAgentString = viewModel.userAgent(desktop = viewModel.desktopMode)
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
        settings.setSupportZoom(true)
        settings.builtInZoomControls = true
        settings.displayZoomControls = false
        settings.mediaPlaybackRequiresUserGesture = false
        settings.allowFileAccess = false
        settings.allowContentAccess = false

        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false)

        if (incognito) {
            webView.settings.cacheMode = WebSettings.LOAD_NO_CACHE
            webView.clearCache(true)
            webView.clearHistory()
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                val target = url ?: return false
                if (target.startsWith("http")) return false
                try {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(target)))
                    return true
                } catch (_: Exception) {
                    return false
                }
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                binding.progress.isVisible = true
                binding.urlInput.setText(url)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                binding.progress.isVisible = false
                binding.swipeRefresh.isRefreshing = false
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                binding.progress.progress = newProgress
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: android.webkit.ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileChooserCallback = filePathCallback
                filePicker.launch(arrayOf("*/*"))
                return true
            }
        }

        webView.setDownloadListener(DownloadListener { url, userAgent, contentDisposition, mimeType, contentLength ->
            val filename = contentDisposition.substringAfter("filename=", "download.bin").replace("\"", "")
            val request = android.app.DownloadManager.Request(Uri.parse(url)).apply {
                setMimeType(mimeType ?: MimeTypeMap.getFileExtensionFromUrl(url))
                addRequestHeader("User-Agent", userAgent)
                setNotificationVisibility(android.app.DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                setDestinationInExternalPublicDir(android.os.Environment.DIRECTORY_DOWNLOADS, filename)
                allowScanningByMediaScanner()
            }
            try {
                val dm = getSystemService(DOWNLOAD_SERVICE) as android.app.DownloadManager
                dm.enqueue(request)
                Snackbar.make(binding.root, "Downloading $filename", Snackbar.LENGTH_SHORT).show()
            } catch (e: SecurityException) {
                Snackbar.make(binding.root, "Download failed", Snackbar.LENGTH_SHORT).show()
            }
        })

        binding.swipeRefresh.setOnRefreshListener { webView.reload() }
        viewModel.currentWebView = webView
    }

    private fun bindViewModel() {
        viewModel.url.observe(this) { url ->
            viewModel.currentWebView?.loadUrl(url)
        }

        viewModel.incognito.observe(this) {
            setupWebView(it)
        }

        viewModel.desktopModeLive.observe(this) {
            viewModel.currentWebView?.settings?.userAgentString = viewModel.userAgent(desktop = it)
        }
    }

    private fun setupUi() {
        binding.urlInput.setOnEditorActionListener { v, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_GO) {
                loadInput(v.text.toString())
                true
            } else false
        }

        binding.incognitoSwitch.setOnCheckedChangeListener { _, isChecked ->
            viewModel.setIncognito(isChecked)
            if (isChecked) {
                window.setFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE, android.view.WindowManager.LayoutParams.FLAG_SECURE)
            } else {
                window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_SECURE)
            }
        }

        binding.desktopToggle.setOnClickListener {
            viewModel.setDesktopMode(!viewModel.desktopMode)
            Snackbar.make(binding.root, "Desktop mode ${if (viewModel.desktopMode) "on" else "off"}", Snackbar.LENGTH_SHORT).show()
        }

        binding.backButton.setOnClickListener { viewModel.currentWebView?.goBack() }
        binding.forwardButton.setOnClickListener { viewModel.currentWebView?.goForward() }
        binding.urlInputLayout.setEndIconOnClickListener { viewModel.currentWebView?.reload() }

        binding.addTabButton.setOnClickListener {
            viewModel.addTab()
            setupWebView(viewModel.isIncognito)
            viewModel.loadUrl(viewModel.tabs.last())
        }
    }

    private fun loadInput(input: String) {
        val url = if (input.contains('.')) {
            if (input.startsWith("http")) input else "https://$input"
        } else {
            "https://duckduckgo.com/?q=" + Uri.encode(input)
        }
        viewModel.loadUrl(url)
    }
}
