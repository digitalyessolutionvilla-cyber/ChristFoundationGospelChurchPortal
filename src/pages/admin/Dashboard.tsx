import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen, CalendarDays, MessageSquare, HandHeart, Mail,
  Map, Users, Newspaper, Image, ChevronRight, Activity, Clock
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ActivityLog {
  id: string;
  action: string;
  section: string;
  user_email: string;
  created_at: string;
}

function StatCard({ label, value, icon: Icon, to, color }: {
  label: string; value: number | string; icon: React.ComponentType<{ className?: string }>;
  to: string; color: string;
}) {
  return (
    <Link to={to} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-blue hover:border-primary/30 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <p className="font-display font-bold text-2xl text-foreground">{value}</p>
      <p className="text-xs font-serif text-muted-foreground mt-0.5">{label}</p>
    </Link>
  );
}

function AdminDashboardInner() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin_dashboard_stats'],
    queryFn: async () => {
      const [sermons, events, branches, prayer, testimonies, news, subscribers, contact, activity] = await Promise.all([
        supabase.from('sermons').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }).gte('event_date', new Date().toISOString().split('T')[0]),
        supabase.from('church_branches').select('id', { count: 'exact' }),
        supabase.from('prayer_requests').select('id', { count: 'exact' }).eq('is_responded', false),
        supabase.from('testimonies').select('id', { count: 'exact' }).eq('approved', false),
        supabase.from('news_announcements').select('id', { count: 'exact' }).eq('is_published', true),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('contact_messages').select('id', { count: 'exact' }).eq('is_read', false),
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
        recentActivity: activity.data ?? [],
      };
    },
  });

  const quickActions = [
    { label: 'Add Sermon', to: '/admin/sermons', icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { label: 'Add Event', to: '/admin/events', icon: CalendarDays, color: 'bg-accent/15 text-church-gold-dark' },
    { label: 'Edit Content', to: '/admin/content', icon: MessageSquare, color: 'bg-secondary text-secondary-foreground' },
    { label: 'Add News', to: '/admin/news', icon: Newspaper, color: 'bg-church-red/10 text-church-red' },
    { label: 'View Messages', to: '/admin/forms/contact', icon: Mail, color: 'bg-primary/10 text-primary' },
    { label: 'Settings', to: '/admin/settings', icon: Activity, color: 'bg-muted text-muted-foreground' },
  ];

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-serif text-sm">Welcome back. Here's an overview of your website.</p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Sermons" value={stats?.sermons ?? 0} icon={BookOpen} to="/admin/sermons" color="bg-primary/10 text-primary" />
          <StatCard label="Upcoming Events" value={stats?.upcomingEvents ?? 0} icon={CalendarDays} to="/admin/events" color="bg-accent/15 text-church-gold-dark" />
          <StatCard label="Church Branches" value={stats?.branches ?? 0} icon={Map} to="/admin/branches" color="bg-secondary text-secondary-foreground" />
          <StatCard label="Prayer Requests" value={stats?.prayerRequests ?? 0} icon={HandHeart} to="/admin/forms/prayer" color="bg-church-red/10 text-church-red" />
          <StatCard label="Pending Testimonies" value={stats?.pendingTestimonies ?? 0} icon={MessageSquare} to="/admin/testimonies" color="bg-accent/10 text-church-gold-dark" />
          <StatCard label="Published News" value={stats?.publishedNews ?? 0} icon={Newspaper} to="/admin/news" color="bg-primary/10 text-primary" />
          <StatCard label="Unread Messages" value={stats?.unreadMessages ?? 0} icon={Mail} to="/admin/forms/contact" color="bg-church-red/10 text-church-red" />
          <StatCard label="Newsletter Subscribers" value={stats?.subscribers ?? 0} icon={Users} to="/admin/forms/newsletter" color="bg-secondary text-secondary-foreground" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div>
          <h2 className="font-display font-semibold text-base text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(({ label, to, icon: Icon, color }) => (
              <Link key={to} to={to} className="flex items-center gap-2.5 bg-card rounded-xl border border-border p-3.5 hover:border-primary/30 hover:shadow-card transition-all">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-serif font-medium text-foreground">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="font-display font-semibold text-base text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Recent Activity
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-10" />)}</div>
            ) : stats?.recentActivity.length === 0 ? (
              <p className="text-muted-foreground font-serif text-sm p-4 text-center">No activity recorded yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {stats?.recentActivity.map((log: ActivityLog) => (
                  <div key={log.id} className="flex items-start gap-3 p-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-serif text-foreground truncate">{log.action} — <span className="font-semibold">{log.section}</span></p>
                      <p className="text-[10px] text-muted-foreground font-serif">{log.user_email} · {format(parseISO(log.created_at), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-border p-2">
              <Link to="/admin/activity" className="text-xs text-primary font-serif hover:underline block text-center">View all activity →</Link>
            </div>
          </div>
        </div>
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
