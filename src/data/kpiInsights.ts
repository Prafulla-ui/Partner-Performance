export interface KpiInsight {
  kpiId: string
  eyebrow: string
  riskLabel: string
  summary: string
  problem: string
  whyItMatters: string
  causes: string[]
  actions: string[]
  measure: string[]
  owner: string
}

export const kpiInsights: Record<string, KpiInsight> = {
  'content-score': {
    kpiId: 'content-score',
    eyebrow: 'Conversion at risk',
    riskLabel: '~$155K left on the table',
    summary: '3 of 12 brand sites sit below the content standard. Shoppers compare those pages to sharper OTA listings before they ever see your rate.',
    problem:
      'Content score is 72 / 100 against a target of 80. Only 9 of 12 websites meet the standard. Destination copy, room-page completeness and booking-path messages are the main gaps.',
    whyItMatters:
      'Guests who land on a thin brand page often finish the stay on Booking.com or Agoda even when the rate is equal. A 0.10 pt conversion lift on 542k sessions is roughly 540 extra bookings at $287 ABV.',
    causes: [
      'Three hotels fail the content bar — names are not on the snapshot today; treat them as the first sprint.',
      'Stale destination copy and missing amenity / cancellation messaging on the booking path.',
      'Room pages that do not match the OTA listing for the same hotel.',
    ],
    actions: [
      'Ask brand/ops for the three failing hotels and a room-type asset list this week.',
      'Run a 30-day sprint: hero, room, bathroom and view photos plus “why book direct” above the fold.',
      'Sync the same assets to OTAs so brand.com does not look weaker than the OTA page.',
    ],
    measure: [
      'Content score toward 80, and 12 of 12 sites at standard.',
      'Room-select and checkout rates on the three upgraded hotels vs the chain.',
      'Brand.com vs OTA look-to-book on those hotels after 30 days.',
    ],
    owner: 'Brand / e-commerce',
  },
  'ai-visibility': {
    kpiId: 'ai-visibility',
    eyebrow: 'Shopper trust at risk',
    riskLabel: '568 images below standard',
    summary: 'AI Visibility is 68 / 100. About 570 photos fail quality or tagging, so rooms look weaker on the brand site than on OTAs.',
    problem:
      '1,842 of 2,410 images meet standard. The rest are poorly lit, untagged, or missing amenity coverage. Visual consistency between brand and OTA galleries is weak.',
    whyItMatters:
      'Imagery is decided in seconds. A guest who cannot see the bathroom or view will pick the OTA card that can. This is the same conversion leak as content score, from the photo side.',
    causes: [
      'Missing bathroom, view and amenity shots on several room types.',
      'User-generated or old DSLR files mixed with newer brand photography.',
      'OTA galleries updated independently of the brand CMS.',
    ],
    actions: [
      'Prioritise the same three content-laggard hotels for a photo recapture or cull.',
      'Retag rooms and amenities so AI Visibility and the booking engine show the same set.',
      'Publish a minimum shot list (hero, room, bathroom, view) before the next review.',
    ],
    measure: [
      'AI Visibility toward 80; images at standard above 2,200.',
      'Bounce rate on mobile room pages for treated hotels.',
      'Direct conversion on those hotels vs last 30 days.',
    ],
    owner: 'Brand / ops photography',
  },
  'parity-win': {
    kpiId: 'parity-win',
    eyebrow: 'Price trust at risk',
    riskLabel: '71% win vs 85% target',
    summary: 'Direct is losing nearly 3 in 10 rate checks. Shoppers who open Agoda after brand.com are being trained that the website is not the best price.',
    problem:
      'Parity win rate is 71% and falling (−3 pts QoQ, −6 vs LY). Target is 85%. Worst losses sit on Agoda at Bangkok Riverside, Booking.com at Dubai Marina, and Expedia at Singapore Orchard.',
    whyItMatters:
      'A lost parity check is often a lost booking plus 16–18% commission. Estimated leakage this quarter is $182K. Recommendation 1 prices the Agoda/wholesale fix at +$95K direct.',
    causes: [
      '61% of Agoda undercuts are unmapped mobile-only rates.',
      '24% of losses look like wholesale leakage through B2B partners.',
      'Booking.com mobile gap at Dubai Marina is still an open next step.',
    ],
    actions: [
      'Start at GM Bangkok Riverside: freeze new mobile-rate mappings until the audit is clean.',
      'Distribution to name the two wholesale partners leaking internally (not in the client copy).',
      'Close the Booking.com mobile gap already logged for 15 Aug — treat as overdue if still open.',
    ],
    measure: [
      'Weekly Agoda loss count and average undercut % by hotel.',
      'Parity win rate toward 85%.',
      'Direct vs Agoda share at Bangkok Riverside.',
    ],
    owner: 'Revenue / distribution',
  },
  'parity-leak': {
    kpiId: 'parity-leak',
    eyebrow: 'Revenue at risk',
    riskLabel: '$182K estimated leakage',
    summary: 'Modelled direct revenue diverted on loss events this quarter. This is recoverable mix, not a demand problem.',
    problem:
      'Leakage is up $21K vs last quarter. 2,914 Agoda losses at −14.8% average undercut are the largest slice, followed by Booking.com and Expedia.',
    whyItMatters:
      'Every point of mix moved from OTA to direct saves about $13.5K in quarterly commission. Guests already searched the brand; they left because the OTA was cheaper.',
    causes: [
      'Unmapped mobile-only rates on Agoda.',
      'Wholesale resale of contracted rates.',
      'Property-level mapping drift after promotions.',
    ],
    actions: [
      'Same workstream as the parity win-rate insight — do not open a second project.',
      'Turn on a best-rate guarantee only after win rate is recovering, or you will pay claims on a broken map.',
    ],
    measure: [
      'Leakage $ vs this quarter’s $182K baseline.',
      'Best-rate guarantee claims (should fall, not rise).',
      'Commission $ on the treated hotels.',
    ],
    owner: 'Revenue / distribution',
  },
  conversion: {
    kpiId: 'conversion',
    eyebrow: 'Checkout leak',
    riskLabel: '~$224K / 780 bookings',
    summary: 'Conversion is up, but payment is still the largest recoverable leak. Guests already chose a room — they did not pay.',
    problem:
      '31,240 checkouts started; 14,890 began payment (−52.3%); 8,412 confirmed (−43.5% after payment). The report already flags this as the largest leak.',
    whyItMatters:
      'This is a failed sale at the till, not a traffic problem. Buying more SEM before this is fixed pays to fill a hole. Recovering part of the drop-off is estimated at $224K next quarter.',
    causes: [
      'Missing local methods (UPI, PayNow, wallets) on APAC hotels.',
      'Card failure with no retry and rate disappearing after login.',
      'Too many fields and 3-D Secure friction on mobile.',
    ],
    actions: [
      'E-commerce: payment-method coverage by market (India / SEA first), not one global checkout.',
      'Hold the selected rate 15–20 minutes and offer a failed-payment retry.',
      'Mystery-shop mobile checkout at Bangkok, Jakarta and Dubai this week.',
    ],
    measure: [
      'Payment initiated / checkout started, and payment-to-confirm.',
      'Bookings tagged checkout_retry.',
      'Direct conversion from 1.56% — do not use RevPAR as the success metric.',
    ],
    owner: 'E-commerce / IT',
  },
  'ota-comm': {
    kpiId: 'ota-comm',
    eyebrow: 'Commission pressure',
    riskLabel: '$455K estimated this quarter',
    summary: 'OTA commission is rising with production. Mix, not just cost, needs to move — especially high-cancel Booking.com and Agoda volume.',
    problem:
      'Commission is +5.8% QoQ. Booking.com is 17.4% of revenue at 24.6% cancel; Agoda is the fastest-growing OTA and the worst parity offender.',
    whyItMatters:
      'A point of mix from OTA to direct is about $13.5K commission a quarter. Growing OTA RN with 22–25% cancel is soft demand you pay for twice.',
    causes: [
      'Parity losses pushing shoppers to finish on the OTA.',
      'Last-minute, high-cancel OTA products (11–13 day lead vs 21 on direct).',
      'No member-rate campaign accepted in the hotelier pack yet.',
    ],
    actions: [
      'Do not ask OTAs for more allotment until payment and Agoda mapping are in motion.',
      'Push brand-only value-adds in the last 14 days instead of a public BAR cut.',
      'Review cancellable OTA allotment at the three hotels with the worst OTA cancel.',
    ],
    measure: [
      'Commission $ and OTA share vs 37.1%.',
      'Cancel % by channel.',
      'Last-14-day source mix on brand.com.',
    ],
    owner: 'Commercial / revenue',
  },
  cancel: {
    kpiId: 'cancel',
    eyebrow: 'Quality of demand',
    riskLabel: '18.4% vs 15% target',
    summary: 'Partnership cancellations are above the quality target. Soft demand is crowding out better-converting windows.',
    problem:
      'Look-to-book is improving, but cancel sits at 18.4% against a 15% target. High-cancel production inflates room nights that never stay.',
    whyItMatters:
      'You hold inventory, then it falls back — often after a brand.com or corporate guest was turned away.',
    causes: [
      'Free-cancel products on the demand path.',
      'Event-window speculative holds.',
      'Weaker deposit rules than brand.com.',
    ],
    actions: [
      'Align cancel/deposit with the 15% quality target on the next joint campaign.',
      'Use event packages in Dubai and Singapore instead of open-ended free cancel.',
    ],
    measure: ['Cancel % toward 15%.', 'Denied/walked if you can tag it.', 'Show-up RN on event dates.'],
    owner: 'Demand partnership',
  },
}

export function insightForKpi(kpiId: string): KpiInsight | undefined {
  return kpiInsights[kpiId]
}
