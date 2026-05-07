# KnoWMi — Landing Page v2.0

> India's first QR-enabled identity t-shirt. One scan. Infinite connections.

---

## What is New in v2

- 3D animated phone mockup replacing the flat illustration (metallic frame, reflections, floating animation)
- Live QR scan animation inside the phone screen with animated scanline
- Bento-grid features section for visual hierarchy
- Dark leaderboard section with city filter tabs
- Scroll-reveal animations on every section using IntersectionObserver
- Fully responsive from 320px to 4K
- Premium glassmorphism cards and floating stat chips
- PWA support with install banner
- SEO + Open Graph meta tags built in
- Razorpay inline checkout integrated
- Accessibility — ARIA labels, skip-to-content, semantic HTML throughout

---

## Tech Stack

- Framework: React 18
- Styling: Tailwind CSS v3
- Animations: CSS keyframes + IntersectionObserver
- Fonts: Fraunces (display) + DM Sans (body) + JetBrains Mono
- Payments: Razorpay Checkout.js
- Build: Vite 5
- Deploy: Netlify / Vercel

---

## Quick Start

Requirements: Node.js 18+, npm 9+

```bash
git clone https://github.com/yourusername/knowmi.git
cd knowmi
npm install
npm run dev
# Opens at http://localhost:5173
```

Build for production:

```bash
npm run build
# Output in /dist
```

---

## Project Structure

```
KnowMi/
├── public/
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── PhoneMockup.jsx     <- 3D phone with animated QR screen
│   │   ├── HowItWorks.jsx      <- Marquee + 4-step process
│   │   ├── Features.jsx        <- Bento grid
│   │   ├── Pricing.jsx         <- Razorpay checkout
│   │   ├── Leaderboard.jsx     <- City-filtered scan leaderboard
│   │   ├── Testimonials.jsx
│   │   ├── FAQ.jsx
│   │   ├── Footer.jsx          <- CTA + Footer
│   │   └── PWABanner.jsx
│   ├── hooks/
│   │   └── useReveal.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               <- Tailwind + CSS design tokens
├── index.html
├── vite.config.js
├── tailwind.config.js
├── netlify.toml
└── vercel.json
```

---

## Configuration

### Razorpay

In src/components/Pricing.jsx, replace:

```js
key: 'rzp_test_YOUR_KEY_HERE',
```

Also update WhatsApp fallback: `wa.me/919999999999` -> your number.

### Brand Colours

Edit CSS variables in src/index.css:

```css
:root {
  --saffron: #FF9933;
  --green-india: #138808;
  --navy: #000080;
  --ink: #0A0A0F;
}
```

---

## Deployment

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

Or connect your GitHub repo at netlify.com. Build command: `npm run build`. Publish directory: `dist`.

### Vercel

```bash
npm run build
vercel --prod
```

Or connect at vercel.com. Framework preset: Vite.

---

future prompt: Add my face to Home page

*Built with love for KnoWMi - Wear Your World. Share Your Story.*
