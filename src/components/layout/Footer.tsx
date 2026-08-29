import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const LOGO_URL = 'https://cdn.enter.pro/resources/uid_100066245/29b71ed7-ea27-47.png';

interface FooterLink {
  id: string;
  label: string;
  url: string;
  target: string;
  display_order: number;
  is_active: boolean;
}

// Shown while the DB menu loads / if the footer menu is empty, so the footer
// never appears blank. Once the admin saves a Footer Menu, it takes over.
const FALLBACK_LINKS = [
  { id: 'fallback-1', label: 'Home', url: '/' },
  { id: 'fallback-2', label: 'Brief History', url: '/about' },
  { id: 'fallback-3', label: 'Our Vision', url: '/vision' },
  { id: 'fallback-4', label: 'Our Mission', url: '/mission' },
  { id: 'fallback-5', label: 'Doctrines & Beliefs', url: '/about#doctrines' },
  { id: 'fallback-6', label: 'Our Locations', url: '/locations' },
  { id: 'fallback-7', label: 'Our Calendar', url: '/calendar' },
  { id: 'fallback-8', label: 'Youth Ministry', url: '/youth-ministry' },
  { id: 'fallback-9', label: 'Online Radio', url: '/online-radio' },
  { id: 'fallback-10', label: 'Watch Us Live', url: '/watch-live' },
  { id: 'fallback-11', label: 'Testimonies', url: '/testimonies' },
];

export function Footer() {
  // Footer quick links come from the Footer Menu in the admin.
  const { data: footerItems = [] } = useQuery({
    queryKey: ['nav_footer'],
    queryFn: async () => {
      const { data: menu } = await supabase.from('nav_menus').select('id').eq('slug', 'footer').maybeSingle();
      if (!menu?.id) return [];
      const { data: items } = await supabase
        .from('nav_menu_items')
        .select('*')
        .eq('menu_id', menu.id)
        .eq('is_active', true)
        .order('display_order');
      return (items ?? []) as FooterLink[];
    },
    staleTime: 60 * 1000,
  });

  const links = footerItems.length > 0 ? footerItems : FALLBACK_LINKS;

  return (
    <footer className="bg-church-deep text-primary-foreground">
      {/* Gold top border */}
      <div className="h-1 bg-gradient-gold" />

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Church info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={LOGO_URL}
              alt="CFGC Logo"
              className="h-14 w-14 rounded-full bg-white/10 p-0.5"
              crossOrigin="anonymous"
            />
            <div>
              <p className="font-display font-bold text-base text-primary-foreground leading-tight">
                Christ Foundation Gospel Church
              </p>
              <p className="text-accent text-xs font-serif">(Inc.)</p>
            </div>
          </div>
          <p className="text-primary-foreground/70 font-serif text-sm leading-relaxed mb-4">
            Committed to serving the hungry and thirsty individual with spiritual diet (the Word of God).
          </p>
          <p className="text-accent font-serif text-sm italic">
            "Christ, the Sure Foundation" — I Cor. 3:11
          </p>
        </div>

        {/* Quick Links — managed via admin > Menu Management > Footer Menu */}
        <div>
          <h3 className="font-display font-semibold text-base text-accent mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {links.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.url}
                  target={item.target === '_blank' ? '_blank' : undefined}
                  className="text-sm font-serif text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display font-semibold text-base text-accent mb-4">Headquarters</h3>
          <div className="space-y-3 text-sm font-serif text-primary-foreground/80">
            <div className="flex gap-2.5">
              <MapPin className="w-4 h-4 text-church-red mt-0.5 shrink-0" />
              <div>
                <p>7, Olusoji Street, Orile Oshodi</p>
                <p className="text-primary-foreground/60">P. O. Box 983, Mushin, Lagos</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <a href="tel:+2347030090757" className="block hover:text-accent transition-colors">+2347030090757</a>
                <a href="tel:+2348027723788" className="block hover:text-accent transition-colors">+2348027723788</a>
                <a href="tel:+2348060279123" className="block hover:text-accent transition-colors">+2348060279123</a>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="font-display font-semibold text-sm text-accent mb-2">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-serif text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Facebook className="w-4 h-4" /> Facebook
              </a>
              <a
                href="https://twitter.com/cfgcglobal"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-serif text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Twitter className="w-4 h-4" /> @cfgcglobal
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-primary-foreground/50 text-xs font-serif">
            &copy; {new Date().getFullYear()} Christ Foundation Gospel Church (Inc.). All rights reserved.
          </p>
          <Link to="/admin/login" className="text-primary-foreground/30 hover:text-accent text-xs font-serif transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
