# Ashish Agrawal — Modern Personal Portfolio Website

A modern, premium, fully responsive, and interactive personal portfolio website for **Ashish Agrawal**, presenting him as both a capable **Web Developer** and a results-driven **Sales Executive**.

---

## 🌟 Highlights & Features

- **Sophisticated Dark Theme**: Deep cosmic navy & obsidian background (`#060813`), electric cyan (`#00d2ff`), royal blue (`#3b82f6`), and vibrant purple (`#8b5cf6`) accents with glowing glassmorphism cards (`backdrop-filter: blur(16px)`).
- **Interactive Particle Constellation**: Lightweight HTML5 Canvas particle system that smoothly animates and subtly interacts with cursor movement and touch, with pause controls and reduced-motion support.
- **Dynamic Typing Headline**: Smooth typewriter effect cycling through:
  - *Web Developer*
  - *Sales Executive*
  - *Digital Problem Solver*
  - *Client Growth Partner*
- **Comprehensive Sections**:
  1. **Hero Section**: Prominent name presentation, dynamic headline, dual CTA buttons ("Explore My Work" and "Contact Me"), custom vector profile avatar with rotating aura ring and floating badges, and key metric counters.
  2. **About Me**: Narrative connecting technical coding with commercial communication, client relationship management, and 4 core values (Creativity, Teamwork, Adaptability, Value Delivery). Includes a Dual-Advantage breakdown card.
  3. **Verified Skills & Expertise**: Filter tabs for **Web Development & CMS** (WordPress, Shopify, HTML5, CSS3, JavaScript, Responsive Web Design, UI/UX Fundamentals, Website Optimization) and **Sales & Business** (Sales Strategy, Lead Generation, Client Relationship Management, Communication and Negotiation, Customer Support, Business Development) with animated progress indicators on scroll.
  4. **Projects & Portfolio (Total 5 Projects)**:
     - **Project 1**: **GoGold USA — Full Custom WordPress Redesign & Client Intake Platform** (Live Client at [gogoldusa.com](https://gogoldusa.com), U.S. relocation & investment advisory, Gutenberg blocks, ACF Pro, multi-step intake).
     - **Project 2**: Shopify High-Converting Fashion & Lifestyle Store (Liquid templates, AJAX slide cart, +31.8% conversion lift).
     - **Project 3**: High-Converting Sales Landing Page & Lead Capture Funnel (Recent 3 Months / Active, 26% lead conversion rate, CRM sync).
     - **Project 4**: Shopify B2B Wholesale & Multi-Tier Retail Store (Liquid Cart API, tiered volume pricing, customer tag gating).
     - **Project 5**: Custom WordPress Real Estate & Booking Portal (Recent 3 Months / Active, Custom Post Types, Google Maps API, automated calendar booking).
  5. **Professional Experience**: Chronological milestone timeline with glowing nodes, clearly designated editable placeholders (`[Company Name]`, `[Dates]`), and real-world responsibilities.
  6. **Services**: 6 service cards with deliverable checklists and an "Inquire" button that auto-scrolls to the contact form and prefills the subject!
  7. **Contact Section**: One-click "Copy Email" button with animated tooltip feedback, direct social links (LinkedIn, GitHub, WhatsApp), and a fully validated contact form.
  8. **Footer**: Navigation links, direct contact details, back-to-top button, and copyright notice.

---

## 📁 Project Structure

```
d:\ashish portfolio\
├── index.html                  # Semantic HTML5, SEO meta tags, OpenGraph, JSON-LD schema
├── README.md                   # Full documentation & setup guide
├── css/
│   └── style.css               # Modern CSS3 design system, responsive grid & animations
├── js/
│   ├── config.js               # Centralized data file (Edit details, skills, projects here!)
│   ├── particles.js            # Interactive starry canvas constellation background
│   └── main.js                 # Smooth scroll, nav drawer, scrollspy, modal, form validation
└── assets/
    ├── docs/
    │   └── README_RESUME.txt   # Guide for placing Ashish_Agrawal_Resume.pdf
    └── images/
        ├── logo.png            # 3D Gold & Silver Monogram "AA" Official Brand Logo
        ├── avatar.svg          # Professional web developer & sales pro vector avatar
        ├── favicon.svg         # Monogram AA high-res icon
        ├── project-gogold.svg  # GoGold USA (gogoldusa.com) Full Custom WordPress Redesign mockup
        ├── project-2.svg       # Shopify High-Converting Fashion Store mockup
        ├── project-3.svg       # High-Converting Sales Landing Page & Lead Funnel mockup
        ├── project-4.svg       # Shopify B2B Wholesale & Multi-Tier Store mockup
        └── project-5.svg       # Custom WordPress Real Estate & Booking Portal mockup
```

---

## 🚀 How to Run Locally

Because this project is built using vanilla HTML5, CSS3, and modern JavaScript:

1. **Option 1: Direct Open (Simplest)**
   - Double-click `index.html` in Windows Explorer or your file manager. It will open instantly in Google Chrome, Microsoft Edge, Firefox, or Brave with full functionality!

2. **Option 2: VS Code Live Server**
   - Open the `d:\ashish portfolio` folder in VS Code.
   - Right-click `index.html` and choose **"Open with Live Server"**.

---

## ✏️ How to Customize

### 1. Update Personal Info, Projects, or Skills
Open `js/config.js` and modify the values in `PORTFOLIO_CONFIG`:
- `personal.fullName`: Change your name
- `personal.email`: Update your email address
- `socials`: Update LinkedIn, GitHub, or WhatsApp links
- `projects`: Add your live project URLs, custom screenshots, or new projects
- `experience`: Replace `[Company Name]` and `[Dates]` with your real work history

### 2. Add Your Downloadable Resume
1. Export your resume as a PDF.
2. Name it: `Ashish_Agrawal_Resume.pdf`.
3. Drop it inside the `assets/docs/` folder:
   ```
   assets/docs/Ashish_Agrawal_Resume.pdf
   ```
4. The **"Resume"** and **"Download PDF Resume"** buttons on the site will automatically download your PDF!

### 3. Direct Contact & Communication Channels
The website provides direct, friction-free communication channels for clients and recruiters:
- **Direct Phone Call**: Clickable `tel:9928903550` link allows mobile and desktop users to dial immediately (`+91 9928903550`).
- **LinkedIn Profile**: Direct, clickable link to [Ashish Agrawal's LinkedIn](https://www.linkedin.com/in/ashishagrwal7014/) opening safely in a new browser tab.
- **Direct Email**: Standard `mailto:ashishagrwal307@gmail.com` link enabling visitors to use their preferred email application (Gmail, Outlook, Apple Mail, etc.) without forced desktop client traps.
- **One-Click Email Copy**: Integrated clipboard copy button allows browser webmail users (e.g. Gmail in Chrome) to copy `ashishagrwal307@gmail.com` with a single click.
- **WhatsApp Direct**: Direct messaging link to start a WhatsApp conversation with Ashish instantly.
- **Zero-Dependency Architecture**: Runs statically in any modern browser without requiring Node.js, npm, or external servers.

---

## 🌐 Free 1-Click Deployment

You can host this website online for free with your own custom domain or free subdomain:

- **GitHub Pages**:
  1. Create a repository on GitHub (e.g., `ashish-portfolio`).
  2. Push these files to the repository.
  3. Go to **Settings > Pages > Branch: main / root** and click Save.
- **Vercel / Netlify / Render**:
  - Drag and drop this folder directly into the Netlify, Vercel, or Render dashboard. It will deploy within 10 seconds!

---

© 2026 Ashish Agrawal. Designed for professional excellence.
