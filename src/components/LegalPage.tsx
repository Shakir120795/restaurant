import { BRAND } from '../config'

/**
 * Legal page — Privacy Policy + Terms of Service, in plain language.
 * No legal entity, lawyer or regulator is invented here. Everything
 * stated is what this site actually does: cart in the visitor's browser,
 * messages only via WhatsApp / Copy when the visitor chooses that, and
 * prices/bookings that stay provisional until the restaurant confirms.
 */
export default function LegalPage({ onHome, onContact }: { onHome: () => void; onContact: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={onHome} className="text-sm font-semibold text-stone-600 hover:text-saffron">← Back to Home</button>
      <h1 className="text-3xl md:text-4xl font-bold mt-6" style={{ fontFamily: 'Georgia, serif' }}>Legal</h1>
      <p className="text-stone-600 mt-3 leading-relaxed">
        This page covers how {BRAND.name} handles your information and the terms for using this website.
        It is written in plain language and is not legal advice.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Privacy Policy</h2>
        <div className="mt-4 space-y-4 text-stone-700 leading-relaxed">
          <p><strong>What we store on this site: almost nothing.</strong> Your cart is kept in your own browser (local storage) so it survives a refresh. We do not run an account system, and we do not store your name, email or phone number on a server from this website.</p>
          <p><strong>Messages you choose to send.</strong> When you send an order, a table-booking request or a contact message, you choose WhatsApp or Copy. A WhatsApp message goes through WhatsApp and is subject to WhatsApp's own policy; a copied message stays with you until you paste and send it yourself. The restaurant's reply — not this website — confirms any order or booking.</p>
          <p><strong>Newsletter form.</strong> The footer newsletter form on this site is front-end only for now: entering an email there does not store it in a mailing list anywhere yet. It will only collect emails once a mailing-list service is connected and this policy is updated to say so.</p>
          <p><strong>Maps and links.</strong> The map and Directions links open Google Maps, which has its own privacy policy. Links to other sites are not covered by this policy.</p>
          <p><strong>Contact about privacy.</strong> Use the <button onClick={onContact} className="underline font-semibold text-ink">Contact page</button> to reach us about anything on this page.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Terms of Service</h2>
        <div className="mt-4 space-y-4 text-stone-700 leading-relaxed">
          <p><strong>Menu and prices.</strong> The menu lists 128 dishes across 14 categories. 25 prices were verified from public listings; the rest are provisional working prices and need owner confirmation before launch. Prices, availability and hours can change without notice — the restaurant's reply is the final word.</p>
          <p><strong>Orders and bookings are requests.</strong> Sending an order or a table-booking request on WhatsApp (or by copying a message) does not reserve a table or confirm an order. Nothing is confirmed until the restaurant replies and confirms it. Delivery charges, minimum order and delivery area are not confirmed on this site.</p>
          <p><strong>Photos.</strong> Dish photos are representative category photos unless stated otherwise. They may not match the exact dish served.</p>
          <p><strong>About this site.</strong> {BRAND.name} is an independent demo website. It is not affiliated with Google, Zomato or Swiggy. The restaurant is listed at {BRAND.address}, open {BRAND.hours.toLowerCase()}. FSSAI Lic. 12715001001061, as shown in public listings.</p>
          <p><strong>Fair use.</strong> Please do not misuse the contact form, place fake bulk orders, or copy this site's content and present it as your own.</p>
        </div>
      </section>

      <p className="text-sm text-stone-500 mt-10">Last updated: 26 October 2026. If anything on this page changes, the change will be shown here.</p>
    </div>
  )
}
