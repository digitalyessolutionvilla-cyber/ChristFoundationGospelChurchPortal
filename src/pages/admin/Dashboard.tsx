import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, CalendarDays, MessageSquare, HandHeart, Mail,
  Map, Users, Newspaper, Image, ChevronRight, Activity, Clock,
  Sliders, FolderOpen, Navigation, Tag, Layers, Tv, Radio,
  UserCog, Settings, Rss, FileText, Users2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ActivityLog {
  id: string;
  action: string;
  section: string;
  user_email: string;
  created_at: string;
}

interface CmsModule {
  label: string;
  description: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string | number;
}

function ModuleCard({ label, description, to, icon: Icon, color, badge }: CmsModule) {
  return (
    <Link
      to={to}
      className="relative bg-card rounded-xl border border-border p-4 shadow-card hover:shadow-blue hover:border-primary/30 transition-all group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {badge !== undefined && Number(badge) > 0 && (
          <Badge className="text-[10px] bg-church-red text-white font-serif">{badge}</Badge>
        )}
      </div>
      <div>
        <p className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">{label}</p>
        <p className="text-[11px] font-serif text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors self-end" />
    </Link>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-muted/40 border border-border">
      <span className="font-serif text-xs text-muted-foreground">{label}</span>
      <span className={`font-display font-bold text-sm ${color}`}>{value}</span>
    </div>
  );
}

