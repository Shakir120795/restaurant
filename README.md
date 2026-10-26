# Zaika House — Premium 3D Restaurant E-Commerce Website

A customer-facing veg multi-cuisine restaurant website for a Shahganj, Agra
restaurant. Temporary working brand: **Zaika House** (change it in one
place: `src/config.ts`).

## What is inside
- React 19 + Vite + TypeScript + Tailwind CSS 4 + GSAP (hero entrance only)
- Lightweight procedural 3D hero (Three.js / React Three Fiber + drei),
  lazy-loaded, with a photo fallback when WebGL is unavailable — the menu
  and cart never depend on WebGL. v2: mouse-parallax camera + thali sway,
  floating garnish, warm point light and sparkles.
- Framer Motion scroll reveals, reduced-motion support.
- **v2 game-style card boxes** (`src/components/GameCard.tsx`, guided by
  ui-ux-pro-max / threejs-webgl / gsap-scrolltrigger-storytelling skills):
  framed box with corner accents, pointer-following shine, desktop-only
  3D tilt (transform/opacity only), gold frame + LEGENDARY badge for
  bestsellers, VERIFIED badge for verified prices. Add button is always
  visible and >=44px — tilt never hides price or CTA, and mobile uses tap.
- **v2 3D dish view** (`src/components/Dish3D.tsx`, lazy-loaded): signature
  dishes open a rotatable/zoomable 3D thali in the detail modal (drag to
  rotate, auto-rotate). Stylised composition, not a scan of the real dish.
- **v3 (2026-10-26):** hero is now full-graphic — Three.js canvas fills a
  dark 560–640px stage with only a small overlay (name, one line, 2 CTAs);
  the big hero headline/paragraphs were removed after user feedback.
  Signature section is now a React Bits **DepthCarousel**
  (`src/components/DepthCarousel.tsx` + `.css`, GSAP, depth 220, spread 90,
  tilt 22, autoplay, loop) showing 8 signature/verified dishes, with a
  compact active-dish bar (name, price, View, Add). All other sections were
  trimmed to minimum text, graphic-first.
- Full menu: **128 dishes, 14 categories** — exactly the Zomato category
  counts found in research (see `docs/menu-research.md`).
- Search, category filter, veg filter, price sort, empty-state handling.
- Dish detail modal: variants, add-ons, quantity, related dishes.
- Cart persisted in `localStorage` (Zustand), subtotal math, WhatsApp order
  message (name, items, variants, add-ons, quantities, subtotal, delivery /
  pickup, address, notes). The cart is cleared only after the restaurant
  confirms — never automatically when WhatsApp opens.
- Location section: verified address, hours, call button, Google Maps
  search embed + directions link.
- SEO: title/meta/OG tags, Restaurant JSON-LD, `robots.txt`, `sitemap.xml`.

## Honest data notes — read before launch
Verified prices (2026-10-26): the full 19-item Sweet category from Zomato
Order Online, plus 6 JustDial/Zomato-snippet items (Dahi Bhalla, Desi Ghee
Bhalla, Pani Puri, Paneer Pasanda, Mushroom Masala, Maharaja Thali).
Every other price in `src/data/menu.ts` is marked
`verification: 'provisional'` and is labelled as such in the dish detail
view. A scanned printed menu with lower, conflicting prices is recorded
in `docs/menu-research.md` but NOT copied into the dataset. The WhatsApp
number is blank by design until the owner confirms it — until then the
cart offers "Copy order message". Delivery charges, minimum order and
service area are NOT claimed. Full detail: `docs/menu-research.md`.

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

## Configure (before launch)
1. `src/config.ts` — brand name, tagline, address, phone, social links.
2. `.env` (copy from `.env.example`) — `VITE_WHATSAPP_NUMBER` only after
   the owner confirms the WhatsApp business number.
3. `src/data/menu.ts` — replace provisional prices, add real dish photos
   (currently generic Unsplash category photos with a fallback image).
4. `public/sitemap.xml` — replace `example.com` with the real domain.

## Deploy
Any static host works: `npm run build`, then deploy `dist/`
(Netlify, Vercel, Cloudflare Pages, or any static server).

## Testing done (2026-10-26)
- `npm run build` — passes (TypeScript + Vite).
- Dev server serves the page with correct title/meta.
- Menu count check: 128 `mk(...)` items in `src/data/menu.ts`.
- Cart/WhatsApp logic reviewed: subtotal = sum of (variant + add-ons) × qty;
  WhatsApp text contains items, quantities, variants, add-ons and subtotal.
- WebGL fallback: if no WebGL context is available, the hero shows a photo
  instead of the 3D scene.
- Remaining manual check for the owner: open the built site on a real
  Android phone, add 2–3 dishes, and verify the WhatsApp message text.
