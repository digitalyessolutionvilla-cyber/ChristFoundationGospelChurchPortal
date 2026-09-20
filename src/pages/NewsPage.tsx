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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RegistrationDialog } from '@/components/shared/RegistrationDialog';

interface NewsArticle {
  id: string; title: string; content: string; image_url: string;
  author: string; is_featured: boolean; published_at: string;
}

const FALLBACK_NEWS_ARTICLE: NewsArticle = {
  id: 'national-youth-rally-news-2026',
  title: '2026 National Youth Rally: Christ Foundation Gospel Church Calls Young People to “Fight the Good Fight of Faith”',
  content: `By Christ Foundation Gospel Church (Inc.)

September 2026

Christ Foundation Gospel Church (Inc.), through its Covenant Youths, is set to host the 2026 National Youth Rally, a three-day gathering designed to inspire, equip and empower young people through the Word of God, prayer, fellowship and practical activities.

The rally, themed “Fight the Good Fight of Faith”, is anchored on the biblical charge from 1 Timothy 6:12: “Fight the good fight of faith.”

A Programme Designed to Empower the Youth

The 2026 National Youth Rally will feature a range of spiritual, creative and developmental activities aimed at engaging young people and encouraging them in their faith journey.

Activities scheduled for the rally include:

• Word Exposition
• Symposia
• Prevailing Prayer
• Teens Presentations
• Youth Concert
• Drama
• Entrepreneurial Workshop

The organisers say the gathering will provide an opportunity for young people to receive biblical teaching, participate in prayer and worship, develop meaningful relationships, and gain practical insights through the entrepreneurial workshop.

Ministering

The programme will be ministered by Rev. N. A. Akintobi, General Overseer, who will lead participants through the theme of standing firm and remaining committed to the Christian faith.

Event Details

Event: 2026 National Youth Rally
Theme: Fight the Good Fight of Faith
Date: Thursday, 29th – Saturday, 31st October 2026
Time: 9:00 AM Daily
Venue: 5–13 Tijani Ayoola Street, Iroko Town via Ajegunle B/Stop, Sango-Ota, Ogun State.

Join the Celebration

Young people, families, church members and guests are invited to participate in the three-day programme and experience a time of spiritual renewal, learning, worship and fellowship.

The event will also be available online through the church's social media platforms.

Facebook: CFGC Nationwide
YouTube: CFGC

For enquiries, contact:
+234 703 974 9785
+234 703 333 75418

“Come, be blessed and empowered.”

Christ Foundation Gospel Church (Inc.)`,
  image_url: '',
  author: 'Christ Foundation Gospel Church (Inc.)',
  is_featured: true,
  published_at: '2026-09-20T00:00:00Z',
};

export default function NewsPage() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const { data } = await supabase.from('news_announcements').select('*').eq('is_published', true).order('published_at', { ascending: false });
        return data?.length ? data as NewsArticle[] : [FALLBACK_NEWS_ARTICLE];
      } catch {
        return [FALLBACK_NEWS_ARTICLE];
      }
    },
    initialData: [FALLBACK_NEWS_ARTICLE],
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
            <div className="space-y-6">{[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="mt-4 font-serif">Read More</Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="font-display text-2xl text-primary">{article.title}</DialogTitle>
                              </DialogHeader>
                              <div className="whitespace-pre-line font-serif leading-8 text-foreground/85">{article.content}</div>
                            </DialogContent>
                          </Dialog>
                          <RegistrationDialog className="mt-3" />
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="mt-3 font-serif">Read More</Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="font-display text-2xl text-primary">{article.title}</DialogTitle>
                              </DialogHeader>
                              <div className="whitespace-pre-line font-serif leading-8 text-foreground/85">{article.content}</div>
                            </DialogContent>
                          </Dialog>
                          <RegistrationDialog className="mt-3" />
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
