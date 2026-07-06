# CFGC Church Website Plan

## Context
Building a full church website for **Christ Foundation Gospel Church Inc. (CFGC)** with a CMS-powered backend so admins can edit the welcome message, history, and other text content. Inspired by apostolicfaithweca.org but with a distinctive, dignified aesthetic derived from the CFGC logo.

---

## Step 0 — Prerequisites
- **Enable Enter Cloud (Supabase)** — required for admin auth and CMS content storage.

---

## Design System
**Aesthetic**: Traditional Nigerian church — dignified, royal, spiritually elevated.

**Logo URL**: `https://cdn.enter.pro/resources/uid_100066245/29b71ed7-ea27-47.png`

**Color palette extracted from logo**:
- Primary: Royal Blue `224 71% 35%` (logo's blue ring)
- Accent/Danger: Red `0 85% 48%` (logo's cross + outer ring)  
- Gold: `45 96% 50%` (logo's motto text — yellow-gold)
- Background: `220 20% 97%` (near-white with cool tint)
- Dark: `224 50% 12%` (deep navy for dark sections)

**Google Fonts**: **Playfair Display** (headings) + **Source Serif 4** (body) — both serif for a church-appropriate tone.

**Design tokens (index.css)**:
```css
--primary: 224 71% 35%;
--primary-foreground: 0 0% 100%;
--accent: 0 85% 48%;         /* red */
--gold: 45 96% 50%;          /* gold */
--church-dark: 224 50% 12%;  /* deep navy */
--gradient-hero: linear-gradient(135deg, hsl(224 71% 25%), hsl(224 71% 40%));
--gradient-gold: linear-gradient(90deg, hsl(45 96% 45%), hsl(38 96% 55%));
```

---

## Enter Cloud (Supabase) Tables

### `cms_content`
| col | type | notes |
|-----|------|-------|
| id | uuid | PK |
| key | text | unique slug, e.g. `welcome_message`, `history_text` |
| value | text | rich text / plain text |
| updated_at | timestamp | auto |

**Seed keys**: `welcome_message`, `history_text`, `vision_text`, `mission_text`, `motto_text`, `doctrines_text`, `youth_ministry_text`

### `events`
| col | type | notes |
|-----|------|-------|
| id | uuid | PK |
| title | text | |
| description | text | |
| event_date | date | |
| location | text | optional venue |
| is_featured | bool | show on homepage |
| created_at | timestamp | |

### `testimonies`
| col | type | notes |
|-----|------|-------|
| id | uuid | PK |
| author_name | text | |
| content | text | |
| approved | bool | admin-controlled |
| created_at | timestamp | |

**RLS Policies**: Public can read `cms_content`, `events`, and `testimonies` (where `approved=true`). Only authenticated admins can insert/update/delete.

---

## File Structure

```
src/
  pages/
    Index.tsx              # Home: Hero, Welcome, Vision/Mission/Motto cards
    About.tsx              # Brief History + Doctrines and Beliefs
    Locations.tsx          # All church branches organized by district
    Testimonies.tsx        # Member testimonies + submit form
    OnlineRadio.tsx        # Placeholder for stream embed
    YouthMinistry.tsx      # Youth ministry section
    WatchLive.tsx          # Watch live placeholder
    Vision.tsx             # Our Vision (CMS)
    Mission.tsx            # Our Mission (CMS)
    Calendar.tsx           # Upcoming + past events
    admin/
      Login.tsx            # Admin email+password login
      Dashboard.tsx        # CMS content overview
      EditContent.tsx      # Edit a single CMS content key
      ManageEvents.tsx     # Add/edit/delete events
      ManageTestimonies.tsx# Approve/reject testimonies
  components/
    layout/
      Navbar.tsx           # Responsive nav with all menu items + dropdowns
      Footer.tsx           # Contact, social links, quick links
    home/
      HeroSlider.tsx       # 3-card auto-rotating banner
      WelcomeSection.tsx   # Editable welcome message display
      VisionMissionCards.tsx # Vision/Mission/Motto cards
      UpcomingEvents.tsx   # Featured events preview
    shared/
      CMSText.tsx          # Fetches & renders text from cms_content table
      LocationCard.tsx     # Branch card (name, address, phones)
      EventCard.tsx        # Event card (upcoming vs past styling)
      AdminGuard.tsx       # Redirects unauthenticated users from /admin
      PageHeader.tsx       # Reusable page header banner with blue/gold gradient
  lib/
    supabase.ts            # Supabase client setup
    locations.ts           # Static data: all branches by district
```

---

## Navigation Menu

```
[CFGC Logo]   Home | About ▾ | Ministries ▾ | Media ▾ | Calendar | Testimonies | Locations
                      ├ Brief History        ├ Youth Ministry  ├ Online Radio
                      ├ Our Vision           └ Watch Us Live   └ (social links)
                      ├ Our Mission
                      └ Doctrines & Beliefs
```

Mobile: Hamburger menu with full sidebar.

---

## Pages Detail

### Home (`/`)
- **Hero Slider**: 3 rotating slides with dark-blue background and gold accents — scripture verse, church motto, welcome CTA
- **Welcome Message**: "Welcome to CFGC" section, CMS-editable (key: `welcome_message`), signed by Rev. Nathaniel A. Akintobi
- **Vision / Mission / Motto**: 3 card grid with icons
- **Featured Events**: 2–3 upcoming events from `events` table
- **Quick Links Bar**: Online Radio, Watch Live, Locations, Youth Ministry

### About (`/about`)
- **Brief History of the Church** (CMS-editable, key: `history_text`) — full history from 1969
- **Doctrines and Beliefs** section (CMS-editable, key: `doctrines_text`)

### Our Locations (`/locations`)
- Organized by district (Headquarters → National Camp Ground → Lagos → Badagry → Iroko → Ota → Ifo → Arigbajo → Ilaro → Abeokuta South → Odeda → Keesan → Ibafo → Ijebu → Ibadan → Ekiti)
- Each card: branch name, address, phone numbers
- Static data from `src/lib/locations.ts`

### Our Calendar (`/calendar`)
- Two tabs: **Upcoming Events** / **Past Events**
- Data from `events` Supabase table, sorted by `event_date`

### Testimonies (`/testimonies`)
- Grid of approved testimonies from `testimonies` table
- Form to submit a new testimony (goes to admin for approval)

### Online Radio (`/online-radio`)
- Clean placeholder page: "Coming Soon — Our online radio stream will be available here"
- Ready for embed when link is provided

### Watch Us Live (`/watch-live`)
- Clean placeholder page: "Watch our live services — stream link coming soon"

### Youth Ministry (`/youth-ministry`)
- CMS-editable text (key: `youth_ministry_text`)
- Youth mission statement, activities

### Vision (`/vision`) & Mission (`/mission`)
- CMS-editable text from `cms_content` table (keys: `vision_text`, `mission_text`)

### Admin (`/admin/login`)
- Supabase Auth email + password login
- Redirects to `/admin/dashboard` on success

### Admin Dashboard (`/admin/dashboard`)  (protected)
- List of editable content sections with "Edit" buttons
- Links to Events management and Testimonies management

### Admin Edit Content (`/admin/edit/:key`)
- Textarea for editing the content value
- Save button (updates `cms_content` table)

### Admin Events (`/admin/events`)
- Table of all events with Add / Edit / Delete

### Admin Testimonies (`/admin/testimonies`)
- Table of pending testimonies with Approve / Reject

---

## Router Updates (`router.tsx`)
Add all new routes. Wrap `/admin/*` with `<AdminGuard>` component.

---

## Key Implementation Notes
- All CMS text is loaded via `CMSText.tsx` using React Query (`useQuery`) against the `cms_content` table
- Supabase client initialized in `src/lib/supabase.ts`
- Logo used in Navbar and Footer
- No i18n needed (English only)
- Run `run_lint` after all implementation

---

## Verification Checklist
- [ ] Home page loads with hero slider and welcome message from DB
- [ ] Admin can log in at `/admin/login` and edit welcome message
- [ ] Changes appear immediately on public home page
- [ ] Admin can add event → appears on `/calendar`
- [ ] All 13+ nav menu items navigate correctly
- [ ] Locations page shows all districts and branches
- [ ] Mobile hamburger menu works
- [ ] Testimonies submission form works
- [ ] Lint passes with no errors
