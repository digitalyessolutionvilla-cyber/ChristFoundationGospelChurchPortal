import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DynamicIcon } from '@/components/shared/DynamicIcon';

interface QuickLink {
  id: string;
  icon_library: string;
  icon_name: string;
  label: string;
  description: string;
  url: string;
  icon_color: string;
  bg_color: string;
  display_order: number;
  is_active: boolean;
}

export function QuickLinks() {
  const { data: links = [] } = useQuery({
    queryKey: ['quick_links'],
    queryFn: async () => {
      const { data } = await supabase
        .from('quick_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      return (data ?? []) as QuickLink[];
    },
  });

  if (links.length === 0) return null;

  return (
    <section className="py-10 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {links.map(link => (
            <Link
              key={link.id}
              to={link.url}
              className="group flex flex-col items-center text-center rounded-xl p-5 bg-white/5 hover:bg-white/15 border border-white/15 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-full ${link.bg_color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <DynamicIcon
                  library={link.icon_library as 'lucide' | 'fa-solid' | 'fa-brands'}
                  name={link.icon_name}
                  className={`w-6 h-6 ${link.icon_color}`}
                />
              </div>
              <p className="font-display font-semibold text-white text-sm mb-1">{link.label}</p>
              <p className="text-white/60 text-xs font-serif leading-snug">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
