// Bug Bounty Command Center - Main JavaScript

/**
 * Utility: Parse domain input to clean format
 */
function parseDomain(input) {
    // Remove protocol if present
    let domain = input.replace(/^https?:\/\//, '');
    // Remove www if present
    domain = domain.replace(/^www\./, '');
    // Remove trailing slash, path, query params, and fragments
    domain = domain.split('/')[0].split('?')[0].split('#')[0];
    return domain.trim();
}

/**
 * Utility: Generate domain variants
 */
function generateDomainVariants(domain) {
    const variants = [
        `https://${domain}`,
        `http://${domain}`,
        `https://www.${domain}`,
        `https://api.${domain}`,
        `https://dev.${domain}`,
        `https://staging.${domain}`,
        `https://admin.${domain}`,
        `https://m.${domain}`,
        `https://beta.${domain}`,
        `https://test.${domain}`
    ];
    return variants;
}

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
    button.style.color = '#000';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.style.color = '';
    }, 2000);
}

/**
 * Render output sections with copy buttons
 */
function renderOutput(outputId, sections, showCopyAll = true) {
    const container = document.getElementById(outputId);
    if (!container) return;
    
    container.innerHTML = '';
    container.classList.add('show');
    
    sections.forEach((section, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'output-section';
        
        if (section.title) {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'section-header';
            
            const title = document.createElement('h4');
            title.textContent = section.title;
            headerDiv.appendChild(title);
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-section-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.onclick = () => copyToClipboard(section.content, copyBtn);
            headerDiv.appendChild(copyBtn);
            
            sectionDiv.appendChild(headerDiv);
        }
        
        const codeBlock = document.createElement('pre');
        codeBlock.textContent = section.content;
        sectionDiv.appendChild(codeBlock);
        
        container.appendChild(sectionDiv);
    });
    
    if (showCopyAll && sections.length > 0) {
        const copyAllBtn = document.createElement('button');
        copyAllBtn.className = 'copy-all-btn';
        copyAllBtn.textContent = 'Copy All';
        const allContent = sections.map(s => s.content).join('\n\n');
        copyAllBtn.onclick = () => copyToClipboard(allContent, copyAllBtn);
        container.appendChild(copyAllBtn);
    }
}

/**
 * Tool 1: Bug Bounty Command Generator (with domain variants)
 */
function generateBugBountyCommands() {
    const input = document.getElementById('input-command-gen');
    const domain = parseDomain(input.value);
    
    if (!domain) {
        alert('Please enter a domain name');
        return;
    }
    
    const variants = generateDomainVariants(domain);
    const variantsText = 'DOMAIN VARIANTS:\n' + variants.join('\n');
    
    const sections = [
        {
            title: 'Domain Variants',
            content: variantsText
        },
        {
            title: 'Subdomain Discovery',
            content: `# Subdomain Enumeration
subfinder -d ${domain} -all -recursive -o subdomains.txt
assetfinder --subs-only ${domain} | tee assetfinder-subs.txt
amass enum -d ${domain} -o amass-subs.txt
chaos -d ${domain} -o chaos-subs.txt`
        },
        {
            title: 'HTTP Probing',
            content: `# HTTP Probing & Live Host Detection
httpx -l subdomains.txt -o live-hosts.txt -status-code -title -tech-detect`
        },
        {
            title: 'Vulnerability Scanning',
            content: `# Nuclei Scanning
nuclei -l live-hosts.txt -t cves/ -t vulnerabilities/ -o nuclei-results.txt`
        },
        {
            title: 'URL Collection',
            content: `# URL Discovery
waybackurls ${domain} | tee wayback-urls.txt
gau ${domain} --threads 5 | tee gau-urls.txt
katana -u https://${domain} -d 5 -o katana-urls.txt`
        },
        {
            title: 'Parameter Discovery',
            content: `# Parameter Discovery
paramspider -d ${domain} -o paramspider-results.txt`
        }
    ];
    
    renderOutput('output-command-gen', sections);
}

/**
 * Tool 2: Subdomain Recon Toolkit
 */
