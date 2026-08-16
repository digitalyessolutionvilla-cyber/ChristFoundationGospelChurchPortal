import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

interface Leader {
  id: string; full_name: string; title: string; bio: string;
  photo_url: string; email: string; phone: string; display_order: number;
}

export default function ChurchLeadership() {
  const { data: leaders, isLoading } = useQuery({
    queryKey: ['leadership'],
    queryFn: async () => {
      const { data } = await supabase.from('leadership').select('*').eq('is_active', true).order('display_order');
      return (data ?? []) as Leader[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <PageHeader
        title="Church Leadership"
        subtitle="Servant leaders called and ordained to shepherd the flock of God."
      />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2].map(i => <Skeleton key={i} className="h-60 rounded-2xl" />)}
            </div>
          ) : leaders?.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl text-foreground mb-2">Leadership page coming soon</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {leaders!.map(leader => (
                <div key={leader.id} className="bg-card rounded-2xl border border-border shadow-card p-8 flex flex-col sm:flex-row gap-6">
                  {leader.photo_url ? (
                    <img src={leader.photo_url} alt={leader.full_name} className="w-24 h-24 rounded-full object-cover shrink-0 border-4 border-primary/20 shadow-blue self-start" crossOrigin="anonymous" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-hero flex items-center justify-center shrink-0 self-start">
                      <span className="font-display font-bold text-2xl text-primary-foreground">{leader.full_name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h2 className="font-display font-bold text-xl text-foreground leading-tight">{leader.full_name}</h2>
                    <p className="text-primary font-serif font-semibold text-sm mb-3">{leader.title}</p>
                    {leader.bio && (
                      <p className="font-serif text-sm text-muted-foreground leading-relaxed">{leader.bio}</p>
                    )}
                    {(leader.email || leader.phone) && (
                      <div className="mt-3 space-y-1">
                        {leader.email && <p className="text-xs font-serif text-primary">{leader.email}</p>}
                        {leader.phone && <p className="text-xs font-serif text-muted-foreground">{leader.phone}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
