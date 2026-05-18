# Cleo Ameylia Salsabila — Premium Portfolio

A world-class startup founder portfolio built with Next.js 15, Framer Motion, and Tailwind CSS.  
Includes a full **5-language switcher**, dark/light theme system, and CMD+K command palette.

## 🚀 Quick Start

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🌐 Languages Supported

| Flag | Code | Name             |
|------|------|------------------|
| 🇺🇸  | en   | English          |
| 🇮🇩  | id   | Bahasa Indonesia |
| 🇪🇸  | es   | Español          |
| 🇯🇵  | ja   | 日本語            |
| 🇫🇷  | fr   | Français         |

Language is auto-detected from the browser, and persisted to localStorage.

## ✨ Features

| Feature                        | Status |
|-------------------------------|--------|
| 🌗 Dark / Light / System theme | ✅     |
| 🌐 5-language switcher         | ✅     |
| ⌨️ CMD+K Command Palette        | ✅     |
| 📊 Animated Stats Counters     | ✅     |
| 🎭 Framer Motion Animations    | ✅     |
| 🔮 Glassmorphism Navbar        | ✅     |
| ✨ Particle Canvas Effect       | ✅     |
| 🖱️ Mouse Cursor Glow           | ✅     |
| 📈 Scroll Progress Bar         | ✅     |
| 🎯 Mouse Spotlight Effect      | ✅     |
| 📱 Fully Responsive            | ✅     |
| 🧭 Active Section Tracking     | ✅     |
| 📋 Email Copy Interaction      | ✅     |
| 🚀 Orbit Ring Animation        | ✅     |
| 🌀 Animated Background Grid    | ✅     |

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── globals.css          # Design tokens & global styles
│   ├── layout.tsx           # Root layout with Geist font
│   ├── page.tsx             # Main page composition
│   └── providers.tsx        # Theme + Language providers
├── contexts/
│   └── language-context.tsx # Language state & useLanguage() hook
├── components/
│   ├── effects/             # Particles, Spotlight, Grid bg
│   ├── layout/              # Navbar (with language toggle), Footer
│   ├── sections/            # Hero, About, Companies, Projects,
│   │                        # Stats, Timeline, Services, Contact
│   └── ui/                  # AnimatedCounter, CommandMenu,
│                            # CursorGlow, LanguageToggle,
│                            # ScrollProgress, ThemeToggle
├── hooks/
│   ├── use-magnetic.ts
│   └── use-scroll.ts
└── lib/
    ├── translations.ts      # All strings for 5 languages
    └── utils.ts
```

## 🎨 Customization

### Change Personal Info
Edit data inside each section component under `components/sections/`.

### Add a New Language
In `lib/translations.ts`:
1. Add to `locales` array: `{ code: "de", label: "DE", flag: "🇩🇪", name: "Deutsch" }`
2. Add a matching `de: { ... }` block to `translations`
3. Update the `Locale` type: `"en" | "id" | "es" | "ja" | "fr" | "de"`

### Add Profile Photo
Place `profile.jpg` in `/public/`, then in `hero.tsx` replace the emoji placeholder
with `<Image src="/profile.jpg" alt="Cleo Ameylia Salsabila" fill className="object-cover" />`.

## 🔧 Tech Stack

- **Next.js 15** — App Router, Server Components
- **TypeScript** — Strict mode
- **Tailwind CSS 3.4** — Custom design token system
- **Framer Motion 11** — Animations & transitions
- **next-themes** — Dark / Light / System theme
- **Geist** — Premium Vercel font
- **Lucide React** — Icon library
- **cmdk** — CMD+K command palette

## 📄 License
MIT — Free to use as your own portfolio.