function generateSubdomainCommands() {
    const input = document.getElementById('input-subdomain');
    const domain = parseDomain(input.value);
    
    if (!domain) {
        alert('Please enter a domain name');
        return;
    }
    
    const sections = [
        {
            title: 'Passive Subdomain Discovery',
            content: `# Passive Subdomain Discovery
subfinder -d ${domain} -all -recursive -o subfinder-output.txt`
        },
        {
            title: 'Asset Finder',
            content: `# Asset Finder
assetfinder --subs-only ${domain} | tee assetfinder-output.txt`
        },
        {
            title: 'Amass Enumeration',
            content: `# Amass Enumeration
amass enum -passive -d ${domain} -o amass-passive.txt`
        },
        {
            title: 'ProjectDiscovery Chaos',
            content: `# ProjectDiscovery Chaos
chaos -d ${domain} -o chaos-output.txt`
        },
        {
            title: 'Combine & Deduplicate',
            content: `# Combine & Deduplicate
cat subfinder-output.txt assetfinder-output.txt amass-passive.txt chaos-output.txt | sort -u > all-subdomains.txt`
        },
        {
            title: 'DNS Resolution',
            content: `# DNS Resolution
puredns resolve all-subdomains.txt -r resolvers.txt -w resolved-subdomains.txt`
        }
    ];
    
    renderOutput('output-subdomain', sections);
}

/**
 * Tool 3: URL Collection Toolkit
 */
function generateUrlCommands() {
    const input = document.getElementById('input-urls');
    const domain = parseDomain(input.value);
    
    if (!domain) {
        alert('Please enter a domain name');
        return;
    }
    
    const sections = [
        {
            title: 'Wayback Machine URLs',
            content: `# Wayback Machine URLs
waybackurls ${domain} | tee wayback-urls.txt`
        },
        {
            title: 'GetAllUrls (GAU)',
            content: `# GetAllUrls (GAU)
gau ${domain} --threads 5 -o gau-urls.txt`
        },
        {
            title: 'Katana Crawler',
            content: `# Katana Crawler
katana -u https://${domain} -d 5 -js-crawl -o katana-urls.txt`
        },
        {
            title: 'Hakrawler',
            content: `# Hakrawler
echo "https://${domain}" | hakrawler -d 3 -u | tee hakrawler-urls.txt`
        },
        {
            title: 'Combine All URLs',
            content: `# Combine All URLs
cat wayback-urls.txt gau-urls.txt katana-urls.txt hakrawler-urls.txt | sort -u > all-urls.txt`
        },
        {
            title: 'Filter for Interesting Endpoints',
            content: `# Filter for Interesting Endpoints
cat all-urls.txt | grep -E "\\.js$" > js-files.txt
cat all-urls.txt | grep "?" > urls-with-params.txt`
        }
    ];
    
    renderOutput('output-urls', sections);
}

/**
 * Tool 4: Parameter Discovery
 */
function generateParamCommands() {
    const input = document.getElementById('input-params');
    const domain = parseDomain(input.value);
    
    if (!domain) {
        alert('Please enter a domain or URL');
        return;
    }
    
    const sections = [
        {
            title: 'ParamSpider - Parameter Discovery',
            content: `# ParamSpider - Parameter Discovery
paramspider -d ${domain} -o paramspider-output.txt`
        },
        {
            title: 'Arjun - HTTP Parameter Discovery',
            content: `# Arjun - HTTP Parameter Discovery
arjun -u https://${domain}/endpoint -o arjun-output.txt`
        },
        {
            title: 'FFUF Parameter Fuzzing',
            content: `# FFUF Parameter Fuzzing
ffuf -u https://${domain}/endpoint?FUZZ=test -w params.txt -mc 200,301,302`
        },
        {
            title: 'Parameter Mining from URLs',
            content: `# Parameter Mining from URLs
cat all-urls.txt | grep "?" | cut -d "?" -f 2 | tr "&" "\\n" | cut -d "=" -f 1 | sort -u > parameters.txt`
        },
        {
            title: 'X8 Hidden Parameter Discovery',
            content: `# X8 Hidden Parameter Discovery
x8 -u https://${domain}/endpoint -w params.txt -o x8-output.txt`
        }
    ];
    
    renderOutput('output-params', sections);
}

/**
 * Tool 5: API Recon Toolkit
 */
