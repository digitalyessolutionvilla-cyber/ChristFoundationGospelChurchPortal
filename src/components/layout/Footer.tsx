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

const FOOTER_KEYS = [
  'footer_logo_url', 'footer_church_name', 'footer_description',
  'footer_motto_text', 'footer_motto_reference',
  'footer_address', 'footer_po_box',
  'footer_phone_1', 'footer_phone_2', 'footer_phone_3', 'footer_email',
  'footer_copyright',
];

// Shown while the DB loads / if a setting is empty, so the footer is never blank.
const FALLBACK_VALUES: Record<string, string> = {
  footer_logo_url: LOGO_URL,
  footer_church_name: 'Christ Foundation Gospel Church',
  footer_description: 'Committed to serving the hungry and thirsty individual with spiritual diet (the Word of God).',
  footer_motto_text: 'Christ, the Sure Foundation',
  footer_motto_reference: 'I Cor. 3:11',
  footer_address: '7, Olusoji Street, Orile Oshodi',
  footer_po_box: 'P. O. Box 983, Mushin, Lagos',
  footer_phone_1: '+2347030090757',
  footer_phone_2: '+2348027723788',
  footer_phone_3: '+2348060279123',
  footer_copyright: 'Christ Foundation Gospel Church (Inc.). All rights reserved.',
  facebook_url: 'https://facebook.com',
  twitter_url: 'https://twitter.com/cfgcglobal',
};

// Shown while the DB menu loads / if the footer menu is empty.
const FALLBACK_LINKS: FooterLink[] = [
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
  // All footer text comes from Website Settings in the admin (Footer + Social tabs).
  const { data: settings } = useQuery({
    queryKey: ['footer_settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('website_settings')
        .select('key, value')
        .in('key', [...FOOTER_KEYS, 'facebook_url', 'twitter_url']);
      return (data ?? []) as { key: string; value: string }[];
    },
    staleTime: 60 * 1000,
  });

  const values: Record<string, string> = { ...FALLBACK_VALUES };
  settings?.forEach(s => { if (s.value) values[s.key] = s.value; });

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

  const phones = [values.footer_phone_1, values.footer_phone_2, values.footer_phone_3].filter(Boolean);
  const showEmail = !!values.footer_email;

  return (
    <footer className="bg-church-deep text-primary-foreground">
      {/* Gold top border */}
      <div className="h-1 bg-gradient-gold" />

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Church info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={values.footer_logo_url}
              alt="CFGC Logo"
              className="h-14 w-14 rounded-full bg-white/10 p-0.5 object-cover"
              crossOrigin="anonymous"
            />
            <div>
              <p className="font-display font-bold text-base text-primary-foreground leading-tight">
                {values.footer_church_name}
              </p>
              <p className="text-accent text-xs font-serif">(Inc.)</p>
            </div>
          </div>
          <p className="text-primary-foreground/70 font-serif text-sm leading-relaxed mb-4">
            {values.footer_description}
          </p>
          <p className="text-accent font-serif text-sm italic">
            "{values.footer_motto_text}" — {values.footer_motto_reference}
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
                <p>{values.footer_address}</p>
                {values.footer_po_box && <p className="text-primary-foreground/60">{values.footer_po_box}</p>}
              </div>
            </div>
            {phones.length > 0 && (
              <div className="flex gap-2.5">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  {phones.map((phone) => (
                    <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="block hover:text-accent transition-colors">
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {showEmail && (
              <div className="flex gap-2.5">
                <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a href={`mailto:${values.footer_email}`} className="hover:text-accent transition-colors">{values.footer_email}</a>
              </div>
            )}
          </div>

          <div className="mt-5">
            <h4 className="font-display font-semibold text-sm text-accent mb-2">Follow Us</h4>
            <div className="flex gap-3 flex-wrap">
              {values.facebook_url && (
                <a
                  href={values.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-serif text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
              )}
              {values.twitter_url && (
                <a
                  href={values.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-serif text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Twitter className="w-4 h-4" /> @cfgcglobal
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-primary-foreground/50 text-xs font-serif">
            &copy; {new Date().getFullYear()} {values.footer_copyright}
          </p>
          <Link to="/admin/login" className="text-primary-foreground/30 hover:text-accent text-xs font-serif transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
