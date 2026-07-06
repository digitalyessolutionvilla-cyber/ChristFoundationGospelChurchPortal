import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, X, User } from 'lucide-react';

const LOGO_URL = 'https://cdn.enter.pro/resources/uid_100066245/29b71ed7-ea27-47.png';

interface Testimony {
  id: string;
  author_name: string;
  content: string;
  approved: boolean;
  created_at: string;
}

function ManageTestimoniesInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonies, isLoading } = useQuery({
    queryKey: ['all_testimonies_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonies')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Testimony[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase.from('testimonies').update({ approved }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_testimonies_admin'] });
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      toast({ title: 'Testimony updated' });
    },
    onError: () => toast({ title: 'Failed to update testimony', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_testimonies_admin'] });
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      toast({ title: 'Testimony deleted' });
    },
    onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary shadow-blue sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <img src={LOGO_URL} alt="CFGC" className="h-8 w-8 rounded-full bg-white/10" crossOrigin="anonymous" />
          <span className="font-display font-bold text-primary-foreground text-sm">CFGC Admin</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5 font-serif text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-display font-bold text-xl text-foreground">Manage Testimonies</h1>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
        ) : testimonies?.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-serif text-muted-foreground">No testimonies submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testimonies!.map((t) => (
              <div key={t.id} className={`bg-card rounded-xl border p-5 ${t.approved ? 'border-primary/20' : 'border-border'}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm text-foreground">{t.author_name}</p>
                      <p className="text-xs text-muted-foreground font-serif">
                        {new Date(t.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <Badge variant={t.approved ? 'default' : 'secondary'} className={`text-xs ${t.approved ? 'bg-primary text-primary-foreground' : ''}`}>
                      {t.approved ? 'Published' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!t.approved ? (
                      <Button
                        size="sm"
                        onClick={() => updateMutation.mutate({ id: t.id, approved: true })}
                        className="bg-primary text-primary-foreground font-serif text-xs h-8 gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateMutation.mutate({ id: t.id, approved: false })}
                        className="font-serif text-xs h-8 gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Unpublish
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(t.id)}
                      className="text-destructive border-destructive/30 hover:bg-destructive/10 font-serif text-xs h-8"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm font-serif text-foreground/80 leading-relaxed">{t.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const ManageTestimonies = () => (
  <AdminGuard>
    <ManageTestimoniesInner />
  </AdminGuard>
);

export default ManageTestimonies;
