import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Check, X, User, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Testimony {
  id: string;
  author_name: string;
  content: string;
  approved: boolean;
  is_featured: boolean;
  created_at: string;
}

function TestimoniesInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonies, isLoading } = useQuery({
    queryKey: ['all_testimonies_admin'],
    queryFn: async () => {
      const { data } = await supabase.from('testimonies').select('*').order('created_at', { ascending: false });
      return (data ?? []) as Testimony[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, approved, is_featured }: { id: string; approved?: boolean; is_featured?: boolean }) => {
      const updates: Record<string, boolean> = {};
      if (approved !== undefined) updates.approved = approved;
      if (is_featured !== undefined) updates.is_featured = is_featured;
      const { error } = await supabase.from('testimonies').update(updates).eq('id', id);
      if (error) throw error;
      await logActivity('Updated testimony', 'Testimonies');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_testimonies_admin'] });
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      toast({ title: 'Testimony updated' });
    },
    onError: () => toast({ title: 'Failed to update', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_testimonies_admin'] });
      toast({ title: 'Testimony deleted' });
    },
  });

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Testimonies</h1>
        <p className="text-muted-foreground font-serif text-sm">Approve, feature, or remove member testimonies.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
      ) : testimonies?.length === 0 ? (
        <div className="text-center py-12"><p className="font-serif text-muted-foreground">No testimonies submitted yet.</p></div>
      ) : (
        <div className="space-y-3">
          {testimonies!.map((t: Testimony) => (
            <div key={t.id} className={`bg-card rounded-xl border p-5 ${t.approved ? 'border-primary/20' : 'border-border'}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">{t.author_name}</p>
                    <p className="text-[10px] text-muted-foreground font-serif">{format(parseISO(t.created_at), 'MMM d, yyyy')}</p>
                  </div>
                  <Badge variant={t.approved ? 'default' : 'secondary'} className={`text-[10px] ${t.approved ? 'bg-primary text-primary-foreground' : ''}`}>
                    {t.approved ? 'Published' : 'Pending'}
                  </Badge>
                  {t.is_featured && <Star className="w-3 h-3 text-church-gold-dark" fill="currentColor" />}
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  {!t.approved ? (
                    <Button size="sm" onClick={() => updateMutation.mutate({ id: t.id, approved: true })} className="bg-primary text-primary-foreground font-serif text-xs h-7 gap-1">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: t.id, approved: false })} className="font-serif text-xs h-7">Unpublish</Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: t.id, is_featured: !t.is_featured })} className={`font-serif text-xs h-7 gap-1 ${t.is_featured ? 'text-church-gold-dark border-church-gold' : ''}`}>
                    <Star className="w-3 h-3" fill={t.is_featured ? 'currentColor' : 'none'} />
                    {t.is_featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(t.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10 h-7">
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-sm font-serif text-foreground/80 leading-relaxed">{t.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ManageTestimonies = () => (
  <AdminGuard>
    <AdminLayout>
      <TestimoniesInner />
    </AdminLayout>
  </AdminGuard>
);

export default ManageTestimonies;
