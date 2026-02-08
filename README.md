# Drumy 🥁

A high-performance, mobile-responsive drum machine built with Next.js and the Web Audio API. Designed for low-latency feedback and seamless cross-device play.

![drumyy](https://github.com/user-attachments/assets/bdc9eccd-98e9-416c-b686-5996fcde3742)


**[Live Demo →](https://alton47.github.io/drumy/)**

---

## 🚀 Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Audio Engine:** Native Web Audio API (Oscillators & Gain Nodes)
* **Deployment:** GitHub Actions + GitHub Pages
* **Language:** TypeScript

## ✨ Key Features

* **Adaptive Grid:** Dynamic layout engine that reconfigures for Desktop (3 rows) and Mobile (5 rows).
* **Zero Samples:** All sounds are synthesized in real-time using oscillators—no bulky audio files to load.
* **Responsive UI:** Full support for touch events and keyboard mapping (QWERTZ/QWERTY).
* **Dual Mode:** Integrated Light/Dark modes with synchronized glow-state transitions.

## 🛠️ Installation & Setup

Clone the repository and install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. Happy Coding!!
