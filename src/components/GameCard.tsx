import { useRef, useState } from 'react'
import { FALLBACK_IMG, type MenuItem } from '../data/menu'

/**
 * Game-style card box, built to ui-ux-pro-max rules:
 * - transform/opacity only (no layout animation), tap-first on mobile (Add is always visible, >=44px),
 * - hover tilt is desktop-only enhancement; it never hides the price or CTA.
 *
 * Card layout (user request): 70% image / 30% text.
 * The whole card opens the detail view (same DetailModal the carousel's
 * View button opens) — variants, add-ons, qty and related dishes live
 * there. The Add button only adds directly for dishes with no variants
 * or add-ons; for customisable dishes it opens the detail view instead,
 * so an add-on choice is never bypassed by a direct add.
 */
export default function GameCard({ m, onOpen, onAdd }: { m: MenuItem; onOpen: () => void; onAdd: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, glow: 0 })
  const customisable = Boolean(m.variants?.length || m.addons?.length)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setT({ rx: (0.5 - py) * 10, ry: (px - 0.5) * 12, gx: px * 100, gy: py * 100, glow: 1 })
  }
  const onLeave = () => setT({ rx: 0, ry: 0, gx: 50, gy: 50, glow: 0 })

  return (
    <div style={{ perspective: '900px' }} className="h-full">
      <article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
        aria-label={`View ${m.name} details`}
        style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`, willChange: 'transform' }}
        className={`game-card relative bg-white rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer ${m.bestseller ? 'game-card--gold' : ''}`}
      >
        {/* shine following the pointer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{ opacity: t.glow * 0.5, background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.65), transparent 55%)` }}
        />
        {/* corner accents — the "card box" frame */}
        <span aria-hidden className="game-corner game-corner--tl" />
        <span aria-hidden className="game-corner game-corner--tr" />
        <span aria-hidden className="game-corner game-corner--bl" />
        <span aria-hidden className="game-corner game-corner--br" />

        {/* 70% — image */}
        <div className="relative flex-[7] min-h-0 overflow-hidden">
          <img
            src={m.image}
            alt={m.name}
            loading="lazy"
            className="food-img w-full h-full object-cover"
            onError={(e) => { if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG }}
          />
          {m.bestseller && (
            <span className="absolute top-3 left-3 bg-amber-400 text-amber-950 text-xs font-extrabold px-2.5 py-1 rounded-full shadow">★ LEGENDARY</span>
          )}
          {m.verification === 'verified' && (
            <span className="absolute top-3 right-3 bg-leaf text-white text-xs font-bold px-2 py-1 rounded-full shadow">✓ VERIFIED</span>
          )}
        </div>

        {/* 30% — text */}
        <div className="p-3 flex-[3] min-h-0 flex flex-col">
          <div className="flex justify-between gap-2">
            <h3 className="font-bold leading-tight line-clamp-1">{m.name}</h3>
            <span className="text-leaf text-xs font-bold border border-green-200 rounded px-1.5 py-0.5 h-fit shrink-0">VEG</span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5 truncate">{m.category}{m.portion ? ` • ${m.portion}` : ''}{customisable ? ' • Add-ons available' : ''}</p>
          <div className="mt-auto pt-2 flex items-center justify-between gap-2">
            <span className="font-extrabold bg-cream2 border border-orange-200 rounded-full px-3 py-1">₹{m.price}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onAdd() }}
              aria-label={customisable ? `Customise ${m.name}` : `Add ${m.name} to cart`}
              className="min-h-11 bg-saffron text-white px-5 py-2 rounded-full text-sm font-bold shadow-md shadow-orange-200 active:scale-95 transition-transform"
            >
              Add +
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
