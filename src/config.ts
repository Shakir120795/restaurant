// Central brand + business configuration. Change ONLY this file to rebrand.
// NOTE: WhatsApp number is intentionally blank — the owner must supply it.
// Never invent a phone number here.
export const BRAND = {
  name: 'Zaika House',
  tagline: 'Pure veg multi-cuisine, fresh and made to order.',
  shortTagline: 'Veg multi-cuisine, fresh and made to order.',
  // User-corrected 2026-10-26 (original public listing address is preserved
  // in docs/menu-research.md for provenance).
  // The brand name above is a temporary working name, not the original listing name.
  address: '6, M.I.G., Bodla, Shahganj, Agra, Uttar Pradesh 282010',
  addressShort: 'Shahganj, Agra',
  hours: 'Open daily, 8:00 AM – 11:00 PM',
  hoursNote: 'Hours as listed publicly; confirm with the restaurant before travelling.',
  // PLACEHOLDER ONLY — not a real number. The previously listed call number
  // was removed at the user's request. A random real-looking number was
  // deliberately NOT used, because it could belong to a stranger.
  // Replace this with the owner-confirmed number before launch.
  phoneDisplay: '+91 00000 00000',
  phoneTel: 'tel:+910000000000',
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? '910000000000', // placeholder — replace with owner-confirmed WhatsApp number
  mapsQuery: 'Sattolala Food Court, 6 M.I.G., Bodla, Shahganj, Agra',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Sattolala Food Court, 6 M.I.G., Bodla, Shahganj, Agra'),
  mapsEmbed:
    'https://www.google.com/maps?q=' + encodeURIComponent('Sattolala Food Court, 6 M.I.G., Bodla, Shahganj, Agra') + '&output=embed',
  instagram: '',
  facebook: '',
}

export const ORDER_NOTE =
  'WhatsApp order = confirmation nahi. Restaurant confirm karega tabhi order pakka. Delivery charge / minimum order abhi confirm nahi hai.'
