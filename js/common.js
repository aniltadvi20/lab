/**
 * Bug Bounty Frontend Lab - Common JavaScript Utilities
 * Reusable functions for all lab pages
 */

// Create and inject warning banner
function createWarningBanner() {
    const banner = document.createElement('div');
    banner.className = 'warning-banner';
    banner.innerHTML = `
        <span class="emoji">⚠️</span>
        <strong>FOR EDUCATIONAL PURPOSES ONLY</strong>
        <span class="emoji">⚠️</span>
        <br>
        <small>These labs demonstrate real vulnerabilities. NEVER test these techniques on websites you don't own.</small>
    `;
    
    const container = document.querySelector('.container, .lab-container');
    if (container) {
        container.insertBefore(banner, container.firstChild);
    }
}

// Create header with navigation
function createHeader(title = 'Bug Bounty Frontend Lab', showBreadcrumb = false, breadcrumbPath = []) {
    const header = document.createElement('header');
    
    let breadcrumbHTML = '';
    if (showBreadcrumb) {
        const crumbs = ['<a href="/index.html">🏠 Home</a>', ...breadcrumbPath];
        breadcrumbHTML = `<div class="breadcrumb">${crumbs.join(' / ')}</div>`;
    }
    
    header.innerHTML = `
        <div class="header-content">
            <a href="/index.html" class="logo">🎯 ${title}</a>
            ${breadcrumbHTML}
        </div>
    `;
    
    document.body.insertBefore(header, document.body.firstChild);
}

// Create footer with disclaimer
function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div class="footer-content">
            <div class="disclaimer">
                <strong>⚠️ IMPORTANT DISCLAIMER</strong>
                <p>This educational platform is designed for learning web security concepts in a safe environment.</p>
                <p><strong>Ethical Guidelines:</strong></p>
                <ul style="text-align: left; max-width: 600px; margin: 1rem auto;">
                    <li>🔒 Only test on systems you own or have explicit permission to test</li>
                    <li>🎓 Use this knowledge to build more secure applications</li>
                    <li>⚖️ Unauthorized testing is illegal and unethical</li>
                    <li>🤝 Always practice responsible disclosure</li>
                </ul>
            </div>
            <p>&copy; 2026 Bug Bounty Frontend Lab | Created for Educational Purposes</p>
        </div>
    `;
    
    document.body.appendChild(footer);
}

// Escape HTML to prevent XSS (for showing safe examples)
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Show status message
function showStatus(message, type = 'info', duration = 5000) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message status-${type} fade-in`;
    statusDiv.textContent = message;
    
    const container = document.querySelector('.container, .lab-container');
    if (container) {
        container.appendChild(statusDiv);
        
        if (duration > 0) {
            setTimeout(() => {
                statusDiv.style.transition = 'opacity 0.5s';
                statusDiv.style.opacity = '0';
                setTimeout(() => statusDiv.remove(), 500);
            }, duration);
        }
    }
    
    return statusDiv;
}

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showStatus('✅ Copied to clipboard!', 'success', 2000);
        }).catch(() => {
            showStatus('❌ Failed to copy', 'error', 2000);
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showStatus('✅ Copied to clipboard!', 'success', 2000);
        } catch (err) {
            showStatus('❌ Failed to copy', 'error', 2000);
        }
        
        document.body.removeChild(textarea);
    }
}

// Add keyboard shortcut for Enter key
function addEnterKeyListener(buttonId) {
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const button = document.getElementById(buttonId);
            if (button && !button.disabled) {
                button.click();
            }
        }
    });
}

// Format timestamp
function formatTimestamp() {
    const now = new Date();
    return now.toLocaleString();
}

