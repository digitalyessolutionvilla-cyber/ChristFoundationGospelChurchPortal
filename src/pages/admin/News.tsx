import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { RichTextEditor } from '@/components/shared/RichTextEditor';
import { Plus, Trash2, Edit2, Save, Star, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  is_published: boolean;
  is_featured: boolean;
  author: string;
  published_at: string | null;
  category_id: string | null;
  tags: string[];
  seo_title: string;
  seo_description: string;
  slug: string | null;
  scheduled_at: string | null;
  status: string;
}

interface Category { id: string; name: string; color: string; }

const emptyForm = {
  title: '', content: '', excerpt: '', image_url: '', is_published: false, is_featured: false,
  author: '', published_at: '', category_id: '', tags: [] as string[], seo_title: '', seo_description: '',
  slug: '', scheduled_at: '', status: 'draft',
};

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function NewsInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [tagInput, setTagInput] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['admin_news'],
    queryFn: async () => {
      const { data } = await supabase.from('news_announcements').select('*').order('created_at', { ascending: false });
      return (data ?? []) as NewsItem[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['news_categories'],
    queryFn: async () => {
      const { data } = await supabase.from('news_categories').select('id, name, color').order('name');
      return (data ?? []) as Category[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt,
        image_url: form.image_url,
        is_published: form.is_published,
        is_featured: form.is_featured,
        author: form.author,
        category_id: form.category_id || null,
        tags: form.tags,
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        slug: form.slug || slugify(form.title),
        scheduled_at: form.scheduled_at || null,
        status: form.is_published ? 'published' : form.scheduled_at ? 'scheduled' : 'draft',
        published_at: form.is_published && !form.published_at ? new Date().toISOString() : form.published_at || null,
      };
      if (editId) {
        const { error } = await supabase.from('news_announcements').update(payload).eq('id', editId);
        if (error) throw error;
        await logActivity('Updated news article', 'News', form.title);
      } else {
        const { error } = await supabase.from('news_announcements').insert(payload);
        if (error) throw error;
        await logActivity('Published news article', 'News', form.title);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_news'] });
      queryClient.invalidateQueries({ queryKey: ['news_ticker'] });
      toast({ title: editId ? 'Article updated!' : 'Article saved!' });
      setShowForm(false); setEditId(null); setForm({ ...emptyForm });
    },
    onError: (e) => toast({ title: (e as Error).message || 'Failed to save', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('news_announcements').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted news article', 'News');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_news'] });
      toast({ title: 'Article deleted' });
    },
    onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
  });

  const startEdit = (item: NewsItem) => {
    setForm({
      title: item.title, content: item.content, excerpt: item.excerpt || '',
      image_url: item.image_url || '', is_published: item.is_published,
      is_featured: item.is_featured, author: item.author || '',
      published_at: item.published_at ? format(parseISO(item.published_at), "yyyy-MM-dd'T'HH:mm") : '',
      category_id: item.category_id || '', tags: item.tags || [],
      seo_title: item.seo_title || '', seo_description: item.seo_description || '',
      slug: item.slug || '', scheduled_at: item.scheduled_at ? format(parseISO(item.scheduled_at), "yyyy-MM-dd'T'HH:mm") : '',
      status: item.status || 'draft',
    });
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  const filtered = news.filter(n =>
    !search || n.title.toLowerCase().includes(search.toLowerCase()) || (n.author || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (item: NewsItem) => {
    if (item.is_published) return 'bg-green-500/10 text-green-700 border-green-500/30';
    if (item.scheduled_at) return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
    return 'bg-muted text-muted-foreground border-border';
  };

  const statusLabel = (item: NewsItem) => {
    if (item.is_published) return 'Published';
    if (item.scheduled_at) return 'Scheduled';
    return 'Draft';
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">News & Announcements</h1>
            <p className="text-sm font-serif text-muted-foreground">{news.length} articles</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...emptyForm }); }} className="font-serif shrink-0">
            <Plus className="w-4 h-4 mr-1" /> New Article
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg">{editId ? 'Edit Article' : 'New Article'}</h2>
              <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditId(null); }}>
                ✕
              </Button>
            </div>
            <div className="p-5">
              <Tabs defaultValue="content" className="space-y-4">
                <TabsList className="font-serif">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="meta">Details & SEO</TabsTrigger>
                  <TabsTrigger value="publish">Publish</TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label className="font-serif text-sm">Title *</Label>
                    <Input
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
                      className="mt-1.5 font-serif"
                      placeholder="Article title"
                    />
                  </div>
                  <div>
                    <Label className="font-serif text-sm">Excerpt / Summary</Label>
                    <Input
                      value={form.excerpt}
                      onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                      className="mt-1.5 font-serif"
                      placeholder="Short description shown in listings"
                    />
                  </div>
                  <div>
                    <Label className="font-serif text-sm">Featured Image</Label>
                    <div className="mt-1.5">
                      <ImageUploader
                        value={form.image_url}
                        onChange={url => setForm(f => ({ ...f, image_url: url }))}
                        folder="news"
                        label="Featured Image"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="font-serif text-sm">Content</Label>
                    <div className="mt-1.5">
                      <RichTextEditor
                        value={form.content}
                        onChange={html => setForm(f => ({ ...f, content: html }))}
                        placeholder="Write your article here..."
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Meta Tab */}
                <TabsContent value="meta" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-serif text-sm">Author</Label>
                      <Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="mt-1.5 font-serif" placeholder="Author name" />
                    </div>
                    <div>
                      <Label className="font-serif text-sm">Category</Label>
                      <select
                        value={form.category_id}
                        onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                        className="mt-1.5 w-full font-serif text-sm border border-input rounded-md px-3 py-2 bg-background"
                      >
                        <option value="">-- No Category --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="font-serif text-sm">URL Slug</Label>
                      <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="mt-1.5 font-serif font-mono text-sm" placeholder="article-url-slug" />
                    </div>
                  </div>
                  <div>
                    <Label className="font-serif text-sm">Tags</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}} placeholder="Add tag and press Enter" className="font-serif text-sm" />
                      <Button type="button" size="sm" variant="outline" onClick={addTag} className="font-serif shrink-0">Add</Button>
                    </div>
                    {form.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="font-serif text-xs cursor-pointer" onClick={() => removeTag(tag)}>
                            {tag} ✕
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="font-serif text-sm">SEO Title</Label>
                    <Input value={form.seo_title} onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))} className="mt-1.5 font-serif" placeholder="SEO page title (defaults to article title)" />
                  </div>
                  <div>
                    <Label className="font-serif text-sm">SEO Description</Label>
                    <Input value={form.seo_description} onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} className="mt-1.5 font-serif" placeholder="Meta description for search engines" maxLength={160} />
                    <p className="text-xs text-muted-foreground mt-1 font-serif">{form.seo_description.length}/160 characters</p>
                  </div>
                </TabsContent>

                {/* Publish Tab */}
                <TabsContent value="publish" className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                    <div>
                      <p className="font-serif font-semibold text-sm text-foreground">Published</p>
                      <p className="font-serif text-xs text-muted-foreground">Make article visible on the website</p>
                    </div>
                    <Switch checked={form.is_published} onCheckedChange={v => setForm(f => ({ ...f, is_published: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                    <div>
                      <p className="font-serif font-semibold text-sm text-foreground">Featured</p>
                      <p className="font-serif text-xs text-muted-foreground">Show prominently on the website</p>
                    </div>
                    <Switch checked={form.is_featured} onCheckedChange={v => setForm(f => ({ ...f, is_featured: v }))} />
                  </div>
                  <div>
                    <Label className="font-serif text-sm">Publish Date & Time</Label>
                    <Input type="datetime-local" value={form.published_at} onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))} className="mt-1.5 font-serif" />
                  </div>
                  <div>
                    <Label className="font-serif text-sm">Scheduled Publish (future date)</Label>
                    <Input type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} className="mt-1.5 font-serif" />
                    <p className="text-xs text-muted-foreground mt-1 font-serif">Leave empty for immediate publish</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="p-5 border-t border-border flex gap-2">
              <Button onClick={() => saveMutation.mutate()} disabled={!form.title || saveMutation.isPending} className="font-serif">
                <Save className="w-4 h-4 mr-1" /> {saveMutation.isPending ? 'Saving...' : 'Save Article'}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }} className="font-serif">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="pl-9 font-serif" />
        </div>

        {/* Articles List */}
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground font-serif">No articles found</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => {
              const cat = categories.find(c => c.id === item.category_id);
              const isExpanded = expandedId === item.id;
              return (
                <div key={item.id} className="border border-border rounded-xl bg-card overflow-hidden">
                  <div className="flex items-start gap-4 p-4">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-lg object-cover shrink-0" crossOrigin="anonymous" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-serif px-2 py-0.5 rounded-full border font-semibold ${statusColor(item)}`}>
                          {statusLabel(item)}
                        </span>
                        {item.is_featured && <Badge variant="secondary" className="text-xs"><Star className="w-3 h-3 mr-0.5" />Featured</Badge>}
                        {cat && <Badge variant="outline" className="text-xs" style={{ borderColor: cat.color, color: cat.color }}>{cat.name}</Badge>}
                      </div>
                      <p className="font-serif font-semibold text-foreground truncate">{item.title}</p>
                      <p className="text-xs font-serif text-muted-foreground">
                        {item.author && `By ${item.author} — `}
                        {item.published_at ? format(parseISO(item.published_at), 'PPP') : 'Not published'}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="ghost" onClick={() => setExpandedId(isExpanded ? null : item.id)} className="h-8 w-8 p-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => startEdit(item)} className="font-serif text-xs h-8">
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(item.id)} disabled={deleteMutation.isPending} className="h-8 w-8 p-0 text-destructive border-destructive/30">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border pt-3">
                      {item.excerpt && <p className="font-serif text-sm text-muted-foreground italic mb-2">{item.excerpt}</p>}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs font-serif">{tag}</Badge>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function ManageNews() {
  return <AdminGuard><NewsInner /></AdminGuard>;
}
