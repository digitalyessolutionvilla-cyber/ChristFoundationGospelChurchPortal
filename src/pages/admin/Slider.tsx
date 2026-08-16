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
import { ImageUploader } from '@/components/shared/ImageUploader';
import { Plus, Trash2, Edit2, Save, GripVertical } from 'lucide-react';

interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  display_order: number;
  is_active: boolean;
}

const emptyForm = { title: '', subtitle: '', image_url: '', cta_text: '', cta_url: '/', display_order: 0, is_active: true };

function SliderInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: slides, isLoading } = useQuery({
    queryKey: ['admin_slider'],
    queryFn: async () => {
      const { data } = await supabase.from('home_slider_items').select('*').order('display_order');
      return (data ?? []) as SliderItem[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from('home_slider_items').update(form).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('home_slider_items').insert(form);
        if (error) throw error;
      }
      await logActivity(editId ? 'Updated slider' : 'Added slider item', 'Slider', form.title.substring(0, 50));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_slider'] });
      queryClient.invalidateQueries({ queryKey: ['home_slider'] });
      toast({ title: 'Slide saved!' });
      setShowForm(false); setEditId(null); setForm({ ...emptyForm });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('home_slider_items').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted slider item', 'Slider');
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin_slider'] }); toast({ title: 'Slide deleted' }); },
  });

  const startEdit = (s: SliderItem) => {
    setForm({ title: s.title, subtitle: s.subtitle, image_url: s.image_url, cta_text: s.cta_text, cta_url: s.cta_url, display_order: s.display_order, is_active: s.is_active });
    setEditId(s.id); setShowForm(true);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Hero Slider</h1>
          <p className="text-muted-foreground font-serif text-sm">Manage the rotating banner slides on the homepage.</p>
        </div>
        <Button onClick={() => { setForm({ ...emptyForm }); setEditId(null); setShowForm(true); }} className="bg-primary text-primary-foreground font-serif gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Slide
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <h2 className="font-display font-semibold text-lg mb-4">{editId ? 'Edit Slide' : 'New Slide'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="font-serif text-sm">Title / Scripture Verse *</Label>
              <Textarea value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1.5 font-serif min-h-20" placeholder='"For God so loved the world..."' required />
            </div>
            <div className="md:col-span-2">
              <Label className="font-serif text-sm">Subtitle / Reference</Label>
              <Input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="mt-1.5 font-serif" placeholder="John 3:16" />
            </div>
            <div>
              <Label className="font-serif text-sm">Background Image</Label>
              <div className="mt-1.5">
                <ImageUploader
                  value={form.image_url}
                  onChange={url => setForm(f => ({ ...f, image_url: url }))}
                  folder="slider"
                  label="Slide Background"
                />
              </div>
            </div>
            <div>
              <Label className="font-serif text-sm">Button Text</Label>
              <Input value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} className="mt-1.5 font-serif" placeholder="Learn More" />
            </div>
            <div>
              <Label className="font-serif text-sm">Button Link (URL)</Label>
              <Input value={form.cta_url} onChange={e => setForm(f => ({ ...f, cta_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="/about" />
            </div>
            <div>
              <Label className="font-serif text-sm">Display Order</Label>
              <Input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} className="mt-1.5 font-serif" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
              <Label className="font-serif text-sm">Active / Visible</Label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-primary text-primary-foreground font-serif gap-2">
              <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Slide'}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }} className="font-serif">Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {slides?.map(s => (
            <div key={s.id} className={`bg-card rounded-xl border p-4 flex items-start gap-4 ${s.is_active ? 'border-primary/20' : 'border-border opacity-60'}`}>
              <GripVertical className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-serif font-medium text-sm text-foreground line-clamp-2">{s.title}</p>
                <p className="text-xs text-muted-foreground font-serif">{s.subtitle} · Button: {s.cta_text || 'None'} → {s.cta_url}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => startEdit(s)} className="font-serif text-xs h-8"><Edit2 className="w-3 h-3" /></Button>
                <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(s.id)} className="text-destructive border-destructive/30 h-8"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Slider = () => (
  <AdminGuard>
    <AdminLayout>
      <SliderInner />
    </AdminLayout>
  </AdminGuard>
);

export default Slider;
