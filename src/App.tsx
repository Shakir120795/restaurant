import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ALL_MENU, CATEGORIES, FALLBACK_IMG, type MenuItem } from './data/menu'
import { BRAND, ORDER_NOTE } from './config'
import { useCart, cartSubtotal, cartCount, buildWhatsAppMessage } from './store/cart'
import GameCard from './components/GameCard'
import ContactPage from './components/ContactPage'
import LegalPage from './components/LegalPage'
import DepthCarousel from './components/DepthCarousel'
import FlexCarousel from './components/FlexCarousel'
import BookTableModal from './components/BookTable'
import ScrollVideoHero from './components/ScrollVideoHero'

const Dish3D = lazy(() => import('./components/Dish3D'))

const inr = (n: number) => `₹${n}`

function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} loading="lazy" className={className} onError={(e) => { if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG }} />
}

export default function App() {
  const [cat, setCat] = useState<string>('All')
  const [q, setQ] = useState('')
  const [vegOnly, setVegOnly] = useState(false)
  const [sort, setSort] = useState<'pop' | 'low' | 'high'>('pop')
  const [detail, setDetail] = useState<MenuItem | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const [webglOk, setWebglOk] = useState(true)
  const lines = useCart((s) => s.lines)
  const add = useCart((s) => s.add)

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      if (!c.getContext('webgl') && !c.getContext('experimental-webgl')) setWebglOk(false)
    } catch { setWebglOk(false) }
  }, [])

  // GSAP entrance (gsap-scrolltrigger-storytelling guidance: transform/opacity only,
  // context cleanup on unmount, reduced-motion respected by the browser's CSS rule).
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (!heroTitleRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(heroTitleRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [])

  const filtered = useMemo(() => {
    let list = ALL_MENU.filter((m) => (cat === 'All' ? true : m.category === cat))
    if (q.trim()) list = list.filter((m) => (m.name + ' ' + m.category + ' ' + m.description).toLowerCase().includes(q.toLowerCase()))
    if (vegOnly) list = list.filter((m) => m.veg)
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'pop') list = [...list].sort((a, b) => Number(b.bestseller ?? false) - Number(a.bestseller ?? false))
    return list
  }, [cat, q, vegOnly, sort])

  const signature = ALL_MENU.filter((m) => m.bestseller)
  // Carousel dishes: bestsellers first, then verified dishes, capped at 8 for the depth stack.
  const carouselDishes = [...signature, ...ALL_MENU.filter((m) => m.verification === 'verified' && !m.bestseller)].slice(0, 8)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [view, setView] = useState<'home' | 'contact' | 'legal'>('home')
  const goHome = (id?: string) => {
    setView('home')
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50)
    else window.scrollTo({ top: 0 })
  }
  useEffect(() => { window.scrollTo(0, 0) }, [view])

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button onClick={() => goHome('top')} className="flex items-center gap-3 text-left">
            <span className="w-10 h-10 rounded-full bg-saffron text-white grid place-items-center font-bold text-xl">Z</span>
            <span className="leading-tight">
              <span className="block font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>{BRAND.name}</span>
              <span className="block text-xs text-stone-500">Pure Veg</span>
            </span>
          </button>
          <nav className="hidden md:flex gap-5 text-sm font-medium">
            <button onClick={() => goHome('signature')}>Menu</button><button onClick={() => goHome('story')}>Our Story</button><button onClick={() => setView('contact')}>Contact</button>
          </nav>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setBookOpen(true)} className="bg-white border border-orange-200 px-3 md:px-4 py-2 rounded-full text-sm font-semibold min-h-11">Book Table</button>
            <button onClick={() => setCartOpen(true)} className="bg-ink text-white px-3 md:px-4 py-2 rounded-full text-sm font-semibold min-h-11">
              Cart • {cartCount(lines)} • {inr(cartSubtotal(lines))}
            </button>
          </div>
        </div>
      </header>

      {view === 'home' ? (<>
      <ScrollVideoHero onBook={() => setBookOpen(true)} />

      {/* SIGNATURE — FlexCarousel (React Bits, real WebGL liquid-lens 3D).
          DepthCarousel was CSS-only depth, which is why it never looked 3D.
          FlexCarousel renders the row through an OGL lens shader that bends
          the images as they move. On devices without WebGL it falls back
          to the previous DepthCarousel so the section still works. */}
      <section id="signature" className="max-w-7xl mx-auto px-4 pt-8 pb-4 scroll-mt-24">
        <h2 className="text-xl font-bold">Signature</h2>
        <div className="relative h-[520px] md:h-[560px]">
          {webglOk ? (
            <FlexCarousel
              items={carouselDishes.map((m) => ({ src: m.image, alt: m.name, title: m.name, subtitle: `${inr(m.price)} • ${m.category}` }))}
              preset="liquid"
              intro="rise"
              cardHeight={0.5}
              gap={12}
              squeeze={0.2}
              focusOnClick
              captions
              autoplay
              interval={4}
              onChange={(i) => setCarouselIdx(i)}
            />
          ) : (
            <DepthCarousel
              items={carouselDishes.map((m) => ({ image: m.image, alt: m.name }))}
              depth={220}
              spread={90}
              tilt={22}
              tiltDirection="right"
              perspective={1400}
              visibleCards={4}
              falloff={0.2}
              blur={6}
              autoplay
              loop
              onChange={(i) => setCarouselIdx(i)}
            />
          )}
        </div>
        {carouselDishes[carouselIdx] && (
          <div className="flex items-center justify-between gap-3 bg-white border border-orange-100 rounded-2xl px-4 py-3 -mt-2 relative z-10">
            <div className="min-w-0">
              <p className="font-bold truncate">{carouselDishes[carouselIdx].name}</p>
              <p className="text-sm text-stone-500">{inr(carouselDishes[carouselIdx].price)}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setDetail(carouselDishes[carouselIdx])} className="min-h-11 border border-ink px-4 py-2 rounded-full text-sm font-semibold">View</button>
              <button onClick={() => { const d = carouselDishes[carouselIdx]; if (d.variants?.length || d.addons?.length) setDetail(d); else add(d, d.variants?.[0]?.label ?? 'Regular', []) }} className="min-h-11 bg-saffron text-white px-5 py-2 rounded-full text-sm font-bold">Add +</button>
            </div>
          </div>
        )}
      </section>

      {/* MENU */}
      <main id="menu" className="max-w-7xl mx-auto px-4 pb-16 scroll-mt-24">
        <h2 className="text-xl font-bold">Menu</h2>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes — e.g. dosa, paneer, thali…" className="flex-1 border border-orange-200 bg-white rounded-full px-5 py-3 outline-none focus:ring-2 ring-saffron" aria-label="Search dishes" />
          <select value={sort} onChange={(e) => setSort(e.target.value as never)} className="border border-orange-200 bg-white rounded-full px-4 py-3">
            <option value="pop">Sort: Popular first</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option>
          </select>
          <label className="flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-3 text-sm font-medium cursor-pointer">
            <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} /> Veg only
          </label>
        </div>
        {/* Minimized filter bar: categories live inside a collapsible panel, not a long chip wall */}
        <div className="mt-3 flex items-center gap-2">
          <button onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen} className="min-h-11 bg-ink text-white px-4 py-2 rounded-full text-sm font-semibold">
            Filter {cat !== 'All' ? `: ${cat}` : ''} {filtersOpen ? '▲' : '▼'}
          </button>
          {cat !== 'All' && (
            <button onClick={() => setCat('All')} className="min-h-11 border border-orange-200 bg-white px-4 py-2 rounded-full text-sm font-semibold">Clear ×</button>
          )}
          <span className="text-sm text-stone-500 ml-auto">{filtered.length} dishes</span>
        </div>
        {filtersOpen && (
          <div className="mt-3 bg-white border border-orange-100 rounded-2xl p-3 flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => { setCat(c); setFiltersOpen(false) }} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border ${cat === c ? 'bg-saffron text-white border-saffron' : 'bg-white border-orange-200'}`}>
                {c} · {c === 'All' ? ALL_MENU.length : ALL_MENU.filter((m) => m.category === c).length}
              </button>
            ))}
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center mt-5">
            <p className="text-xl font-semibold">Kuch nahi mila</p>
            <button onClick={() => { setQ(''); setCat('All') }} className="mt-4 bg-ink text-white px-5 py-2 rounded-full">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
            {filtered.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.35, delay: Math.min(i % 8 * 0.04, 0.3) }}>
                <GameCard m={m} onOpen={() => setDetail(m)} onAdd={() => { if (m.variants?.length || m.addons?.length) setDetail(m); else add(m, m.variants?.[0]?.label ?? 'Regular', []) }} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* STORY + VISIT — graphic-led, one line of text */}
      <section id="story" className="max-w-7xl mx-auto px-4 pb-12 scroll-mt-24">
        <div className="bg-white rounded-[2rem] overflow-hidden grid md:grid-cols-2 shadow-sm">
          <Img src={ALL_MENU.find((m) => m.name === 'Maharaja Thali')!.image} alt="Maharaja thali" className="w-full h-64 md:h-full object-cover" />
          <div className="p-6 md:p-8" id="visit">
            <h2 className="text-xl font-bold">Visit Us</h2>
            <p className="text-stone-600 mt-2 text-sm">Bedai • Dosa • Thali • Mithai — veg, fresh.</p>
            <p className="text-stone-600 mt-3 text-sm">{BRAND.address}<br />{BRAND.hours}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => setBookOpen(true)} className="bg-saffron text-white px-4 py-2 rounded-full text-sm font-semibold min-h-11">Book Table</button>
              <a href={BRAND.phoneTel} className="bg-leaf text-white px-4 py-2 rounded-full text-sm font-semibold min-h-11 inline-flex items-center">Call</a>
              <a href={BRAND.mapsUrl} target="_blank" rel="noreferrer" className="bg-ink text-white px-4 py-2 rounded-full text-sm font-semibold min-h-11 inline-flex items-center">Directions</a>
            </div>
            <iframe title="Map to Shahganj, Agra" src={BRAND.mapsEmbed} className="w-full h-48 rounded-2xl border mt-4" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            {/* Persistent fallback: cross-origin iframes can't be reliably
                detected as failed, so this card is always visible under the
                map — if the embed is blocked, users still get the address
                and Directions instead of a grey broken box. */}
            <div className="mt-3 bg-cream2 border border-orange-100 rounded-2xl p-3 flex items-center justify-between gap-3">
              <p className="text-sm text-stone-600">Map not loading? {BRAND.address}</p>
              <a href={BRAND.mapsUrl} target="_blank" rel="noreferrer" className="shrink-0 bg-ink text-white px-4 py-2 rounded-full text-sm font-semibold min-h-11 inline-flex items-center">Directions ↗</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer — minimal light style with a pill newsletter form,
          matching the site's cream/saffron theme (not dark).
          Original code written for Zaika House (not the React Bits Pro
          source, which remains locked behind its license); only the
          generic layout idea is reused: letterspaced headings,
          bottom copyright + pill form. */}
      </>) : view === 'contact' ? (
        <ContactPage onHome={() => goHome()} onLegal={() => setView('legal')} onBook={() => setBookOpen(true)} />
      ) : (
        <LegalPage onHome={() => goHome()} onContact={() => setView('contact')} />
      )}
      <footer className="bg-cream text-ink border-t border-orange-100 mt-4 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
          <div>
            <p className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-saffron text-white grid place-items-center font-bold text-xl">Z</span>
              <span className="font-bold leading-tight">ZAIKA<br />HOUSE</span>
            </p>
            <p className="text-sm text-black mt-4">128 dishes · 14 categories</p>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs tracking-[0.25em] text-black">NAVIGATION</p>
            <ul className="mt-4 space-y-3">
              <li><button onClick={() => goHome('top')} className="hover:text-saffron">Home</button></li>
              <li><button onClick={() => goHome('menu')} className="hover:text-saffron">Menu</button></li>
              <li><button onClick={() => goHome('visit')} className="hover:text-saffron">Visit Us</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-saffron">Contact</button></li>
              <li><button onClick={() => setView('legal')} className="hover:text-saffron">Legal</button></li>
            </ul>
          </nav>
          <div>
            <p className="text-xs tracking-[0.25em] text-black">WHO WE ARE</p>
            <p className="text-xl leading-snug mt-4">A pure veg kitchen,<br />fresh and made<br />to order.</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] text-black">CONTACT</p>
            <ul className="mt-4 space-y-3 text-sm text-black">
              <li><a href={BRAND.phoneTel} className="hover:text-saffron">Call: {BRAND.phoneDisplay}</a></li>
              <li><a href={BRAND.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-saffron">Get Directions</a></li>
              <li><button onClick={() => setBookOpen(true)} className="hover:text-saffron">Book a Table</button></li>
            </ul>
            <p className="text-sm text-black mt-4 leading-relaxed">{BRAND.address}<br />{BRAND.hours}</p>
          </div>
        </div>
        <div className="border-t border-orange-100">
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 lg:items-end justify-between">
            <div className="text-sm text-black leading-relaxed">
              <p>© 2026 · {BRAND.name} · FSSAI Lic. 12715001001061</p>
              <p className="mt-1"><button onClick={() => setView('legal')} className="underline hover:text-saffron">Privacy Policy</button> • <button onClick={() => setView('legal')} className="underline hover:text-saffron">Terms of Service</button> • <button onClick={() => setView('contact')} className="underline hover:text-saffron">Contact</button></p>
              <p className="mt-1">Independent demo — not affiliated with Google, Zomato or Swiggy.</p>
            </div>
            <div className="w-full lg:w-[420px]">
              <p className="text-xs tracking-[0.25em] text-black mb-3">GET UPDATES</p>
              {subscribed ? (
                <p className="text-sm text-black py-3">Thanks — you're on the list.</p>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubscribed(true) }}
                  className="flex items-center border border-orange-200 bg-white rounded-full p-1.5 pl-5"
                >
                  <label htmlFor="footer-email" className="sr-only">Email address</label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    placeholder="E-MAIL"
                    className="bg-transparent flex-1 min-w-0 outline-none text-sm tracking-widest placeholder:text-stone-700"
                  />
                  <button type="submit" className="shrink-0 bg-saffron text-white rounded-full px-5 py-2.5 text-xs font-bold tracking-widest min-h-11">GET UPDATES</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {detail && <DetailModal key="detail" item={detail} onClose={() => setDetail(null)} onRelated={(m) => setDetail(m)} />}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && <CartDrawer key="cart" onClose={() => setCartOpen(false)} />}
      </AnimatePresence>

      {/* Floating WhatsApp button, bottom-right — above the mobile tab bar */}
      {!cartOpen && !bookOpen && BRAND.whatsappNumber && (
        <a
          href={`https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent('Namaste! Zaika House ke baare me jaanna chahta hoon.')}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-20 md:bottom-6 right-4 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full grid place-items-center text-2xl shadow-xl"
        >
          💬
        </a>
      )}

      {/* Book Table modal */}
      <AnimatePresence>
        {bookOpen && <BookTableModal key="book" onClose={() => setBookOpen(false)} />}
      </AnimatePresence>

      {/* Mobile app view: bottom tab bar, like a native app shell (phones only) */}
      {!cartOpen && !bookOpen && (
        <nav aria-label="App navigation" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cream/95 backdrop-blur border-t border-orange-100 px-2 pt-1 pb-[env(safe-area-inset-bottom)] grid grid-cols-4">
          <a href="#top" className="flex flex-col items-center py-2 text-[11px] font-semibold min-h-11 justify-center"><span className="text-lg leading-none">🏠</span>Home</a>
          <a href="#menu" className="flex flex-col items-center py-2 text-[11px] font-semibold min-h-11 justify-center"><span className="text-lg leading-none">🍽️</span>Menu</a>
          <button onClick={() => setBookOpen(true)} className="flex flex-col items-center py-2 text-[11px] font-semibold min-h-11 justify-center"><span className="text-lg leading-none">📅</span>Book</button>
          <button onClick={() => setCartOpen(true)} className="relative flex flex-col items-center py-2 text-[11px] font-semibold min-h-11 justify-center">
            <span className="text-lg leading-none">🛒</span>Cart
            {cartCount(lines) > 0 && <span className="absolute top-1 right-4 bg-saffron text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{cartCount(lines)}</span>}
          </button>
        </nav>
      )}
    </div>
  )
}

function DetailModal({ item, onClose, onRelated }: { item: MenuItem; onClose: () => void; onRelated: (m: MenuItem) => void }) {
  const add = useCart((s) => s.add)
  const [variant, setVariant] = useState(item.variants?.[0]?.label ?? 'Regular')
  const [addons, setAddons] = useState<string[]>([])
  const [qty, setQty] = useState(1)
  const related = ALL_MENU.filter((m) => m.category === item.category && m.id !== item.id).slice(0, 4)
  const unit = (item.variants?.find((v) => v.label === variant)?.price ?? item.price) + addons.reduce((s, a) => s + (item.addons?.find((x) => x.label === a)?.price ?? 0), 0)
  return (
    <motion.div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-cream w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[2rem] md:rounded-[2rem] p-5" initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{item.name}</h2>
          <button onClick={onClose} className="bg-white border rounded-full w-9 h-9 font-bold" aria-label="Close">✕</button>
        </div>
        {item.bestseller ? (
          <div className="rounded-3xl overflow-hidden mt-4 h-72 bg-cream2">
            <Suspense fallback={<Img src={item.image} alt={item.name} className="w-full h-full object-cover" />}>
              <Dish3D />
            </Suspense>
            <p className="text-center text-xs text-stone-500 pb-2 -mt-2">Drag karke ghumayein, zoom kar sakte hain — stylised 3D thali, asli dish ka scan nahi hai.</p>
          </div>
        ) : (
          <div className="rounded-3xl overflow-hidden mt-4 h-64">
            <Img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
        )}
        <p className="text-stone-600 mt-4">{item.description}</p>
        <p className="text-sm text-stone-500 mt-2">{item.category}{item.portion ? ` • ${item.portion}` : ''} • VEG • Price status: <b>{item.verification === 'verified' ? 'Verified in public listing' : 'Provisional — owner confirmation pending'}</b></p>
        {item.variants && (
          <div className="mt-4"><p className="font-semibold text-sm">Size / Variant</p>
            <div className="flex gap-2 mt-2 flex-wrap">{item.variants.map((v) => <button key={v.label} onClick={() => setVariant(v.label)} className={`px-4 py-2 rounded-full border text-sm ${variant === v.label ? 'bg-ink text-white' : 'bg-white'}`}>{v.label} • {inr(v.price)}</button>)}</div>
          </div>
        )}
        {item.addons && (
          <div className="mt-4"><p className="font-semibold text-sm">Add-ons</p>
            <div className="flex gap-2 mt-2 flex-wrap">{item.addons.map((a) => <button key={a.label} onClick={() => setAddons((p) => p.includes(a.label) ? p.filter((x) => x !== a.label) : [...p, a.label])} className={`px-4 py-2 rounded-full border text-sm ${addons.includes(a.label) ? 'bg-saffron text-white' : 'bg-white'}`}>{a.label} • +{inr(a.price)}</button>)}</div>
          </div>
        )}
        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 bg-white border rounded-full px-2 py-1">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 font-bold">−</button><span className="font-bold">{qty}</span><button onClick={() => setQty(qty + 1)} className="w-8 h-8 font-bold">+</button>
          </div>
          <span className="font-bold text-xl">{inr(unit * qty)}</span>
          <button onClick={() => { for (let i = 0; i < qty; i++) add(item, variant, addons); onClose() }} className="bg-saffron text-white px-6 py-3 rounded-full font-bold">Add to Cart</button>
        </div>
        <p className="text-xs text-stone-400 mt-3">Signature (LEGENDARY) dishes ka detail view me rotatable 3D thali dikhta hai. Baaki dishes ke liye photography hai — use 3D scan ki tarah present nahi kiya gaya hai.</p>
        {related.length > 0 && (
          <div className="mt-6"><p className="font-bold">You may also like</p>
            <div className="grid grid-cols-2 gap-3 mt-3">{related.map((r) => <button key={r.id} onClick={() => onRelated(r)} className="bg-white rounded-2xl p-3 text-left border"><span className="block font-semibold text-sm">{r.name}</span><span className="text-sm text-stone-500">{inr(r.price)}</span></button>)}</div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function CartDrawer({ onClose }: { onClose: () => void }) {
  const lines = useCart((s) => s.lines)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)
  const clear = useCart((s) => s.clear)
  const [name, setName] = useState('')
  const [mode, setMode] = useState<'Delivery' | 'Pickup'>('Pickup')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [sent, setSent] = useState(false)

  const sendWhatsApp = () => {
    if (!BRAND.whatsappNumber) {
      alert('WhatsApp business number abhi owner se confirm nahi hua hai. Isliye order message copy karke restaurant ko bhej sakte hain — neeche “Copy order” use karein.')
      return
    }
    const msg = buildWhatsAppMessage({ name, mode, address, notes, lines })
    window.open(`https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
  }
  const copyOrder = async () => {
    await navigator.clipboard.writeText(buildWhatsAppMessage({ name, mode, address, notes, lines }))
    alert('Order message copy ho gaya hai.')
  }
  const finishAfterConfirmation = () => { clear(); setSent(false); onClose() }

  return (
    <motion.div className="fixed inset-0 z-50 bg-black/50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.aside className="bg-cream w-full max-w-md h-full overflow-y-auto p-5" initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Your Order</h2>
          <button onClick={onClose} className="bg-white border rounded-full w-9 h-9 font-bold" aria-label="Close cart">✕</button>
        </div>
        {lines.length === 0 ? (
          <p className="text-stone-500 mt-6">Cart khaali hai. Menu se koi dish add karein.</p>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {lines.map((l) => (
                <div key={l.key} className="bg-white rounded-2xl p-3 border flex gap-3">
                  <Img src={l.item.image} alt={l.item.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-snug">{l.item.name}</p>
                    <p className="text-xs text-stone-500">{l.variant}{l.addons.length ? ` • ${l.addons.join(', ')}` : ''}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border rounded-full px-1">
                        <button onClick={() => setQty(l.key, l.qty - 1)} className="w-7 h-7 font-bold">−</button><span className="text-sm font-bold">{l.qty}</span><button onClick={() => setQty(l.key, l.qty + 1)} className="w-7 h-7 font-bold">+</button>
                      </div>
                      <span className="font-bold text-sm">{inr((l.item.variants?.find((v) => v.label === l.variant)?.price ?? l.item.price) * l.qty + l.addons.reduce((s, a) => s + (l.item.addons?.find((x) => x.label === a)?.price ?? 0), 0) * l.qty)}</span>
                      <button onClick={() => remove(l.key)} className="text-xs text-red-600 font-semibold">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg mt-5"><span>Subtotal</span><span>{inr(cartSubtotal(lines))}</span></div>
            <p className="text-xs text-stone-500 mt-1">Delivery charge / taxes, agar applicable hain, restaurant confirm karega — yahan add nahi kiye gaye hain.</p>

            <div className="mt-5 space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="w-full border bg-white rounded-xl px-4 py-3" />
              <div className="flex gap-2">
                {(['Delivery', 'Pickup'] as const).map((m) => <button key={m} onClick={() => setMode(m)} className={`flex-1 py-3 rounded-full border font-semibold ${mode === m ? 'bg-ink text-white' : 'bg-white'}`}>{m}</button>)}
              </div>
              {mode === 'Delivery' && <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" className="w-full border bg-white rounded-xl px-4 py-3" />}
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes — e.g. less spicy, no onion" className="w-full border bg-white rounded-xl px-4 py-3" />
            </div>
            <button onClick={sendWhatsApp} className="w-full bg-leaf text-white py-3.5 rounded-full font-bold mt-5">Send Order on WhatsApp</button>
            <button onClick={copyOrder} className="w-full bg-white border py-3 rounded-full font-semibold mt-2">Copy order message</button>
            <button onClick={() => { clear() }} className="w-full text-sm text-stone-500 py-2 mt-1">Clear cart</button>
            <p className="text-xs text-stone-500 mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">{ORDER_NOTE}</p>
            {sent && (
              <div className="mt-4 bg-white border rounded-2xl p-4">
                <p className="font-semibold">WhatsApp khul gaya hai?</p>
                <p className="text-sm text-stone-500 mt-1">Message send karne ke baad, restaurant ki confirmation ka wait karein. Confirmation milne par hi cart clear karein.</p>
                <button onClick={finishAfterConfirmation} className="mt-3 bg-ink text-white px-4 py-2 rounded-full text-sm font-semibold">Restaurant ne confirm kiya — Clear cart</button>
              </div>
            )}
          </>
        )}
      </motion.aside>
    </motion.div>
  )
}
