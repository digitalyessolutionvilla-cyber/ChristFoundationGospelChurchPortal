import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Video, Music, FileText, BookOpen } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Sermon {
  id: string; title: string; speaker: string; sermon_date: string;
  description: string; audio_url: string; video_url: string;
  notes_url: string; category: string; is_featured: boolean; thumbnail_url: string;
}

function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-blue hover:border-primary/30 transition-all group">
      {sermon.thumbnail_url ? (
        <img src={sermon.thumbnail_url} alt={sermon.title} className="w-full h-40 object-cover" crossOrigin="anonymous" />
      ) : (
        <div className="w-full h-40 bg-gradient-hero flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-white/30" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="secondary" className="text-[10px] font-serif">{sermon.category}</Badge>
          {sermon.is_featured && <Badge className="text-[10px] bg-church-red text-primary-foreground">Featured</Badge>}
        </div>
        <h3 className="font-display font-bold text-foreground text-base leading-tight mb-1">{sermon.title}</h3>
        <p className="text-xs text-primary font-serif font-semibold">{sermon.speaker}</p>
        <p className="text-xs text-muted-foreground font-serif">{sermon.sermon_date ? format(parseISO(sermon.sermon_date), 'MMMM d, yyyy') : ''}</p>
        {sermon.description && <p className="text-sm text-muted-foreground font-serif mt-2 line-clamp-2">{sermon.description}</p>}
        <div className="flex flex-wrap gap-2 mt-4">
          {sermon.video_url && (
            <a href={sermon.video_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-serif font-semibold text-primary-foreground bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
              <Video className="w-3.5 h-3.5" /> Watch
            </a>
          )}
          {sermon.audio_url && (
            <a href={sermon.audio_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-serif font-semibold text-foreground bg-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors">
              <Music className="w-3.5 h-3.5" /> Listen
            </a>
          )}
          {sermon.notes_url && (
            <a href={sermon.notes_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-serif font-semibold text-foreground bg-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors">
              <FileText className="w-3.5 h-3.5" /> Notes
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sermons() {
  const { data: sermons, isLoading } = useQuery({
    queryKey: ['sermons'],
    queryFn: async () => {
      const { data } = await supabase.from('sermons').select('*').order('sermon_date', { ascending: false });
      return (data ?? []) as Sermon[];
    },
  });

  const categories = [...new Set(sermons?.map(s => s.category) ?? [])];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <PageHeader
        title="Sermons"
        subtitle="Listen to the Word of God. Sermons, messages, and Bible teachings from our pastors and ministers."
      />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-80 rounded-2xl" />)}
            </div>
          ) : sermons?.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl text-foreground mb-2">Sermons Coming Soon</h3>
              <p className="font-serif text-muted-foreground">Sermon recordings will be posted here. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons!.map(sermon => <SermonCard key={sermon.id} sermon={sermon} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
