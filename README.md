# Bug Bounty Command Center

> **Your Personal Security Research Platform**

A professional bug bounty knowledge and tooling platform designed for security researchers. Access interactive tools, comprehensive payload libraries, proven methodologies, and advanced reconnaissance techniques - all in one centralized dashboard.

![Platform](https://img.shields.io/badge/Platform-Frontend_Only-green)
![Status](https://img.shields.io/badge/Status-Production_Ready-blue)
![Deploy](https://img.shields.io/badge/Deploy-Cloudflare_Pages-orange)

## 🚀 Features

### 🛠️ Interactive Tools
- **Domain Variant Generator** - Generate common domain variants for testing
- **Bug Bounty Command Generator** - Pre-configured reconnaissance commands
- **Payload Encoder/Decoder** - Encode/decode payloads for bypass techniques

### 💉 Payload Library
- XSS (Basic, Filter Bypass, Attribute Context, Advanced, DOM)
- SQL Injection (UNION, Blind, Time-based, Error-based)
- Open Redirect, LFI, SSTI, Command Injection, IDOR
- 150+ payloads with copy buttons

### 📋 Testing Methodology
- Phase 1: Reconnaissance
- Phase 2: Mapping & Enumeration
- Phase 3: Vulnerability Discovery
- Phase 4: Exploitation & Validation
- Phase 5: Reporting & Validation

### 🔍 Recon Knowledge Base
- Subdomain Discovery Strategy
- JavaScript File Hunting
- Parameter Discovery
- API Reconnaissance
- Wayback Machine Analysis
- Cloud Asset Discovery
- GitHub Reconnaissance
- Google Dorks

### 📝 Quick Reference
- WAF Fingerprinting
- HTTP Status Codes
- Authentication Testing Checklist
- Rate Limit Testing Checklist
- IDOR Checklist
- Account Takeover Checklist
- Common Ports & Services
- Quick Payload Reference

### 🧪 Practice Labs
- Reflected XSS
- DOM-based XSS
- Stored XSS
- SQL Injection Simulator
- Account Takeover
- Rate Limiting

## 🎨 Design

- **Dark hacker theme** with professional styling
- **Neon green (#00ff41)** and **cyan (#00d9ff)** accent colors
- **Fully responsive** - works on desktop, tablet, and mobile
- **Copy buttons** on all code blocks and payloads
- **Tab-based navigation** for organized content
- **Sticky navigation bar** with active page highlighting

## 🚀 Deployment

This platform is built with pure HTML, CSS, and JavaScript - no backend required!

### Cloudflare Pages
```bash
# Simply push to GitHub and connect to Cloudflare Pages
# Build settings: None required (static site)
# Build output directory: / (root)
```

### GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# Source: main branch / (root)
```

### Local Development
```bash
# Start a local server
python3 -m http.server 8000
# Visit http://localhost:8000
```

## 📁 Project Structure

```
.
├── index.html              # Home/Dashboard
├── tools.html              # Interactive Tools
├── payloads.html           # Payload Library
├── methodology.html        # Testing Methodology
├── recon.html             # Recon Knowledge Base
├── notes.html             # Quick Reference & Cheatsheets
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js            # Main functionality
│   └── common.js          # Common utilities (for labs)
└── labs/                  # Practice labs
    ├── xss/
    ├── sqli/
    ├── account-takeover/
    └── rate-limiting/
```

## 💻 Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS variables
- **Vanilla JavaScript** - No frameworks or dependencies
- **Font Awesome** - Icons (optional, using emoji fallback)

## 🔒 Security & Ethics

This platform is designed for:
- **Authorized security testing only**
- **Educational purposes** in controlled environments
- **Responsible disclosure** practices
- **Legal bug bounty programs**

Always obtain proper authorization before testing any system.

## 🤝 Contributing

This is a personal security research platform. Feel free to fork and customize for your own needs!

## 📄 License

This project is open source and available for security researchers to use and modify.

## ⚡ Quick Start

1. Clone the repository
2. Open `index.html` in your browser
3. Start exploring tools and resources!

No installation, no dependencies, no backend required.

---

**Built by security researchers, for security researchers.**