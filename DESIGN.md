---
name: Winter 2026 Academic Portal
description: The semester as a jet-age ticket wallet; every deadline is a tear-off coupon.
colors:
  carrier-navy: "#0d1b3d"
  navy-cabin: "#1b2c57"
  navy-bulkhead: "#2c3f70"
  jet-red: "#d7262d"
  jet-ink: "#b81e25"
  jet-wash: "#fbe9e9"
  carbon-purple: "#4b2e83"
  carbon-lilac: "#dcd3f0"
  carbon-lilac-pale: "#ebe5f7"
  ticket-stock: "#f2f2f0"
  coupon-white: "#ffffff"
  ink: "#0d1b3d"
  ink-muted: "#4a5578"
  ink-faint: "#69728f"
  perforation: "#aeb5c8"
  hairline: "#d5d8e1"
  clear-green: "#1e7a34"
  course-ipe-4705: "#0b5cad"
  course-ipe-4706: "#0e6e66"
  course-ipe-4709: "#a13a0b"
  course-ipe-4710: "#3b3fb6"
  course-ipe-4715: "#1e7a34"
  course-ipe-4716: "#0b6e8a"
  course-ipe-4725: "#8a5a00"
  course-ipe-4785: "#7b2fa8"
  course-ipe-4700: "#a3204d"
  course-me-4703: "#6b4a2e"
  course-unknown: "#4a5578"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "0.01em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.1em"
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  body-strong:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 500
    lineHeight: 1.375
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
  numeral-display:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.05em"
    fontFeature: "\"tnum\", \"zero\""
  numeral:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\", \"zero\""
rounded:
  hairline: "3px"
  control: "4px"
  ticket: "6px"
  sheet: "12px"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "40px"
  ticket-pad: "16px"
  ticket-pad-wide: "24px"
  rail: "256px"
components:
  button-primary:
    backgroundColor: "{colors.jet-red}"
    textColor: "{colors.coupon-white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.jet-ink}"
  button-secondary:
    backgroundColor: "{colors.coupon-white}"
    textColor: "{colors.carrier-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.carrier-navy}"
    textColor: "{colors.coupon-white}"
  field:
    backgroundColor: "{colors.coupon-white}"
    textColor: "{colors.carrier-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "40px"
  ticket:
    backgroundColor: "{colors.coupon-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.ticket}"
    padding: "{spacing.ticket-pad}"
  ticket-header:
    backgroundColor: "{colors.carrier-navy}"
    textColor: "{colors.coupon-white}"
    typography: "{typography.label}"
    height: "40px"
  carbon-copy:
    backgroundColor: "{colors.carbon-lilac}"
    textColor: "{colors.carbon-purple}"
    rounded: "{rounded.ticket}"
  course-tab:
    textColor: "{colors.coupon-white}"
    typography: "{typography.label}"
    rounded: "{rounded.hairline}"
    padding: "0 8px"
    height: "24px"
  topic-chip:
    backgroundColor: "{colors.carbon-lilac-pale}"
    textColor: "{colors.carbon-purple}"
    rounded: "{rounded.hairline}"
    padding: "2px 6px"
  nav-item-active:
    backgroundColor: "{colors.navy-cabin}"
    textColor: "{colors.coupon-white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "44px"
  nav-icon-active:
    backgroundColor: "{colors.jet-red}"
    textColor: "{colors.coupon-white}"
    rounded: "{rounded.control}"
  stamp:
    textColor: "{colors.jet-red}"
    typography: "{typography.label}"
    rounded: "{rounded.hairline}"
    padding: "0 0.45em"
---

# Design System: Winter 2026 Academic Portal

## Overview

**Creative North Star: "The Ticket Wallet"**

The semester is a carrier's ticket wallet. Every quiz, assignment and event is a coupon (a leg) printed on white stock and filed in a navy wallet; the wallet always shows what remains, and a finished leg is stamped USED rather than disappearing. The world borrows the jet-age airline ticket: navy carrier bars, condensed grotesk caps for every head and field label, ruled fare boxes, dashed tear lines with punched notches, a purple carbon-copy duplicate, and a rubber stamp. It is a vernacular-ephemera world, not a dashboard with a theme: there are no stat tiles and no generic cards, only coupons, stubs and copies.

