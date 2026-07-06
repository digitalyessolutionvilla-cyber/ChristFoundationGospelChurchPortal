# CFGC Full CMS Upgrade Plan

## Context
Upgrading the existing church website to a fully-featured CMS with role-based access control, super admin account, activity logs, and complete content management across all website sections.

---

## Step 1 — Super Admin Account
Create via Supabase Edge Function (`/setup-super-admin`) using service role:
- **Email**: delightdesign.org@gmail.com  
- **Password**: Iamblessed@1  
- **Role**: super_admin

---

## Step 2 — Database Schema (One Migration)

### New Tables

| Table | Purpose |
|-------|---------|
| `admin_roles` | Role definitions + permissions JSON |
| `admin_profiles` | Links auth.users → role, stores name, active status |
| `admin_activity_logs` | Who did what and when |
| `sermons` | Title, speaker, date, audio_url, video_url, notes_url, category |
| `leadership` | Name, title, bio, photo_url, order, active |
| `gallery_albums` | Name, description, cover_url |
| `gallery_items` | album_id, media_url, media_type, caption, display_order |
| `news_announcements` | Title, content, image_url, published, featured, published_at |
| `prayer_requests` | Name, email, request, is_private, responded |
| `contact_messages` | Name, email, phone, message, read |
| `newsletter_subscribers` | Email, active, subscribed_at |
| `website_settings` | Key-value (site name, logo, SEO, contacts, social links, colors) |
| `home_slider_items` | title, subtitle, image_url, cta_text, cta_url, display_order, active |
| `church_districts` | name, display_order |
| `church_branches` | district_id, name, address, po_box, phones[], is_hq |

### Updated Tables
- `events` → add: registration_link, banner_url, map_url
- `testimonies` → add: featured (bool)

---

## Step 3 — Admin Roles

6 predefined roles with permission flags:

| Role | Slug | Can Manage |
|------|------|-----------|
| Super Administrator | super_admin | Everything + user management |
| Website Administrator | website_admin | All content + settings |
| Content Editor | content_editor | Pages, sermons, news, gallery |
| Media Administrator | media_admin | Sermons, gallery only |
| Events Administrator | events_admin | Events + calendar only |
| Livestream Administrator | livestream_admin | Watch Live + Radio only |

Permissions stored as JSON column on `admin_roles`.

---

## Step 4 — Files to Create / Update

### Edge Functions (Supabase)
- `setup-super-admin/index.ts` — creates super admin account (one-time)

### Updated Components
- `AdminGuard.tsx` — check role + permissions
- `Navbar.tsx` — add Sermons, News, Leadership, Gallery links
- `Footer.tsx` — pull contact info from `website_settings`
- `HeroSlider.tsx` — load slides from `home_slider_items` table
- `CMSText.tsx` — already exists, keep as-is

### New Shared Components
- `AdminLayout.tsx` — shared admin sidebar + header
- `RoleGuard.tsx` — permission-based rendering

### New Public Pages
- `Sermons.tsx` — /sermons
- `Leadership.tsx` — /leadership
- `Gallery.tsx` — /gallery
- `News.tsx` — /news
- `NewsDetail.tsx` — /news/:id
- `Contact.tsx` — /contact (contact form + prayer request)

### New Admin Pages
- `admin/Dashboard.tsx` — ENHANCED: stats overview, recent activity, quick actions
- `admin/Sermons.tsx` — full CRUD
- `admin/Leadership.tsx` — full CRUD
- `admin/Gallery.tsx` — albums + items CRUD
- `admin/News.tsx` — full CRUD
- `admin/Branches.tsx` — districts + branches CRUD (replaces static)
- `admin/Slider.tsx` — hero slider item management
- `admin/Settings.tsx` — website settings (name, logo, SEO, social, theme)
- `admin/Users.tsx` — admin user management (super_admin only)
- `admin/ActivityLogs.tsx` — filterable activity log
- `admin/forms/PrayerRequests.tsx`
- `admin/forms/ContactMessages.tsx`
- `admin/forms/Newsletter.tsx`

### Updated Admin Pages
- `admin/EditContent.tsx` — keep, still works for cms_content keys
- `admin/ManageEvents.tsx` — add banner_url, registration_link fields
- `admin/ManageTestimonies.tsx` — add "feature" toggle

---

## Step 5 — Admin Layout

Replace the per-page admin header with a shared `AdminLayout` that includes:
- Collapsible sidebar with grouped navigation
- Role-filtered menu items (only show sections the role can access)
- User profile display (name, role, logout)
- Activity badge for pending items (testimonies, prayer requests, messages)

---

## Step 6 — Activity Logging

Create `logActivity(action, details)` utility that inserts to `admin_activity_logs` after every admin write operation.

---

## Step 7 — Website Settings Integration

- Footer pulls phone/email/social from `website_settings` table
- SEO meta tags use settings for title/description
- Logo URL from settings (overrides hardcoded logo)

---

## Step 8 — Updated Router

Add all new public and admin routes, grouped clearly.

---

## Verification Checklist
- [ ] Super admin can log in at /admin/login
- [ ] Dashboard shows stats (sermons count, events count, pending testimonies, etc.)
- [ ] All 6 roles created in DB
- [ ] Super admin can create new admin users and assign roles
- [ ] Content editor cannot access user management
- [ ] Hero slider loads from DB
- [ ] Sermons page shows sermon list
- [ ] Leadership page shows leaders
- [ ] Gallery page shows albums
- [ ] News page lists articles
- [ ] Contact page has prayer request + contact forms
- [ ] Branches page shows dynamic data from DB (all existing branches seeded)
- [ ] Website settings page saves and reflects on public site
- [ ] Activity logs track all admin writes
- [ ] Lint passes
