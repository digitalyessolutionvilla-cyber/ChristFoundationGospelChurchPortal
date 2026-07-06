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
import {
  Plus, Trash2, Edit2, Save, X, ChevronUp, ChevronDown, FileText,
  Image as ImageIcon, Video, AlignLeft, BookOpen, MousePointer, GripVertical
} from 'lucide-react';
import { format } from 'date-fns';

interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: ContentBlock[];
  featured_image: string;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

interface ContentBlock {
  id: string;
  type: 'hero' | 'text' | 'image' | 'video' | 'bible_verse' | 'cta' | 'download';
  data: Record<string, string>;
}

const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero Banner', icon: ImageIcon, description: 'Full-width header with image & title' },
  { type: 'text', label: 'Text Block', icon: AlignLeft, description: 'Rich text paragraph' },
  { type: 'image', label: 'Image', icon: ImageIcon, description: 'Single image with caption' },
  { type: 'video', label: 'Video Embed', icon: Video, description: 'YouTube or Facebook video' },
  { type: 'bible_verse', label: 'Bible Verse', icon: BookOpen, description: 'Highlighted scripture' },
  { type: 'cta', label: 'Call to Action', icon: MousePointer, description: 'Button with heading' },
  { type: 'download', label: 'Download File', icon: FileText, description: 'Downloadable PDF or document' },
];

function makeId() { return Math.random().toString(36).slice(2, 10); }

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const emptyPage = { title: '', slug: '', content: [] as ContentBlock[], featured_image: '', is_published: false, seo_title: '', seo_description: '' };

function BlockEditor({ block, onChange, onDelete, onMoveUp, onMoveDown }: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const set = (key: string, value: string) => onChange({ ...block, data: { ...block.data, [key]: value } });

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
        <Badge variant="outline" className="font-serif text-xs capitalize">{block.type.replace('_', ' ')}</Badge>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onMoveUp}><ChevronUp className="w-3 h-3" /></Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onMoveDown}><ChevronDown className="w-3 h-3" /></Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={onDelete}><X className="w-3 h-3" /></Button>
      </div>
      <div className="p-4 space-y-3">
        {block.type === 'hero' && (
          <>
            <div><Label className="font-serif text-xs">Heading</Label><Input value={block.data.heading || ''} onChange={e => set('heading', e.target.value)} className="mt-1 font-serif text-sm" placeholder="Page heading" /></div>
            <div><Label className="font-serif text-xs">Subheading</Label><Input value={block.data.subheading || ''} onChange={e => set('subheading', e.target.value)} className="mt-1 font-serif text-sm" placeholder="Optional subheading" /></div>
            <div><Label className="font-serif text-xs">Background Image</Label><ImageUploader value={block.data.image || ''} onChange={url => set('image', url)} folder="pages" label="Hero Image" className="mt-1" /></div>
          </>
        )}
        {block.type === 'text' && (
          <div><Label className="font-serif text-xs">Content</Label><div className="mt-1"><RichTextEditor value={block.data.html || ''} onChange={html => set('html', html)} /></div></div>
        )}
        {block.type === 'image' && (
          <>
            <div><Label className="font-serif text-xs">Image</Label><ImageUploader value={block.data.url || ''} onChange={url => set('url', url)} folder="pages" label="Image" className="mt-1" /></div>
            <div><Label className="font-serif text-xs">Caption</Label><Input value={block.data.caption || ''} onChange={e => set('caption', e.target.value)} className="mt-1 font-serif text-sm" placeholder="Optional caption" /></div>
            <div><Label className="font-serif text-xs">Alt Text</Label><Input value={block.data.alt || ''} onChange={e => set('alt', e.target.value)} className="mt-1 font-serif text-sm" placeholder="Descriptive alt text" /></div>
          </>
        )}
        {block.type === 'video' && (
          <>
            <div><Label className="font-serif text-xs">Video URL (YouTube / Facebook)</Label><Input value={block.data.url || ''} onChange={e => set('url', e.target.value)} className="mt-1 font-serif text-sm font-mono" placeholder="https://youtube.com/watch?v=..." /></div>
            <div><Label className="font-serif text-xs">Caption</Label><Input value={block.data.caption || ''} onChange={e => set('caption', e.target.value)} className="mt-1 font-serif text-sm" /></div>
          </>
        )}
        {block.type === 'bible_verse' && (
          <>
            <div><Label className="font-serif text-xs">Verse Text</Label><Input value={block.data.text || ''} onChange={e => set('text', e.target.value)} className="mt-1 font-serif text-sm" placeholder='"For God so loved the world..."' /></div>
            <div><Label className="font-serif text-xs">Reference</Label><Input value={block.data.reference || ''} onChange={e => set('reference', e.target.value)} className="mt-1 font-serif text-sm" placeholder="John 3:16" /></div>
          </>
        )}
        {block.type === 'cta' && (
          <>
            <div><Label className="font-serif text-xs">Heading</Label><Input value={block.data.heading || ''} onChange={e => set('heading', e.target.value)} className="mt-1 font-serif text-sm" /></div>
            <div><Label className="font-serif text-xs">Description</Label><Input value={block.data.description || ''} onChange={e => set('description', e.target.value)} className="mt-1 font-serif text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="font-serif text-xs">Button Text</Label><Input value={block.data.btn_text || ''} onChange={e => set('btn_text', e.target.value)} className="mt-1 font-serif text-sm" /></div>
              <div><Label className="font-serif text-xs">Button URL</Label><Input value={block.data.btn_url || ''} onChange={e => set('btn_url', e.target.value)} className="mt-1 font-serif text-sm font-mono" /></div>
            </div>
          </>
        )}
        {block.type === 'download' && (
          <>
            <div><Label className="font-serif text-xs">File Label</Label><Input value={block.data.label || ''} onChange={e => set('label', e.target.value)} className="mt-1 font-serif text-sm" placeholder="Download Programme" /></div>
            <div><Label className="font-serif text-xs">File URL</Label><Input value={block.data.url || ''} onChange={e => set('url', e.target.value)} className="mt-1 font-serif text-sm font-mono" placeholder="https://..." /></div>
          </>
        )}
      </div>
    </div>
  );
}

function PageBuilderInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editPage, setEditPage] = useState<Partial<CmsPage> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showBlockPicker, setShowBlockPicker] = useState(false);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['cms_pages'],
    queryFn: async () => {
      const { data } = await supabase.from('cms_pages').select('*').order('created_at', { ascending: false });
      return (data ?? []) as CmsPage[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!editPage) return;
      const payload = {
        title: editPage.title,
        slug: editPage.slug || slugify(editPage.title || ''),
        content: editPage.content || [],
        featured_image: editPage.featured_image || '',
        is_published: editPage.is_published || false,
        seo_title: editPage.seo_title || '',
        seo_description: editPage.seo_description || '',
        updated_at: new Date().toISOString(),
      };
      if (isNew) {
        const { error } = await supabase.from('cms_pages').insert(payload);
        if (error) throw error;
        await logActivity('Created page', 'Pages', editPage.title);
      } else {
        const { error } = await supabase.from('cms_pages').update(payload).eq('id', editPage.id);
        if (error) throw error;
        await logActivity('Updated page', 'Pages', editPage.title);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms_pages'] });
      toast({ title: isNew ? 'Page created!' : 'Page saved!' });
      setEditPage(null);
    },
    onError: (e) => toast({ title: (e as Error).message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cms_pages').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted page', 'Pages');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms_pages'] });
      toast({ title: 'Page deleted' });
    },
  });

  const addBlock = (type: ContentBlock['type']) => {
    const block: ContentBlock = { id: makeId(), type, data: {} };
    setEditPage(p => p ? { ...p, content: [...(p.content || []), block] } : p);
    setShowBlockPicker(false);
  };

  const updateBlock = (idx: number, block: ContentBlock) => {
    setEditPage(p => {
      if (!p) return p;
      const content = [...(p.content || [])];
      content[idx] = block;
      return { ...p, content };
    });
  };

  const deleteBlock = (idx: number) => {
    setEditPage(p => {
      if (!p) return p;
      const content = [...(p.content || [])];
      content.splice(idx, 1);
      return { ...p, content };
    });
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    setEditPage(p => {
      if (!p) return p;
      const content = [...(p.content || [])];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= content.length) return p;
      [content[idx], content[newIdx]] = [content[newIdx], content[idx]];
      return { ...p, content };
    });
  };

  // --- Page Editor ---
  if (editPage !== null) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" className="font-serif" onClick={() => setEditPage(null)}>
              ← Back to Pages
            </Button>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={editPage.is_published || false}
                  onCheckedChange={v => setEditPage(p => p ? { ...p, is_published: v } : p)}
                />
                <span className="font-serif text-sm text-muted-foreground">Published</span>
              </div>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !editPage.title} className="font-serif">
                <Save className="w-4 h-4 mr-1" /> {saveMutation.isPending ? 'Saving...' : 'Save Page'}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="font-serif">
              <TabsTrigger value="content">Content Blocks</TabsTrigger>
              <TabsTrigger value="settings">Page Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <div className="border border-border rounded-xl p-5 bg-card space-y-4">
                <div>
                  <Label className="font-serif text-sm">Page Title *</Label>
                  <Input value={editPage.title || ''} onChange={e => setEditPage(p => p ? { ...p, title: e.target.value, slug: slugify(e.target.value) } : p)} className="mt-1.5 font-serif" placeholder="Page title" />
                </div>
                <div>
                  <Label className="font-serif text-sm">URL Slug</Label>
                  <Input value={editPage.slug || ''} onChange={e => setEditPage(p => p ? { ...p, slug: e.target.value } : p)} className="mt-1.5 font-serif font-mono text-sm" placeholder="page-url-slug" />
                  <p className="text-xs text-muted-foreground font-serif mt-1">Public URL: /page/{editPage.slug || 'slug'}</p>
                </div>
                <div>
                  <Label className="font-serif text-sm">Featured Image</Label>
                  <ImageUploader value={editPage.featured_image || ''} onChange={url => setEditPage(p => p ? { ...p, featured_image: url } : p)} folder="pages" label="Featured Image" className="mt-1.5" />
                </div>
                <div>
                  <Label className="font-serif text-sm">SEO Title</Label>
                  <Input value={editPage.seo_title || ''} onChange={e => setEditPage(p => p ? { ...p, seo_title: e.target.value } : p)} className="mt-1.5 font-serif" />
                </div>
                <div>
                  <Label className="font-serif text-sm">SEO Description</Label>
                  <Input value={editPage.seo_description || ''} onChange={e => setEditPage(p => p ? { ...p, seo_description: e.target.value } : p)} className="mt-1.5 font-serif" maxLength={160} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {/* Blocks */}
              {(editPage.content || []).length === 0 && (
                <div className="border border-dashed border-border rounded-xl p-10 text-center text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-serif">No content blocks yet. Add your first block below.</p>
                </div>
              )}
              <div className="space-y-3">
                {(editPage.content || []).map((block, idx) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    onChange={b => updateBlock(idx, b)}
                    onDelete={() => deleteBlock(idx)}
                    onMoveUp={() => moveBlock(idx, -1)}
                    onMoveDown={() => moveBlock(idx, 1)}
                  />
                ))}
              </div>

              {/* Block Picker */}
              {showBlockPicker ? (
                <div className="border border-border rounded-xl p-4 bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-serif font-semibold text-sm">Choose a block type</p>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowBlockPicker(false)}><X className="w-3 h-3" /></Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BLOCK_TYPES.map(({ type, label, icon: Icon, description }) => (
                      <button
                        key={type}
                        onClick={() => addBlock(type as ContentBlock['type'])}
                        className="text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-primary mb-1.5" />
                        <p className="font-serif font-semibold text-xs text-foreground">{label}</p>
                        <p className="font-serif text-[10px] text-muted-foreground">{description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="w-full font-serif border-dashed" onClick={() => setShowBlockPicker(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Content Block
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    );
  }

  // --- Pages List ---
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Page Builder</h1>
            <p className="text-sm font-serif text-muted-foreground">Create and manage custom pages</p>
          </div>
          <Button onClick={() => { setEditPage({ ...emptyPage }); setIsNew(true); }} className="font-serif">
            <Plus className="w-4 h-4 mr-1" /> New Page
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : pages.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-serif">No pages yet. Create your first custom page!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pages.map(page => (
              <div key={page.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                {page.featured_image && (
                  <img src={page.featured_image} alt={page.title} className="w-14 h-14 rounded-lg object-cover shrink-0" crossOrigin="anonymous" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-serif font-semibold text-foreground">{page.title}</p>
                    <Badge variant={page.is_published ? 'default' : 'secondary'} className="text-xs">
                      {page.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">/page/{page.slug}</p>
                  <p className="font-serif text-xs text-muted-foreground mt-0.5">
                    {(page.content || []).length} blocks — Updated {format(new Date(page.updated_at), 'PP')}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="font-serif text-xs" onClick={() => { setEditPage(page); setIsNew(false); }}>
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/30 h-8 w-8 p-0" onClick={() => deleteMutation.mutate(page.id)}>
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

export default function PageBuilder() {
  return <AdminGuard><PageBuilderInner /></AdminGuard>;
}