function generateApiCommands() {
    const input = document.getElementById('input-api');
    const domain = parseDomain(input.value);
    
    if (!domain) {
        alert('Please enter a domain name');
        return;
    }
    
    const sections = [
        {
            title: 'API Subdomain Discovery',
            content: `# API Subdomain Discovery
subfinder -d ${domain} | grep -i api | tee api-subdomains.txt`
        },
        {
            title: 'Common API Paths',
            content: `# Common API Paths
echo "https://${domain}/api
https://${domain}/api/v1
https://${domain}/api/v2
https://api.${domain}
https://api.${domain}/v1
https://${domain}/rest
https://${domain}/graphql
https://${domain}/swagger
https://${domain}/api-docs" | httpx -mc 200,201,301,302,401,403 -o api-endpoints.txt`
        },
        {
            title: 'API Fuzzing Template',
            content: `# API Fuzzing Template
ffuf -u https://${domain}/api/FUZZ -w api-endpoints.txt -mc 200,201,401,403`
        },
        {
            title: 'GraphQL Introspection',
            content: `# GraphQL Introspection
curl -X POST https://${domain}/graphql -H "Content-Type: application/json" -d '{"query":"query { __schema { types { name } } }"}'`
        },
        {
            title: 'Swagger/OpenAPI Discovery',
            content: `# Swagger/OpenAPI Discovery
curl https://${domain}/swagger.json
curl https://${domain}/api-docs`
        },
        {
            title: 'Common API Endpoints to Test',
            content: `/api/v1/users
/api/v1/auth/login
/api/v1/auth/register
/api/v1/admin
/api/v1/config
/api/v2/users/{id}`
        }
    ];
    
    renderOutput('output-api', sections);
}

/**
 * Tool 6: JS Recon Toolkit
 */
function generateJsCommands() {
    const input = document.getElementById('input-js');
    const domain = parseDomain(input.value);
    
    if (!domain) {
        alert('Please enter a domain name');
        return;
    }
    
    const sections = [
        {
            title: 'Discover JS Files',
            content: `# Discover JS Files
katana -u https://${domain} -js-crawl -f qurl | grep -E "\\.js$" | tee js-files.txt`
        },
        {
            title: 'Alternative: HTTPX JS Filtering',
            content: `# Alternative: HTTPX JS Filtering
httpx -l subdomains.txt -path / -mc 200 | grep -E "\\.js$" > js-files-httpx.txt`
        },
        {
            title: 'SubJS - JavaScript Discovery',
            content: `# SubJS - JavaScript Discovery
subjs -i subdomains.txt -c 50 -o subjs-output.txt`
        },
        {
            title: 'LinkFinder - Extract Endpoints from JS',
            content: `# LinkFinder - Extract Endpoints from JS
for url in $(cat js-files.txt); do
  python3 linkfinder.py -i "$url" -o results.html
done`
        },
        {
            title: 'SecretFinder - Find API Keys & Secrets',
            content: `# SecretFinder - Find API Keys & Secrets
for url in $(cat js-files.txt); do
  python3 SecretFinder.py -i "$url" -o secretfinder-output.txt
done`
        },
        {
            title: 'MantraJS - Analyze JS Files',
            content: `# MantraJS - Analyze JS Files
echo js-files.txt | mantra`
        },
        {
            title: 'JSScanner - Automated JS Analysis',
            content: `# JSScanner - Automated JS Analysis
jsscanner -f js-files.txt -o jsscan-results`
        }
    ];
    
    renderOutput('output-js', sections);
}

/**
 * Old functions kept for backward compatibility with other pages
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
    
    // Add Enter key handlers for tool inputs (old tools)
    const domainInput = document.getElementById('domain-input');
    if (domainInput) {
        domainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                // Check if we're on the new tools page
                if (typeof generateAllCommands === 'function') {
                    generateAllCommands();
                } else {
                    generateDomainVariants();
                }
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
    
    // Add Enter key handlers for new tool cards
    const toolInputs = [
        { id: 'input-command-gen', func: generateBugBountyCommands },
        { id: 'input-subdomain', func: generateSubdomainCommands },
        { id: 'input-urls', func: generateUrlCommands },
        { id: 'input-params', func: generateParamCommands },
        { id: 'input-api', func: generateApiCommands },
        { id: 'input-js', func: generateJsCommands }
    ];
    
    toolInputs.forEach(tool => {
        const input = document.getElementById(tool.id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    tool.func();
                }
            });
        }
    });
    
    // Initialize first tab if on payloads page
    const firstTab = document.querySelector('.tab-button');
    if (firstTab) {
        firstTab.click();
    }
});

// ==================== NEW TOOLS PAGE FUNCTIONS ====================

/**
 * Generate all commands - Main function for new tools page
 * Includes 30+ real-world bug bounty tools
 */
