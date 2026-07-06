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

const aboutLinks = [
  { label: 'Brief History of the Church', to: '/about' },
  { label: 'Our Vision', to: '/vision' },
  { label: 'Our Mission', to: '/mission' },
  { label: 'Doctrines & Beliefs', to: '/about#doctrines' },
  { label: 'Church Leadership', to: '/leadership' },
];

const ministriesLinks = [
  { label: 'Youth Ministry', to: '/youth-ministry' },
  { label: 'Watch Us Live', to: '/watch-live' },
];

const mediaLinks = [
  { label: 'Sermons', to: '/sermons' },
  { label: 'News & Announcements', to: '/news' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Online Radio', to: '/online-radio' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch published news headlines
  const { data: newsHeadlines = [] } = useQuery({
    queryKey: ['news_ticker'],
    queryFn: async () => {
      const { data } = await supabase
        .from('news_announcements')
        .select('title')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(8);
      return (data ?? []).map((n: { title: string }) => n.title);
    },
    staleTime: 5 * 60 * 1000,
  });

  const fallbackHeadlines = [
    'Welcome to Christ Foundation Gospel Church (Inc.)',
    'Sunday Worship Service — 9:00 AM & 11:00 AM',
    'Midweek Bible Study every Wednesday — 6:30 PM',
    'Prayer & Fasting — First Friday of every month',
  ];

  const headlines = newsHeadlines.length > 0 ? newsHeadlines : fallbackHeadlines;
  const tickerText = headlines.join('   •••   ');

  const dateStr = now.toLocaleDateString('en-GH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-serif transition-colors ${
      isActive ? 'text-accent font-semibold' : 'text-primary-foreground/90 hover:text-accent'
    }`;

  return (
    <header className="sticky top-0 z-50 shadow-blue">
      {/* Top info bar */}
      <div className="bg-church-red">
        <div className="container mx-auto px-4 flex items-center h-8 gap-3">
          {/* Quote — hidden on small screens */}
          <span className="hidden lg:block text-[11px] font-serif text-white/90 italic shrink-0">
            "Christ, the Sure Foundation" — I Cor 3:11
          </span>
          <div className="hidden lg:block w-px h-4 bg-white/30 shrink-0" />

          {/* News ticker */}
          <div className="flex-1 flex items-center gap-2 overflow-hidden min-w-0">
            <span className="flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider border border-white/30">
              <Radio className="w-2.5 h-2.5" />
              News
            </span>
            <div className="overflow-hidden flex-1">
              <p className="animate-ticker whitespace-nowrap text-[11px] font-serif text-white/95">
                {tickerText}
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-4 bg-white/30 shrink-0" />

          {/* Date & Time */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[11px] font-serif text-white/90 tabular-nums">
            <span>{dateStr}</span>
            <span className="text-white/50">|</span>
            <span className="font-semibold">{timeStr}</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-primary">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo + Name */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={LOGO_URL}
              alt="CFGC Logo"
              className="h-11 w-11 rounded-full object-contain bg-white/10 p-0.5"
              crossOrigin="anonymous"
            />
            <div className="hidden sm:block leading-tight">
              <p className="text-primary-foreground font-display font-bold text-sm leading-none">
                Christ Foundation
              </p>
              <p className="text-accent font-serif text-xs">Gospel Church (Inc.)</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-serif text-primary-foreground/90 hover:text-accent transition-colors">
                  About <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border-border shadow-card">
                {aboutLinks.map((l) => (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link to={l.to} className="font-serif cursor-pointer">{l.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink to="/locations" className={navLinkClass}>Locations</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-serif text-primary-foreground/90 hover:text-accent transition-colors">
                  Ministries <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border-border shadow-card">
                {ministriesLinks.map((l) => (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link to={l.to} className="font-serif cursor-pointer">{l.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-serif text-primary-foreground/90 hover:text-accent transition-colors">
                  Media <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border-border shadow-card">
                {mediaLinks.map((l) => (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link to={l.to} className="font-serif cursor-pointer">{l.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink to="/calendar" className={navLinkClass}>Our Calendar</NavLink>
            <NavLink to="/testimonies" className={navLinkClass}>Testimonies</NavLink>

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

              <nav className="p-4 space-y-1">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Brief History', to: '/about' },
                  { label: 'Our Vision', to: '/vision' },
                  { label: 'Our Mission', to: '/mission' },
                  { label: 'Church Leadership', to: '/leadership' },
                  { label: 'Doctrines & Beliefs', to: '/about#doctrines' },
                  { label: 'Sermons', to: '/sermons' },
                  { label: 'News & Announcements', to: '/news' },
                  { label: 'Gallery', to: '/gallery' },
                  { label: 'Our Locations', to: '/locations' },
                  { label: 'Youth Ministry', to: '/youth-ministry' },
                  { label: 'Online Radio', to: '/online-radio' },
                  { label: 'Watch Us Live', to: '/watch-live' },
                  { label: 'Our Calendar', to: '/calendar' },
                  { label: 'Testimonies', to: '/testimonies' },
                  { label: 'Contact Us', to: '/contact' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-sm font-serif text-primary-foreground/90 hover:text-accent hover:bg-primary-foreground/10 transition-colors"
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
