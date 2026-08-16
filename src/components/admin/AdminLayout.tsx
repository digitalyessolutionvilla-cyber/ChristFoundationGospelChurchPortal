import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, FileText, Users, CalendarDays, Image, Newspaper,
  MessageSquare, Settings, LogOut, ChevronDown, ChevronRight,
  Radio, Tv, Map, BookOpen, Sliders, Bell, UserCog, Activity,
  HandHeart, Mail, Rss, Menu, X, Shield, FolderOpen, Navigation,
  Tag, Layers
} from 'lucide-react';

const LOGO_URL = 'https://cdn.enter.pro/resources/uid_100066245/55b7f7df-d041-4c.png';

interface NavGroup {
  label: string;
  items: NavItem[];
  permission?: string;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  badge?: string;
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Homepage Builder', to: '/admin/homepage', icon: Layers, permission: 'manage_content' },
      { label: 'Hero Slider', to: '/admin/slider', icon: Sliders, permission: 'manage_slider' },
      { label: 'Page Builder', to: '/admin/pages', icon: Layers, permission: 'manage_content' },
      { label: 'Page Content', to: '/admin/content', icon: FileText, permission: 'manage_content' },
      { label: 'Sermons', to: '/admin/sermons', icon: BookOpen, permission: 'manage_sermons' },
      { label: 'Leadership', to: '/admin/leadership', icon: Users, permission: 'manage_leadership' },
      { label: 'News & Announcements', to: '/admin/news', icon: Newspaper, permission: 'manage_news' },
      { label: 'News Categories', to: '/admin/categories', icon: Tag, permission: 'manage_news' },
      { label: 'Gallery', to: '/admin/gallery', icon: Image, permission: 'manage_gallery' },
    ],
  },
  {
    label: 'Church',
    items: [
      { label: 'Events Calendar', to: '/admin/events', icon: CalendarDays, permission: 'manage_events' },
      { label: 'Church Branches', to: '/admin/branches', icon: Map, permission: 'manage_branches' },
      { label: 'Testimonies', to: '/admin/testimonies', icon: MessageSquare, permission: 'manage_testimonies' },
    ],
  },
  {
    label: 'Media',
    items: [
      { label: 'Media Library', to: '/admin/media', icon: FolderOpen, permission: 'manage_gallery' },
      { label: 'Online Radio', to: '/admin/radio', icon: Radio, permission: 'manage_livestream' },
      { label: 'Watch Live', to: '/admin/watchlive', icon: Tv, permission: 'manage_livestream' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { label: 'Menu Management', to: '/admin/menus', icon: Navigation, permission: 'manage_settings' },
    ],
  },
  {
    label: 'Forms',
    items: [
      { label: 'Prayer Requests', to: '/admin/forms/prayer', icon: HandHeart, permission: 'manage_forms' },
      { label: 'Contact Messages', to: '/admin/forms/contact', icon: Mail, permission: 'manage_forms' },
      { label: 'Newsletter', to: '/admin/forms/newsletter', icon: Rss, permission: 'manage_forms' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Admin Users', to: '/admin/users', icon: UserCog, permission: 'manage_users' },
      { label: 'Activity Logs', to: '/admin/activity', icon: Activity, permission: 'view_activity' },
      { label: 'Website Settings', to: '/admin/settings', icon: Settings, permission: 'manage_settings' },
    ],
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? '');
    });
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['admin_profile_me'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      const { data } = await supabase.from('admin_profiles').select('*, admin_roles(permissions)').eq('user_id', session.user.id).maybeSingle();
      return data;
    },
  });

  const _isSuperAdmin = profile?.role_slug === 'super_admin';

  // All authenticated admins see all nav items — RLS handles data security
  const _canAccess = (_permission?: string) => true;

  const { data: pendingCounts } = useQuery({
    queryKey: ['admin_pending_counts'],
    queryFn: async () => {
      const [testimonies, prayer, contact] = await Promise.all([
        supabase.from('testimonies').select('id', { count: 'exact' }).eq('approved', false),
        supabase.from('prayer_requests').select('id', { count: 'exact' }).eq('is_responded', false),
        supabase.from('contact_messages').select('id', { count: 'exact' }).eq('is_read', false),
      ]);
      return {
        testimonies: testimonies.count ?? 0,
        prayer: prayer.count ?? 0,
        contact: contact.count ?? 0,
      };
    },
    refetchInterval: 30000,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const renderSidebar = (compact = false) => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center gap-3 shrink-0">
        <img src={LOGO_URL} alt="CFGC" className="h-9 w-9 rounded-full shrink-0 object-cover" crossOrigin="anonymous" />
        {!compact && (
          <div className="min-w-0">
            <p className="font-display font-bold text-sidebar-foreground text-xs leading-tight truncate">CFGC Admin</p>
            <p className="text-sidebar-foreground/50 text-[10px] font-serif truncate">{userEmail}</p>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!compact && profile && (
        <div className="px-4 py-2 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-sidebar-primary shrink-0" />
            <span className="text-[10px] font-serif text-sidebar-primary font-semibold uppercase tracking-wider truncate">
              {profile.role_slug?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 min-h-0">
        {navGroups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.label);
          return (
            <div key={group.label}>
              {!compact && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors"
                >
                  {group.label}
                  {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;
                    const count = item.to === '/admin/testimonies' ? pendingCounts?.testimonies
                      : item.to === '/admin/forms/prayer' ? pendingCounts?.prayer
                      : item.to === '/admin/forms/contact' ? pendingCounts?.contact
                      : 0;

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-serif transition-all ${
                          isActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold'
                            : 'text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {!compact && (
                          <>
                            <span className="flex-1 truncate text-xs">{item.label}</span>
                            {count ? <Badge className="text-[9px] h-4 px-1 bg-church-red text-primary-foreground">{count}</Badge> : null}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1 shrink-0">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-serif text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
        >
          <Bell className="w-4 h-4 shrink-0" />
          {!compact && <span>View Website</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-serif text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!compact && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-14'}`}
      >
        {renderSidebar(!sidebarOpen)}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative z-10 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-full">
            {renderSidebar(false)}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) setMobileSidebarOpen(!mobileSidebarOpen);
                else setSidebarOpen(!sidebarOpen);
              }}
              className="text-muted-foreground hover:text-foreground p-1 rounded"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-display font-semibold text-foreground hidden sm:block">
              Content Management System
            </span>
          </div>
          <div className="flex items-center gap-2">
            {pendingCounts && (pendingCounts.testimonies + pendingCounts.prayer + pendingCounts.contact) > 0 && (
              <div className="flex items-center gap-1.5 bg-church-red/10 text-church-red px-2 py-1 rounded-full text-xs font-serif">
                <Bell className="w-3 h-3" />
                {pendingCounts.testimonies + pendingCounts.prayer + pendingCounts.contact} pending
              </div>
            )}
            <span className="text-xs text-muted-foreground font-serif hidden md:block truncate max-w-32">{userEmail}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
