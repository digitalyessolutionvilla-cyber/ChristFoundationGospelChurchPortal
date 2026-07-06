import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Plus, Trash2, Edit2, Save, X, Upload, ChevronRight, ArrowLeft, Loader2, GripVertical, Video, Image as ImageIcon } from 'lucide-react';

interface Album {
  id: string;
  name: string;
  description: string;
  cover_url: string;
  category: string;
  display_order: number;
  is_active: boolean;
  event_date: string | null;
  created_at: string;
}

interface GalleryItem {
  id: string;
  album_id: string;
  media_url: string;
  media_type: string;
  caption: string;
  alt_text: string;
  description: string;
  display_order: number;
}

const CATEGORIES = [
  'Sunday Worship', 'Youth Ministry', 'Annual Camp Meeting', 'Crusades', 'Revivals',
  'Choir', "Children's Ministry", "Women's Ministry", "Men's Ministry", 'Evangelism',
  'Thanksgiving Services', 'Special Programmes', 'Conferences', 'Community Outreach', 'Other Events',
];

const emptyAlbum = { name: '', description: '', cover_url: '', category: 'Other Events', display_order: 0, is_active: true, event_date: '' };

function GalleryInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState<'albums' | 'items'>('albums');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [editAlbumId, setEditAlbumId] = useState<string | null>(null);
  const [albumForm, setAlbumForm] = useState({ ...emptyAlbum });
  const [uploading, setUploading] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);

  const { data: albums = [], isLoading: albumsLoading } = useQuery({
    queryKey: ['gallery_albums'],
    queryFn: async () => {
      const { data } = await supabase.from('gallery_albums').select('*').order('display_order');
      return (data ?? []) as Album[];
    },
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['gallery_items', selectedAlbum?.id],
    enabled: !!selectedAlbum,
    queryFn: async () => {
      const { data } = await supabase.from('gallery_items').select('*').eq('album_id', selectedAlbum!.id).order('display_order');
      return (data ?? []) as GalleryItem[];
    },
  });

  const saveAlbumMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...albumForm, event_date: albumForm.event_date || null };
      if (editAlbumId) {
        const { error } = await supabase.from('gallery_albums').update(payload).eq('id', editAlbumId);
        if (error) throw error;
        await logActivity('Updated gallery album', 'Gallery', albumForm.name);
      } else {
        const { error } = await supabase.from('gallery_albums').insert(payload);
        if (error) throw error;
        await logActivity('Created gallery album', 'Gallery', albumForm.name);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_albums'] });
      toast({ title: editAlbumId ? 'Album updated!' : 'Album created!' });
      setShowAlbumForm(false); setEditAlbumId(null); setAlbumForm({ ...emptyAlbum });
    },
    onError: (e) => toast({ title: (e as Error).message, variant: 'destructive' }),
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted gallery album', 'Gallery');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_albums'] });
      toast({ title: 'Album deleted' });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_items', selectedAlbum?.id] });
      toast({ title: 'Image removed' });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (item: Partial<GalleryItem> & { id: string }) => {
      const { id, ...payload } = item;
      const { error } = await supabase.from('gallery_items').update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_items', selectedAlbum?.id] });
      setEditItem(null);
      toast({ title: 'Image updated!' });
    },
  });

  const uploadFiles = async (files: File[]) => {
    if (!selectedAlbum) return;
    setUploading(true);
    try {
      await supabase.storage.createBucket('cfgc-media', { public: true }).catch(() => null);
      const { data: { session } } = await supabase.auth.getSession();
      let uploaded = 0;
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('cfgc-media').upload(path, file, { upsert: true });
        if (uploadError) continue;
        const { data: { publicUrl } } = supabase.storage.from('cfgc-media').getPublicUrl(path);
        const isVideo = file.type.startsWith('video');
        await supabase.from('gallery_items').insert({
          album_id: selectedAlbum.id,
          media_url: publicUrl,
          media_type: isVideo ? 'video' : 'image',
          caption: '',
          alt_text: file.name.replace(/\.[^.]+$/, ''),
          display_order: items.length + uploaded,
        });
        await supabase.from('media_library').insert({
          filename: file.name, storage_path: path, public_url: publicUrl,
          file_type: isVideo ? 'video' : 'image', file_size: file.size, folder: 'gallery',
          uploaded_by: session?.user?.id ?? null,
        });
        uploaded++;
      }
      queryClient.invalidateQueries({ queryKey: ['gallery_items', selectedAlbum.id] });
      queryClient.invalidateQueries({ queryKey: ['media_library'] });
      toast({ title: `${uploaded} file(s) uploaded!` });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((accepted: File[]) => { uploadFiles(accepted); }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [selectedAlbum, items.length]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    disabled: uploading,
  });

  const startEditAlbum = (album: Album) => {
    setAlbumForm({
      name: album.name, description: album.description, cover_url: album.cover_url,
      category: album.category || 'Other Events', display_order: album.display_order,
      is_active: album.is_active, event_date: album.event_date || '',
    });
    setEditAlbumId(album.id);
    setShowAlbumForm(true);
  };

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setView('items');
  };

  // --- Album View ---
  if (view === 'albums') {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">Gallery Management</h1>
              <p className="text-sm font-serif text-muted-foreground">{albums.length} albums</p>
            </div>
            <Button onClick={() => { setShowAlbumForm(true); setEditAlbumId(null); setAlbumForm({ ...emptyAlbum }); }} className="font-serif">
              <Plus className="w-4 h-4 mr-1" /> New Album
            </Button>
          </div>

          {showAlbumForm && (
            <div className="border border-border rounded-xl p-5 bg-card space-y-4">
              <h2 className="font-display font-semibold text-lg">{editAlbumId ? 'Edit Album' : 'New Album'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-serif text-sm">Album Name *</Label>
                  <Input value={albumForm.name} onChange={e => setAlbumForm(f => ({ ...f, name: e.target.value }))} className="mt-1 font-serif" placeholder="Sunday Worship — June 2026" />
                </div>
                <div>
                  <Label className="font-serif text-sm">Category</Label>
                  <select value={albumForm.category} onChange={e => setAlbumForm(f => ({ ...f, category: e.target.value }))} className="mt-1 w-full font-serif text-sm border border-input rounded-md px-3 py-2 bg-background">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="font-serif text-sm">Event Date</Label>
                  <Input type="date" value={albumForm.event_date} onChange={e => setAlbumForm(f => ({ ...f, event_date: e.target.value }))} className="mt-1 font-serif" />
                </div>
                <div>
                  <Label className="font-serif text-sm">Display Order</Label>
                  <Input type="number" value={albumForm.display_order} onChange={e => setAlbumForm(f => ({ ...f, display_order: +e.target.value }))} className="mt-1 font-serif" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="font-serif text-sm">Description</Label>
                  <Textarea value={albumForm.description} onChange={e => setAlbumForm(f => ({ ...f, description: e.target.value }))} className="mt-1 font-serif text-sm" rows={2} />
                </div>
                <div className="sm:col-span-2">
                  <Label className="font-serif text-sm">Cover Image URL</Label>
                  <Input value={albumForm.cover_url} onChange={e => setAlbumForm(f => ({ ...f, cover_url: e.target.value }))} className="mt-1 font-serif text-sm" placeholder="https://..." />
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={albumForm.is_active} onCheckedChange={v => setAlbumForm(f => ({ ...f, is_active: v }))} />
                  <Label className="font-serif text-sm">Active / Visible</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => saveAlbumMutation.mutate()} disabled={!albumForm.name || saveAlbumMutation.isPending} className="font-serif">
                  <Save className="w-4 h-4 mr-1" /> {saveAlbumMutation.isPending ? 'Saving...' : 'Save Album'}
                </Button>
                <Button variant="outline" onClick={() => { setShowAlbumForm(false); setEditAlbumId(null); }} className="font-serif">
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          )}

          {albumsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {albums.map(album => (
                <div key={album.id} className="border border-border rounded-xl overflow-hidden bg-card group cursor-pointer hover:border-primary/40 transition-colors" onClick={() => openAlbum(album)}>
                  <div className="relative aspect-video bg-muted">
                    {album.cover_url ? (
                      <img src={album.cover_url} alt={album.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
                      </div>
                    )}
                    {!album.is_active && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">Hidden</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-serif font-semibold text-foreground truncate">{album.name}</p>
                        <p className="text-xs font-serif text-muted-foreground">{album.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                      <Button size="sm" variant="outline" className="text-xs font-serif flex-1" onClick={() => startEditAlbum(album)}>
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs text-destructive border-destructive/30" onClick={() => deleteAlbumMutation.mutate(album.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  // --- Items View ---
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setView('albums'); setSelectedAlbum(null); }} className="font-serif">
            <ArrowLeft className="w-4 h-4 mr-1" /> Albums
          </Button>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">{selectedAlbum?.name}</h1>
            <p className="text-xs font-serif text-muted-foreground">{selectedAlbum?.category} — {items.length} items</p>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="font-serif text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="font-serif font-semibold text-foreground">{isDragActive ? 'Drop files here' : 'Upload Images & Videos'}</p>
              <p className="font-serif text-xs text-muted-foreground">Drag & drop multiple files at once</p>
            </div>
          )}
        </div>

        {/* Edit Item Form */}
        {editItem && (
          <div className="border border-border rounded-xl p-4 bg-card space-y-3">
            <h3 className="font-serif font-semibold">Edit Image Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="font-serif text-xs">Caption</Label>
                <Input value={editItem.caption} onChange={e => setEditItem(it => it ? { ...it, caption: e.target.value } : null)} className="mt-1 font-serif text-sm" placeholder="Image caption" />
              </div>
              <div>
                <Label className="font-serif text-xs">Alt Text (for SEO)</Label>
                <Input value={editItem.alt_text} onChange={e => setEditItem(it => it ? { ...it, alt_text: e.target.value } : null)} className="mt-1 font-serif text-sm" placeholder="Descriptive alt text" />
              </div>
              <div className="sm:col-span-2">
                <Label className="font-serif text-xs">Description</Label>
                <Input value={editItem.description} onChange={e => setEditItem(it => it ? { ...it, description: e.target.value } : null)} className="mt-1 font-serif text-sm" placeholder="Optional description" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => updateItemMutation.mutate({ id: editItem.id, caption: editItem.caption, alt_text: editItem.alt_text, description: editItem.description })} className="font-serif">
                <Save className="w-3 h-3 mr-1" /> Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditItem(null)} className="font-serif">Cancel</Button>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {itemsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground font-serif">No media in this album. Upload some above!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, idx) => (
              <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                {item.media_type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Video className="w-10 h-10 text-muted-foreground" />
                    <span className="absolute bottom-1 left-1 text-[10px] font-serif bg-black/60 text-white px-1 rounded truncate max-w-[80%]">Video</span>
                  </div>
                ) : (
                  <img src={item.media_url} alt={item.alt_text || item.caption || `Image ${idx + 1}`} className="w-full h-full object-cover" crossOrigin="anonymous" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" className="text-xs h-7" onClick={() => setEditItem(item)}>
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="text-xs h-7" onClick={() => deleteItemMutation.mutate(item.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                    <p className="text-[10px] font-serif text-white truncate">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function Gallery() {
  return <AdminGuard><GalleryInner /></AdminGuard>;
}
