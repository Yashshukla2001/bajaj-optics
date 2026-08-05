# Bajaj Optics — Premium Eyewear Website

A single-page luxury product-reveal experience for Bajaj Optics, built by **Exsora**.

React 19 · Vite · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP ScrollTrigger · Lenis smooth scroll · React Hook Form + Zod · EmailJS (optional)

---

## 1. Setup

```bash
npm install
npm run dev        # http://localhost:5173
```

## 2. Build & Preview

```bash
npm run build       # type-checks, then builds to /dist
npm run preview     # serves the production build locally
npm run lint         # oxlint — zero warnings/errors expected
```

## 3. Environment Variables (optional)

Copy `.env.example` to `.env` if you want appointment/contact submissions to
also send an email via [EmailJS](https://www.emailjs.com/) (free tier, no backend
required). If you skip this, the site works exactly the same — every form still
opens WhatsApp with a pre-filled message, which is the primary lead channel.

```bash
cp .env.example .env
```

Fill in:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## 4. Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo directly in the Vercel dashboard:
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- Add the three `VITE_EMAILJS_*` env vars in Vercel's Project Settings → Environment Variables, if using EmailJS.

## 5. How to Edit Content

**Everything text-based lives in one file:** `src/constants/business.ts`.
No copy is hardcoded inside components. Edit that file to change:

| What | Field |
|---|---|
| Business name, tagline, subtitle | `BUSINESS.name`, `.tagline`, `.subtitle` |
| WhatsApp number | `BUSINESS.whatsappNumber` (digits only, country code, no `+`) |
| Phone number | `BUSINESS.phoneNumber` |
| Email | `BUSINESS.email` |
| Address & map | `BUSINESS.address`, `.mapEmbedUrl`, `.mapDirectionsUrl` |
| Store timings | `BUSINESS.timings` |
| Google rating & review count | `BUSINESS.googleRating`, `.googleReviewCount` |
| "Why Us" cards | `WHY_US` array |
| Product categories | `PRODUCT_CATEGORIES` array |
| Frame showcase items | `FRAME_SHOWCASE` array |
| Eye test steps | `EYE_TEST_STEPS` array |
| Reviews | `REVIEWS` array |
| Owner bio & quote | `OWNER` object |

### Changing the WhatsApp number
Edit `BUSINESS.whatsappNumber` in `src/constants/business.ts`. Format:
country code + number, digits only (e.g. `919876543210` for a +91 number).
Every WhatsApp button and form on the site reads from this one field.

### Changing the Google Map
Go to Google Maps → find your location → Share → Embed a map → copy the `src`
URL from the iframe code → paste into `BUSINESS.mapEmbedUrl`.

### Updating Google Reviews
`REVIEWS` in `src/constants/business.ts` is a plain array — add, remove, or edit
entries directly. There's no live Google API wired in (that requires a paid
Places API key with billing), so review content is maintained here manually.
`BUSINESS.googleRating` / `.googleReviewCount` display the aggregate numbers
shown next to the marquee.

### Replacing Images
This build uses CSS gradients and SVG line-art instead of stock photography, so
there are no licensing concerns and nothing to break if an image link dies.
To add real photography:
1. Drop images into `src/assets/images/`
2. Import them where needed (e.g. in `About.tsx`, `Owner.tsx`, `Products.tsx`)
   and replace the gradient `<div>` with an `<img>` — Vite will hash and
   optimize them automatically on build.

## 6. Project Structure

```
src/
├── components/
│   ├── layout/       Navbar, Footer, FloatingDock (Smart Assistant), Loader
│   ├── sections/      Hero, VisionExperience, About, WhyUs, FaceShapeGuide,
│   │                   Products, FrameShowcase, LensTechnology,
│   │                   BeforeAfterVision, EyeTestJourney, Appointment,
│   │                   Reviews, Owner, Instagram, Location, Contact, FAQ,
│   │                   GrandFinale
│   └── ui/            MagneticButton, SplitReveal, LensReveal (signature
│                       scroll-transition), LensCursor, and other primitives
├── constants/          business.ts — single source of truth for all content
├── hooks/               useLenis.ts — smooth scroll + GSAP ScrollTrigger sync
├── utils/               whatsapp.ts, emailjs.ts
├── App.tsx              Assembles the full scroll story
└── index.css            Design tokens (color/type), Tailwind v4 @theme
```

### The full experience, section by section

1. **Hero** — cinematic, mouse-parallax, scroll-zoom into the lens
2. **Vision Experience** — the page starts blurred; a lens sweeps across on scroll, resolving the world into focus (fully reversible)
3. **About** (behind the first `LensReveal` portal)
4. **Why Us** — premium hover cards
5. **Face Shape Guide** — click a face shape, get frame recommendations, CTA to WhatsApp
6. **Product Collection** — gradient category cards, WhatsApp enquiry
7. **Frame Showcase** — horizontal drag gallery with mouse-tilt 3D cards
8. **Lens Technology** — Blue Cut / Anti-Glare / UV / Scratch-Resistant / Photochromic / Progressive, with a moving glass-reflection sweep on hover
9. **Before / After Vision** — draggable comparison slider, blurred vs crystal-clear
10. **Eye Test Journey** — animated step timeline
11. **Appointment** (behind the second `LensReveal` portal) — Zod-validated booking form
12. **Reviews** — infinite marquee
13. **Owner**, **Instagram**, **Location**, **Contact**, **FAQ** (animated accordion)
14. **Grand Finale** — cinematic closing CTA with mouse-reactive glow and glass reflection streaks
15. **Smart Floating Assistant** (`FloatingDock`) — the WhatsApp bubble's label changes contextually as you scroll through sections (via `IntersectionObserver`)
16. **Lens Cursor** — a custom spectacle-lens cursor with a glass/magnify feel; auto-disabled on touch devices and when `prefers-reduced-motion` is set

## 7. The Signature Interaction

`src/components/ui/LensReveal.tsx` is the site's core visual idea: as you
scroll into a new chapter, content is revealed through an expanding circular
aperture — like walking through the lens itself — fully scrubbed to scroll
position via GSAP ScrollTrigger, so scrolling back up reverses it exactly.
It wraps the About and Appointment sections; reuse it anywhere else you want
that same "emerging through glass" moment.

## 8. Final Verification Checklist

- [x] `npm run build` — no TypeScript errors
- [x] `npm run lint` (oxlint) — 0 warnings, 0 errors
- [x] Fully responsive (mobile nav, fluid type, horizontal-scroll frame gallery)
- [x] Reduced-motion respected (`prefers-reduced-motion` in `index.css`)
- [x] Keyboard focus states on all interactive elements
- [x] WhatsApp deep-links on every CTA, product card, and form
- [x] Appointment form — Zod-validated, WhatsApp + optional EmailJS
- [x] Contact form — Zod-validated, WhatsApp
- [x] Google Map embedded
- [x] Instagram links out to your handle
- [x] No paid libraries or licensed assets used
- [x] Ready to deploy on Vercel

## 9. Maintaining the Project

- Keep dependencies current: `npm outdated` then `npm update`
- All animation timing lives close to where it's used (each section owns its
  own Framer Motion / GSAP calls) — there's no global animation config to hunt through
- Tailwind v4 is configured CSS-first in `src/index.css` under `@theme` — add
  new design tokens there rather than a `tailwind.config.js` (v4 doesn't use one)
