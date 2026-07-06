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
import { Plus, Trash2, Edit2, Save, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface News {
  id: string;
  title: string;
  content: string;
  image_url: string;
  is_published: boolean;
  is_featured: boolean;
  author: string;
  published_at: string | null;
}

const emptyForm = { title: '', content: '', image_url: '', is_published: false, is_featured: false, author: '', published_at: '' };

function NewsInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: news, isLoading } = useQuery({
    queryKey: ['admin_news'],
    queryFn: async () => {
      const { data } = await supabase.from('news_announcements').select('*').order('created_at', { ascending: false });
      return (data ?? []) as News[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        published_at: form.is_published && !form.published_at ? new Date().toISOString() : form.published_at || null,
      };
      if (editId) {
        const { error } = await supabase.from('news_announcements').update(payload).eq('id', editId);
        if (error) throw error;
        await logActivity('Updated news', 'News', form.title);
      } else {
        const { error } = await supabase.from('news_announcements').insert(payload);
        if (error) throw error;
        await logActivity('Published news', 'News', form.title);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({ title: editId ? 'News updated!' : 'News published!' });
      setShowForm(false); setEditId(null); setForm({ ...emptyForm });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('news_announcements').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted news', 'News');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_news'] });
      toast({ title: 'Article deleted' });
    },
    onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
  });

  const startEdit = (n: News) => {
    setForm({ title: n.title, content: n.content, image_url: n.image_url,
      is_published: n.is_published, is_featured: n.is_featured, author: n.author, published_at: n.published_at ?? '' });
    setEditId(n.id); setShowForm(true);
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">News & Announcements</h1>
          <p className="text-muted-foreground font-serif text-sm">Publish and manage church news and announcements.</p>
        </div>
        <Button onClick={() => { setForm({ ...emptyForm }); setEditId(null); setShowForm(true); }} className="bg-primary text-primary-foreground font-serif gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Article
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <h2 className="font-display font-semibold text-lg mb-4">{editId ? 'Edit Article' : 'New Article'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="font-serif text-sm">Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1.5 font-serif" required />
            </div>
            <div>
              <Label className="font-serif text-sm">Author</Label>
              <Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="mt-1.5 font-serif" />
            </div>
            <div>
              <Label className="font-serif text-sm">Featured Image URL</Label>
              <Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <Label className="font-serif text-sm">Content *</Label>
              <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="mt-1.5 font-serif min-h-36" required />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_published} onCheckedChange={v => setForm(f => ({ ...f, is_published: v }))} />
              <Label className="font-serif text-sm">Publish immediately</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured} onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))} />
              <Label className="font-serif text-sm">Feature on homepage</Label>
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
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : news?.length === 0 ? (
        <div className="text-center py-12"><p className="text-muted-foreground font-serif">No articles yet. Add your first announcement above.</p></div>
      ) : (
        <div className="space-y-2">
          {news!.map(n => (
            <div key={n.id} className="bg-card rounded-xl border border-border p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display font-semibold text-sm text-foreground">{n.title}</p>
                  {n.is_published ? <Badge className="text-[10px] bg-primary text-primary-foreground">Published</Badge> : <Badge variant="secondary" className="text-[10px]">Draft</Badge>}
                  {n.is_featured && <Star className="w-3 h-3 text-church-gold-dark" fill="currentColor" />}
                </div>
                <p className="text-xs text-muted-foreground font-serif mt-0.5">
                  {n.author && `By ${n.author} · `}
                  {n.published_at ? format(parseISO(n.published_at), 'MMM d, yyyy') : 'Draft'}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => startEdit(n)} className="font-serif text-xs h-8 gap-1"><Edit2 className="w-3 h-3" /></Button>
                <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(n.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10 h-8"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const News = () => (
  <AdminGuard>
    <AdminLayout>
      <NewsInner />
    </AdminLayout>
  </AdminGuard>
);

export default News;
