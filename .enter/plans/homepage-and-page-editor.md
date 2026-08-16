# Full Homepage & Page Content Editor

## What the user wants
1. Full control over the homepage — edit every section, add/remove sections, reorder them
2. Each section supports icons (Lucide + Font Awesome), images, videos, URLs
3. Edit full content of other pages (About, Vision, Mission, Contact, Youth Ministry, etc.)

---

## Current State
| Feature | Status |
|---|---|
| Hero Slider | ✅ Managed at `/admin/slider` |
| Quick Links | ❌ Hardcoded in component |
| Welcome Section | ⚠️ Text-only via CMSText |
| Vision/Mission Cards | ⚠️ Text-only via CMSText |
| Upcoming Events | ✅ Auto from DB |
| Homepage section order/visibility | ❌ Not controllable |
| About / Vision / Mission pages | ⚠️ Partial text only |
| Contact / Youth Ministry / etc. | ❌ Fully static |

---

## Implementation Plan

### 1. Database (single migration)
- `home_sections` table — controls which sections appear on homepage, in what order
  - `id`, `section_key` (hero_slider | quicklinks | welcome | vision_mission | events | custom), `label`, `display_order`, `is_visible`, `custom_config` (jsonb)
  - Seed with the 5 built-in sections in their current order

- `quick_links` table — replaces hardcoded QuickLinks array
  - `id`, `icon_library` (lucide | fa-solid | fa-brands), `icon_name`, `label`, `description`, `url`, `icon_color`, `bg_color`, `display_order`, `is_active`
  - Seed with the 4 existing quick links

- Extend `cms_pages` to support core pages by slug (about, vision, mission, contact, youth-ministry, church-leadership) — no schema change needed, just seed entries with `is_published: true`

### 2. New Admin Page: Homepage Builder (`/admin/homepage`)
Located in sidebar under Content > "Homepage Builder"

**Tabs:**
- **Sections** — list all homepage sections in order, drag to reorder, toggle visibility, click to configure each built-in section or edit custom blocks
- **Quick Links** — add/edit/delete/reorder the 4 quick link cards; icon picker (Lucide list + FA solid icons); color picker for icon and bg
- **Custom Blocks** — add new sections between existing ones (Hero banner, Text block, Image, Video, Bible Verse, CTA, Icon Grid)

### 3. Icon Picker Component (`/src/components/shared/IconPicker.tsx`)
- Searchable modal with tabs: Lucide, FontAwesome Solid, FontAwesome Brands
- Shows icon grid, click to select
- Returns `{ library: 'lucide' | 'fa-solid' | 'fa-brands', name: string }`

### 4. Dynamic Icon Renderer (`/src/components/shared/DynamicIcon.tsx`)
- Takes `{ library, name, className }` and renders the correct icon
- Used in QuickLinks, homepage custom sections, etc.

### 5. Homepage renders from DB
- `Index.tsx` queries `home_sections` ordered by `display_order`
- Renders each visible section dynamically
- Built-in section keys map to existing components
- Custom sections rendered with a block renderer

### 6. QuickLinks reads from DB
- `QuickLinks.tsx` queries `quick_links` table instead of hardcoded array
- Uses `DynamicIcon` to render any Lucide or FA icon

### 7. Core Pages now block-editable via Page Builder
- Seed `cms_pages` with entries for: About, Vision, Mission, Contact, Youth Ministry, Church Leadership (using their URL slugs)
- Each public page component checks `cms_pages` first — if blocks exist, renders them; otherwise falls back to existing static content
- Page Builder shows these as "Core Pages" with an edit button
- Admin sidebar gets a "Core Pages" link in the Content section

### 8. Sidebar update
- Add "Homepage Builder" to Content section in AdminLayout
- Add "Core Pages" link (or merge into Page Builder)

---

## Files Touched
| File | Change |
|---|---|
| DB migration | New tables + seed data |
| `src/pages/Index.tsx` | Dynamic section rendering |
| `src/components/home/QuickLinks.tsx` | Read from DB + DynamicIcon |
| `src/components/shared/IconPicker.tsx` | New: icon picker modal |
| `src/components/shared/DynamicIcon.tsx` | New: renders any icon |
| `src/pages/admin/HomeBuilder.tsx` | New: homepage builder admin page |
| `src/pages/admin/PageBuilder.tsx` | Add Core Pages tab |
| `src/pages/About.tsx` + other pages | Check cms_pages, fallback to static |
| `src/components/admin/AdminLayout.tsx` | Add Homepage Builder to nav |
| `src/router.tsx` | Add `/admin/homepage` route |
