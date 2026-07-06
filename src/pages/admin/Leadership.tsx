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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Plus, Trash2, Edit2, Save, GripVertical } from 'lucide-react';

interface Leader {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  photo_url: string;
  email: string;
  phone: string;
  display_order: number;
  is_active: boolean;
}

const emptyForm = { full_name: '', title: '', bio: '', photo_url: '', email: '', phone: '', display_order: 0, is_active: true };

function LeadershipInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: leaders, isLoading } = useQuery({
    queryKey: ['admin_leadership'],
    queryFn: async () => {
      const { data } = await supabase.from('leadership').select('*').order('display_order', { ascending: true });
      return (data ?? []) as Leader[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from('leadership').update(form).eq('id', editId);
        if (error) throw error;
        await logActivity('Updated leader', 'Leadership', form.full_name);
      } else {
        const { error } = await supabase.from('leadership').insert(form);
        if (error) throw error;
        await logActivity('Added leader', 'Leadership', form.full_name);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_leadership'] });
      queryClient.invalidateQueries({ queryKey: ['leadership'] });
      toast({ title: editId ? 'Leader updated!' : 'Leader added!' });
      setShowForm(false); setEditId(null); setForm({ ...emptyForm });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('leadership').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted leader', 'Leadership');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_leadership'] });
      toast({ title: 'Leader removed' });
    },
    onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
  });

  const startEdit = (l: Leader) => {
    setForm({ full_name: l.full_name, title: l.title, bio: l.bio, photo_url: l.photo_url,
      email: l.email, phone: l.phone, display_order: l.display_order, is_active: l.is_active });
    setEditId(l.id); setShowForm(true);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Church Leadership</h1>
          <p className="text-muted-foreground font-serif text-sm">Manage church leaders, pastors and officers.</p>
        </div>
        <Button onClick={() => { setForm({ ...emptyForm }); setEditId(null); setShowForm(true); }} className="bg-primary text-primary-foreground font-serif gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Leader
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <h2 className="font-display font-semibold text-lg mb-4">{editId ? 'Edit Leader' : 'Add New Leader'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-serif text-sm">Full Name *</Label>
              <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="mt-1.5 font-serif" required />
            </div>
            <div>
              <Label className="font-serif text-sm">Title / Position *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1.5 font-serif" placeholder="e.g. General Overseer" required />
            </div>
            <div>
              <Label className="font-serif text-sm">Photo URL</Label>
              <Input value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://..." />
            </div>
            <div>
              <Label className="font-serif text-sm">Display Order</Label>
              <Input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} className="mt-1.5 font-serif" />
            </div>
            <div>
              <Label className="font-serif text-sm">Email (optional)</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="mt-1.5 font-serif" />
            </div>
            <div>
              <Label className="font-serif text-sm">Phone (optional)</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="mt-1.5 font-serif" />
            </div>
            <div className="md:col-span-2">
              <Label className="font-serif text-sm">Biography</Label>
              <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="mt-1.5 font-serif min-h-28" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
              <Label className="font-serif text-sm">Active / Visible on website</Label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground font-serif gap-2">
              <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }} className="font-serif">Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {leaders?.map(l => (
            <div key={l.id} className="bg-card rounded-xl border border-border p-4 flex items-start gap-4">
              <GripVertical className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
              {l.photo_url && <img src={l.photo_url} alt={l.full_name} className="w-14 h-14 rounded-full object-cover shrink-0 border border-border" crossOrigin="anonymous" />}
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm text-foreground">{l.full_name}</p>
                <p className="text-xs text-primary font-serif">{l.title}</p>
                {l.bio && <p className="text-xs text-muted-foreground font-serif mt-1 line-clamp-2">{l.bio}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => startEdit(l)} className="font-serif text-xs h-8 gap-1"><Edit2 className="w-3 h-3" /></Button>
                <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(l.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10 h-8">
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

const Leadership = () => (
  <AdminGuard>
    <AdminLayout>
      <LeadershipInner />
    </AdminLayout>
  </AdminGuard>
);

export default Leadership;