function generateAllCommands() {
    const domainInputEl = document.getElementById('domain-input');
    const domainInput = domainInputEl.value.trim();
    const domain = parseDomain(domainInput || '');

    if (!domain) {
        domainInputEl.style.borderColor = '#ff3860';
        domainInputEl.focus();
        setTimeout(() => {
            domainInputEl.style.borderColor = '';
        }, 1500);
        return;
    }

    // SUBDOMAIN ENUMERATION (9 tools)
    updateSubfinder(domain);
    updateAmass(domain);
    updateAssetfinder(domain);
    updateFindomain(domain);
    updateChaos(domain);
    updateCrt(domain);
    updateShosubgo(domain);
    updateGithubSubdomains(domain);
    updateDnsdumpster(domain);

    // DNS / RESOLUTION (4 tools)
    updateDnsx(domain);
    updatePuredns(domain);
    updateShuffledns(domain);
    updateMassdns(domain);

    // HTTP PROBING (4 tools)
    updateHttpx(domain);
    updateHttprobe(domain);
    updateNaabu(domain);
    updateTlsx(domain);

    // URL COLLECTION (6 tools)
    updateGau(domain);
    updateWaybackurls(domain);
    updateKatana(domain);
    updateHakrawler(domain);
    updateGospider(domain);
    updateUrlfinder(domain);

    // JAVASCRIPT RECON (4 tools)
    updateSubjs(domain);
    updateLinkfinder(domain);
    updateGetjs(domain);
    updateJsfinder(domain);

    // PARAMETER DISCOVERY (4 tools)
    updateParamspider(domain);
    updateArjun(domain);
    updateX8(domain);
    updateUnfurl(domain);

    // VULNERABILITY SCANNING (6 tools)
    updateNuclei(domain);
    updateNucleiCves(domain);
    updateNucleiExposures(domain);
    updateNucleiMisconfig(domain);
    updateDalfox(domain);
    updateKxss(domain);
}

// ==================== SUBDOMAIN ENUMERATION ====================

function updateSubfinder(domain) {
    const el = document.getElementById('subfinder-commands');
    if (el) el.textContent =
`subfinder -d ${domain} -all -recursive -o subfinder-${domain}.txt
subfinder -d ${domain} -all -silent | tee subfinder-silent.txt
subfinder -dL domains.txt -all -o all-subdomains.txt`;
}

function updateAmass(domain) {
    const el = document.getElementById('amass-commands');
    if (el) el.textContent =
`# Passive enumeration
amass enum -passive -d ${domain} -o amass-passive-${domain}.txt

# Active enumeration with brute force
amass enum -active -d ${domain} -brute -w /usr/share/wordlists/subdomains.txt -o amass-active-${domain}.txt

# Intel gathering
amass intel -d ${domain} -whois

# Full enumeration with config
amass enum -d ${domain} -config config.ini -o amass-full-${domain}.txt`;
}

function updateAssetfinder(domain) {
    const el = document.getElementById('assetfinder-commands');
    if (el) el.textContent =
`assetfinder --subs-only ${domain} | tee assetfinder-${domain}.txt
assetfinder ${domain} | grep ${domain} | sort -u`;
}

function updateFindomain(domain) {
    const el = document.getElementById('findomain-commands');
    if (el) el.textContent =
`findomain -t ${domain} -o
findomain -t ${domain} -u findomain-${domain}.txt
findomain -f domains.txt -o`;
}

function updateChaos(domain) {
    const el = document.getElementById('chaos-commands');
    if (el) el.textContent =
`chaos -d ${domain} -silent -o chaos-${domain}.txt
chaos -d ${domain} -key YOUR_API_KEY -o chaos-${domain}.txt
chaos -dL domains.txt -silent`;
}

