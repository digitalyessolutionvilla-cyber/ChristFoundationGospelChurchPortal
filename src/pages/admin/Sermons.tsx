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
import { Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  sermon_date: string;
  description: string;
  audio_url: string;
  video_url: string;
  notes_url: string;
  category: string;
  is_featured: boolean;
  thumbnail_url: string;
}

const emptyForm = {
  title: '', speaker: '', sermon_date: '', description: '',
  audio_url: '', video_url: '', notes_url: '', category: 'General',
  is_featured: false, thumbnail_url: '',
};

function SermonsInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState('');

  const { data: sermons, isLoading } = useQuery({
    queryKey: ['admin_sermons'],
    queryFn: async () => {
      const { data } = await supabase.from('sermons').select('*').order('sermon_date', { ascending: false });
      return (data ?? []) as Sermon[];
    },
  });

  const filtered = sermons?.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.speaker.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from('sermons').update(form).eq('id', editId);
        if (error) throw error;
        await logActivity('Updated sermon', 'Sermons', form.title);
      } else {
        const { error } = await supabase.from('sermons').insert(form);
        if (error) throw error;
        await logActivity('Added sermon', 'Sermons', form.title);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_sermons'] });
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
      toast({ title: editId ? 'Sermon updated!' : 'Sermon added!' });
      setShowForm(false); setEditId(null); setForm({ ...emptyForm });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sermons').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted sermon', 'Sermons');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_sermons'] });
      toast({ title: 'Sermon deleted' });
    },
    onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
  });

  const startEdit = (s: Sermon) => {
    setForm({ title: s.title, speaker: s.speaker, sermon_date: s.sermon_date, description: s.description,
      audio_url: s.audio_url, video_url: s.video_url, notes_url: s.notes_url, category: s.category,
      is_featured: s.is_featured, thumbnail_url: s.thumbnail_url });
    setEditId(s.id); setShowForm(true);
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Sermons</h1>
          <p className="text-muted-foreground font-serif text-sm">Manage sermon recordings and resources.</p>
        </div>
        <Button onClick={() => { setForm({ ...emptyForm }); setEditId(null); setShowForm(true); }} className="bg-primary text-primary-foreground font-serif gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Sermon
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <h2 className="font-display font-semibold text-lg mb-4">{editId ? 'Edit Sermon' : 'Add New Sermon'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="font-serif text-sm">Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1.5 font-serif" required />
            </div>
            <div>
              <Label className="font-serif text-sm">Speaker</Label>
              <Input value={form.speaker} onChange={e => setForm(f => ({ ...f, speaker: e.target.value }))} className="mt-1.5 font-serif" />
            </div>
            <div>
              <Label className="font-serif text-sm">Date *</Label>
              <Input type="date" value={form.sermon_date} onChange={e => setForm(f => ({ ...f, sermon_date: e.target.value }))} className="mt-1.5 font-serif" required />
            </div>
            <div>
              <Label className="font-serif text-sm">Category</Label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="mt-1.5 font-serif" placeholder="e.g. Salvation, Holiness" />
            </div>
            <div>
              <Label className="font-serif text-sm">Thumbnail URL</Label>
              <Input value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://..." />
            </div>
            <div>
              <Label className="font-serif text-sm">Audio URL (Google Drive / SoundCloud / etc.)</Label>
              <Input value={form.audio_url} onChange={e => setForm(f => ({ ...f, audio_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://..." />
            </div>
            <div>
              <Label className="font-serif text-sm">Video URL (YouTube / Facebook)</Label>
              <Input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://youtube.com/..." />
            </div>
            <div>
              <Label className="font-serif text-sm">Sermon Notes URL (PDF link)</Label>
              <Input value={form.notes_url} onChange={e => setForm(f => ({ ...f, notes_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://drive.google.com/..." />
            </div>
            <div className="md:col-span-2">
              <Label className="font-serif text-sm">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="mt-1.5 font-serif min-h-20" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured} onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))} />
              <Label className="font-serif text-sm">Feature on homepage</Label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground font-serif gap-2">
              <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Sermon'}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }} className="font-serif">Cancel</Button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sermons by title, speaker or category..." className="font-serif" />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-serif">No sermons found. Add your first sermon above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => (
            <div key={s.id} className="bg-card rounded-xl border border-border p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display font-semibold text-sm text-foreground">{s.title}</p>
                  {s.is_featured && <Badge className="text-[10px] bg-church-red text-primary-foreground">Featured</Badge>}
                  <Badge variant="secondary" className="text-[10px]">{s.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-serif mt-0.5">
                  {s.speaker} · {s.sermon_date ? format(parseISO(s.sermon_date), 'MMM d, yyyy') : ''}
                </p>
                <div className="flex gap-3 mt-1">
                  {s.video_url && <a href={s.video_url} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-serif hover:underline">Video</a>}
                  {s.audio_url && <a href={s.audio_url} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-serif hover:underline">Audio</a>}
                  {s.notes_url && <a href={s.notes_url} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-serif hover:underline">Notes</a>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => startEdit(s)} className="font-serif text-xs h-8 gap-1"><Edit2 className="w-3 h-3" /> Edit</Button>
                <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(s.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10 h-8">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Sermons = () => (
  <AdminGuard>
    <AdminLayout>
      <SermonsInner />
    </AdminLayout>
  </AdminGuard>
);

export default Sermons;
