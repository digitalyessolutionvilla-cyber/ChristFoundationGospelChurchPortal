# CFGC Church Website Plan

## Context
Building a full church website for **Christ Foundation Gospel Church Inc. (CFGC)** with a CMS-powered backend so admins can edit the welcome message, history, and other text content. Inspired by apostolicfaithweca.org but with a more refined, distinctive aesthetic suited to the CFGC brand.

---

## Step 0 — Prerequisites
- **Enable Enter Cloud (Supabase)** — required for admin auth and CMS content storage.

---

## Design System
**Aesthetic**: Traditional Nigerian church — dignified, warm, and spiritually elevated.

**Tokens (index.css)**:
- `--primary`: Deep burgundy/maroon `27 70% 25%` (hsl)
- `--gold`: `43 96% 56%` — accent gold for highlights
- `--cream`: `40 30% 97%` — warm background
- `--primary-foreground`: near-white
- Custom CSS vars: `--gradient-hero`, `--shadow-gold`
- Google Fonts: **Playfair Display** (headings) + **Lato** (body)

---

## Enter Cloud (Supabase) Tables

### `cms_content`
| col | type | notes |
|-----|------|-------|
| id | uuid | PK |
| key | text | unique slug, e.g. `welcome_message`, `history_text` |
| value | text | rich text / plain text |
| updated_at | timestamp | auto |

Seed rows: `welcome_message`, `history_text`, `vision_text`, `mission_text`, `motto_text`, `doctrines_text`

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

**Row-Level Security**: Public read on `cms_content`, `events`, `testimonies (approved=true)`. Admin writes via service role (edge functions).

---

## File Structure

```
src/
  pages/
    Index.tsx          # Home: Hero, Welcome, Vision/Mission/Motto
    About.tsx          # Brief History + Doctrines
    Locations.tsx      # All church branches by district
    Testimonies.tsx    # Member testimonies
    OnlineRadio.tsx    # Radio placeholder
    YouthMinistry.tsx  # Youth section
    WatchLive.tsx      # Live stream placeholder
    Vision.tsx         # Our Vision
    Mission.tsx        # Our Mission
    Calendar.tsx       # Events (upcoming + past)
    admin/
      Login.tsx        # Admin email+password login
      Dashboard.tsx    # CMS editor list
      EditContent.tsx  # Edit a single CMS key
      ManageEvents.tsx # Add/edit/delete events
      ManageTestimonies.tsx # Approve testimonies
  components/
    layout/
      Navbar.tsx       # Main navigation (all menu items)
      Footer.tsx       # Contact + social links
    home/
      HeroSlider.tsx   # Rotating banner with scripture/announcement
      WelcomeSection.tsx # CMS-editable welcome message
      VisionMissionCards.tsx
    shared/
      CMSText.tsx      # Renders editable text from cms_content table
      LocationCard.tsx # Branch card with address + phone
      EventCard.tsx    # Calendar event card
      AdminGuard.tsx   # Redirects non-admins
  lib/
    supabase.ts        # Supabase client
    locations.ts       # Static location data (all branches)
```

---

## Navigation Menu Structure

```
Home | About ▾ | Ministries ▾ | Media ▾ | Our Calendar | Testimonies | Contact
                  ├ Brief History      ├ Youth Ministry    ├ Online Radio
                  ├ Vision             └ Watch Us Live     └ Social Media
                  ├ Mission
                  └ Doctrines & Beliefs

(also: Our Locations as a standalone page)
```

---

## Pages Detail

### Home (`/`)
- Hero slider (3 rotating cards): scripture verse + church motto + upcoming event
- Welcome message section (CMS-editable, pulled from `cms_content` key `welcome_message`)
- Vision / Mission / Motto cards (3-column)
- Upcoming events preview (from `events` table, `is_featured=true`)
- Quick links: Online Radio, Watch Live, Locations, Youth Ministry

### About (`/about`)
- **Brief History of the Church** section (CMS-editable text)
- **Doctrines and Beliefs** section (CMS-editable text)

### Our Locations (`/locations`)
- Static data (hardcoded from `locations.ts`) organized by district
- Headquarters first, then National Camp Ground, then all districts
- Each card shows branch name, address, phone numbers

### Our Calendar (`/calendar`)
- Upcoming events section (event_date >= today)
- Past events section (event_date < today)
- Data from `events` Supabase table

### Testimonies (`/testimonies`)
- Lists approved testimonies from `testimonies` table
- Submit testimony form (adds unapproved row for admin review)

### Online Radio (`/online-radio`)
- Placeholder page — ready for stream embed when link is available

### Watch Us Live (`/watch-live`)
- Placeholder page — ready for YouTube/stream embed

### Youth Ministry (`/youth-ministry`)
- Static youth section with mission statement

### Vision (`/vision`) & Mission (`/mission`)
- CMS-editable text from `cms_content` table

### Admin (`/admin`)
- Login page with Supabase Auth (email + password)
- Dashboard showing editable content sections
- CMS editor for each content key
- Event management (add/edit/delete)
- Testimony management (approve/reject)

---

## Router Updates (`router.tsx`)
Add all new routes, wrap admin routes with `<AdminGuard>`.

---

## Verification
1. Home page loads with hero slider, welcome message from DB
2. Admin can log in and edit welcome message — change visible immediately on public site
3. Admin can add an event — appears on `/calendar`
4. Locations page shows all branches organized by district
5. All menu items navigate to correct pages
6. Mobile responsive navigation (hamburger menu)
7. Run `run_lint` after implementation