function updateCrt(domain) {
    const el = document.getElementById('crt-commands');
    if (el) el.textContent =
`# Certificate Transparency Log search
curl -s "https://crt.sh/?q=%25.${domain}&output=json" | jq -r '.[].name_value' | sort -u | tee crt-${domain}.txt

# Alternative with common names
curl -s "https://crt.sh/?q=%.${domain}" | grep -oP '(?<=<TD>)[^<]+(?=</TD>)' | grep ${domain} | sort -u`;
}

function updateShosubgo(domain) {
    const el = document.getElementById('shosubgo-commands');
    if (el) el.textContent =
`shosubgo -d ${domain} -s YOUR_SHODAN_API_KEY
shosubgo -d ${domain} -s YOUR_SHODAN_API_KEY | tee shosubgo-${domain}.txt`;
}

function updateGithubSubdomains(domain) {
    const el = document.getElementById('github-subdomains-commands');
    if (el) el.textContent =
`github-subdomains -d ${domain} -t YOUR_GITHUB_TOKEN -o github-subs-${domain}.txt
github-subdomains -d ${domain} -t YOUR_GITHUB_TOKEN -raw | sort -u`;
}

function updateDnsdumpster(domain) {
    const el = document.getElementById('dnsdumpster-commands');
    if (el) el.textContent =
`# DNSDumpster API query (requires API or manual)
curl -s "https://api.hackertarget.com/hostsearch/?q=${domain}" | tee dnsdumpster-${domain}.txt

# Alternative: Python script
python3 dnsdumpster.py -d ${domain}`;
}

// ==================== DNS / RESOLUTION ====================

function updateDnsx(domain) {
    const el = document.getElementById('dnsx-commands');
    if (el) el.textContent =
`cat subdomains.txt | dnsx -silent -o resolved-${domain}.txt
cat subdomains.txt | dnsx -a -resp -silent
cat subdomains.txt | dnsx -cname -resp -silent
cat subdomains.txt | dnsx -txt -resp -silent
cat subdomains.txt | dnsx -mx -resp -silent
dnsx -l subdomains.txt -json -o dnsx-${domain}.json`;
}

function updatePuredns(domain) {
    const el = document.getElementById('puredns-commands');
    if (el) el.textContent =
`# Resolve subdomains with wildcard filtering
puredns resolve subdomains.txt -r resolvers.txt -w resolved-${domain}.txt

# Bruteforce subdomains
puredns bruteforce wordlist.txt ${domain} -r resolvers.txt -w bruteforced-${domain}.txt

# With custom resolvers
puredns resolve subdomains.txt -r /path/to/resolvers.txt --write-wildcards wildcards.txt`;
}

function updateShuffledns(domain) {
    const el = document.getElementById('shuffledns-commands');
    if (el) el.textContent =
`# Bruteforce mode
shuffledns -d ${domain} -w /usr/share/wordlists/subdomains.txt -r resolvers.txt -o shuffledns-${domain}.txt

# Resolve mode
shuffledns -d ${domain} -list subdomains.txt -r resolvers.txt -o resolved-${domain}.txt

# With massdns
shuffledns -d ${domain} -w wordlist.txt -r resolvers.txt -m /usr/bin/massdns`;
}

function updateMassdns(domain) {
    const el = document.getElementById('massdns-commands');
    if (el) el.textContent =
`# Basic resolution
massdns -r resolvers.txt -t A subdomains.txt -o S -w massdns-${domain}.txt

# JSON output
massdns -r resolvers.txt -t A subdomains.txt -o J -w massdns-${domain}.json

# With custom wordlist for bruteforce
cat wordlist.txt | sed "s/\$/.${domain}/" | massdns -r resolvers.txt -t A -o S`;
}

// ==================== HTTP PROBING ====================

function updateHttpx(domain) {
    const el = document.getElementById('httpx-commands');
    if (el) el.textContent =
`# Basic probing with details
httpx -l subdomains.txt -title -status-code -tech-detect -o httpx-${domain}.txt

# Full reconnaissance
httpx -l subdomains.txt -title -status-code -content-length -tech-detect -follow-redirects -o httpx-full-${domain}.txt

# JSON output
httpx -l subdomains.txt -json -o httpx-${domain}.json

# Web server detection
httpx -l subdomains.txt -server -content-type -websocket -pipeline -http2

# Screenshot with katana
httpx -l subdomains.txt -screenshot -o httpx-screenshots/`;
}

