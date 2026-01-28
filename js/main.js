// Bug Bounty Command Center - Main JavaScript

/**
 * Navigation Functionality
 */
function initializeNavigation() {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Highlight active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

/**
 * Copy to clipboard with visual feedback
 */
function copyToClipboard(text, button) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(button);
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text, button);
        });
    } else {
        fallbackCopy(text, button);
    }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback(button);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
    document.body.removeChild(textarea);
}

/**
 * Show copy success feedback
 */
function showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✓ Copied!';
    button.style.backgroundColor = 'var(--accent-green)';
    button.style.color = 'var(--bg-primary)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.style.color = '';
    }, 2000);
}

/**
 * Domain Variant Generator
 */
function generateDomainVariants() {
    const domainInput = document.getElementById('domain-input');
    const outputDiv = document.getElementById('domain-output');
    
    if (!domainInput || !outputDiv) return;
    
    const domain = domainInput.value.trim();
    
    if (!domain) {
        outputDiv.innerHTML = '<p style="color: var(--warning-red);">Please enter a domain name</p>';
        return;
    }
    
    // Remove protocol if present
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    const variants = [
        `https://${cleanDomain}`,
        `http://${cleanDomain}`,
        `https://www.${cleanDomain}`,
        `http://www.${cleanDomain}`,
        `https://api.${cleanDomain}`,
        `https://dev.${cleanDomain}`,
        `https://test.${cleanDomain}`,
        `https://staging.${cleanDomain}`,
        `https://admin.${cleanDomain}`,
        `https://m.${cleanDomain}`,
        `https://beta.${cleanDomain}`,
        `https://portal.${cleanDomain}`,
        `https://dashboard.${cleanDomain}`,
        `https://app.${cleanDomain}`
    ];
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="color: var(--accent-green); margin: 0;">Generated URLs (${variants.length})</h3>
            <button class="copy-icon-btn" onclick="copyAllVariants()">Copy All</button>
        </div>
    `;
    
    variants.forEach((url, index) => {
        html += `
            <div class="url-item">
                <span class="url-text">${url}</span>
                <button class="copy-icon-btn" onclick="copyToClipboard('${url}', this)">Copy</button>
            </div>
        `;
    });
    
    outputDiv.innerHTML = html;
}

/**
 * Copy all domain variants
 */
function copyAllVariants() {
    const urlItems = document.querySelectorAll('.url-text');
    const urls = Array.from(urlItems).map(item => item.textContent).join('\n');
    
    const button = event.target;
    copyToClipboard(urls, button);
}

/**
 * Bug Bounty Command Generator
 */
function generateCommands() {
    const domainInput = document.getElementById('command-domain-input');
    const outputDiv = document.getElementById('command-output');
    
    if (!domainInput || !outputDiv) return;
    
    const domain = domainInput.value.trim();
    
    if (!domain) {
        outputDiv.innerHTML = '<p style="color: var(--warning-red);">Please enter a domain name</p>';
        return;
    }
    
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    const commandSections = [
        {
            title: 'Subdomain Discovery',
            commands: [
                `subfinder -d ${cleanDomain} -all -recursive`,
                `assetfinder --subs-only ${cleanDomain}`,
                `amass enum -d ${cleanDomain}`
            ]
        },
        {
            title: 'HTTP Probing',
            commands: [
                `httpx -l subdomains.txt -o live-hosts.txt`,
                `httpx -l subdomains.txt -title -status-code -tech-detect`
            ]
        },
        {
            title: 'Vulnerability Scanning',
            commands: [
                `nuclei -l live-hosts.txt -t cves/ -t vulnerabilities/`,
                `nuclei -u https://${cleanDomain} -tags cve,exposure`
            ]
        },
        {
            title: 'URL Discovery',
            commands: [
                `waybackurls ${cleanDomain} | tee wayback-urls.txt`,
                `gau ${cleanDomain} | tee gau-urls.txt`,
                `katana -u https://${cleanDomain} -o katana-urls.txt`
            ]
        },
        {
            title: 'Parameter Discovery',
            commands: [
                `paramspider -d ${cleanDomain}`,
                `arjun -u https://${cleanDomain}`
            ]
        },
        {
            title: 'JavaScript Analysis',
            commands: [
                `subjs -i subdomains.txt`,
                `katana -u https://${cleanDomain} -js-crawl`,
                `python3 linkfinder.py -i https://${cleanDomain} -o results.html`
            ]
        },
        {
            title: 'Port Scanning',
            commands: [
                `naabu -host ${cleanDomain} -top-ports 1000`,
                `nmap -sV -sC ${cleanDomain}`
            ]
        }
    ];
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="color: var(--accent-green); margin: 0;">Bug Bounty Commands</h3>
            <button class="copy-icon-btn" onclick="copyAllCommands()">Copy All</button>
        </div>
    `;
    
    commandSections.forEach(section => {
        html += `<h4 style="color: var(--accent-cyan); margin-top: 25px; margin-bottom: 10px;">${section.title}</h4>`;
        
        section.commands.forEach(cmd => {
            html += `
                <div class="command-item">
                    <code class="command-text">${cmd}</code>
                    <button class="copy-icon-btn" onclick="copyToClipboard(\`${cmd}\`, this)">Copy</button>
                </div>
            `;
        });
    });
    
    outputDiv.innerHTML = html;
}

/**
 * Copy all commands
 */
function copyAllCommands() {
    const commandItems = document.querySelectorAll('.command-text');
    const commands = Array.from(commandItems).map(item => item.textContent).join('\n');
    
    const button = event.target;
    copyToClipboard(commands, button);
}

/**
 * Tab Switching for Payloads Page
 */
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Add active class to clicked button
    const selectedButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

/**
 * Add copy buttons to code blocks
 */
function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        // Skip if button already exists
        if (block.querySelector('.copy-btn')) return;
        
        const code = block.querySelector('code') || block.querySelector('pre') || block;
        const text = code.textContent;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = function() {
            copyToClipboard(text, this);
        };
        
        block.style.position = 'relative';
        block.appendChild(copyBtn);
    });
}

/**
 * Payload Encoder/Decoder
 */
function encodePayload(type) {
    const input = document.getElementById('encoder-input');
    const output = document.getElementById('encoder-output');
    
    if (!input || !output) return;
    
    const text = input.value;
    let result = '';
    
    switch(type) {
        case 'base64':
            result = btoa(text);
            break;
        case 'url':
            result = encodeURIComponent(text);
            break;
        case 'html':
            result = text.replace(/[&<>"']/g, char => {
                const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
                return entities[char];
            });
            break;
    }
    
    output.value = result;
}

function decodePayload(type) {
    const input = document.getElementById('encoder-input');
    const output = document.getElementById('encoder-output');
    
    if (!input || !output) return;
    
    const text = input.value;
    let result = '';
    
    try {
        switch(type) {
            case 'base64':
                result = atob(text);
                break;
            case 'url':
                result = decodeURIComponent(text);
                break;
            case 'html':
                const textarea = document.createElement('textarea');
                textarea.innerHTML = text;
                result = textarea.value;
                break;
        }
        output.value = result;
    } catch(e) {
        output.value = 'Error: Invalid input for decoding';
    }
}

/**
 * Initialize page on load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
    
    // Add copy buttons to existing code blocks
    addCopyButtonsToCodeBlocks();
    
    // Add Enter key handlers for tool inputs
    const domainInput = document.getElementById('domain-input');
    if (domainInput) {
        domainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                generateDomainVariants();
            }
        });
    }
    
    const commandDomainInput = document.getElementById('command-domain-input');
    if (commandDomainInput) {
        commandDomainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                generateCommands();
            }
        });
    }
    
    // Initialize first tab if on payloads page
    const firstTab = document.querySelector('.tab-button');
    if (firstTab) {
        firstTab.click();
    }
});
