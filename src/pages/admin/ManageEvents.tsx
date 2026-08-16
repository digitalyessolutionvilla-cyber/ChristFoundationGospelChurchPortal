import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Plus, Trash2, Edit2, Save, Star, CalendarDays } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  is_featured: boolean;
  registration_link: string;
  banner_url: string;
  map_url: string;
}

const emptyForm = { title: '', description: '', event_date: '', location: '', is_featured: false, registration_link: '', banner_url: '', map_url: '' };

function ManageEventsInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin_events'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
      return (data ?? []) as Event[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from('events').update(form).eq('id', editId);
        if (error) throw error;
        await logActivity('Updated event', 'Events', form.title);
      } else {
        const { error } = await supabase.from('events').insert(form);
        if (error) throw error;
        await logActivity('Added event', 'Events', form.title);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({ title: editId ? 'Event updated!' : 'Event added!' });
      setShowForm(false); setEditId(null); setForm({ ...emptyForm });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted event', 'Events');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_events'] });
      toast({ title: 'Event deleted' });
    },
  });

  const startEdit = (e: Event) => {
    setForm({ title: e.title, description: e.description, event_date: e.event_date, location: e.location,
      is_featured: e.is_featured, registration_link: e.registration_link ?? '', banner_url: e.banner_url ?? '', map_url: e.map_url ?? '' });
    setEditId(e.id); setShowForm(true);
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Events Calendar</h1>
          <p className="text-muted-foreground font-serif text-sm">Create and manage church events.</p>
        </div>
        <Button onClick={() => { setForm({ ...emptyForm }); setEditId(null); setShowForm(true); }} className="bg-primary text-primary-foreground font-serif gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <h2 className="font-display font-semibold text-lg mb-4">{editId ? 'Edit Event' : 'Add New Event'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="font-serif text-sm">Event Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1.5 font-serif" required />
            </div>
            <div>
              <Label className="font-serif text-sm">Date *</Label>
              <Input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} className="mt-1.5 font-serif" required />
            </div>
            <div>
              <Label className="font-serif text-sm">Location</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="mt-1.5 font-serif" />
            </div>
            <div>
              <Label className="font-serif text-sm">Registration Link (optional)</Label>
              <Input value={form.registration_link} onChange={e => setForm(f => ({ ...f, registration_link: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://..." />
            </div>
            <div>
              <Label className="font-serif text-sm">Banner Image URL (optional)</Label>
              <Input value={form.banner_url} onChange={e => setForm(f => ({ ...f, banner_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://..." />
            </div>
            <div>
              <Label className="font-serif text-sm">Google Maps URL (optional)</Label>
              <Input value={form.map_url} onChange={e => setForm(f => ({ ...f, map_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://maps.google.com/..." />
            </div>
            <div className="md:col-span-2">
              <Label className="font-serif text-sm">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="mt-1.5 font-serif min-h-24" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured} onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))} />
              <Label className="font-serif text-sm">Feature on homepage</Label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground font-serif gap-2">
              <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Event'}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }} className="font-serif">Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {events?.map(e => {
            const past = e.event_date ? isPast(parseISO(e.event_date)) : false;
            return (
              <div key={e.id} className={`bg-card rounded-xl border p-4 flex items-start justify-between gap-4 ${past ? 'opacity-60' : 'border-primary/20'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-semibold text-sm text-foreground">{e.title}</p>
                      {e.is_featured && <Star className="w-3 h-3 text-church-gold-dark" fill="currentColor" />}
                      {past ? <Badge variant="secondary" className="text-[10px]">Past</Badge> : <Badge className="text-[10px] bg-primary text-primary-foreground">Upcoming</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground font-serif">{format(parseISO(e.event_date), 'MMM d, yyyy')} {e.location && `· ${e.location}`}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => startEdit(e)} className="font-serif text-xs h-8 gap-1"><Edit2 className="w-3 h-3" /></Button>
                  <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(e.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10 h-8"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const ManageEvents = () => (
  <AdminGuard>
    <AdminLayout>
      <ManageEventsInner />
    </AdminLayout>
  </AdminGuard>
);

export default ManageEvents;
