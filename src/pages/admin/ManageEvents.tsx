import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const LOGO_URL = 'https://cdn.enter.pro/resources/uid_100066245/29b71ed7-ea27-47.png';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  is_featured: boolean;
}

const emptyForm = { title: '', description: '', event_date: '', location: '', is_featured: false };

function ManageEventsInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: events, isLoading } = useQuery({
    queryKey: ['all_events_admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Event[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from('events').update(form).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_events_admin'] });
      queryClient.invalidateQueries({ queryKey: ['all_events'] });
      queryClient.invalidateQueries({ queryKey: ['featured_events'] });
      toast({ title: editId ? 'Event updated!' : 'Event added!' });
      setShowForm(false);
      setEditId(null);
      setForm({ ...emptyForm });
    },
    onError: () => toast({ title: 'Failed to save event', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_events_admin'] });
      queryClient.invalidateQueries({ queryKey: ['all_events'] });
      queryClient.invalidateQueries({ queryKey: ['featured_events'] });
      toast({ title: 'Event deleted' });
    },
    onError: () => toast({ title: 'Failed to delete event', variant: 'destructive' }),
  });

  const startEdit = (event: Event) => {
    setForm({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      is_featured: event.is_featured,
    });
    setEditId(event.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary shadow-blue sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <img src={LOGO_URL} alt="CFGC" className="h-8 w-8 rounded-full bg-white/10" crossOrigin="anonymous" />
          <span className="font-display font-bold text-primary-foreground text-sm">CFGC Admin</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5 font-serif text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
            <div className="h-4 w-px bg-border" />
            <h1 className="font-display font-bold text-xl text-foreground">Manage Events</h1>
          </div>
          <Button
            onClick={() => { setForm({ ...emptyForm }); setEditId(null); setShowForm(true); }}
            className="bg-primary text-primary-foreground font-serif gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Event
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
            <h2 className="font-display font-semibold text-lg mb-4">{editId ? 'Edit Event' : 'Add New Event'}</h2>
            <div className="space-y-4">
              <div>
                <Label className="font-serif text-sm">Event Title</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1.5 font-serif" required />
              </div>
              <div>
                <Label className="font-serif text-sm">Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-1.5 font-serif min-h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-serif text-sm">Date</Label>
                  <Input type="date" value={form.event_date} onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))} className="mt-1.5 font-serif" required />
                </div>
                <div>
                  <Label className="font-serif text-sm">Location</Label>
                  <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="mt-1.5 font-serif" placeholder="Optional" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.is_featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, is_featured: v }))}
                />
                <Label className="font-serif text-sm cursor-pointer">Feature on homepage</Label>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground font-serif">
                  {saveMutation.isPending ? 'Saving...' : 'Save Event'}
                </Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }} className="font-serif">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Events list */}
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : (
          <div className="space-y-3">
            {events?.map((event) => (
              <div key={event.id} className="bg-card rounded-xl border border-border p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display font-semibold text-foreground text-sm">{event.title}</p>
                    {event.is_featured && <Star className="w-3.5 h-3.5 text-church-gold-dark shrink-0" fill="currentColor" />}
                  </div>
                  <p className="text-xs text-muted-foreground font-serif">
                    {format(parseISO(event.event_date), 'MMMM d, yyyy')} · {event.location || 'No location'}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => startEdit(event)} className="font-serif text-xs h-8">Edit</Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(event.id)}
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 font-serif text-xs h-8"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const ManageEvents = () => (
  <AdminGuard>
    <ManageEventsInner />
  </AdminGuard>
);

export default ManageEvents;