Density is ticket-dense: small caps labels over bold mono figures, tight ruled rows, generous only around the one coupon that matters next. The phone is the primary surface: a navy top bar, the next-leg coupon owning the first viewport, a list of compact leg coupons, and a navy bottom tab bar. On desktop the navy rail replaces both bars and the next coupon sits beside its carbon copy.

Colour is functional and printed. Navy is the carrier (shell, rules, ink). Jet red is urgency and the one primary action. Carbon purple is the colour of every filled-in figure, as if the date, time, marks and D-count had been typed through carbon paper. Each course carries its own ink colour on a tab, like a flight number.

**Key Characteristics:**
- Coupons with perforated D-count stubs are the unit of every list.
- Condensed uppercase caps (Barlow Condensed) for heads, tabs and labels; Barlow for prose; JetBrains Mono carbon numerals for every figure.
- Dashed tear lines with punched notches separate a coupon from its stub.
- Done is a rotated jet-red USED stamp, never a removal or a green check.
- Navy shell, white coupon stock on pale ticket-stock ground, lilac for the carbon copy.
- Flat print: depth comes from 1.5px navy rules and a 1px ledge, not from floating shadows.

## Colors

A printed carrier palette: navy ink and shell, jet red for urgency, carbon purple for figures, on white coupon stock.

### Primary
- **Carrier Navy** (carrier-navy): The shell (desktop rail, phone top bar and tab bar), coupon header bars, every ruled line and ticket border (at 78% opacity on the ticket edge), and the main text ink. The navy is the wallet itself.
- **Navy Cabin / Navy Bulkhead** (navy-cabin, navy-bulkhead): Raised steps inside the shell only: active rail item, the index cell of a coupon header, tab-bar top border, scrollbar thumb.

### Secondary
- **Jet Red** (jet-red): Urgency and the single primary action: the primary button, D-counts under the urgent threshold, the active nav icon plate, the record-type flag on the next coupon, the `///` section mark, the USED / LATE stamp, focus outlines and text caret. Hover deepens to **Jet Ink** (jet-ink). **Jet Wash** (jet-wash) is the setup-warning banner ground only.

### Tertiary
- **Carbon Purple** (carbon-purple): Every filled-in figure: dates, times, marks, D-counts, counts beside section heads, the in-progress "Boarding" status word. Also the ink of the carbon-copy panel.
- **Carbon Lilac** (carbon-lilac): The carbon-copy duplicate panel and text selection. **Pale Lilac** (carbon-lilac-pale) for topic chips, the selected calendar day and loading skeletons.

### Neutral
- **Ticket Stock** (ticket-stock): Page ground; also the colour of tear-line notches, so the punch reads as a hole through the coupon.
- **Coupon White** (coupon-white): Every ticket surface, fields, sheets.
- **Ink Muted / Ink Faint** (ink-muted, ink-faint): Secondary prose and metadata; faint for field labels and inactive tabs.
- **Perforation** (perforation): Dashed tear lines, vertical stub perforations, dashed link underlines.
- **Hairline** (hairline): List dividers inside sheets and search; security-dot texture.
- **Clear Green** (clear-green): The single word "Clear" on a course with nothing open. Nowhere else.

### Course Inks
Each Winter 2026 course has one fixed ink (course-* tokens), used only as the filled background of its course tab with white caps text, and as its bar colour in progress views. Unknown courses fall back to course-unknown. Course ink never colours prose, borders or whole cards.

### Named Rules
**The Carbon Figure Rule.** Every filled-in figure (date, time, marks, count, D-code) is JetBrains Mono bold in carbon purple with slashed zeros. A figure that turns urgent switches to jet red; a figure with no data goes ink-faint. Prose numbers stay in the body face.

**The One Red Rule.** Jet red marks urgency, the primary action, the active location and the stamp. It is never a decorative fill, a course colour or a card background.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow fallback), weights 500/600/700
**Body Font:** Barlow (with system sans fallback), weights 400/500/600
**Label/Mono Font:** JetBrains Mono, weights 500/700

**Character:** Airline ticket printing: narrow uppercase grotesk caps for everything that names a field or a place, a plain humanist sans for what a person wrote, and a typewriter mono for every figure.

