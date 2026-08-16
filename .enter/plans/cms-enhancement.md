# CFGC CMS Enhancement Plan

## What Already Exists
✅ Admin Dashboard with sidebar, roles, activity logs  
✅ Hero Slider, Sermons, Leadership, News, Gallery (basic), Events, Branches, Testimonies  
✅ Radio/Watch Live settings, Prayer/Contact/Newsletter forms, Users, Settings  
✅ DB tables: home_slider_items, sermons, leadership, gallery_albums/items, news_announcements, events, testimonies, website_settings, church_branches

---

## Phase 1 — Foundation: Media Library + Image Uploads (All Sections)
**Goal:** Every content type can upload images directly — no more pasting URLs.

### 1a. Supabase Storage Setup
- Create `cfgc-media` storage bucket (public, with RLS)
- Supports: images, videos, audio, documents

### 1b. New Database Tables
```sql
-- Media library tracking
CREATE TABLE media_library (id, filename, storage_path, public_url, file_type, file_size, alt_text, caption, folder, uploaded_by, created_at)

-- News categories
CREATE TABLE news_categories (id, name, slug, color, description, created_at)

-- Dynamic nav menus
CREATE TABLE nav_menus (id, name, slug, location)
CREATE TABLE nav_menu_items (id, menu_id, parent_id, label, url, target, icon, display_order, is_active)
```

### 1c. New Column Additions
```sql
-- news_announcements: add category_id, tags[], seo_title, seo_description, excerpt, slug, scheduled_at
-- gallery_albums: add category, tags[]
-- gallery_items: add alt_text, description
-- home_slider_items: no change (already has image_url)
-- sermons: no change (already has thumbnail_url)
-- events: no change (already has banner_url)
-- leadership: no change (already has photo_url)
```

### 1d. New Shared Components
- `ImageUploader` — drag-and-drop upload to Supabase Storage, returns URL
- `MediaPicker` — browse Media Library and pick existing image

### 1e. New Admin Page: Media Library (`/admin/media`)
- Upload files (images, video, audio, PDF/docs)
- Browse all uploaded files in a grid
- Search by name/type, filter by folder
- Copy URL to clipboard, delete files
- Reuse across all content forms via MediaPicker

---

## Phase 2 — Content Enhancements

### 2a. Gallery Enhancement
- Add category dropdown (Youth Ministry, Sunday Worship, Camp Meeting, etc.)
- Replace image URL fields with `ImageUploader` component
- Bulk image upload into an album
- Drag-and-drop reordering of images within albums
- Video upload/embed support (YouTube URL or direct upload)
- Alt text field per image

### 2b. News & Blog Enhancement
- News Categories management sub-page (`/admin/categories`)
- Rich text content editor (using TipTap — installed)
- Add: excerpt, slug, category, tags, seo_title, seo_description
- Scheduled publishing (set future publish date)
- Featured image upload via `ImageUploader`
- Draft / Published / Scheduled status badges

### 2c. Image Upload on All Existing Modules
Replace all `image_url` text input fields with the `ImageUploader` component in:
- Hero Slider
- Sermons (thumbnail)
- Leadership (photo)
- Events (banner)
- Church Branches

---

## Phase 3 — Navigation & Footer Management

### 3a. Menu Management (`/admin/menus`)
- Create/edit/delete menus (Header, Footer)
- Add/edit/remove menu items with label, URL, target
- Sub-menus (parent/child relationship)
- Drag-and-drop ordering
- Toggle visibility (show/hide items)
- Public site Navbar reads from DB (falls back to static if no DB menus)

### 3b. Footer Management (extend `/admin/settings`)
- Dedicated "Footer" tab in Website Settings
- Edit: address, phone numbers, email, social links, copyright text, footer logo, newsletter section on/off
- Footer component reads from `website_settings` table in real-time

---

## Phase 4 — Page Builder (Advanced)

### 4a. Page Builder (`/admin/pages`)
- Create custom pages with a slug (e.g. `/page/mens-ministry`)
- Block-based editor with block types:
  - Hero Banner (title, subtitle, image)
  - Text Block (rich text via TipTap)
  - Image (single image with caption)
  - Image Gallery (pick from Media Library)
  - YouTube/Facebook Video embed
  - Bible Verse
  - Call-to-Action Button
  - Downloadable File (PDF/DOCX)
- Drag-and-drop block reordering
- Preview before publishing
- Pages automatically added to router via dynamic route

---

## New Packages to Install
- `@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/extension-image` — rich text editor
- `@dnd-kit/core` + `@dnd-kit/sortable` — drag-and-drop
- `react-dropzone` — file upload UX

---

## New Routes Added
| Path | Page |
|------|------|
| `/admin/media` | Media Library |
| `/admin/categories` | News Categories |
| `/admin/menus` | Menu Management |
| `/admin/pages` | Page Builder |

---

## Implementation Order
1. DB migration (all new tables + column additions)
2. Supabase Storage bucket + RLS policies
3. `ImageUploader` + `MediaPicker` shared components
4. Media Library admin page
5. Enhanced Gallery (categories, bulk upload, ordering)
6. Enhanced News (categories, tags, SEO, rich text, scheduling)
7. Image upload on all existing modules (Slider, Sermons, Leadership, Events)
8. News Categories admin sub-page
9. Menu Management + Footer Management
10. Page Builder (Phase 4)

All changes are backwards-compatible. Existing content remains intact.
