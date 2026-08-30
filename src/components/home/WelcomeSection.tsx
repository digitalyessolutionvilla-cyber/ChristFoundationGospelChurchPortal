import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CMSText } from '@/components/shared/CMSText';
import { UserRound } from 'lucide-react';

export function WelcomeSection() {
  const { data: churchSettings = {} as Record<string, string> } = useQuery({
    queryKey: ['church_settings'],
    queryFn: async () => {
      const { data } = await supabase.from('website_settings').select('key, value').eq('setting_group', 'church');
      const map: Record<string, string> = {};
      (data ?? []).forEach((item: { key: string; value: string }) => {
        map[item.key] = item.value;
      });
      return map;
    },
    staleTime: 60 * 1000,
  });

  const overseerPhoto = churchSettings.general_overseer_photo || '';

  return (
    <section className="py-14 md:py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <div className="text-center mb-10">
          <p className="text-church-red font-serif text-sm uppercase tracking-widest mb-2 font-semibold">
            Welcome
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            A Message From Our General Overseer
          </h2>
          {/* Decorative underline */}
          <div className="flex items-center justify-center mt-4 gap-3">
            <div className="h-0.5 w-16 bg-church-red/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-church-red" />
            <div className="h-0.5 w-16 bg-church-red/40" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Welcome text from CMS */}
          <div className="bg-secondary/50 rounded-2xl p-6 md:p-10 shadow-card border border-border relative">
            {/* Quote mark */}
            <div className="absolute top-4 left-6 text-7xl font-display text-primary/10 leading-none select-none">
              "
            </div>
            <div className="relative z-10">
              <CMSText contentKey="welcome_message" className="text-foreground/85 font-serif" />
            </div>

            {/* Overseer signature */}
            <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
              {overseerPhoto ? (
                <img
                  src={overseerPhoto}
                  alt="General Overseer"
                  className="w-10 h-10 rounded-full object-cover border border-border bg-white shrink-0"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <UserRound className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              <div>
                <p className="font-display font-semibold text-primary text-sm">
                  {churchSettings.general_overseer_name || 'Rev. Nathaniel A. Akintobi'}
                </p>
                <p className="text-muted-foreground text-xs font-serif">
                  General Overseer, CFGC (Inc.)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
