import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { EventCard } from '@/components/shared/EventCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Clock } from 'lucide-react';
import { parseISO, isPast } from 'date-fns';

const Calendar = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['all_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const upcoming = events?.filter((e) => !isPast(parseISO(e.event_date))) ?? [];
  const past = events?.filter((e) => isPast(parseISO(e.event_date))) ?? [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Our Calendar"
          subtitle="Stay updated with upcoming programs, camp meetings, and special services"
        />

        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-8 bg-secondary border border-border">
              <TabsTrigger value="upcoming" className="font-serif data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <CalendarDays className="w-4 h-4" /> Upcoming Events
              </TabsTrigger>
              <TabsTrigger value="past" className="font-serif data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <Clock className="w-4 h-4" /> Past Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
                </div>
              ) : upcoming.length === 0 ? (
                <div className="text-center py-16">
                  <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="font-display text-xl text-muted-foreground">No upcoming events at this time.</p>
                  <p className="font-serif text-muted-foreground text-sm mt-1">Check back soon for new programs.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcoming.map((event) => <EventCard key={event.id} event={event} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
                </div>
              ) : past.length === 0 ? (
                <div className="text-center py-16">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="font-display text-xl text-muted-foreground">No past events on record.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...past].reverse().map((event) => <EventCard key={event.id} event={event} />)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calendar;
