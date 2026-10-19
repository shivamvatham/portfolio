# Shivam Vatham — Premium Animated Developer Portfolio

> An award-winning, Awwwards-inspired developer portfolio website engineered with pure HTML5, CSS3, and vanilla JavaScript. Features dark glassmorphic aesthetics, high-contrast readable typography, compact content-dense layouts, Lenis smooth scrolling, GSAP & ScrollTrigger choreography, Three.js 3D interactive particle constellation, Typed.js headline animation, and a multi-profile Web Audio API synthesized sound engine.

---

## 🚀 Live Preview & Quick Start

You can preview the portfolio immediately by opening `index.html` in any modern web browser, or by serving it locally with Node.js:

```bash
# Using Node.js npx serve (recommended)
npx serve .

# Or using Python (if installed)
python -m http.server 3000
```

Then visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
portfolio/
├── index.html              # Semantic HTML5 markup, SEO meta tags, equalizer audio toggle, and structured sections
├── style.css               # Obsidian dark theme, Awwwards glassmorphism, high-contrast typography & compact CSS
├── script.js               # Vanilla JS engine (Lenis, Three.js, GSAP, Web Audio Engine, Filtering)
├── sitemap.xml             # XML sitemap protocol for Googlebot and search crawlers
├── robots.txt              # Crawler permissions and sitemap location directive
├── shivam_vatham_CV.pdf    # Direct download resume PDF
├── assets/                 # Project screenshots and visual assets
└── README.md               # Documentation & deployment guide
```

---

## ✨ Features & Architecture

### 1. High-Contrast Typography & Visual Clarity
- **Enhanced Contrast Ratios**: Main text upgraded to `#f8fafc` and secondary text to `#cbd5e1`, eliminating eye strain and ensuring effortless legibility against the dark cosmic backdrop.
- **Surface Separation**: Glass cards calibrated to `rgba(14, 19, 36, 0.88)` with subtle luminous borders (`rgba(255, 255, 255, 0.13)`), creating clear visual isolation from background ambient glows.
- **Consistent Typographic Hierarchy**: *Plus Jakarta Sans* (Display Headings, `font-weight: 700`, subtle text drop shadow), *Inter* (Body copy, `font-weight: 450`, `line-height: 1.6`), and *JetBrains Mono* (Code, Badges & Labels).

### 2. Compact, Content-Dense Spacing
- **Balanced Layout**: Section padding reduced to `72px 0` (desktop) and `48px 0` (mobile) to eliminate bloated vertical gaps.
- **Immediate Information Delivery**: Hero container gaps, bento grid padding, and card margins tuned so that high-value achievements, tools, and technical experience are visible without excessive scrolling.

### 3. Multi-Profile Web Audio API Sound Engine
- **Muted by Default**: Respects user preference; state is remembered across sessions using `localStorage`.
- **Animated Audio Waveform**: The header sound toggle features live-pulsing equalizer bars when sound is enabled.
- **Pristine Synthesized Sounds** (zero-latency, no external audio files required):
  - `hover`: Acoustic micro-tick (`1800Hz`) on buttons, chips, and links.
  - `click`: Tactile haptic thud (`520Hz -> 120Hz`) on buttons and cards.
  - `toggle`: Musical two-tone arpeggio (`C5 -> E5`) on sound state change.
  - `nav`: Frequency glide (`360Hz -> 560Hz`) when navigating sections.
  - `filter`: Crisp frequency pop (`620Hz`) when switching project categories.
  - `copy`: Dual-tone confirmation chime (`880Hz -> 1174Hz`) on clipboard copy.
  - `success`: Sparkling major triad arpeggio (`C5 - E5 - G5`) on valid form submission.
  - `error`: Gentle double low pulse (`240Hz -> 180Hz`) on form validation alert.