### Hierarchy
- **Display** (700, 32px phone / 40px desktop, line-height 1, 0.04em, uppercase): Page titles only.
- **Headline** (700, 30px phone / 44px desktop, 0.98, 0.01em, uppercase): The course name on the next-leg coupon; the one loud line per screen.
- **Title** (600, 17px, 0.1em, uppercase): Section heads, always preceded by the jet-red `///` mark and optionally followed by a carbon count.
- **Body** (400, 15px, 1.625): Descriptions, metadata lines (13-14px in ink-muted). Page descriptions cap at 60ch.
- **Body Strong** (500, 15.5-20px, snug): Record titles on coupons and leg rows, in navy.
- **Label** (600, 11-13px, 0.12-0.16em, uppercase): Fare-box labels, tab caps, nav items, button text, status words, course tabs.
- **Numeral Display** (mono 700, 44px, -0.05em): The D-count stub on the next coupon; 34-64px variants appear only inside the carbon copy.
- **Numeral** (mono 700, 12.5-22px, -0.02em, tabular, slashed zero): Fare-box values, stub dates, inline dates.

### Named Rules
**The Caps-Name, Sans-Say Rule.** Condensed caps name things (fields, places, courses, actions); Barlow carries sentences a person wrote. Never set a record title or description in caps, and never set a field label in sentence-case sans.

**The Twelve Floor Rule.** Labels sit at 11px minimum with wide tracking; body metadata at 13px minimum.

## Layout

Phone-first. Content column max 1152px (max-w-6xl) with side gutters of 16px (phone), 24px (640px+), 40px (1024px+). Below 1024px: a sticky 56px navy top bar with the compact wordmark and a search button, and a fixed 64px navy bottom tab bar with five slots (Today, Courses, Assess, Calendar, More); main content reserves 112px bottom padding for it. "More" opens a white bottom sheet (12px top corners) above the tab bar. At 1024px+: a fixed 256px navy left rail with the wordmark, nav and a board-sync box; the top bar becomes translucent stock with blur, holding the search field and the synced timestamp.

Coupons stack in a single column with small gaps on phones. On desktop the dashboard pairs the next coupon with the carbon copy side by side, with legs and notices below. Inside tickets, padding is 16px (24px from 640px). Fare boxes are a three-column ruled grid (roughly 1.35 : 1 : 0.8) with 1.5px navy rules top, bottom and between. Leg rows are at least 68px tall with a fixed 78px (92px desktop) stub on the right.

## Elevation & Depth

Flat print. Depth is drawn, not lit: a ticket is a white sheet with a 1.5px navy rule and a 1px bottom ledge, sitting on pale stock. Shadows appear only on things that genuinely float over the page (search dialog, More sheet) or as a hover response on a leg row.

### Shadow Vocabulary
- **Ticket ledge** (`box-shadow: 0 1px 0 rgb(13 27 61 / 0.14)`): Resting state of every ticket.
- **Leg lift** (`box-shadow: 0 10px 20px -16px rgba(13,27,61,0.6)`): Hover on a leg row.
- **Primary press lip** (`box-shadow: 0 1px 0 #8f161b, 0 6px 14px -8px rgba(215,38,45,0.7)`): The primary button only.
- **Sheet** (`box-shadow: 0 -12px 30px -12px rgba(13,27,61,0.5)`): Phone More sheet rising from the tab bar.
- **Dialog** (`box-shadow: 0 24px 60px -20px rgba(13,27,61,0.7)`): Global search overlay.

### Named Rules
**The Drawn-Not-Lit Rule.** Containers are separated by navy rules and perforations, not by drop shadows. A shadow means the thing is floating or being hovered.

## Shapes

Small, printed corners. 3px for course tabs, chips, keycaps and the stamp; 4px for buttons, fields, nav items and icon plates; 6px for tickets, the carbon copy, empty states and the active tab-cap's top corners; 12px only for the top of the phone bottom sheet. Borders are 1.5px throughout (tickets, fields, secondary buttons, tab caps, fare-box rules); the stamp border is 2.5px.

The recurring silhouettes are ticket hardware: the horizontal tear line (2px dashed perforation with 16px circular notches punched at each edge, filled with the ground colour and outlined in the ticket rule when inside a ticket), the vertical stub perforation (2px dashed left border), and the three-slash brand and section mark.

## Components

### Buttons
Airline-counter controls: caps label, firm 1.5px edges, a small press.
- **Shape:** Lightly squared (4px). Heights 40px (md), 32px (sm), 40px square (icon).
- **Primary:** Jet red fill, white caps 13px at 0.12em tracking, with the press lip shadow. Hover deepens to jet ink. Used once per coupon at most ("Open in Notion").
- **Secondary:** White fill, 1.5px navy border, navy caps; hover inverts to navy fill with white text.
- **Quiet:** Navy caps on nothing; hover adds a 5% navy wash.
- **States:** Active nudges down 1px; disabled at 50% opacity; focus is the global 2px jet-red outline at 2px offset. External links carry an up-right arrow icon and a screen-reader "(opens in a new tab)".
- **Text links:** Caps 12px in ink-muted with a 2px dashed-perforation underline that turns jet red on hover.

