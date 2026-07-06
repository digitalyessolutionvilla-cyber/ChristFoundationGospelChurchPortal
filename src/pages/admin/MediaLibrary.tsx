import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Copy, Search, Image as ImageIcon, FileText, Music, Video, Loader2, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';

interface MediaItem {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  file_type: string;
  file_size: number;
  alt_text: string;
  caption: string;
  folder: string;
  created_at: string;
}

const FOLDER_OPTIONS = ['general', 'sermons', 'gallery', 'news', 'leadership', 'slider', 'events'];

const FILE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  document: FileText,
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MediaLibraryInner() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [folder, setFolder] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const { data: media = [], isLoading } = useQuery({
    queryKey: ['media_library'],
    queryFn: async () => {
      const { data } = await supabase.from('media_library').select('*').order('created_at', { ascending: false });
      return (data ?? []) as MediaItem[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (item: MediaItem) => {
      await supabase.storage.from('cfgc-media').remove([item.storage_path]);
      const { error } = await supabase.from('media_library').delete().eq('id', item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media_library'] });
      toast({ title: 'File deleted' });
      setSelected(null);
    },
    onError: () => toast({ title: 'Failed to delete', variant: 'destructive' }),
  });

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    let uploaded = 0;
    try {
      const { data: { session } } = await supabase.auth.getSession();

      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('cfgc-media').upload(path, file, { upsert: true });
        if (uploadError) continue;
        const { data: { publicUrl } } = supabase.storage.from('cfgc-media').getPublicUrl(path);
        const fileType = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'document';
        await supabase.from('media_library').insert({
          filename: file.name,
          storage_path: path,
          public_url: publicUrl,
          file_type: fileType,
          file_size: file.size,
          folder,
          uploaded_by: session?.user?.id ?? null,
        });
        uploaded++;
      }
      queryClient.invalidateQueries({ queryKey: ['media_library'] });
      toast({ title: `${uploaded} file(s) uploaded successfully!` });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((accepted: File[]) => { uploadFiles(accepted); }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [folder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, disabled: uploading });

  const filtered = media.filter(m => {
    const matchType = typeFilter === 'all' || m.file_type === typeFilter;
    const matchSearch = !search || m.filename.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const selectedItem = media.find(m => m.id === selected);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Media Library</h1>
            <p className="text-sm font-serif text-muted-foreground">{media.length} files stored</p>
          </div>
          <select
            value={folder}
            onChange={e => setFolder(e.target.value)}
            className="text-sm font-serif border border-border rounded-md px-3 py-1.5 bg-background"
          >
            {FOLDER_OPTIONS.map(f => (
              <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/20'
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="font-serif text-sm text-muted-foreground">Uploading files...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-10 h-10 text-muted-foreground" />
              <p className="font-serif font-semibold text-foreground">
                {isDragActive ? 'Drop files here' : 'Upload Files'}
              </p>
              <p className="font-serif text-xs text-muted-foreground">
                Drag & drop or click — Images, Videos, Audio, PDF, DOCX
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search files..."
              className="pl-9 font-serif text-sm"
            />
          </div>
          {['all', 'image', 'video', 'audio', 'document'].map(t => (
            <Button
              key={t}
              size="sm"
              variant={typeFilter === t ? 'default' : 'outline'}
              onClick={() => setTypeFilter(t)}
              className="font-serif text-xs capitalize"
            >
              {t}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* File Grid */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-serif">No files found</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {filtered.map(item => {
                  const Icon = FILE_ICONS[item.file_type] ?? FileText;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelected(item.id === selected ? null : item.id)}
                      className={`relative aspect-square rounded-lg border overflow-hidden bg-muted/30 transition-all ${
                        item.id === selected ? 'ring-2 ring-primary border-primary' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      {item.file_type === 'image' ? (
                        <img src={item.public_url} alt={item.alt_text || item.filename} className="w-full h-full object-cover" crossOrigin="anonymous" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                          <Icon className="w-8 h-8 text-muted-foreground" />
                          <span className="text-[10px] font-serif text-muted-foreground text-center truncate w-full">{item.filename}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedItem ? (
              <div className="border border-border rounded-xl p-4 space-y-4 sticky top-4">
                {selectedItem.file_type === 'image' && (
                  <img src={selectedItem.public_url} alt={selectedItem.alt_text} className="w-full aspect-video object-cover rounded-lg" crossOrigin="anonymous" />
                )}
                <div className="space-y-1">
                  <p className="font-serif font-semibold text-sm text-foreground truncate">{selectedItem.filename}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs capitalize">{selectedItem.file_type}</Badge>
                    <span className="text-xs font-serif text-muted-foreground">{formatBytes(selectedItem.file_size)}</span>
                  </div>
                  <p className="text-xs font-serif text-muted-foreground">{format(new Date(selectedItem.created_at), 'PPp')}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full font-serif text-xs"
                    onClick={() => { navigator.clipboard.writeText(selectedItem.public_url); toast({ title: 'URL copied!' }); }}
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy URL
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full font-serif text-xs"
                    onClick={() => deleteMutation.mutate(selectedItem)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-serif text-sm">Select a file to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function MediaLibrary() {
  return <AdminGuard><MediaLibraryInner /></AdminGuard>;
}
