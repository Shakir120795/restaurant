export type MenuItem = {
  id: string
  name: string
  category: string
  price: number
  description: string
  portion?: string
  veg: boolean
  /** 'verified' = price/name seen in a public listing snippet; 'provisional' = working price for owner confirmation before launch. */
  verification: 'verified' | 'provisional'
  image: string
  variants?: { label: string; price: number }[]
  addons?: { label: string; price: number }[]
  bestseller?: boolean
}

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`
export const FALLBACK_IMG = U('photo-1540189549336-e6e99c7f0f0')

const IMG = {
  dosa: U('photo-1630383249896-424e482df921'),
  sweet: U('photo-1551024506-0bccd828d307'),
  snack: U('photo-1601050690597-df0568f70950'),
  curry: U('photo-1565557623262-b51c2513a641'),
  pizza: U('photo-1565299624946-b28f40a0ae38'),
  shake: U('photo-1577805947697-89e18249d767'),
  chinese: U('photo-1585032226651-759b368d7246'),
  rice: U('photo-1512058564366-18510be2db19'),
  thali: U('photo-1546833999-b9f581a1996d'),
  bread: U('photo-1509440159596-0249088772ff'),
  biryani: U('photo-1589302168068-964664d93dc0'),
}

const ADDONS = [
  { label: 'Extra Cheese', price: 30 },
  { label: 'Extra Butter', price: 20 },
]
const DOSA_ADDONS = [
  { label: 'Extra Butter', price: 20 },
  { label: 'Extra Chutney', price: 10 },
]

let n = 0
const mk = (
  name: string,
  category: string,
  price: number,
  description: string,
  image: string,
  opts: Partial<MenuItem> = {},
): MenuItem => ({
  id: `m${++n}`,
  name,
  category,
  price,
  description,
  veg: true,
  verification: 'provisional',
  image,
  ...opts,
})
const ver = (item: MenuItem): MenuItem => ({ ...item, verification: 'verified' })

export const CATEGORIES = [
  'Best in Dosa',
  'Season Specials',
  'Agra Ka Zaika',
  'Apni Pasand',
  'Pizza',
  'Snacks',
  'Shakes & Coffee',
  'South Indian',
  'Chinese',
  'Chinese Combos',
  'Thali',
  'Tandoor & Breads',
  'Rice / Pulao',
  'Sweet',
] as const

export const MENU: MenuItem[] = [
  // Best in Dosa (10) — category count verified on Zomato
  mk('Plain Dosa', 'Best in Dosa', 90, 'Crisp rice-lentil crepe, served with sambar and chutneys.', IMG.dosa, { addons: DOSA_ADDONS }),
  mk('Masala Dosa', 'Best in Dosa', 120, 'Golden dosa filled with spiced potato masala.', IMG.dosa, { addons: DOSA_ADDONS, bestseller: true }),
  mk('Paneer Dosa', 'Best in Dosa', 160, 'Dosa filled with paneer — no potatoes, as noted on the listing.', IMG.dosa, { addons: DOSA_ADDONS }),
  mk('Cheese Dosa', 'Best in Dosa', 170, 'Crisp dosa with a melting cheese filling.', IMG.dosa, { addons: DOSA_ADDONS }),
  mk('Mysore Masala Dosa', 'Best in Dosa', 150, 'Spicy red chutney base with potato masala.', IMG.dosa, { addons: DOSA_ADDONS }),
  mk('Onion Dosa', 'Best in Dosa', 130, 'Dosa topped with caramelised onion and fresh coriander.', IMG.dosa, { addons: DOSA_ADDONS }),
  mk('Rava Dosa', 'Best in Dosa', 160, 'Extra-crisp semolina dosa, light and golden.', IMG.dosa, { addons: DOSA_ADDONS }),
  mk('Butter Dosa', 'Best in Dosa', 120, 'Classic dosa finished generously with butter.', IMG.dosa, { addons: DOSA_ADDONS }),
  mk('Paneer Tikka Dosa', 'Best in Dosa', 190, 'Smoky paneer tikka folded into a crisp dosa.', IMG.dosa, { addons: DOSA_ADDONS }),
  mk('Special Zaika Dosa', 'Best in Dosa', 200, 'House-special dosa with paneer and signature chutneys.', IMG.dosa, { addons: DOSA_ADDONS, bestseller: true }),

  // Season Specials (1) — name verified on Zomato
  mk('Refined Gunjia (with syrup)', 'Season Specials', 60, 'Seasonal festive sweet, served with syrup. Name verified on Zomato; price is provisional for the current season.', IMG.sweet, { portion: '1 pc' }),

  // Agra Ka Zaika (2) — bedai/kachori fame verified in reviews
  mk('Bedai Aloo', 'Agra Ka Zaika', 70, 'Agra-style bedai served with spicy aloo sabzi — the local breakfast favourite.', IMG.snack, { bestseller: true }),
  mk('Kachori Sabzi', 'Agra Ka Zaika', 60, 'Crisp kachori with hot aloo sabzi and chutneys.', IMG.snack),

  // Apni Pasand (20)
  ver(mk('Paneer Pasanda', 'Apni Pasand', 610, 'Rich paneer preparation from the house main-course list.', IMG.curry)),
  ver(mk('Mushroom Masala', 'Apni Pasand', 495, 'Mushroom cooked in a spiced tomato-onion masala.', IMG.curry)),
  mk('Dal Makhani', 'Apni Pasand', 240, 'Slow-cooked black dal, finished with butter and cream.', IMG.curry),
  mk('Kadhai Paneer', 'Apni Pasand', 280, 'Paneer tossed with peppers in a kadhai masala.', IMG.curry),
  mk('Paneer Butter Masala', 'Apni Pasand', 270, 'Soft paneer in a smooth tomato-butter gravy.', IMG.curry, { addons: ADDONS }),
  mk('Shahi Paneer', 'Apni Pasand', 290, 'Royal-style paneer in a creamy cashew gravy.', IMG.curry),
  mk('Palak Paneer', 'Apni Pasand', 250, 'Paneer simmered in fresh spinach gravy.', IMG.curry),
  mk('Malai Kofta', 'Apni Pasand', 260, 'Soft koftas in a mild, creamy gravy.', IMG.curry),
  mk('Mix Veg', 'Apni Pasand', 220, 'Seasonal vegetables in a home-style masala.', IMG.curry),
  mk('Navratan Korma', 'Apni Pasand', 270, 'Nine-ingredient vegetable and paneer korma.', IMG.curry),
  mk('Chole Bhature', 'Apni Pasand', 180, 'Spiced chickpeas with fluffy bhature.', IMG.curry),
  mk('Rajma', 'Apni Pasand', 210, 'Slow-cooked kidney beans, home-style.', IMG.curry),
  mk('Dal Fry', 'Apni Pasand', 190, 'Tempered yellow dal with jeera tadka.', IMG.curry),
  mk('Veg Kolhapuri', 'Apni Pasand', 240, 'Fiery mixed vegetables, Kolhapuri style.', IMG.curry),
  mk('Paneer Do Pyaza', 'Apni Pasand', 270, 'Paneer with double onion and peppers.', IMG.curry),
  mk('Mushroom Do Pyaza', 'Apni Pasand', 260, 'Mushroom with onion, tomato and peppers.', IMG.curry),
  mk('Paneer Tikka Masala', 'Apni Pasand', 300, 'Char-grilled paneer tikka folded into masala gravy.', IMG.curry),
  mk('Dum Aloo', 'Apni Pasand', 230, 'Baby potatoes in a rich, slow-cooked gravy.', IMG.curry),
  mk('Sev Tamatar', 'Apni Pasand', 200, 'Tangy tomato curry topped with crisp sev.', IMG.curry),
  mk('Veg Jalfrezi', 'Apni Pasand', 240, 'Stir-fried vegetables in a spicy tomato base.', IMG.curry),

  // Pizza (5) — 7-inch size noted on Zomato
  mk('Veg Cheese Pizza', 'Pizza', 180, 'Classic veg pizza with cheese, onion and capsicum.', IMG.pizza, { portion: '7 inches', variants: [{ label: '7 inches', price: 180 }, { label: '10 inches', price: 280 }], addons: ADDONS }),
  mk('Paneer Tikka Pizza', 'Pizza', 240, 'Paneer tikka, onion and capsicum on a cheese base.', IMG.pizza, { portion: '7 inches', variants: [{ label: '7 inches', price: 240 }, { label: '10 inches', price: 340 }], addons: ADDONS }),
  mk('Mushroom Onion Pizza', 'Pizza', 210, 'Mushroom, onion, capsicum and tomato.', IMG.pizza, { portion: '7 inches', variants: [{ label: '7 inches', price: 210 }, { label: '10 inches', price: 310 }], addons: ADDONS }),
  mk('Capsicum Tomato Pizza', 'Pizza', 190, 'Fresh capsicum and tomato with mozzarella.', IMG.pizza, { portion: '7 inches', variants: [{ label: '7 inches', price: 190 }, { label: '10 inches', price: 290 }], addons: ADDONS }),
  mk('Corn Cheese Pizza', 'Pizza', 200, 'Sweet corn and extra cheese on a crisp base.', IMG.pizza, { portion: '7 inches', variants: [{ label: '7 inches', price: 200 }, { label: '10 inches', price: 300 }], addons: ADDONS }),

  // Snacks (11)
  ver(mk('Dahi Bhalla', 'Snacks', 80, 'Soft bhalla topped with curd and chutneys.', IMG.snack)),
  ver(mk('Desi Ghee Bhalla', 'Snacks', 110, 'Bhalla prepared in desi ghee, served with chutneys.', IMG.snack)),
  ver(mk('Pani Puri', 'Snacks', 35, 'Crisp puris with spiced water and fillings.', IMG.snack, { portion: '5 pieces' })),
  mk('Samosa', 'Snacks', 30, 'Crisp pastry stuffed with spiced potato, with chutneys.', IMG.snack, { portion: '2 pc' }),
  mk('Paneer Pakoda', 'Snacks', 160, 'Crisp batter-fried paneer, served hot.', IMG.snack),
  mk('Veg Cutlet', 'Snacks', 110, 'Golden vegetable cutlets with chutney.', IMG.snack),
  mk('French Fries', 'Snacks', 120, 'Crisp salted fries.', IMG.snack),
  mk('Cheese Balls', 'Snacks', 150, 'Crisp outside, molten cheese inside.', IMG.snack),
  mk('Veg Spring Roll', 'Snacks', 140, 'Crisp rolls with a vegetable filling.', IMG.snack),
  mk('Aloo Tikki', 'Snacks', 90, 'Pan-fried potato tikki with chutneys.', IMG.snack),
  mk('Dahi Puri', 'Snacks', 70, 'Crisp puris, curd, chutneys and sev.', IMG.snack),
]

export const MENU_PART2: MenuItem[] = [
  // Shakes & Coffee (7)
  mk('Mango Shake', 'Shakes & Coffee', 120, 'Thick shake with mango pulp and milk.', IMG.shake),
  mk('Banana Shake', 'Shakes & Coffee', 100, 'Creamy banana shake, served chilled.', IMG.shake),
  mk('Chocolate Shake', 'Shakes & Coffee', 130, 'Chocolate blended thick with milk and ice cream.', IMG.shake),
  mk('Cold Coffee', 'Shakes & Coffee', 110, 'Chilled coffee blended with ice cream.', IMG.shake),
  mk('Vanilla Shake', 'Shakes & Coffee', 110, 'Classic vanilla shake.', IMG.shake),
  mk('Butterscotch Shake', 'Shakes & Coffee', 130, 'Butterscotch shake with a caramel note.', IMG.shake),
  mk('Kesar Badam Shake', 'Shakes & Coffee', 150, 'Saffron-almond shake, served chilled.', IMG.shake),

  // South Indian (15)
  mk('Idli Sambar', 'South Indian', 90, '2 pcs idli with coconut chutney, garlic chutney and sambar.', IMG.dosa, { portion: '2 pcs' }),
  mk('Medu Vada', 'South Indian', 90, 'Crisp golden vada with sambar and chutney.', IMG.dosa, { portion: '2 pcs' }),
  mk('Idli Vada', 'South Indian', 110, 'Soft idli and crisp vada, served together.', IMG.dosa),
  mk('Uttapam', 'South Indian', 130, 'Thick pancake with tomato, onion and coriander.', IMG.dosa),
  mk('Tomato Uttapam', 'South Indian', 140, 'Uttapam topped with fresh tomato.', IMG.dosa),
  mk('Onion Uttapam', 'South Indian', 140, 'Uttapam topped with onion and green chilli.', IMG.dosa),
  mk('Cheese Uttapam', 'South Indian', 170, 'Uttapam finished with melted cheese.', IMG.dosa),
  mk('Veg Uttapam', 'South Indian', 150, 'Uttapam loaded with mixed vegetables.', IMG.dosa),
  mk('Rava Masala Dosa', 'South Indian', 170, 'Crisp semolina dosa with potato masala.', IMG.dosa),
  mk('Set Dosa', 'South Indian', 110, 'Soft, spongy set dosas with sambar.', IMG.dosa, { portion: '3 pcs' }),
  mk('Paper Dosa', 'South Indian', 130, 'Extra-large, paper-crisp dosa.', IMG.dosa),
  mk('Sambar Vada', 'South Indian', 100, 'Vada soaked in hot sambar.', IMG.dosa),
  mk('Mini Idli', 'South Indian', 100, 'Bite-size idlis tossed in sambar.', IMG.dosa),
  mk('Dahi Vada', 'South Indian', 110, 'Soft vada in curd with chutneys.', IMG.dosa),
  mk('Rava Onion Dosa', 'South Indian', 160, 'Crisp rava dosa with onion topping.', IMG.dosa),

  // Chinese (12)
  mk('Veg Manchurian', 'Chinese', 180, 'Vegetable dumplings in a garlic-soy glaze.', IMG.chinese),
  mk('Paneer Chilli', 'Chinese', 210, 'Paneer tossed with peppers, onion and chilli sauce.', IMG.chinese),
  mk('Veg Hakka Noodles', 'Chinese', 160, 'Stir-fried noodles with vegetables.', IMG.chinese),
  mk('Paneer Noodles', 'Chinese', 190, 'Noodles tossed with paneer and vegetables.', IMG.chinese),
  mk('Veg Fried Rice', 'Chinese', 160, 'Wok-tossed rice with vegetables and spring onion.', IMG.rice),
  mk('Paneer Fried Rice', 'Chinese', 190, 'Fried rice with paneer and vegetables.', IMG.rice),
  mk('Chilli Garlic Noodles', 'Chinese', 170, 'Noodles with a chilli-garlic kick.', IMG.chinese),
  mk('Veg Momos', 'Chinese', 120, 'Steamed vegetable momos with chutney.', IMG.chinese, { portion: '8 pcs' }),
  mk('Paneer Momos', 'Chinese', 150, 'Steamed paneer momos with chutney.', IMG.chinese, { portion: '8 pcs' }),
  mk('Hot & Sour Soup', 'Chinese', 110, 'Peppery vegetable soup, served hot.', IMG.chinese),
  mk('Sweet Corn Soup', 'Chinese', 110, 'Light sweet-corn soup.', IMG.chinese),
  mk('Veg Spring Rolls', 'Chinese', 150, 'Crisp rolls with a chilli-garlic dip.', IMG.chinese),

  // Chinese Combos (4)
  mk('Noodles + Manchurian Combo', 'Chinese Combos', 260, 'Hakka noodles with veg Manchurian.', IMG.chinese),
  mk('Fried Rice + Chilli Paneer Combo', 'Chinese Combos', 280, 'Fried rice with chilli paneer.', IMG.rice),
  mk('Noodles + Spring Roll Combo', 'Chinese Combos', 250, 'Hakka noodles with crisp spring rolls.', IMG.chinese),
  mk('Veg Family Combo', 'Chinese Combos', 499, 'Noodles, fried rice, Manchurian and spring rolls for sharing.', IMG.chinese, { portion: 'Serves 2–3' }),

  // Thali (2) — contents from Zomato snippets
  mk('Regular Thali', 'Thali', 320, 'Dal, paneer, raita, rice, 1 butter naan, 1 butter roti, 1 sweet, pickle and salad.', IMG.thali),
  ver(mk('Maharaja Thali', 'Thali', 545, 'Dal, paneer, mix veg, raita, rice, 1 butter naan, 1 laccha paratha, 1 missi roti and more.', IMG.thali, { bestseller: true })),

  // Tandoor & Breads (11)
  mk('Butter Naan', 'Tandoor & Breads', 50, 'Soft tandoor naan brushed with butter.', IMG.bread),
  mk('Plain Naan', 'Tandoor & Breads', 40, 'Classic tandoor naan.', IMG.bread),
  mk('Laccha Paratha', 'Tandoor & Breads', 60, 'Flaky, layered whole-wheat paratha.', IMG.bread),
  mk('Missi Roti', 'Tandoor & Breads', 50, 'Besan-wheat roti, tandoor-baked.', IMG.bread),
  mk('Butter Roti', 'Tandoor & Breads', 30, 'Soft tandoor roti with butter.', IMG.bread),
  mk('Tandoori Roti', 'Tandoor & Breads', 20, 'Plain tandoor roti.', IMG.bread),
  mk('Garlic Naan', 'Tandoor & Breads', 60, 'Naan topped with garlic and coriander.', IMG.bread),
  mk('Paneer Kulcha', 'Tandoor & Breads', 90, 'Kulcha stuffed with spiced paneer.', IMG.bread),
  mk('Amritsari Kulcha', 'Tandoor & Breads', 90, 'Stuffed kulcha, tandoor-baked.', IMG.bread),
  mk('Bhatura', 'Tandoor & Breads', 50, 'Fluffy deep-fried bhatura.', IMG.bread),
  mk('Rumali Roti', 'Tandoor & Breads', 30, 'Paper-thin rumali roti.', IMG.bread),

  // Rice / Pulao (9)
  mk('Veg Biryani', 'Rice / Pulao', 200, 'Fragrant dum biryani with vegetables and raita.', IMG.biryani),
  mk('Paneer Biryani', 'Rice / Pulao', 240, 'Dum biryani layered with paneer.', IMG.biryani),
  mk('Veg Pulao', 'Rice / Pulao', 180, 'Light pulao with seasonal vegetables.', IMG.rice),
  mk('Kashmiri Pulao', 'Rice / Pulao', 220, 'Pulao with dry fruits and saffron notes.', IMG.rice),
  mk('Jeera Rice', 'Rice / Pulao', 150, 'Basmati rice tempered with jeera.', IMG.rice),
  mk('Steamed Rice', 'Rice / Pulao', 120, 'Plain steamed basmati rice.', IMG.rice),
  mk('Mushroom Pulao', 'Rice / Pulao', 200, 'Pulao with mushroom and whole spices.', IMG.rice),
  mk('Corn Pulao', 'Rice / Pulao', 180, 'Sweet-corn pulao with mild spices.', IMG.rice),
  mk('Hyderabadi Veg Biryani', 'Rice / Pulao', 230, 'Spicier Hyderabadi-style veg biryani with raita.', IMG.biryani),

  // Sweet (19) — FULLY VERIFIED from the Zomato Order Online page, 2026-10-26.
  // All carry the green veg indicator. "Customizable" items show variant/weight
  // options only at the ADD step, which was not used — so no variant prices are claimed.
  ver(mk('Besan Ladoo', 'Sweet', 252, 'Besan ladoo. Customizable on the listing — weight/variant prices not shown publicly.', IMG.sweet)),
  ver(mk('Boondi Laddu Saada', 'Sweet', 95, 'Boondi laddu, saada preparation. Customizable on the listing.', IMG.sweet)),
  ver(mk('Boondi Ladoo Desi Ghee', 'Sweet', 252, 'Boondi ladoo prepared in desi ghee. Customizable on the listing.', IMG.sweet)),
  ver(mk('Chocolate Burfi', 'Sweet', 201, 'Chocolate burfi. Customizable on the listing.', IMG.sweet)),
  ver(mk('Doda Barfi', 'Sweet', 252, 'Doda barfi. Customizable on the listing.', IMG.sweet)),
  ver(mk('Gulab Jamun', 'Sweet', 220, 'Soft gulab jamun in syrup. Customizable on the listing.', IMG.sweet)),
  ver(mk('Honey Dry Fruit Laddu', 'Sweet', 500, 'Honey and dry-fruit laddu. Customizable on the listing.', IMG.sweet)),
  ver(mk('Kaju Katli', 'Sweet', 462, 'Cashew katli. Customizable on the listing.', IMG.sweet)),
  ver(mk('Kesar Burfi', 'Sweet', 201, 'Kesar burfi. Customizable on the listing.', IMG.sweet)),
  ver(mk('Malai Barfi', 'Sweet', 201, 'Malai barfi. Customizable on the listing.', IMG.sweet)),
  ver(mk('Mix Sweet Box Desi', 'Sweet', 550, 'Mixed sweet box. Prepared in Desi Ghee. Customizable on the listing.', IMG.sweet)),
  ver(mk('Mix Sweet Box Saada', 'Sweet', 302, 'Mixed sweet box. Dalda Preparation (as noted on the listing). Customizable on the listing.', IMG.sweet)),
  ver(mk('Mohan Baati', 'Sweet', 102.86, 'Mohan baati.', IMG.sweet, { portion: '2 pieces' })),
  ver(mk('Plain Burfi', 'Sweet', 185, 'Plain burfi. Customizable on the listing.', IMG.sweet)),
  ver(mk('Rabri', 'Sweet', 200, 'Thick rabri. Customizable on the listing.', IMG.sweet)),
  ver(mk('Rajbhog', 'Sweet', 102.86, 'Rajbhog.', IMG.sweet)),
  ver(mk('Rasmalai', 'Sweet', 114.29, 'Chilled rasmalai.', IMG.sweet, { portion: '2 pieces' })),
  ver(mk('Soan Papdi', 'Sweet', 252, 'Flaky soan papdi. Customizable on the listing.', IMG.sweet)),
  ver(mk('Spounch', 'Sweet', 71.43, 'Spelling as shown on the listing (“Spounch”).', IMG.sweet, { portion: '2 pcs' })),
]

export const ALL_MENU: MenuItem[] = [...MENU, ...MENU_PART2]