function updateHttprobe(domain) {
    const el = document.getElementById('httprobe-commands');
    if (el) el.textContent =
`cat subdomains.txt | httprobe | tee httprobe-${domain}.txt
cat subdomains.txt | httprobe -c 50 -t 3000 | tee live-hosts.txt
cat subdomains.txt | httprobe -p http:80 -p https:443 -p http:8080 -p https:8443`;
}

function updateNaabu(domain) {
    const el = document.getElementById('naabu-commands');
    if (el) el.textContent =
`# Port scanning
naabu -host ${domain} -p - -o naabu-${domain}.txt
naabu -host ${domain} -top-ports 1000 -o naabu-top1000-${domain}.txt

# Scan list of hosts
naabu -list subdomains.txt -top-ports 100 -o naabu-ports.txt

# With rate limiting
naabu -host ${domain} -rate 1000 -p 80,443,8080,8443

# Combined with httpx
naabu -host ${domain} -p 80,443,8080,8443 | httpx -silent`;
}

function updateTlsx(domain) {
    const el = document.getElementById('tlsx-commands');
    if (el) el.textContent =
`# TLS/SSL certificate analysis
echo ${domain} | tlsx -san -cn -silent
cat subdomains.txt | tlsx -san -cn -o tlsx-${domain}.txt

# Full TLS info
tlsx -l subdomains.txt -json -o tlsx-${domain}.json

# Certificate details
echo ${domain} | tlsx -expired -self-signed -mismatched -revoked`;
}

// ==================== URL COLLECTION ====================

function updateGau(domain) {
    const el = document.getElementById('gau-commands');
    if (el) el.textContent =
`# Fetch all URLs
gau ${domain} | tee gau-${domain}.txt

# With providers
gau --providers wayback,commoncrawl,otx,urlscan ${domain}

# Filter by extension
gau ${domain} | grep -E "\\.(js|json|xml|txt|log|bak|old)$"

# Multithreaded
gau --threads 10 ${domain} --o gau-${domain}.txt`;
}

function updateWaybackurls(domain) {
    const el = document.getElementById('waybackurls-commands');
    if (el) el.textContent =
`# Fetch Wayback URLs
echo ${domain} | waybackurls | tee wayback-${domain}.txt

# With dates
waybackurls ${domain} | sort -u

# Filter interesting extensions
waybackurls ${domain} | grep -E "\\.(php|asp|aspx|jsp|json|xml)$"

# Find parameters
waybackurls ${domain} | grep "?" | sort -u`;
}

function updateKatana(domain) {
    const el = document.getElementById('katana-commands');
    if (el) el.textContent =
`# Deep crawling
katana -u https://${domain} -d 5 -o katana-${domain}.txt

# JavaScript crawling
katana -u https://${domain} -js-crawl -d 5 -o katana-js-${domain}.txt

# Headless mode
katana -u https://${domain} -headless -d 3 -o katana-headless.txt

# With form filling
katana -u https://${domain} -automatic-form-fill -d 5

# Extract endpoints
katana -u https://${domain} -ef js,css,png,jpg,gif,svg,woff`;
}

function updateHakrawler(domain) {
    const el = document.getElementById('hakrawler-commands');
    if (el) el.textContent =
`echo https://${domain} | hakrawler -d 3 -u | tee hakrawler-${domain}.txt
echo https://${domain} | hakrawler -subs -u
echo https://${domain} | hakrawler -plain -usewayback

# With multiple URLs
cat live-hosts.txt | hakrawler -d 2 -insecure`;
}

function updateGospider(domain) {
    const el = document.getElementById('gospider-commands');
    if (el) el.textContent =
`gospider -s https://${domain} -c 10 -d 3 -o gospider-output/
gospider -s https://${domain} -c 20 -d 5 --js --sitemap --robots

# From file
gospider -S live-hosts.txt -c 10 -d 2 -o gospider-all/

# With blacklist
gospider -s https://${domain} -c 10 --blacklist png,jpg,gif,css,woff`;
}

