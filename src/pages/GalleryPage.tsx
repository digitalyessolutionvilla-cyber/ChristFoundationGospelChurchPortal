import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Image, X } from 'lucide-react';

interface Album { id: string; name: string; description: string; cover_url: string; }
interface GalleryItem { id: string; album_id: string; media_url: string; media_type: string; caption: string; }

export default function GalleryPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const { data: albums, isLoading } = useQuery({
    queryKey: ['gallery_albums_public'],
    queryFn: async () => {
      const { data } = await supabase.from('gallery_albums').select('*').eq('is_active', true).order('display_order');
      return (data ?? []) as Album[];
    },
  });

  const { data: items } = useQuery({
    queryKey: ['gallery_items_public', selectedAlbum?.id],
    queryFn: async () => {
      if (!selectedAlbum) return [];
      const { data } = await supabase.from('gallery_items').select('*').eq('album_id', selectedAlbum.id).order('display_order');
      return (data ?? []) as GalleryItem[];
    },
    enabled: !!selectedAlbum,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <PageHeader title="Gallery" subtitle="Capturing moments of worship, fellowship, and God's grace in our community." />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {!selectedAlbum ? (
            isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
              </div>
            ) : albums?.length === 0 ? (
              <div className="text-center py-20">
                <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-foreground mb-2">Gallery Coming Soon</h3>
                <p className="font-serif text-muted-foreground">Check back for photos and videos from our events.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums!.map(album => (
                  <button key={album.id} onClick={() => setSelectedAlbum(album)} className="group text-left bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-blue hover:border-primary/30 transition-all">
                    {album.cover_url ? (
                      <img src={album.cover_url} alt={album.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" crossOrigin="anonymous" />
                    ) : (
                      <div className="w-full h-48 bg-gradient-hero flex items-center justify-center">
                        <Image className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-display font-bold text-foreground">{album.name}</h3>
                      {album.description && <p className="text-xs text-muted-foreground font-serif mt-1">{album.description}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : (
            <div>
              <button onClick={() => setSelectedAlbum(null)} className="flex items-center gap-2 text-primary font-serif text-sm mb-6 hover:underline">
                ← Back to Albums
              </button>
              <h2 className="font-display font-bold text-2xl text-foreground mb-6">{selectedAlbum.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items?.map(item => (
                  <button key={item.id} onClick={() => setLightboxUrl(item.media_url)} className="aspect-square rounded-xl overflow-hidden border border-border hover:shadow-blue transition-all">
                    <img src={item.media_url} alt={item.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" crossOrigin="anonymous" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxUrl(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-primary-foreground/70"><X className="w-8 h-8" /></button>
          <img src={lightboxUrl} alt="" className="max-w-full max-h-full rounded-xl" crossOrigin="anonymous" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <Footer />
    </div>
  );
}
