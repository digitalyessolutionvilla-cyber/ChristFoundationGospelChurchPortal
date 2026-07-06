import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

interface NewsArticle {
  id: string; title: string; content: string; image_url: string;
  author: string; is_featured: boolean; published_at: string;
}

export default function NewsPage() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data } = await supabase.from('news_announcements').select('*').eq('is_published', true).order('published_at', { ascending: false });
      return (data ?? []) as NewsArticle[];
    },
  });

  const featured = articles?.filter(a => a.is_featured) ?? [];
  const others = articles?.filter(a => !a.is_featured) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <PageHeader
        title="News & Announcements"
        subtitle="Stay informed with the latest news, updates, and announcements from Christ Foundation Gospel Church."
      />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="space-y-6">{[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>
          ) : articles?.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl text-foreground mb-2">No announcements yet</h3>
              <p className="font-serif text-muted-foreground">Check back for church news and announcements.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {featured.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground mb-4">Featured</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featured.map(article => (
                      <article key={article.id} className="bg-card rounded-2xl border border-primary/20 shadow-blue overflow-hidden">
                        {article.image_url && <img src={article.image_url} alt={article.title} className="w-full h-44 object-cover" crossOrigin="anonymous" />}
                        <div className="p-6">
                          <Badge className="text-[10px] bg-primary text-primary-foreground mb-3">Featured</Badge>
                          <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight">{article.title}</h3>
                          {article.author && <p className="text-xs font-serif text-primary mb-2">By {article.author}</p>}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground font-serif mb-3">
                            <Calendar className="w-3 h-3" />
                            {article.published_at ? format(parseISO(article.published_at), 'MMMM d, yyyy') : ''}
                          </div>
                          <p className="text-sm font-serif text-muted-foreground line-clamp-3">{article.content}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {others.length > 0 && (
                <div>
                  {featured.length > 0 && <h2 className="font-display font-bold text-xl text-foreground mb-4">All Announcements</h2>}
                  <div className="space-y-4">
                    {others.map(article => (
                      <article key={article.id} className="bg-card rounded-xl border border-border shadow-card p-5 flex gap-4">
                        {article.image_url && <img src={article.image_url} alt={article.title} className="w-20 h-20 rounded-lg object-cover shrink-0" crossOrigin="anonymous" />}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-base text-foreground leading-tight mb-1">{article.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-serif mb-2">
                            {article.author && <span>By {article.author}</span>}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {article.published_at ? format(parseISO(article.published_at), 'MMM d, yyyy') : ''}
                            </div>
                          </div>
                          <p className="text-sm font-serif text-muted-foreground line-clamp-2">{article.content}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
