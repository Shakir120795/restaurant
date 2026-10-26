import { useState } from 'react'
import { BRAND } from '../config'

/**
 * Contact page — light theme, matching the site (cream / white / saffron).
 * Layout idea only from the screenshot reference: left contact blocks,
 * right form card. No people, emails or addresses from that reference are
 * copied — every contact route here is Zaika House's own, and no email
 * address is invented (the site has no verified restaurant email).
 * Sending is WhatsApp / Copy, like orders and table bookings: a message
 * request, not a confirmed booking or a stored inbox message.
 */
export default function ContactPage({ onHome, onLegal, onBook }: { onHome: () => void; onLegal: () => void; onBook: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('General enquiry')
  const [message, setMessage] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const text = `Hello Zaika House, enquiry (${type}) from ${name} (${email}): ${message}`
  const waUrl = BRAND.whatsappNumber
    ? `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(text)}`
    : ''

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <button onClick={onHome} className="text-sm font-semibold text-stone-600 hover:text-saffron">← Back to Home</button>
      <div className="grid lg:grid-cols-2 gap-10 mt-6 items-start">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Talk to the right person, <em>first time.</em>
          </h1>
          <div className="grid sm:grid-cols-2 gap-8 mt-10">
            <div>
              <p className="text-xs tracking-[0.2em] text-stone-500">GENERAL ENQUIRIES</p>
              <div className="mt-3 space-y-2 text-sm">
                {waUrl && <p><a href={waUrl} target="_blank" rel="noreferrer" className="font-semibold hover:text-saffron">Chat on WhatsApp ↗</a></p>}
                <p><a href={BRAND.phoneTel} className="font-semibold hover:text-saffron">Call: {BRAND.phoneDisplay}</a></p>
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] text-stone-500">TABLE BOOKINGS</p>
              <div className="mt-3">
                <button onClick={onBook} className="bg-saffron text-white px-5 py-2.5 rounded-full text-sm font-bold min-h-11">Book a Table</button>
                <p className="text-xs text-stone-500 mt-2">A booking request — the restaurant confirms it.</p>
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] text-stone-500">FIND US</p>
              <p className="mt-3 text-sm leading-relaxed">{BRAND.address}</p>
              <p className="mt-2 text-sm"><a href={BRAND.mapsUrl} target="_blank" rel="noreferrer" className="font-semibold hover:text-saffron">Get Directions ↗</a></p>
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] text-stone-500">TALK TO US</p>
              <p className="mt-3 text-sm"><a href={BRAND.phoneTel} className="font-semibold hover:text-saffron">{BRAND.phoneDisplay}</a></p>
              <p className="text-sm text-stone-500 mt-1">{BRAND.hours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-orange-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Or send us a message — we'll reach out.</h2>
          {sent ? (
            <div className="mt-6">
              <p className="text-sm text-stone-600 leading-relaxed">Your message is ready. Sending it on WhatsApp is a request — the restaurant's reply confirms it. Nothing is stored in an inbox on this site.</p>
              <p className="mt-4 bg-cream2 border border-orange-100 rounded-2xl p-4 text-sm whitespace-pre-wrap">{text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {waUrl && <a href={waUrl} target="_blank" rel="noreferrer" className="bg-saffron text-white px-5 py-2.5 rounded-full text-sm font-bold min-h-11 inline-flex items-center">Send on WhatsApp</a>}
                <button onClick={() => { navigator.clipboard?.writeText(text).catch(() => {}); setCopied(true) }} className="bg-white border border-orange-200 px-5 py-2.5 rounded-full text-sm font-semibold min-h-11">{copied ? 'Copied ✓' : 'Copy message'}</button>
                <button onClick={() => setSent(false)} className="text-sm font-semibold px-3 min-h-11">Edit message</button>
              </div>
            </div>
          ) : (
            <form className="mt-6 grid sm:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <label className="block text-sm font-semibold">Full name
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1.5 w-full border border-orange-200 bg-cream rounded-full px-4 py-3 font-normal outline-none focus:ring-2 ring-saffron min-h-11" />
              </label>
              <label className="block text-sm font-semibold">Email
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5 w-full border border-orange-200 bg-cream rounded-full px-4 py-3 font-normal outline-none focus:ring-2 ring-saffron min-h-11" />
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">Type of enquiry
                <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1.5 w-full border border-orange-200 bg-cream rounded-full px-4 py-3 font-normal outline-none focus:ring-2 ring-saffron min-h-11">
                  <option>General enquiry</option>
                  <option>Table booking</option>
                  <option>Bulk / party order</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">Message
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you need, and when." rows={5} className="mt-1.5 w-full border border-orange-200 bg-cream rounded-3xl px-4 py-3 font-normal outline-none focus:ring-2 ring-saffron" />
              </label>
              <label className="sm:col-span-2 flex items-start gap-2 text-sm text-stone-600">
                <input required type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-[#e8721c]" />
                <span>I have read and agree to the <button type="button" onClick={onLegal} className="underline font-semibold text-ink">Privacy Policy</button>.</span>
              </label>
              <div className="sm:col-span-2 flex justify-end">
                <button type="submit" className="bg-ink text-white px-6 py-3 rounded-full font-bold min-h-11">Send message</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