function updateUrlfinder(domain) {
    const el = document.getElementById('urlfinder-commands');
    if (el) el.textContent =
`urlfinder -d ${domain} -o urlfinder-${domain}.txt
urlfinder -d ${domain} -all -o urlfinder-all-${domain}.txt

# From multiple domains
urlfinder -dL domains.txt -o urlfinder-output.txt`;
}

// ==================== JAVASCRIPT RECON ====================

function updateSubjs(domain) {
    const el = document.getElementById('subjs-commands');
    if (el) el.textContent =
`# Find JS files from subdomains
cat subdomains.txt | subjs | tee js-files-${domain}.txt

# With concurrency
subjs -i subdomains.txt -c 50 -o js-files.txt

# Unique JS files
cat subdomains.txt | subjs | sort -u`;
}

function updateLinkfinder(domain) {
    const el = document.getElementById('linkfinder-commands');
    if (el) el.textContent =
`# Find endpoints in JS file
python3 linkfinder.py -i https://${domain}/main.js -o cli

# Output to HTML
python3 linkfinder.py -i https://${domain}/app.js -o linkfinder-${domain}.html

# Analyze multiple files
for js in \$(cat js-files.txt); do python3 linkfinder.py -i "\$js" -o cli >> endpoints.txt; done

# With regex
python3 linkfinder.py -i https://${domain}/bundle.js -r 'api|admin|auth'`;
}

function updateGetjs(domain) {
    const el = document.getElementById('getjs-commands');
    if (el) el.textContent =
`# Get all JS from URL
getjs --url https://${domain} --output js-${domain}.txt

# Complete (include inline)
getjs --url https://${domain} --complete

# From list
getjs --input live-hosts.txt --output all-js-files.txt`;
}

function updateJsfinder(domain) {
    const el = document.getElementById('jsfinder-commands');
    if (el) el.textContent =
`# Find JS files and extract endpoints
python3 jsfinder.py -u https://${domain} -o jsfinder-${domain}.txt

# With depth
python3 jsfinder.py -u https://${domain} -d 3 -o jsfinder-deep.txt

# Analyze local file
python3 jsfinder.py -f downloaded.js -o endpoints.txt`;
}

// ==================== PARAMETER DISCOVERY ====================

function updateParamspider(domain) {
    const el = document.getElementById('paramspider-commands');
    if (el) el.textContent =
`# Find parameters from archives
paramspider -d ${domain} -o paramspider-${domain}.txt

# Exclude extensions
paramspider -d ${domain} --exclude woff,css,js,png,jpg,gif

# Multiple domains
paramspider -l domains.txt -o paramspider-all.txt

# With custom placeholder
paramspider -d ${domain} -p FUZZ`;
}

function updateArjun(domain) {
    const el = document.getElementById('arjun-commands');
    if (el) el.textContent =
`# Parameter discovery
arjun -u https://${domain}/api/endpoint -o arjun-${domain}.json

# With custom wordlist
arjun -u https://${domain}/page -w params.txt

# POST method
arjun -u https://${domain}/api -m POST

# JSON parameters
arjun -u https://${domain}/api -m JSON

# Multiple URLs
arjun -i urls.txt -o arjun-results.json`;
}

function updateX8(domain) {
    const el = document.getElementById('x8-commands');
    if (el) el.textContent =
`# Hidden parameter discovery
x8 -u "https://${domain}/api/user" -w params.txt

# With custom headers
x8 -u "https://${domain}/api" -w params.txt -H "Authorization: Bearer token"

# POST request
x8 -u "https://${domain}/api" -w params.txt -X POST

# Output
x8 -u "https://${domain}/page" -w params.txt -o x8-${domain}.txt`;
}

function updateUnfurl(domain) {
    const el = document.getElementById('unfurl-commands');
    if (el) el.textContent =
`# Extract keys (parameter names)
cat urls.txt | unfurl keys | sort -u | tee params-${domain}.txt

# Extract values
cat urls.txt | unfurl values | sort -u

# Extract paths
cat urls.txt | unfurl paths

# Format output
cat urls.txt | unfurl format "%d%p"

# Extract domains
cat urls.txt | unfurl domains`;
}

// ==================== VULNERABILITY SCANNING ====================

