import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Radio } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const LOGO_URL = 'https://cdn.enter.pro/resources/uid_100066245/55b7f7df-d041-4c.png';

interface NavItem {
  id: string;
  parent_id: string | null;
  label: string;
  url: string;
  target: string;
  display_order: number;
  is_active: boolean;
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Top bar settings
  const { data: topbarSettings } = useQuery({
    queryKey: ['topbar_settings'],
    queryFn: async () => {
      const { data } = await supabase.from('website_settings').select('key, value').eq('setting_group', 'topbar');
      const map: Record<string, string> = {};
      (data ?? []).forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
      return map;
    },
    staleTime: 60 * 1000,
  });

  // Dynamic navigation from DB
  const { data: navItems = [] } = useQuery({
    queryKey: ['nav_primary'],
    queryFn: async () => {
      const { data: menu } = await supabase.from('nav_menus').select('id').eq('slug', 'primary').maybeSingle();
      if (!menu?.id) return [];
      const { data: items } = await supabase
        .from('nav_menu_items')
        .select('*')
        .eq('menu_id', menu.id)
        .eq('is_active', true)
        .order('display_order');
      return (items ?? []) as NavItem[];
    },
    staleTime: 60 * 1000,
  });

  // News ticker
  const { data: newsHeadlines = [] } = useQuery({
    queryKey: ['news_ticker'],
    queryFn: async () => {
      const { data } = await supabase.from('news_announcements').select('title').eq('is_published', true).order('published_at', { ascending: false }).limit(8);
      return (data ?? []).map((n: { title: string }) => n.title);
    },
    staleTime: 5 * 60 * 1000,
  });

  const showQuote = topbarSettings?.topbar_show_quote !== 'false';
  const showNews  = topbarSettings?.topbar_show_news  !== 'false';
  const showClock = topbarSettings?.topbar_show_clock !== 'false';
  const quoteText = topbarSettings?.topbar_quote ?? '"Christ, the Sure Foundation"';
  const quoteRef  = topbarSettings?.topbar_quote_reference ?? 'I Corinthians 3:11';
  const fallbackTicker = topbarSettings?.topbar_news_fallback ?? 'Welcome to Christ Foundation Gospel Church (Inc.) • Sunday Worship: 9:00 AM & 11:00 AM';

  const headlines = newsHeadlines.length > 0 ? newsHeadlines : fallbackTicker.split('•').map((s: string) => s.trim()).filter(Boolean);
  const tickerText = headlines.join('   •••   ');
  const dateStr = now.toLocaleDateString('en-GH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-serif transition-colors ${isActive ? 'text-accent font-semibold' : 'text-primary-foreground/90 hover:text-accent'}`;

  // Build nav tree
  const topLevel = navItems.filter(i => !i.parent_id);
  const getChildren = (parentId: string) => navItems.filter(i => i.parent_id === parentId);

  const renderDesktopItem = (item: NavItem) => {
    const children = getChildren(item.id);
    if (children.length > 0) {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-sm font-serif text-primary-foreground/90 hover:text-accent transition-colors">
              {item.label} <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-popover border-border shadow-card">
            {children.map(child => (
              <DropdownMenuItem key={child.id} asChild>
                <Link
                  to={child.url}
                  target={child.target === '_blank' ? '_blank' : undefined}
                  className="font-serif cursor-pointer"
                >
                  {child.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <NavLink key={item.id} to={item.url} className={navLinkClass} end={item.url === '/'}>
        {item.label}
      </NavLink>
    );
  };

  // All items flat for mobile (top-level + children indented)
  const mobileItems: { label: string; url: string; indent?: boolean }[] = [];
  topLevel.forEach(item => {
    const children = getChildren(item.id);
    if (children.length > 0) {
      children.forEach(child => mobileItems.push({ label: child.label, url: child.url, indent: true }));
    } else {
      mobileItems.push({ label: item.label, url: item.url });
    }
  });

  return (
    <header className="sticky top-0 z-50 shadow-blue">
      {/* Top info bar */}
      <div className="bg-church-red">
        <div className="container mx-auto px-4 flex items-center h-8 gap-3">
          {showQuote && (
            <>
              <span className="hidden lg:block text-[11px] font-serif text-white/90 italic shrink-0">
                {quoteText} — {quoteRef}
              </span>
              <div className="hidden lg:block w-px h-4 bg-white/30 shrink-0" />
            </>
          )}

          {showNews && (
            <div className="flex-1 flex items-center gap-2 overflow-hidden min-w-0">
              <span className="flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider border border-white/30">
                <Radio className="w-2.5 h-2.5" />
                News
              </span>
              <div className="overflow-hidden flex-1">
                <p className="animate-ticker whitespace-nowrap text-[11px] font-serif text-white/95">{tickerText}</p>
              </div>
            </div>
          )}

          {showClock && (
            <>
              <div className="hidden sm:block w-px h-4 bg-white/30 shrink-0" />
              <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[11px] font-serif text-white/90 tabular-nums">
                <span>{dateStr}</span>
                <span className="text-white/50">|</span>
                <span className="font-semibold">{timeStr}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-primary">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={LOGO_URL} alt="CFGC Logo" className="h-11 w-11 rounded-full object-contain bg-white/10 p-0.5" crossOrigin="anonymous" />
            <div className="hidden sm:block leading-tight">
              <p className="text-primary-foreground font-display font-bold text-sm leading-none">Christ Foundation</p>
              <p className="text-accent font-serif text-xs">Gospel Church (Inc.)</p>
            </div>
          </Link>

          {/* Desktop Nav — from DB */}
          <div className="hidden lg:flex items-center gap-6">
            {topLevel.map(item => renderDesktopItem(item))}
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-church-gold-dark font-serif font-semibold ml-2"
              onClick={() => navigate('/watch-live')}
            >
              Watch Live
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden text-primary-foreground p-2" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-primary text-primary-foreground w-72 p-0">
              <div className="flex items-center justify-between p-4 border-b border-primary-foreground/20">
                <div className="flex items-center gap-2">
                  <img src={LOGO_URL} alt="CFGC" className="h-9 w-9 rounded-full bg-white/10 p-0.5" crossOrigin="anonymous" />
                  <span className="font-display font-bold text-sm">CFGC</span>
                </div>
                <SheetClose className="text-primary-foreground/70 hover:text-accent">
                  <X className="w-5 h-5" />
                </SheetClose>
              </div>
              <nav className="p-4 space-y-1 overflow-y-auto">
                {mobileItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.url}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2.5 px-3 rounded-lg text-sm font-serif text-primary-foreground/90 hover:text-accent hover:bg-primary-foreground/10 transition-colors ${item.indent ? 'ml-4 text-xs' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
