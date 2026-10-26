import { useState } from 'react'
import { motion } from 'framer-motion'
import { BRAND } from '../config'

// Book Table — a reservation REQUEST, not a confirmed booking.
// There is no booking backend: the request goes to the restaurant via
// WhatsApp (or Copy message while the WhatsApp number is unconfirmed),
// and a table is only reserved once the restaurant confirms it.
const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const h = 8 + i // 08:00 – 22:00
  const label = h <= 12 ? `${h === 12 ? 12 : h}:00 ${h === 12 ? 'PM' : 'AM'}` : `${h - 12}:00 PM`
  return { value: `${String(h).padStart(2, '0')}:00`, label }
})

const todayLocal = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function buildTableMessage(f: { name: string; phone: string; date: string; time: string; guests: string; occasion: string; notes: string }) {
  const timeLabel = TIME_SLOTS.find((t) => t.value === f.time)?.label ?? f.time
  return [
    'Table booking request — Zaika House',
    '',
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Date: ${f.date}`,
    `Time: ${timeLabel}`,
    `Guests: ${f.guests}`,
    ...(f.occasion ? [`Occasion: ${f.occasion}`] : []),
    ...(f.notes ? [`Notes: ${f.notes}`] : []),
    '',
    'Please confirm if a table is available at this time. Booking tabhi confirm hogi jab restaurant confirm kare.',
  ].join('\n')
}

export default function BookTableModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(todayLocal())
  const [time, setTime] = useState('19:00')
  const [guests, setGuests] = useState('2')
  const [occasion, setOccasion] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const form = { name: name.trim(), phone: phone.trim(), date, time, guests, occasion, notes: notes.trim() }

  const validate = () => {
    if (!form.name) return 'Please enter your name.'
    if (form.phone.replace(/\D/g, '').length < 10) return 'Please enter a valid phone number (at least 10 digits).'
    if (!form.date || form.date < todayLocal()) return 'Please pick today or a future date.'
    if (!form.time) return 'Please pick a time.'
    return ''
  }

  const sendWhatsApp = () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    if (!BRAND.whatsappNumber) {
      alert('WhatsApp business number abhi owner se confirm nahi hua hai. Isliye booking message copy karke restaurant ko bhej sakte hain — neeche “Copy booking message” use karein.')
      return
    }
    window.open(`https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(buildTableMessage(form))}`, '_blank')
    setSent(true)
  }

  const copyMessage = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    await navigator.clipboard.writeText(buildTableMessage(form))
    setCopied(true)
  }

  const inputCls = 'w-full border border-orange-200 bg-white rounded-xl px-4 py-3 min-h-11 outline-none focus:ring-2 ring-saffron'

  return (
    <motion.div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-cream w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[2rem] md:rounded-[2rem] p-5" initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Book a Table</h2>
            <p className="text-sm text-stone-500 mt-1">Pure Veg • 8 AM – 11 PM • Request only — restaurant confirmation ke baad hi table pakka hoga.</p>
          </div>
          <button onClick={onClose} className="bg-white border rounded-full w-11 h-11 shrink-0 font-bold" aria-label="Close book table">✕</button>
        </div>

        <div className="mt-5 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name *" className={inputCls} autoComplete="name" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number *" className={inputCls} inputMode="tel" autoComplete="tel" />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-stone-500">Date *</span>
              <input type="date" value={date} min={todayLocal()} onChange={(e) => setDate(e.target.value)} className={`${inputCls} mt-1`} />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-stone-500">Time *</span>
              <select value={time} onChange={(e) => setTime(e.target.value)} className={`${inputCls} mt-1`}>
                {TIME_SLOTS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-stone-500">Guests *</span>
              <select value={guests} onChange={(e) => setGuests(e.target.value)} className={`${inputCls} mt-1`}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'].map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-stone-500">Occasion</span>
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className={`${inputCls} mt-1`}>
                <option value="">None</option>
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Family dinner</option>
                <option>Business meal</option>
              </select>
            </label>
          </div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special request (optional) — e.g. window seat, wheelchair access" className={inputCls} rows={2} />
        </div>

        {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}

        <button onClick={sendWhatsApp} className="w-full bg-leaf text-white py-3.5 rounded-full font-bold mt-5 min-h-11">Send Booking Request on WhatsApp</button>
        <button onClick={copyMessage} className="w-full bg-white border py-3 rounded-full font-semibold mt-2 min-h-11">{copied ? 'Copied ✓' : 'Copy booking message'}</button>
        <a href={BRAND.phoneTel} className="block text-center w-full bg-white border py-3 rounded-full font-semibold mt-2 min-h-11">Or call {BRAND.phoneDisplay}</a>
        <p className="text-xs text-stone-500 mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
          Message bhejne se table reserve NAHI hota. Restaurant ke confirm karne par hi booking pakki hogi. Seating, availability aur koi charge restaurant hi confirm karega.
        </p>
        {sent && (
          <div className="mt-4 bg-white border rounded-2xl p-4">
            <p className="font-semibold">WhatsApp khul gaya hai?</p>
            <p className="text-sm text-stone-500 mt-1">Message send karne ke baad restaurant ki confirmation ka wait karein.</p>
            <button onClick={onClose} className="mt-3 bg-ink text-white px-4 py-2 rounded-full text-sm font-semibold min-h-11">Done</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