function updateNuclei(domain) {
    const el = document.getElementById('nuclei-commands');
    if (el) el.textContent =
`# Full scan with all templates
nuclei -l live-hosts.txt -t ~/nuclei-templates/ -o nuclei-${domain}.txt

# Severity based
nuclei -l live-hosts.txt -severity critical,high -o nuclei-critical-${domain}.txt

# Single target
nuclei -u https://${domain} -o nuclei-single-${domain}.txt

# With rate limiting
nuclei -l live-hosts.txt -rate-limit 100 -o nuclei-results.txt

# Automatic updates
nuclei -update-templates`;
}

function updateNucleiCves(domain) {
    const el = document.getElementById('nuclei-cves-commands');
    if (el) el.textContent =
`# CVE scanning
nuclei -l live-hosts.txt -t cves/ -o nuclei-cves-${domain}.txt

# Specific year CVEs
nuclei -l live-hosts.txt -t cves/2023/ -o nuclei-cves-2023-${domain}.txt
nuclei -l live-hosts.txt -t cves/2024/ -o nuclei-cves-2024-${domain}.txt

# Critical CVEs only
nuclei -l live-hosts.txt -t cves/ -severity critical -o nuclei-critical-cves.txt

# Specific CVE
nuclei -u https://${domain} -t cves/2021/CVE-2021-44228.yaml`;
}

function updateNucleiExposures(domain) {
    const el = document.getElementById('nuclei-exposures-commands');
    if (el) el.textContent =
`# Exposure templates
nuclei -l live-hosts.txt -t exposures/ -o nuclei-exposures-${domain}.txt

# Specific exposure types
nuclei -l live-hosts.txt -t exposures/configs/ -o config-exposures.txt
nuclei -l live-hosts.txt -t exposures/files/ -o file-exposures.txt
nuclei -l live-hosts.txt -t exposures/logs/ -o log-exposures.txt
nuclei -l live-hosts.txt -t exposures/backups/ -o backup-exposures.txt`;
}

function updateNucleiMisconfig(domain) {
    const el = document.getElementById('nuclei-misconfig-commands');
    if (el) el.textContent =
`# Misconfiguration templates
nuclei -l live-hosts.txt -t misconfiguration/ -o nuclei-misconfig-${domain}.txt

# Specific misconfigurations
nuclei -l live-hosts.txt -t misconfiguration/http-missing-security-headers.yaml
nuclei -l live-hosts.txt -t misconfiguration/cors-misconfig.yaml

# All misconfig with tags
nuclei -l live-hosts.txt -tags misconfig -o misconfig-all.txt`;
}

function updateDalfox(domain) {
    const el = document.getElementById('dalfox-commands');
    if (el) el.textContent =
`# XSS scanning on URL with parameters
dalfox url "https://${domain}/search?q=test" -o dalfox-${domain}.txt

# Pipe from paramspider
cat paramspider-${domain}.txt | dalfox pipe -o dalfox-params.txt

# With custom payloads
dalfox url "https://${domain}/page?id=1" --custom-payload payloads.txt

# Full options
dalfox url "https://${domain}/vuln?input=test" --deep-domxss --follow-redirects

# Mass scanning
dalfox file urls-with-params.txt -o dalfox-mass.txt`;
}

function updateKxss(domain) {
    const el = document.getElementById('kxss-commands');
    if (el) el.textContent =
`# Find reflected parameters (XSS candidates)
cat urls-with-params.txt | kxss | tee kxss-${domain}.txt

# From wayback
waybackurls ${domain} | grep "?" | kxss

# Pipeline with other tools
gau ${domain} | grep "=" | kxss | tee reflected-params.txt`;
}

/**
 * Copy individual card commands
 */
function copyCardCommands(cardId) {
    const target = document.getElementById(cardId);
    if (!target) return;
    const commandText = target.textContent;
    const button = target.parentElement.querySelector('.copy-btn');

    copyToClipboard(commandText, button || target);
}

/**
 * Copy all commands from all cards
 */
function copyAllCommands() {
    const allCards = document.querySelectorAll('.command-block');
    const allCommands = Array.from(allCards).map(c => c.textContent).join('\n\n');
    const button = document.querySelector('.copy-all-btn');
    copyToClipboard(allCommands, button || document.body);
}

// ==================== END NEW TOOLS PAGE FUNCTIONS ====================