### 4. Animations & 3D Visual Effects
- **Three.js 3D Particle Constellation**: Organic glowing particle cloud responding dynamically to mouse movement with smooth damping. Automatically throttled when the tab is inactive.
- **Lenis Smooth Scroll**: Butter-smooth momentum scrolling synchronized with GSAP ScrollTrigger.
- **GSAP 3 & ScrollTrigger Choreography**: Snappy staggered entrances, animated number counters (`3+` Years, `5+` Production Apps, `1000+` REST APIs, `15+` Component Systems), 3D card tilt on hover, and scroll-linked progress bars.
- **Typed.js**: Animated headline cycling through Shivam's core specialties.
- **Custom Magnetic Cursor**: Fluid outer ring with lerp trailing, magnetic pull to buttons, and dynamic contextual labels (`EXPLORE`, `DOWNLOAD`, `SAY HI`).

### 5. Content from Resume & Production Showcase
- **Hero Section**: Prominent branding for Shivam Vatham — Software Developer, resume summary, functional CTA buttons, and an **interactive developer sandbox** (`shivam.config.js` and live `bash_cli.sh` REPL).
- **About Me**: Bento-grid layout detailing architectural philosophies, 4 core engineering pillars, live Ahmedabad (IST) digital clock, and language proficiencies (English, Hindi, Gujarati).
- **Experience**: Scroll-progress timeline highlighting Software Developer role at **PHP Infosec, Ahmedabad** (Nov 2023 – Present).
- **Projects Showcase**: Interactive category filters (`All Projects (7)`, `Featured & Live (2)`, `Personal`, `Enterprise`):
  - **DevsLoad — Online Tools Platform**: Verified live link (`https://devsload.com`).
  - **Palak Enterprises — Precision Machine Parts**: Official live corporate platform & 13+ component catalogue (`https://palak-enterprises.in`).
  - **Advocate Management System (AdvoClock)**: Legal case management system (Vue 3, Vuetify 3, Node, Express, MongoDB).
  - **Palak Enterprises — GST Billing Platform**: Invoicing and tax compliance engine (Vue 2, Vuetify 2, Express, MongoDB).
  - **PHP Radius**: Bandwidth management and AAA monitoring dashboard (Vue 3, Chart.js, D3.js).
  - **FusionSpot**: Wi-Fi hotspot management and dynamic captive portal (Vue 3, D3.js).
  - **PHP GST**: Enterprise taxation and multi-branch ledger system (Vue 3, Chart.js, D3.js).
- **Interactive Deep-Dive Modal**: Simulated device viewports (Desktop 💻 / Tablet 📱 / Mobile 📲) with tabbed specs, engineering architecture, and Lighthouse metrics for all projects.
- **Interactive Command Palette HUD**: Accessible anywhere via `Ctrl+K` or `Cmd+K` for instant spotlight fuzzy search, project navigation, and quick developer actions.
- **Live Theme Accent Switcher**: Instant switching between 5 ambient color palettes (Cosmic Violet, Solar Orange, Matrix Emerald, Cyber Aqua, Electric Rose) with live Three.js particle recoloring.
- **Skill-to-Project Cross-Highlighting**: Clicking any skill chip highlights all matching projects with an animated glowing pulse.
- **Confetti Celebration Engine**: Lightweight 60 FPS canvas particle physics celebrating form submissions and availability milestones.
- **Skills & Technologies**: Categorized grid with real-time instant search input.
- **Education & Achievements**: MCA (RBIMS) & BCA (Asia Pacific Institute) timelines alongside top career achievements.
- **Contact Section**: One-click email copy button with toast notification, phone, location, social links (LinkedIn, GitHub), and validated interactive contact form with mail client integration.

---

## 🌐 Free One-Click Deployment

### Option A: GitHub Pages / Custom Domain (shivam.devsload.com)
1. Push this folder to a GitHub repository (e.g., `github.com/shivamvatham/portfolio`).
2. Go to **Settings > Pages**.
3. Under **Custom domain**, enter `shivam.devsload.com` (and add a CNAME record in your DNS pointing `shivam` to `shivamvatham.github.io`).
4. Your site will be live at `https://shivam.devsload.com/`.

### Option B: Vercel / Netlify
1. Drag and drop this folder directly into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Deploys instantly with SSL and global CDN.

---

## 📝 License & Attribution
Designed & developed for **Shivam Vatham** &middot; Software Developer.
