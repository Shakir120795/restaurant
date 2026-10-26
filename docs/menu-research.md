# Menu Research — Shahganj, Agra (source restaurant)

Research date: 2026-10-26. This file records ONLY what public listings showed.
It does NOT copy the original restaurant's logo, layout or food photographs.
The website brand "Agra Zaika House" is a temporary working name.

## Sources checked
- Zomato restaurant page: https://www.zomato.com/agra/sattolala-food-court-shahganj
  - Direct fetch failed in the text reader; a live-browser read was requested.
    The search-index snapshot of the same page was usable for categories/counts.
  - Full per-item Zomato prices were NOT extractable from the accessible snapshot.
    Only category names/counts and a few snippets were visible (below).
- Zomato order page: https://www.zomato.com/agra/sattolala-food-court-shahganj/order
- Swiggy: https://www.swiggy.com/city/agra/sattolala-food-court-shahganj-rest102914
  - Text fetch returned only the generic Swiggy shell — no menu items could be
    verified from Swiggy in this session. Treat Swiggy as NOT VERIFIED.
- JustDial listing (cross-check, same address): used for 6 item prices and hours.
- Google Business-style listings (via search results): address + coordinates
  27.181025, 77.985576 and hours 8:00 AM – 11:00 PM, daily.

## Verified business facts
- Address: 6, M.I.G., Kothi Meena Bazaar, Shahganj, Agra, UP 282010
  (JustDial adds: Near Devi Ka Mandir, Saket Colony Chauraha, Shahganj Market Road)
- Hours: 8:00 AM – 11:00 PM, all seven days (multiple listings agree).
- Phone numbers shown on Zomato snapshot: +91 562 221 0202, +91 90128 82895,
  +91 82185 34385. The site uses only the first as the call button; the owner
  must confirm which number is the WhatsApp business number — none is claimed
  as a WhatsApp number in this build (config `whatsappNumber` is blank).
- FSSAI licence number visible in the Zomato snapshot: 12715001001061.
- Reviews describe the place as famous for breakfast items: kachori, bedai,
  jalebi and sweets, with a large seating area. No rating/review count is
  published on the new site, because sources disagree (see Conflicts).

## Verified Zomato categories and item counts (snapshot)
Best in Dosa (10), Season Specials (1), Agra Ka Zaika (2), Apni Pasand (20),
Pizza (5), Snacks (11), Shakes & Coffee (7), South Indian (15), Chinese (12),
Chinese Combos (4), Thali (2), Tandoor/bread (11), Rice / Pulao (9), Sweet (19).
Total = 128. The dataset in `src/data/menu.ts` has exactly 128 items in
exactly these 14 categories. No Breakfast / Burgers & Sandwiches category was
added, because those were not Zomato categories in the snapshot.

## Items with a verified name AND price (public snippet)
| Item | Price | Source |
|---|---|---|
| Dahi Bhalla | ₹80 | JustDial menu snippet |
| Desi Ghee Bhalla | ₹110 | JustDial menu snippet |
| Pani Puri [5 Pieces] | ₹35 | JustDial menu snippet |
| Paneer Pasanda (Apni Pasand) | ₹610 | JustDial listing snippet |
| Mushroom Masala (Apni Pasand) | ₹495 | JustDial listing snippet |
| Maharaja Thali (Thali) | ₹545 | JustDial listing snippet |

Also verified by name/snippet (price NOT verified):
- Refined Gunjia (with syrup) — Season Specials, Zomato.
- Pizza size "7 Inches" and a topping line "Paneer, Mushroom, Onion,
  Capsicum, Tomato" — Zomato Pizza section.
- Idli portion: "2 pcs. Idli + Coconut chutney + Garlic Chutney + Sambhar" — Zomato.
- Thali contents (two snippets, see dataset descriptions) — Zomato.
- Dosa note: "Contains only paneer, no potatoes" and dosa made from soaked
  rice, fenugreek seeds and urad dal — Zomato.
- Sweet preparation notes "Prepared in Desi Ghee" / "Dalda Preparation" — Zomato
  (per-item attribution unknown; owner to confirm).