### Chips
- **Course tab:** The course code in white caps on the course's ink, 3px corners, three sizes (20/24/28px tall). Linked tabs brighten on hover. Reads like a flight number.
- **Topic chip:** Carbon purple 12.5px text on pale lilac, 3px corners.

### Cards / Containers
- **Ticket:** The one container. White, 1.5px navy rule at 78% opacity, 6px corners, ticket-ledge shadow. Filter bars, leg rows, entry coupons and the next coupon all use it.
- **Carbon copy:** Lilac panel with a 1.5px carbon-purple border at 45%, dashed internal rules, all figures in mono carbon, a generated barcode. It duplicates the next coupon; it is not a general card style.
- **Empty state:** Dashed perforation border on white with the security-dot texture (7px grid of 1px hairline dots), a navy-ringed circular icon plate, caps title, and prose on white knockouts.

### Inputs / Fields
- **Style:** 40px, white, 1.5px navy border at 25%, 4px corners, 15px Barlow, placeholder ink-faint, jet-red caret. Selects use caps 14px with a navy chevron.
- **Focus:** Border goes full navy; keyboard focus adds the jet-red outline. Hover raises the border to 50%.

### Navigation
- **Desktop rail:** Navy, 256px. Items are 44px caps (15px, 0.12em) with a 28px icon plate; active item gets a navy-cabin fill and a jet-red icon plate; inactive at 70% white. A bordered board-sync box with a mono timestamp anchors the bottom.
- **Phone tab bar:** Navy, five 64px slots, 11.5px caps under an 18px icon in a 28x40 plate; active plate is jet red and label full white, inactive at 60%.
- **Tab caps:** Segmented 40px caps tabs on a 1.5px navy baseline; the active tab gets navy sides and a stock-coloured bottom so it reads as a folder tab opening onto the page. Counts are mono, jet red when active.

### Next-Leg Coupon (signature)
A 40px navy header bar (mono index cell on navy-cabin, "Next leg" caps, a jet-red type flag), then course tab, headline course name and record title, a ruled Date / Time / Marks fare box, a notched tear line, and a stub with the status caption, the 44px D-count (carbon, or jet red when urgent), and the prep-by date and action. It prints in once: translates down 8px with a falling shadow over 520ms.

### Leg Row (signature)
A compact ticket: course tab and short name, record title (strikethrough in ink-muted when done), a mono date/time metadata line, and a perforated right stub holding the D-count and status word, the stub date and month for non-tasks, or the USED stamp once done.

### Stamp (signature)
2.5px border in currentColor (jet red), 3px corners, condensed caps at 0.16em, rotated -7deg, multiply blend. On arrival it thunks in once (scale 1.35 to 0.95 to 1, 420ms, staggered by delay); reduced motion shows it already landed.

## Do's and Don'ts

### Do:
- **Do** build every list from coupons with a perforated stub (ticket rule, 6px corners, 1.5px navy).
- **Do** set every figure in JetBrains Mono bold carbon purple with slashed zero; switch to jet red only when urgent.
- **Do** mark finished work with the rotated USED stamp and keep it in the list.
- **Do** open sections with the jet-red `///` mark, caps title and an optional carbon count.
- **Do** put field labels in 11-12px condensed caps above their values, fare-box style.
- **Do** separate a coupon from its stub with the notched tear line, notch fill matching the ground behind it.
- **Do** keep motion to the three one-shot moves (print-in, stamp-in, slide-up) on the 0.16, 1, 0.3, 1 ease, all disabled under reduced motion.

### Don't:
- **Don't** reintroduce the slate-sidebar card dashboard with stat tiles this world replaced.
- **Don't** use course ink for anything but its course tab and progress bar.
- **Don't** use jet red decoratively or as a second accent fill.
- **Don't** use the security-dot texture anywhere but empty states.
- **Don't** separate containers with soft drop shadows; draw them with rules and perforations.
- **Don't** set record titles or prose in uppercase caps.
- **Don't** show a green check or remove a finished item instead of stamping it.
