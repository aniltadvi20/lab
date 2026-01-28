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
 */
function generateAllCommands() {
    const domainInputEl = document.getElementById('domain-input');
    const domainInput = domainInputEl.value.trim();
    
    if (!domainInput) {
        // Visual feedback instead of alert
        domainInputEl.style.borderColor = '#ff3860';
        domainInputEl.focus();
        setTimeout(() => {
            domainInputEl.style.borderColor = '';
        }, 2000);
        return;
    }
    
    const domain = parseDomain(domainInput);
    
    // Validate parsed domain is not empty
    if (!domain) {
        domainInputEl.style.borderColor = '#ff3860';
        domainInputEl.focus();
        setTimeout(() => {
            domainInputEl.style.borderColor = '';
        }, 2000);
        return;
    }
    
    updateReconCommands(domain);
    updateHttpProbingCommands(domain);
    updateUrlCollectionCommands(domain);
    updateJsReconCommands(domain);
    updateParamDiscoveryCommands(domain);
    updateVulnScanningCommands(domain);
}

/**
 * Update individual card commands
 */
function updateReconCommands(domain) {
    const commands = `1 subfinder -d ${domain} -all -recursive
2 amass enum -passive -d ${domain}
3 assetfinder --subs-only ${domain}
4 findomain -t ${domain}
5 chaos -d ${domain}
6 crt.sh ${domain}
7 shosubgo -d ${domain} -s shodan-api-key
8 subfinder -d ${domain} | httpx -silent`;
    
    document.getElementById('recon-commands').textContent = commands;
}

function updateHttpProbingCommands(domain) {
    const commands = `1 httpx -l subdomains.txt -o live-hosts.txt
2 httpx -l subdomains.txt -status-code -title
3 httpx -l subdomains.txt -tech-detect
4 httpx -l subdomains.txt -screenshot -o screenshots
5 httpx -l subdomains.txt -probe -c 50
6 httpx -l subdomains.txt -fr -sr -mc 200,301,302,403`;
    
    document.getElementById('http-probing-commands').textContent = commands;
}

function updateUrlCollectionCommands(domain) {
    const commands = `1 waybackurls ${domain}
2 gau ${domain}
3 katana -u https://${domain} -d 5
4 hakrawler -url https://${domain} -depth 3
5 gospider -s https://${domain} -d 5
6 waybackurls ${domain} | grep "?"
7 gau ${domain} --threads 5
8 katana -u https://${domain} -js-crawl`;
    
    document.getElementById('url-collection-commands').textContent = commands;
}

function updateJsReconCommands(domain) {
    const commands = `1 subjs -i subdomains.txt
2 katana -u https://${domain} -js-crawl
3 gospider -s https://${domain} -c 10 -d 3
4 httpx -l subdomains.txt | grep -E "\\.js$"
5 python3 linkfinder.py -i https://${domain}/app.js
6 python3 SecretFinder.py -i https://${domain}/app.js
7 nuclei -l js-files.txt -t exposures/tokens/`;
    
    document.getElementById('js-recon-commands').textContent = commands;
}

function updateParamDiscoveryCommands(domain) {
    const commands = `1 paramspider -d ${domain}
2 arjun -u https://${domain}/endpoint
3 x8 -u https://${domain}/endpoint -w params.txt
4 waybackurls ${domain} | grep "?" | unfurl keys
5 gau ${domain} | grep "=" | qsreplace test
6 ffuf -u https://${domain}/endpoint?FUZZ=test -w params.txt`;
    
    document.getElementById('param-discovery-commands').textContent = commands;
}

function updateVulnScanningCommands(domain) {
    const commands = `1 nuclei -l live-hosts.txt -t cves/
2 nuclei -l live-hosts.txt -t vulnerabilities/
3 nuclei -l live-hosts.txt -t exposures/
4 nuclei -l live-hosts.txt -t misconfiguration/
5 nuclei -l live-hosts.txt -t takeovers/
6 nuclei -u https://${domain} -as
7 nikto -h https://${domain}`;
    
    document.getElementById('vuln-scanning-commands').textContent = commands;
}

/**
 * Copy individual card commands
 */
function copyCardCommands(cardId) {
    const commandText = document.getElementById(cardId).textContent;
    
    navigator.clipboard.writeText(commandText).then(() => {
        const card = document.getElementById(cardId).closest('.command-card');
        const button = card.querySelector('.copy-btn');
        
        const originalText = button.textContent;
        button.textContent = '✓ Copied';
        button.style.background = '#00ff41';
        button.style.color = '#000';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

/**
 * Copy all commands from all cards
 */
function copyAllCommands() {
    const allCards = document.querySelectorAll('.command-list');
    let allCommands = '';
    
    allCards.forEach((card, index) => {
        if (index > 0) allCommands += '\n\n';
        allCommands += card.textContent;
    });
    
    navigator.clipboard.writeText(allCommands).then(() => {
        const button = document.querySelector('.copy-all-btn');
        const originalText = button.textContent;
        button.textContent = '✓ All Copied';
        button.style.background = '#00ff41';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        // Show error feedback
        const button = document.querySelector('.copy-all-btn');
        const originalText = button.textContent;
        button.textContent = '✗ Copy Failed';
        button.style.background = '#ff3860';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    });
}

// ==================== END NEW TOOLS PAGE FUNCTIONS ====================
