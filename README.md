# 🎣 Hookline — Viral Hook Generator

**Live app:** [hookline-pink.vercel.app](https://hookline-pink.vercel.app)

Paste a raw video idea, get back 10 scroll-stopping hooks, 5 caption options, and an honest audience fit score — in seconds. Built for short-form creators (Reels, TikTok, Shorts) who know the idea but always get stuck on the first line.

![Status](https://img.shields.io/badge/status-live-brightgreen) ![Cost](https://img.shields.io/badge/cost-%240%2Fmonth-blueviolet)

---

## ✨ What it does

- **10 hook options** across proven angles — curiosity gap, bold claim, contrarian take, story cold-open, question hook, and more
- **5 caption ideas** ready to paste straight into your post
- **Audience fit score (0–100)** with honest, idea-specific reasoning — not generic praise
- **Run history** — your last 10 generations are saved automatically so you can revisit old ideas

## 🧠 Why I built this

As a creator, the idea is never the hard part — the first 2 seconds are. I kept rewriting the same hook five different ways before filming, so I built a tool that does that thinking for me and gives me options to choose from instead of staring at a blank caption box.

## 🛠️ Tech stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Fast dev loop, fully custom UI |
| Backend | Supabase Edge Functions (Deno) | Keeps the AI API key server-side, never exposed to the browser |
| Database | Supabase Postgres | Stores every generation for the history panel |
| AI | Groq API (Llama 3.3 70B) | Free tier, extremely fast inference |
| Hosting | Vercel | Free, auto-deploys on every `git push` |

**Total cost to build and run: $0.**

## 🏗️ How it works

```
React app (Vercel)
   │  paste idea → click Generate
   ▼
Supabase Edge Function "generate-hooks"
   │  holds the Groq API key as a secret
   ▼
Groq API (Llama 3.3 70B)
   │  returns 10 hooks + 5 captions + fit score as JSON
   ▼
Edge Function saves the run to Supabase Postgres
   ▼
React app renders results + last 10 runs from history
```

## 📁 Project structure

```
hookline/
├── src/
│   ├── components/
│   │   ├── IdeaForm.jsx       # idea input + generate button
│   │   ├── HookCard.jsx       # single hook, with copy-to-clipboard
│   │   ├── ScoreGauge.jsx     # circular audience fit score
│   │   └── HistoryPanel.jsx   # last 10 generations
│   ├── lib/supabaseClient.js
│   ├── App.jsx
│   └── index.css
├── supabase/
│   └── functions/generate-hooks/index.ts   # calls Groq, saves to DB
└── package.json
```

## 🚀 Run it yourself

```bash
git clone https://github.com/ayushisehgal/hookline.git
cd hookline
npm install
```

Create a `.env` file:
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then:
```bash
npm run dev
```

You'll also need a free [Supabase](https://supabase.com) project (with the `generations` table set up) and a free [Groq](https://console.groq.com) API key set as a secret on your Supabase Edge Function. Full setup steps are in the project commit history / available on request.

## 🎨 Design

Instagram-inspired palette (warm cream background, purple → pink → orange gradient), Fredoka display type for a playful, creator-friendly feel, and a circular progress ring for the fit score instead of a plain number.

## 🔮 Possible next steps

- Auth so each creator has their own private history
- Export hooks as a shareable image/story template
- Platform-specific tuning (TikTok vs. Reels vs. Shorts tone)

---

Built solo in one sitting, shipped free end to end. 🩷
