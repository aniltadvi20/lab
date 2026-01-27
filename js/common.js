/**
 * Bug Bounty Frontend Lab - Common JavaScript Utilities
 * Reusable functions for all lab pages
 */

// Create and insert warning banner
function createWarningBanner() {
    const banner = document.createElement('div');
    banner.className = 'warning-banner';
    banner.innerHTML = '⚠️ FOR EDUCATIONAL PURPOSES ONLY - DO NOT USE ON REAL SYSTEMS ⚠️';
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(banner, container.firstChild);
}

// Create breadcrumb navigation
function createBreadcrumb(items) {
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb';
    
    const html = items.map((item, index) => {
        if (index === items.length - 1) {
            return `<span>${item.text}</span>`;
        }
        return `<a href="${item.url}">${item.text}</a><span>/</span>`;
    }).join('');
    
    breadcrumb.innerHTML = html;
    
    const container = document.querySelector('.container') || document.body;
    const warning = document.querySelector('.warning-banner');
    if (warning) {
        warning.after(breadcrumb);
    } else {
        container.insertBefore(breadcrumb, container.firstChild);
    }
}

// Escape HTML to prevent XSS (for showing safe examples)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Show notification message
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `status-message ${type} fade-in`;
    notification.textContent = message;
    
    const container = document.querySelector('.lab-section') || document.querySelector('.container');
    container.insertBefore(notification, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Reset form inputs in a container
function resetForm(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const inputs = container.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], input[type="number"], textarea');
    inputs.forEach(input => input.value = '');
    
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
}

// Clear output areas
function clearOutput(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
        element.className = element.className.replace(/success|error/g, '').trim();
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
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
            showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        document.body.removeChild(textarea);
    }
}

// Format timestamp
function formatTimestamp() {
    const now = new Date();
    return now.toLocaleString();
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Add fade-in animation to elements
function addFadeIn(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        setTimeout(() => {
            element.classList.add('fade-in');
            element.style.opacity = '1';
        }, index * 100);
    });
}

// Create loading spinner
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading"></div> Loading...';
    }
}

// Initialize common features on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add warning banner if not on home page
    if (!document.body.classList.contains('home-page')) {
        createWarningBanner();
    }
    
    // Add fade-in animation to lab sections
    addFadeIn('.lab-section');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press Escape to clear all outputs
        if (e.key === 'Escape') {
            const outputs = document.querySelectorAll('.output-area, .display-area, .result-area');
            outputs.forEach(output => {
                if (output.id) clearOutput(output.id);
            });
        }
    });
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createWarningBanner,
        createBreadcrumb,
        escapeHtml,
        showNotification,
        resetForm,
        clearOutput,
        copyToClipboard,
        formatTimestamp,
        scrollToElement,
        addFadeIn,
        showLoading
    };
}
