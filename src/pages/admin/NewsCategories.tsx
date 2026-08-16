import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit2, Save, X, Tag } from 'lucide-react';
import { logActivity } from '@/hooks/useAdminProfile';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  created_at: string;
}

const emptyForm = { name: '', slug: '', color: '#1e3a8a', description: '' };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function CategoriesInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['news_categories'],
    queryFn: async () => {
      const { data } = await supabase.from('news_categories').select('*').order('name');
      return (data ?? []) as Category[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, slug: form.slug || slugify(form.name) };
      if (editId) {
        const { error } = await supabase.from('news_categories').update(payload).eq('id', editId);
        if (error) throw error;
        await logActivity('Updated category', 'Categories', form.name);
      } else {
        const { error } = await supabase.from('news_categories').insert(payload);
        if (error) throw error;
        await logActivity('Created category', 'Categories', form.name);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news_categories'] });
      toast({ title: editId ? 'Category updated!' : 'Category created!' });
      setShowForm(false); setEditId(null); setForm({ ...emptyForm });
    },
    onError: (e) => toast({ title: (e as Error).message || 'Failed to save', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('news_categories').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted category', 'Categories');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news_categories'] });
      toast({ title: 'Category deleted' });
    },
    onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
  });

  const startEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, color: cat.color, description: cat.description });
    setEditId(cat.id);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">News Categories</h1>
            <p className="text-sm font-serif text-muted-foreground">{categories.length} categories</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...emptyForm }); }} className="font-serif">
            <Plus className="w-4 h-4 mr-1" /> New Category
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="border border-border rounded-xl p-5 bg-card space-y-4">
            <h2 className="font-display font-semibold text-lg">{editId ? 'Edit Category' : 'New Category'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="font-serif text-sm">Name *</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                  className="mt-1 font-serif"
                  placeholder="Church News"
                />
              </div>
              <div>
                <Label className="font-serif text-sm">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="mt-1 font-serif"
                  placeholder="church-news"
                />
              </div>
              <div>
                <Label className="font-serif text-sm">Color</Label>
                <div className="flex gap-2 mt-1 items-center">
                  <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-10 h-9 rounded border border-border cursor-pointer" />
                  <Input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="font-serif font-mono text-sm" />
                </div>
              </div>
              <div>
                <Label className="font-serif text-sm">Description</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="mt-1 font-serif text-sm" rows={2} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => saveMutation.mutate()} disabled={!form.name || saveMutation.isPending} className="font-serif">
                <Save className="w-4 h-4 mr-1" /> {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }} className="font-serif">
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Categories List */}
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : (
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="w-3 h-10 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-serif font-semibold text-foreground">{cat.name}</p>
                    <Badge variant="outline" className="text-xs font-mono">{cat.slug}</Badge>
                  </div>
                  {cat.description && <p className="text-xs font-serif text-muted-foreground mt-0.5 truncate">{cat.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => startEdit(cat)} className="font-serif text-xs">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(cat.id)} disabled={deleteMutation.isPending} className="font-serif text-xs text-destructive border-destructive/40 hover:bg-destructive/5">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function NewsCategories() {
  return <AdminGuard><CategoriesInner /></AdminGuard>;
}