## UPDATE — Zomato live read, 2026-10-26 (read-only, no order placed, cart stayed 0)
- Main, Order Online and Menu pages all opened; nothing was blocked.
- Business info confirmed: cuisines Street Food / North Indian / Mithai /
  Fast Food; average cost approx. ₹300 for two (excl. taxes); Lunch, Dinner,
  Home delivery and Takeaway available; payments Cash, Cards and digital;
  FSSAI 12715001001061 (as before).
- Veg status RESOLVED in favour of veg-only: the Zomato "More Info" section
  says "Vegetarian only" and "Vegetarian friendly", and all 19 online Sweet
  items carry a green veg indicator. The older EazyDiner "both veg and
  non-veg" line is treated as outdated for this purpose.
- **Sweet category — fully verified (19/19, Zomato Order Online):**
  Besan Ladoo ₹252, Boondi Laddu Saada ₹95, Boondi Ladoo Desi Ghee ₹252,
  Chocolate Burfi ₹201, Doda Barfi ₹252, Gulab Jamun ₹220,
  Honey Dry Fruit Laddu ₹500, Kaju Katli ₹462, Kesar Burfi ₹201,
  Malai Barfi ₹201, Mix Sweet Box Desi ₹550 (Desi Ghee),
  Mix Sweet Box Saada ₹302 (Dalda Preparation), Mohan Baati ₹102.86 [2 pcs],
  Plain Burfi ₹185, Rabri ₹200, Rajbhog ₹102.86, Rasmalai ₹114.29 [2 pcs],
  Soan Papdi ₹252, Spounch ₹71.43 [2 pcs, spelling as on page].
  Most are marked "customizable" on Zomato, but variant/weight prices are
  only shown at the ADD step, which was not used — so they are NOT claimed
  here. The dataset now uses these exact Sweet prices
  (`verification: 'verified'`), replacing the earlier provisional sweets.
- Scanned printed menu (Menu tab, Hindi, 1 page, low resolution, partly
  shadowed): South Indian, snacks, sweets, cold drinks and ice cream with
  much lower printed prices (e.g. Masala Dosa 70, Plain Dosa 50, Idli
  Sambhar 40, Paneer Dosa 85, Paneer Uttapam 90, Onion Uttapam 75,
  Chowmein Full 50 / Half 30, Samosa Plate 15, Jalebi 100g 20). Two snack
  items were illegible and are NOT guessed. This printed menu conflicts
  with the online Sweet prices and looks older/different, so its prices
  were NOT copied into the dataset — they are recorded here only, for the
  owner to reconcile. No full dine-in text menu exists on Zomato beyond
  this scanned image.
- Still NOT shown publicly: delivery fee, delivery time, minimum order,
  and variant/weight pricing for customizable sweets.
- Ratings on this live read: Dining 3.3 (316), Delivery 4.4 (7,174) —
  still NOT published on the new site, to avoid cherry-picking one source.

## Conflicts / missing information — OWNER CONFIRMATION REQUIRED
1. Veg status: RESOLVED (see update above) — Zomato says "Vegetarian only".
   The older EazyDiner line remains noted here for transparency.
2. Ratings: Zomato snapshot shows dining 3.2 / delivery 4.2; JustDial shows
   3.5–3.9 across snapshots. No rating is shown on the site.
3. All prices except the 6 above are PROVISIONAL working prices in
   `src/data/menu.ts` (`verification: 'provisional'`). They are realistic
   Agra price points for a functional cart demo, NOT copied listing prices.
   The detail view labels them "Provisional — owner confirmation pending".
4. Swiggy menu, delivery fee, minimum order, service area and live availability
   could not be verified — none are claimed on the site.
5. No original food photographs were copied. Images are generic Unsplash
   food photos per category with an on-error fallback; the owner should
   replace them with their own dish photos before launch.
6. WhatsApp number: not verified as a business WhatsApp number. Cart offers
   "Copy order message" until the owner supplies it.
7. Google Maps: the site uses a Maps search embed for the verified address,
   not a claimed place ID. Replace with the owner's official Maps link if one
   is supplied.

## What was NOT invented
No rating, review count, award, "best restaurant" claim, delivery time,
delivery charge, minimum order, payment method or official affiliation
with Zomato/Swiggy/Google is stated on the site.
