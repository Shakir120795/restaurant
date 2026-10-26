import { useEffect, useState } from 'react'
import { BRAND } from '../config'

/**
 * Legal page — Privacy Policy, Terms of Service and About Us, as tabs.
 * Plain language, no legal entity, lawyer or regulator invented here.
 * Everything stated is what this site actually does: cart in the
 * visitor's browser, messages only via WhatsApp / Copy when the
 * visitor chooses that, and prices/bookings that stay provisional
 * until the restaurant confirms.
 *
 * About Us uses only verified facts: pure veg, 128 dishes across
 * 14 categories, Bodla address, hours and FSSAI from public listings.
 * No founder, history or story is invented.
 */
export type LegalTab = 'privacy' | 'terms' | 'about'

const TABS: { id: LegalTab; label: string }[] = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms of Service' },
  { id: 'about', label: 'About Us' },
]

export default function LegalPage({ onHome, onContact, onMenu, initialTab = 'privacy' }: {
  onHome: () => void
  onContact: () => void
  onMenu: () => void
  initialTab?: LegalTab
}) {
  const [tab, setTab] = useState<LegalTab>(initialTab)
  useEffect(() => { setTab(initialTab) }, [initialTab])

  const title = tab === 'about' ? 'About Us' : tab === 'terms' ? 'Terms of Service' : 'Privacy Policy'
  const intro = tab === 'about'
    ? `A pure veg kitchen in Bodla, Shahganj, Agra — fresh and made to order.`
    : tab === 'terms'
      ? `The terms for using this website, in plain language. They are not legal advice.`
      : `This page covers how ${BRAND.name} handles your information. It is written in plain language and is not legal advice.`

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={onHome} className="text-sm font-semibold text-stone-600 hover:text-saffron">← Back to Home</button>
      <p className="text-xs tracking-[0.25em] text-stone-500 mt-6">{tab === 'about' ? 'ZAIKA HOUSE' : 'LEGAL'}</p>
      <h1 className="text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Georgia, serif' }}>{title}</h1>
      <p className="text-stone-600 mt-3 leading-relaxed">{intro}</p>

      <div role="tablist" aria-label="Legal and About sections" className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold min-h-11 ${tab === t.id ? 'bg-saffron text-white shadow' : 'bg-white border border-orange-200 text-ink hover:border-saffron'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'privacy' && (
        <section className="mt-10">
          <div className="space-y-4 text-stone-700 leading-relaxed">
            <p><strong>What we store on this site: almost nothing.</strong> Your cart is kept in your own browser (local storage) so it survives a refresh. We do not run an account system, and we do not store your name, email or phone number on a server from this website.</p>
            <p><strong>Messages you choose to send.</strong> When you send an order, a table-booking request or a contact message, you choose WhatsApp or Copy. A WhatsApp message goes through WhatsApp and is subject to WhatsApp's own policy; a copied message stays with you until you paste and send it yourself. The restaurant's reply — not this website — confirms any order or booking.</p>
            <p><strong>Newsletter form.</strong> The footer newsletter form on this site is front-end only for now: entering an email there does not store it in a mailing list anywhere yet. It will only collect emails once a mailing-list service is connected and this policy is updated to say so.</p>
            <p><strong>Maps and links.</strong> The map and Directions links open Google Maps, which has its own privacy policy. Links to other sites are not covered by this policy.</p>
            <p><strong>Contact about privacy.</strong> Use the <button onClick={onContact} className="underline font-semibold text-ink">Contact page</button> to reach us about anything on this page.</p>
          </div>
        </section>
      )}

      {tab === 'terms' && (
        <section className="mt-10">
          <div className="space-y-4 text-stone-700 leading-relaxed">
            <p><strong>Menu and prices.</strong> The menu lists 128 dishes across 14 categories. 25 prices were verified from public listings; the rest are provisional working prices and need owner confirmation before launch. Prices, availability and hours can change without notice — the restaurant's reply is the final word.</p>
            <p><strong>Orders and bookings are requests.</strong> Sending an order or a table-booking request on WhatsApp (or by copying a message) does not reserve a table or confirm an order. Nothing is confirmed until the restaurant replies and confirms it. Delivery charges, minimum order and delivery area are not confirmed on this site.</p>
            <p><strong>Photos.</strong> Dish photos are representative category photos unless stated otherwise. They may not match the exact dish served.</p>
            <p><strong>About this site.</strong> {BRAND.name} is an independent demo website. It is not affiliated with Google, Zomato or Swiggy. The restaurant is listed at {BRAND.address}, open {BRAND.hours.toLowerCase()}. FSSAI Lic. 12715001001061, as shown in public listings.</p>
            <p><strong>Fair use.</strong> Please do not misuse the contact form, place fake bulk orders, or copy this site's content and present it as your own.</p>
          </div>
        </section>
      )}

      {tab === 'about' && (
        <section className="mt-10">
          <div className="space-y-4 text-stone-700 leading-relaxed">
            <p><strong>A pure veg kitchen, fresh and made to order.</strong> {BRAND.name} serves vegetarian food only, at {BRAND.address}.</p>
            <p><strong>What we serve.</strong> 128 dishes across 14 categories — dosa and South Indian dishes, Chinese, thalis, tandoor and breads, rice, snacks, shakes and coffee, pizza, and sweets.</p>
            <p><strong>Visit us.</strong> Open {BRAND.hours.toLowerCase()}. FSSAI Lic. 12715001001061, as shown in public listings.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white border border-orange-100 rounded-2xl py-4"><p className="text-2xl font-bold text-saffron">128</p><p className="text-xs text-stone-500 mt-1">Dishes</p></div>
            <div className="bg-white border border-orange-100 rounded-2xl py-4"><p className="text-2xl font-bold text-saffron">14</p><p className="text-xs text-stone-500 mt-1">Categories</p></div>
            <div className="bg-white border border-orange-100 rounded-2xl py-4"><p className="text-2xl font-bold text-saffron">100%</p><p className="text-xs text-stone-500 mt-1">Pure Veg</p></div>
            <div className="bg-white border border-orange-100 rounded-2xl py-4"><p className="text-2xl font-bold text-saffron">8–11</p><p className="text-xs text-stone-500 mt-1">AM–PM, daily</p></div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onMenu} className="bg-saffron text-white px-6 py-3 rounded-full font-semibold min-h-11">Explore Our Menu</button>
            <button onClick={onContact} className="bg-white border border-orange-200 px-6 py-3 rounded-full font-semibold min-h-11">Contact Us</button>
          </div>
        </section>
      )}

      <p className="text-sm text-stone-500 mt-10">Last updated: 26 October 2026. If anything on this page changes, the change will be shown here.</p>
    </div>
  )
}
