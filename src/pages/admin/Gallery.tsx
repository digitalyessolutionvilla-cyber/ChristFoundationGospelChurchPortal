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
import { Plus, Trash2, Edit2, Save, Image, ChevronDown, ChevronRight } from 'lucide-react';

interface Album {
  id: string;
  name: string;
  description: string;
  cover_url: string;
  display_order: number;
  is_active: boolean;
}

interface GalleryItem {
  id: string;
  album_id: string;
  media_url: string;
  media_type: string;
  caption: string;
  display_order: number;
}

const emptyAlbumForm = { name: '', description: '', cover_url: '', display_order: 0, is_active: true };
const emptyItemForm = { media_url: '', media_type: 'image', caption: '', display_order: 0 };

function GalleryInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [editAlbumId, setEditAlbumId] = useState<string | null>(null);
  const [albumForm, setAlbumForm] = useState({ ...emptyAlbumForm });
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({ ...emptyItemForm });

  const { data: albums, isLoading } = useQuery({
    queryKey: ['admin_gallery_albums'],
    queryFn: async () => {
      const { data } = await supabase.from('gallery_albums').select('*').order('display_order', { ascending: true });
      return (data ?? []) as Album[];
    },
  });

  const { data: items } = useQuery({
    queryKey: ['admin_gallery_items', expandedAlbum],
    queryFn: async () => {
      if (!expandedAlbum) return [];
      const { data } = await supabase.from('gallery_items').select('*').eq('album_id', expandedAlbum).order('display_order');
      return (data ?? []) as GalleryItem[];
    },
    enabled: !!expandedAlbum,
  });

  const saveAlbumMutation = useMutation({
    mutationFn: async () => {
      if (editAlbumId) {
        const { error } = await supabase.from('gallery_albums').update(albumForm).eq('id', editAlbumId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('gallery_albums').insert(albumForm);
        if (error) throw error;
      }
      await logActivity(editAlbumId ? 'Updated album' : 'Created album', 'Gallery', albumForm.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_gallery_albums'] });
      toast({ title: 'Album saved!' });
      setShowAlbumForm(false); setEditAlbumId(null); setAlbumForm({ ...emptyAlbumForm });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
      if (error) throw error;
      await logActivity('Deleted album', 'Gallery');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_gallery_albums'] });
      toast({ title: 'Album deleted' });
    },
    onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
  });

  const saveItemMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('gallery_items').insert({ ...itemForm, album_id: selectedAlbumId });
      if (error) throw error;
      await logActivity('Added gallery item', 'Gallery');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_gallery_items', selectedAlbumId] });
      toast({ title: 'Item added!' });
      setShowItemForm(false); setItemForm({ ...emptyItemForm });
    },
    onError: () => toast({ title: 'Failed to add item', variant: 'destructive' }),
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_gallery_items', expandedAlbum] });
      toast({ title: 'Item removed' });
    },
  });

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Gallery</h1>
          <p className="text-muted-foreground font-serif text-sm">Manage photo and video gallery albums.</p>
        </div>
        <Button onClick={() => { setAlbumForm({ ...emptyAlbumForm }); setEditAlbumId(null); setShowAlbumForm(true); }} className="bg-primary text-primary-foreground font-serif gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Album
        </Button>
      </div>

      {showAlbumForm && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          <h2 className="font-display font-semibold text-lg mb-4">{editAlbumId ? 'Edit Album' : 'New Album'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-serif text-sm">Album Name *</Label>
              <Input value={albumForm.name} onChange={e => setAlbumForm(f => ({ ...f, name: e.target.value }))} className="mt-1.5 font-serif" required />
            </div>
            <div>
              <Label className="font-serif text-sm">Cover Image URL</Label>
              <Input value={albumForm.cover_url} onChange={e => setAlbumForm(f => ({ ...f, cover_url: e.target.value }))} className="mt-1.5 font-serif" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <Label className="font-serif text-sm">Description</Label>
              <Textarea value={albumForm.description} onChange={e => setAlbumForm(f => ({ ...f, description: e.target.value }))} className="mt-1.5 font-serif min-h-16" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={albumForm.is_active} onCheckedChange={v => setAlbumForm(f => ({ ...f, is_active: v }))} />
              <Label className="font-serif text-sm">Visible on website</Label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => saveAlbumMutation.mutate()} disabled={saveAlbumMutation.isPending} className="bg-primary text-primary-foreground font-serif gap-2">
              <Save className="w-4 h-4" /> Save Album
            </Button>
            <Button variant="outline" onClick={() => setShowAlbumForm(false)} className="font-serif">Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {albums?.map(album => (
            <div key={album.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                {album.cover_url ? (
                  <img src={album.cover_url} alt={album.name} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border" crossOrigin="anonymous" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Image className="w-6 h-6 text-muted-foreground" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm text-foreground">{album.name}</p>
                  {album.description && <p className="text-xs text-muted-foreground font-serif line-clamp-1">{album.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => { setExpandedAlbum(expandedAlbum === album.id ? null : album.id); setSelectedAlbumId(album.id); }} className="font-serif text-xs h-8 gap-1">
                    {expandedAlbum === album.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />} Items
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setAlbumForm({ name: album.name, description: album.description, cover_url: album.cover_url, display_order: album.display_order, is_active: album.is_active }); setEditAlbumId(album.id); setShowAlbumForm(true); }} className="font-serif text-xs h-8"><Edit2 className="w-3 h-3" /></Button>
                  <Button variant="outline" size="sm" onClick={() => deleteAlbumMutation.mutate(album.id)} className="text-destructive border-destructive/30 hover:bg-destructive/10 h-8"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>

              {expandedAlbum === album.id && (
                <div className="border-t border-border p-4 bg-secondary/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-serif font-semibold text-muted-foreground">Gallery Items</p>
                    <Button size="sm" onClick={() => { setSelectedAlbumId(album.id); setItemForm({ ...emptyItemForm }); setShowItemForm(true); }} className="bg-primary text-primary-foreground font-serif text-xs h-7 gap-1">
                      <Plus className="w-3 h-3" /> Add
                    </Button>
                  </div>

                  {showItemForm && selectedAlbumId === album.id && (
                    <div className="bg-card rounded-xl border border-border p-4 mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="font-serif text-xs">Image/Video URL *</Label>
                          <Input value={itemForm.media_url} onChange={e => setItemForm(f => ({ ...f, media_url: e.target.value }))} className="mt-1 font-serif text-sm h-8" placeholder="https://..." />
                        </div>
                        <div>
                          <Label className="font-serif text-xs">Type</Label>
                          <select value={itemForm.media_type} onChange={e => setItemForm(f => ({ ...f, media_type: e.target.value }))} className="mt-1 w-full border border-input rounded-md px-3 h-8 text-sm font-serif bg-background">
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="font-serif text-xs">Caption</Label>
                          <Input value={itemForm.caption} onChange={e => setItemForm(f => ({ ...f, caption: e.target.value }))} className="mt-1 font-serif text-sm h-8" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={() => saveItemMutation.mutate()} disabled={saveItemMutation.isPending} className="bg-primary text-primary-foreground font-serif text-xs h-7">Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowItemForm(false)} className="font-serif text-xs h-7">Cancel</Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {items?.map(item => (
                      <div key={item.id} className="relative group rounded-lg overflow-hidden border border-border aspect-square">
                        <img src={item.media_url} alt={item.caption || ''} className="w-full h-full object-cover" crossOrigin="anonymous" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <button onClick={() => deleteItemMutation.mutate(item.id)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4 text-primary-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Gallery = () => (
  <AdminGuard>
    <AdminLayout>
      <GalleryInner />
    </AdminLayout>
  </AdminGuard>
);

export default Gallery;
