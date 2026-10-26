import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MenuItem } from '../data/menu'

export type CartLine = {
  key: string
  item: MenuItem
  variant: string
  addons: string[]
  qty: number
}

type CartState = {
  lines: CartLine[]
  add: (item: MenuItem, variant: string, addons: string[]) => void
  remove: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
}

export const lineTotal = (l: CartLine) => {
  const v = l.item.variants?.find((x) => x.label === l.variant)
  const base = v ? v.price : l.item.price
  const addonTotal = l.addons.reduce((s, a) => s + (l.item.addons?.find((x) => x.label === a)?.price ?? 0), 0)
  return (base + addonTotal) * l.qty
}

export const cartSubtotal = (lines: CartLine[]) => lines.reduce((s, l) => s + lineTotal(l), 0)
export const cartCount = (lines: CartLine[]) => lines.reduce((s, l) => s + l.qty, 0)

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (item, variant, addons) =>
        set((st) => {
          const key = `${item.id}|${variant}|${addons.join('+')}`
          const found = st.lines.find((l) => l.key === key)
          if (found) return { lines: st.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) }
          return { lines: [...st.lines, { key, item, variant, addons, qty: 1 }] }
        }),
      remove: (key) => set((st) => ({ lines: st.lines.filter((l) => l.key !== key) })),
      setQty: (key, qty) =>
        set((st) => ({
          lines: qty <= 0 ? st.lines.filter((l) => l.key !== key) : st.lines.map((l) => (l.key === key ? { ...l, qty } : l)),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'agra-zaika-cart-v1' },
  ),
)

export function buildWhatsAppMessage(opts: {
  name: string
  mode: 'Delivery' | 'Pickup'
  address: string
  notes: string
  lines: CartLine[]
}) {
  const parts = [
    `Namaste! Main ${opts.name || 'customer'} hoon, Zaika House se order karna chahta hoon.`,
    '',
    `Order type: ${opts.mode}`,
    ...(opts.mode === 'Delivery' && opts.address ? [`Delivery address: ${opts.address}`] : []),
    '',
    'Items:',
    ...opts.lines.map((l) => {
      const v = l.item.variants?.find((x) => x.label === l.variant)
      const base = v ? v.price : l.item.price
      const addonTotal = l.addons.reduce((s, a) => s + (l.item.addons?.find((x) => x.label === a)?.price ?? 0), 0)
      const unit = base + addonTotal
      return `- ${l.item.name} (${l.variant}${l.addons.length ? ', ' + l.addons.join(', ') : ''}) x ${l.qty} = ₹${unit * l.qty}`
    }),
    '',
    `Subtotal: ₹${cartSubtotal(opts.lines)}`,
    ...(opts.notes ? ['', `Notes: ${opts.notes}`] : []),
    '',
    'Please confirm availability, total (including any delivery charge) and preparation time. Order tabhi confirm hoga jab restaurant confirm kare.',
  ]
  return parts.join('\n')
}
