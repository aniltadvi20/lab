// Bug Bounty Frontend Lab - Common JavaScript Utilities
// Kept for backward compatibility with existing lab pages

/**
 * Create breadcrumb navigation
 * @param {Array} items - Array of {text, href} objects
 */
function createBreadcrumb(items) {
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb';
    
    items.forEach((item, index) => {
        if (index > 0) {
            const separator = document.createElement('span');
            separator.textContent = '>';
            breadcrumb.appendChild(separator);
        }
        
        if (item.href) {
            const link = document.createElement('a');
            link.href = item.href;
            link.textContent = item.text;
            breadcrumb.appendChild(link);
        } else {
            const span = document.createElement('span');
            span.textContent = item.text;
            breadcrumb.appendChild(span);
        }
    });
    
    const container = document.querySelector('.container');
    if (container && container.firstChild) {
        container.insertBefore(breadcrumb, container.firstChild);
    }
}

/**
 * Escape HTML to prevent XSS (for educational display)
 * @param {string} html - HTML string to escape
 * @returns {string} - Escaped HTML
 */
function escapeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Message type: 'success', 'error', 'info'
 */
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    const outputArea = document.querySelector('.output-area');
    if (outputArea) {
        outputArea.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

/**
 * Clear output area
 */
function clearOutput() {
    const outputArea = document.querySelector('.output-area');
    if (outputArea) {
        outputArea.innerHTML = '<div class="output-title">Output:</div>';
    }
}

/**
 * Reset form inputs
 * @param {string} formId - Form element ID
 */
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
    clearOutput();
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showMessage('Copied to clipboard!', 'success');
        }).catch(() => {
            showMessage('Failed to copy to clipboard', 'error');
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
            showMessage('Copied to clipboard!', 'success');
        } catch (err) {
            showMessage('Failed to copy to clipboard', 'error');
        }
        document.body.removeChild(textarea);
    }
}

/**
 * Format timestamp
 * @returns {string} - Formatted timestamp
 */
function getTimestamp() {
    const now = new Date();
    return now.toLocaleString();
}

/**
 * Add Enter key submit handler
 * @param {string} inputId - Input element ID
 * @param {Function} callback - Function to call on Enter
 */
function addEnterKeyHandler(inputId, callback) {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                callback();
            }
        });
    }
}

/**
 * Create educational disclaimer (for lab pages)
 * @returns {HTMLElement} - Disclaimer element
 */
function createDisclaimer() {
    const disclaimer = document.createElement('div');
    disclaimer.className = 'info-box';
    disclaimer.innerHTML = `
        <h4>🔒 Educational Purpose</h4>
        <ul style="margin-left: 20px;">
            <li>These labs demonstrate vulnerabilities for learning purposes</li>
            <li>NEVER test these techniques on websites you don't own</li>
            <li>Always get written permission before testing</li>
            <li>Use this knowledge to build secure applications</li>
        </ul>
    `;
    return disclaimer;
}

/**
 * Highlight code syntax
 * @param {string} code - Code to highlight
 * @param {string} language - Language type
 * @returns {string} - Highlighted code HTML
 */
function highlightCode(code, language = 'javascript') {
    // Simple syntax highlighting for display
    let highlighted = escapeHtml(code);
    
    if (language === 'sql') {
        const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', 'TABLE'];
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlighted = highlighted.replace(regex, `<span class="sql-keyword">${keyword}</span>`);
        });
    }
    
    return highlighted;
}

/**
 * Validate input length
 * @param {string} input - Input to validate
 * @param {number} maxLength - Maximum length
 * @returns {boolean} - Validation result
 */
function validateInputLength(input, maxLength = 1000) {
    if (input.length > maxLength) {
        showMessage(`Input too long! Maximum ${maxLength} characters allowed.`, 'error');
        return false;
    }
    return true;
}

/**
 * Create tooltip
 * @param {string} text - Tooltip text
 * @param {string} content - Content to wrap
 * @returns {string} - HTML with tooltip
 */
function createTooltip(content, text) {
    return `
        <span class="tooltip">
            ${content}
            <span class="tooltiptext">${text}</span>
        </span>
    `;
}

/**
 * Initialize page with common elements (for lab pages)
 */
function initializePage() {
    // Add disclaimer at bottom if there's a container
    const container = document.querySelector('.container');
    if (container) {
        const disclaimer = createDisclaimer();
        container.appendChild(disclaimer);
    }
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', initializePage);