function AdminDashboardInner() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin_dashboard_stats'],
    queryFn: async () => {
      const [sermons, events, branches, prayer, testimonies, news, subscribers, contact, gallery, media, activity] = await Promise.all([
        supabase.from('sermons').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }).gte('event_date', new Date().toISOString().split('T')[0]),
        supabase.from('church_branches').select('id', { count: 'exact' }),
        supabase.from('prayer_requests').select('id', { count: 'exact' }).eq('is_responded', false),
        supabase.from('testimonies').select('id', { count: 'exact' }).eq('approved', false),
        supabase.from('news_announcements').select('id', { count: 'exact' }).eq('is_published', true),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('contact_messages').select('id', { count: 'exact' }).eq('is_read', false),
        supabase.from('gallery_albums').select('id', { count: 'exact' }),
        supabase.from('media_library').select('id', { count: 'exact' }),
        supabase.from('admin_activity_logs').select('*').order('created_at', { ascending: false }).limit(8),
      ]);
      return {
        sermons: sermons.count ?? 0,
        upcomingEvents: events.count ?? 0,
        branches: branches.count ?? 0,
        prayerRequests: prayer.count ?? 0,
        pendingTestimonies: testimonies.count ?? 0,
        publishedNews: news.count ?? 0,
        subscribers: subscribers.count ?? 0,
        unreadMessages: contact.count ?? 0,
        galleryAlbums: gallery.count ?? 0,
        mediaFiles: media.count ?? 0,
        recentActivity: (activity.data ?? []) as ActivityLog[],
      };
    },
  });

  const cmsModules: { section: string; items: CmsModule[] }[] = [
    {
      section: 'Homepage & Content',
      items: [
        { label: 'Hero Slider', description: 'Manage rotating homepage banners and images', to: '/admin/slider', icon: Sliders, color: 'bg-primary/10 text-primary' },
        { label: 'Page Builder', description: 'Create custom pages with content blocks', to: '/admin/pages', icon: Layers, color: 'bg-purple-500/10 text-purple-600' },
        { label: 'Page Content', description: 'Edit key-value text content across pages', to: '/admin/content', icon: FileText, color: 'bg-secondary text-secondary-foreground' },
      ],
    },
    {
      section: 'Church Content',
      items: [
        { label: 'Sermons', description: 'Upload and manage sermon audio, video & notes', to: '/admin/sermons', icon: BookOpen, color: 'bg-primary/10 text-primary' },
        { label: 'Leadership', description: 'Manage pastors and church leaders with photos', to: '/admin/leadership', icon: Users2, color: 'bg-accent/15 text-church-gold-dark' },
        { label: 'Events Calendar', description: 'Create and manage church events', to: '/admin/events', icon: CalendarDays, color: 'bg-green-500/10 text-green-600', badge: stats?.upcomingEvents },
        { label: 'Church Branches', description: 'Manage all branch locations and contact info', to: '/admin/branches', icon: Map, color: 'bg-orange-500/10 text-orange-600' },
        { label: 'Testimonies', description: 'Approve and manage member testimonies', to: '/admin/testimonies', icon: MessageSquare, color: 'bg-pink-500/10 text-pink-600', badge: stats?.pendingTestimonies },
      ],
    },
    {
      section: 'News & Media',
      items: [
        { label: 'News & Announcements', description: 'Publish articles with rich text, categories & SEO', to: '/admin/news', icon: Newspaper, color: 'bg-church-red/10 text-church-red', badge: stats?.publishedNews },
        { label: 'News Categories', description: 'Create and manage news article categories', to: '/admin/categories', icon: Tag, color: 'bg-teal-500/10 text-teal-600' },
        { label: 'Gallery', description: 'Manage photo albums, bulk upload images & videos', to: '/admin/gallery', icon: Image, color: 'bg-violet-500/10 text-violet-600', badge: stats?.galleryAlbums },
        { label: 'Media Library', description: 'Centralized store for all uploaded files', to: '/admin/media', icon: FolderOpen, color: 'bg-indigo-500/10 text-indigo-600', badge: stats?.mediaFiles },
        { label: 'Online Radio', description: 'Manage the church online radio stream', to: '/admin/radio', icon: Radio, color: 'bg-cyan-500/10 text-cyan-600' },
        { label: 'Watch Live', description: 'Configure the live stream broadcast settings', to: '/admin/watchlive', icon: Tv, color: 'bg-red-500/10 text-red-600' },
      ],
    },
    {
      section: 'Navigation & Settings',
      items: [
        { label: 'Menu Management', description: 'Edit header & footer navigation menus, sub-menus', to: '/admin/menus', icon: Navigation, color: 'bg-slate-500/10 text-slate-600' },
        { label: 'Website Settings', description: 'General, footer, SEO, social media & contact settings', to: '/admin/settings', icon: Settings, color: 'bg-muted text-muted-foreground' },
      ],
    },
    {
      section: 'Forms & Communication',
      items: [
        { label: 'Prayer Requests', description: 'View and respond to submitted prayer requests', to: '/admin/forms/prayer', icon: HandHeart, color: 'bg-rose-500/10 text-rose-600', badge: stats?.prayerRequests },
        { label: 'Contact Messages', description: 'Read messages sent via the contact form', to: '/admin/forms/contact', icon: Mail, color: 'bg-primary/10 text-primary', badge: stats?.unreadMessages },
        { label: 'Newsletter Subscribers', description: 'Manage email newsletter subscribers', to: '/admin/forms/newsletter', icon: Rss, color: 'bg-amber-500/10 text-amber-600', badge: stats?.subscribers },
      ],
    },
    {
      section: 'System',
      items: [
        { label: 'Admin Users', description: 'Manage admin accounts, roles and permissions', to: '/admin/users', icon: UserCog, color: 'bg-primary/10 text-primary' },
        { label: 'Activity Logs', description: 'View all admin actions and audit trail', to: '/admin/activity', icon: Activity, color: 'bg-secondary text-secondary-foreground' },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">CMS Dashboard</h1>
          <p className="text-sm font-serif text-muted-foreground">Christ Foundation Gospel Church — Content Management System</p>
        </div>
        <Link
          to="/"
          target="_blank"
          className="text-xs font-serif text-primary hover:underline flex items-center gap-1"
        >
          View Website <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Stats strip */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <StatPill label="Published News" value={stats?.publishedNews ?? 0} color="text-primary" />
          <StatPill label="Upcoming Events" value={stats?.upcomingEvents ?? 0} color="text-green-600" />
          <StatPill label="Sermons" value={stats?.sermons ?? 0} color="text-primary" />
          <StatPill label="Unread Messages" value={stats?.unreadMessages ?? 0} color="text-church-red" />
          <StatPill label="Media Files" value={stats?.mediaFiles ?? 0} color="text-violet-600" />
        </div>
      )}

      {/* Pending alerts */}
      {stats && (stats.pendingTestimonies > 0 || stats.prayerRequests > 0 || stats.unreadMessages > 0) && (
        <div className="flex flex-wrap gap-2">
          {stats.pendingTestimonies > 0 && (
            <Link to="/admin/testimonies" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-church-red/10 border border-church-red/20 text-church-red text-xs font-serif font-semibold hover:bg-church-red/15 transition-colors">
              <MessageSquare className="w-3 h-3" /> {stats.pendingTestimonies} testimonies pending approval
            </Link>
          )}
          {stats.prayerRequests > 0 && (
            <Link to="/admin/forms/prayer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-serif font-semibold hover:bg-rose-500/15 transition-colors">
              <HandHeart className="w-3 h-3" /> {stats.prayerRequests} prayer requests unanswered
            </Link>
          )}
          {stats.unreadMessages > 0 && (
            <Link to="/admin/forms/contact" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-serif font-semibold hover:bg-primary/15 transition-colors">
              <Mail className="w-3 h-3" /> {stats.unreadMessages} unread contact messages
            </Link>
          )}
        </div>
      )}

      {/* CMS Modules */}
      {cmsModules.map(({ section, items }) => (
        <div key={section}>
          <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border">{section}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map(mod => (
              <ModuleCard key={mod.to} {...mod} />
            ))}
          </div>
        </div>
      ))}

      {/* Recent Activity */}
      <div>
        <h2 className="font-display font-bold text-base text-foreground mb-3 pb-2 border-b border-border flex items-center gap-2">
          <Clock className="w-4 h-4" /> Recent Activity
        </h2>
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
        ) : stats?.recentActivity.length === 0 ? (
          <p className="text-sm font-serif text-muted-foreground py-4">No activity yet</p>
        ) : (
          <div className="space-y-1.5">
            {stats?.recentActivity.map((log: ActivityLog) => (
              <div key={log.id} className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-card">
                <Activity className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-xs text-foreground">{log.action}</p>
                  <p className="font-serif text-[10px] text-muted-foreground">{log.section} — {log.user_email}</p>
                </div>
                <span className="font-serif text-[10px] text-muted-foreground shrink-0">
                  {format(parseISO(log.created_at), 'PP p')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const AdminDashboard = () => (
  <AdminGuard>
    <AdminLayout>
      <AdminDashboardInner />
    </AdminLayout>
  </AdminGuard>
);

export default AdminDashboard;
