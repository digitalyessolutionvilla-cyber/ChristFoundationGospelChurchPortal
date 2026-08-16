import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Radio } from 'lucide-react';

interface SettingRow { key: string; value: string; }

const LIVE_KEYS = ['live_now_active', 'live_now_mixlr_url', 'live_now_message'];

export function LiveNowBanner() {
  const { data: settings } = useQuery({
    queryKey: ['live_now_settings'],
    queryFn: async () => {
      const { data } = await supabase.from('website_settings').select('key, value').in('key', LIVE_KEYS);
      return (data ?? []) as SettingRow[];
    },
    staleTime: 15 * 1000,
    refetchInterval: 60 * 1000,
  });

  const values: Record<string, string> = {};
  settings?.forEach(s => { values[s.key] = s.value; });

  const isLive = values['live_now_active'] === 'true';
  const mixlrUrl = values['live_now_mixlr_url'] ?? '';
  const message = values['live_now_message'] || 'We are LIVE now! Tune in to join the service.';

  if (!isLive) return null;

  return (
    <section className="bg-gradient-hero border-b border-church-gold/30">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-church-red/20">
              <span className="absolute inline-flex h-full w-full rounded-full bg-church-red opacity-60 animate-ping" />
              <Radio className="relative w-4 h-4 text-church-red" />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-primary-foreground tracking-wide uppercase">
                Live Now
              </p>
              <p className="font-serif text-xs text-primary-foreground/80 max-w-xs">
                {message}
              </p>
            </div>
          </div>

          {mixlrUrl && (
            <div className="w-full md:flex-1 rounded-xl overflow-hidden shadow-blue bg-card/10">
              <iframe
                src={mixlrUrl}
                title="Live Mixlr Broadcast"
                width="100%"
                height="150"
                frameBorder="0"
                allow="autoplay"
                className="block"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
