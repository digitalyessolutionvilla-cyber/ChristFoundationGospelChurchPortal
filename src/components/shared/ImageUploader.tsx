import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Link, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  accept?: Record<string, string[]>;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = 'general',
  label = 'Image',
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'] },
  className = '',
}: ImageUploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Try to create bucket if it doesn't exist
      await supabase.storage.createBucket('cfgc-media', { public: true }).catch(() => null);

      const { error } = await supabase.storage.from('cfgc-media').upload(path, file, { upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('cfgc-media').getPublicUrl(path);

      // Track in media library
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from('media_library').insert({
        filename: file.name,
        storage_path: path,
        public_url: publicUrl,
        file_type: file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'document',
        file_size: file.size,
        folder,
        uploaded_by: session?.user?.id ?? null,
      });

      onChange(publicUrl);
      toast({ title: `${label} uploaded successfully!` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast({ title: msg, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) uploadFile(accepted[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: uploading,
  });

  const handleUrlSubmit = () => {
    onChange(urlInput);
    setUrlMode(false);
    toast({ title: `${label} URL saved!` });
  };

  if (urlMode) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="font-serif text-sm"
          />
          <Button size="sm" onClick={handleUrlSubmit} className="shrink-0">Save</Button>
          <Button size="sm" variant="outline" onClick={() => setUrlMode(false)} className="shrink-0">Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-border">
          <img src={value} alt={label} className="w-full h-40 object-cover" crossOrigin="anonymous" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Button size="sm" variant="secondary" disabled={uploading} className="text-xs">
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                Replace
              </Button>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setUrlMode(true)} className="text-xs">
              <Link className="w-3 h-3" /> URL
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onChange('')} className="text-xs">
              <X className="w-3 h-3" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm font-serif text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-serif text-foreground font-medium">
                {isDragActive ? 'Drop file here' : `Upload ${label}`}
              </p>
              <p className="text-xs font-serif text-muted-foreground">Drag & drop or click to browse</p>
              <Button type="button" size="sm" variant="outline" className="mt-1 text-xs font-serif" onClick={e => { e.stopPropagation(); setUrlMode(true); }}>
                <Link className="w-3 h-3 mr-1" /> Paste URL instead
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
