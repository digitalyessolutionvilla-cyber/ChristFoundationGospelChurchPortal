import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { EventCard } from '@/components/shared/EventCard';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays } from 'lucide-react';

export function UpcomingEvents() {
  const today = new Date().toISOString().split('T')[0];

  const { data: events, isLoading } = useQuery({
    queryKey: ['featured_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .gte('event_date', today)
        .order('event_date', { ascending: true })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (!isLoading && (!events || events.length === 0)) return null;

  return (
    <section className="py-14 md:py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-church-red font-serif text-sm uppercase tracking-widest mb-2 font-semibold">
              Upcoming
            </p>
            <h2 className="font-display text-3xl font-bold text-primary flex items-center gap-3">
              <CalendarDays className="w-7 h-7 text-primary" />
              Events & Programs
            </h2>
          </div>
          <Link
            to="/calendar"
            className="text-sm font-serif font-semibold text-primary hover:text-church-gold-dark transition-colors underline-offset-4 hover:underline"
          >
            View full calendar →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events!.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
