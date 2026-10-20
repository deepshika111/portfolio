# Deepshika Thakur — portfolio

A personal site built as a library card catalogue: every project is a catalogue card, the career timeline is a date-due slip that gets stamped as you read, and skills are a searchable subject catalogue.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Motion · Lenis. Fonts are self-hosted via Fontsource (Gloock, Instrument Sans, Courier Prime).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Edit content

All copy lives in `lib/content.ts` — name, tagline, about text, projects (`work`), timeline (`record`) and skills (`subjects`). Components only render it.

Before deploying, fill in:
- `site.url` — your real domain (used for SEO, sitemap and Open Graph)
- `site.linkedin` — appears in Contact when set
- `site.resume` — drop `resume.pdf` into `/public` and set this to `/resume.pdf`
- `link` on any `work` item — adds a "View code" style link to its case study

## Deploy to Vercel

Push to GitHub, import the repo at vercel.com/new, keep the defaults. No env vars needed.

## Interactions worth knowing

- Opening sequence plays once per browser session.
- Hero: tap the top card to flip through author, subject and title cards.
- Selected work: on desktop, vertical scroll slides the drawer sideways; on mobile cards stack as you scroll. Any card opens a case study (arrow keys move between cards, Esc closes).
- Record: entries get date-stamped onto the slip as they reach the reading line.
- Subjects: press `/` from anywhere to search; looked-up cards pile up and link back to the work.
- Contact: an ink pool follows the cursor over the headline.
- Double-click any empty spot to stamp the page with today's date.
- Reduced motion turns off the loader, smooth scroll, parallax and pinning; touch devices get no custom cursor and see result stamps without hovering.