// Add smooth scroll behavior
function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Create a copy button for code blocks
function addCopyButtons() {
    document.querySelectorAll('pre code, .payload-example').forEach((block) => {
        const button = document.createElement('button');
        button.className = 'btn-small';
        button.textContent = '📋 Copy';
        button.style.float = 'right';
        button.style.marginTop = '-0.5rem';
        
        button.addEventListener('click', () => {
            copyToClipboard(block.textContent);
        });
        
        if (block.parentElement.tagName === 'PRE') {
            block.parentElement.insertBefore(button, block);
        } else {
            block.insertBefore(button, block.firstChild);
        }
    });
}

// Highlight SQL injection patterns
function highlightSQLInjection(query) {
    // Highlight SQL keywords
    let highlighted = query.replace(/\b(SELECT|FROM|WHERE|AND|OR|UNION|DROP|TABLE|INSERT|DELETE|UPDATE)\b/gi, 
        '<span class="sql-keyword">$1</span>');
    
    // Highlight strings
    highlighted = highlighted.replace(/'([^']*)'/g, '<span class="sql-string">\'$1\'</span>');
    
    // Highlight injection patterns
    const injectionPatterns = [
        /('.*?OR.*?'.*?'.*?')/gi,
        /('.*?OR.*?1.*?=.*?1)/gi,
        /('.*?--)/gi,
        /(UNION.*?SELECT)/gi,
        /(DROP.*?TABLE)/gi
    ];
    
    injectionPatterns.forEach(pattern => {
        highlighted = highlighted.replace(pattern, '<span class="sql-injection">$1</span>');
    });
    
    return highlighted;
}

// Detect SQL injection attempts
function detectSQLInjection(input) {
    const patterns = [
        { pattern: /'.*?OR.*?'.*?'.*?'/i, description: "OR-based authentication bypass" },
        { pattern: /'.*?OR.*?1.*?=.*?1/i, description: "OR 1=1 always-true condition" },
        { pattern: /'.*?--/i, description: "SQL comment injection" },
        { pattern: /admin'.*?--/i, description: "Admin bypass with comment" },
        { pattern: /UNION.*?SELECT/i, description: "UNION-based injection" },
        { pattern: /DROP.*?TABLE/i, description: "Destructive DROP TABLE injection" },
        { pattern: /;.*?(DROP|DELETE|UPDATE|INSERT)/i, description: "Stacked query injection" }
    ];
    
    for (let item of patterns) {
        if (item.pattern.test(input)) {
            return {
                detected: true,
                description: item.description,
                pattern: item.pattern
            };
        }
    }
    
    return { detected: false };
}

// Create countdown timer
function createCountdownTimer(seconds, onComplete) {
    let remaining = seconds;
    const timerElement = document.createElement('div');
    timerElement.className = 'timer';
    timerElement.textContent = `⏱️ Cooldown: ${remaining}s`;
    
    const interval = setInterval(() => {
        remaining--;
        timerElement.textContent = `⏱️ Cooldown: ${remaining}s`;
        
        if (remaining <= 0) {
            clearInterval(interval);
            if (onComplete) {
                onComplete();
            }
        }
    }, 1000);
    
    return { element: timerElement, interval: interval };
}

// Initialize common features
function initializePage() {
    createWarningBanner();
    createFooter();
    enableSmoothScroll();
    
    // Add fade-in animation to main content
    const container = document.querySelector('.container, .lab-container');
    if (container) {
        container.classList.add('fade-in');
    }
}

// Safe DOM manipulation (alternative to innerHTML)
function setSafeText(element, text) {
    element.textContent = text;
}

function setSafeHTML(element, html) {
    // Note: In a real application, use DOMPurify library
    // This is a basic example for demonstration
    element.textContent = html; // Safer alternative to innerHTML
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createWarningBanner,
        createHeader,
        createFooter,
        escapeHTML,
        showStatus,
        copyToClipboard,
        addEnterKeyListener,
        formatTimestamp,
        enableSmoothScroll,
        addCopyButtons,
        highlightSQLInjection,
        detectSQLInjection,
        createCountdownTimer,
        initializePage,
        setSafeText,
        setSafeHTML
    };
}
