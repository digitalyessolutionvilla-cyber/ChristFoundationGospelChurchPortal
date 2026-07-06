import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { MessageSquareQuote, Send, User } from 'lucide-react';

interface Testimony {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

const Testimonies = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ author_name: '', content: '' });

  const { data: testimonies, isLoading } = useQuery({
    queryKey: ['testimonies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonies')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Testimony[];
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('testimonies')
        .insert({ author_name: form.author_name.trim(), content: form.content.trim(), approved: false });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Testimony submitted!',
        description: 'Your testimony will appear after admin review. God bless you!',
      });
      setForm({ author_name: '', content: '' });
    },
    onError: () => {
      toast({ title: 'Error submitting testimony', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author_name.trim() || !form.content.trim()) return;
    submitMutation.mutate();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Testimonies"
          subtitle="Sharing the goodness of God — to the glory of His name"
        />

        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* Submit form */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 mb-12">
            <h2 className="font-display text-xl font-bold text-primary mb-1">Share Your Testimony</h2>
            <p className="text-muted-foreground font-serif text-sm mb-6">
              "And they overcame him by the blood of the Lamb, and by the word of their testimony" — Rev. 12:11
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-serif text-sm">Your Name</Label>
                <Input
                  id="name"
                  value={form.author_name}
                  onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
                  placeholder="Enter your name"
                  className="mt-1.5 font-serif"
                  required
                />
              </div>
              <div>
                <Label htmlFor="testimony" className="font-serif text-sm">Your Testimony</Label>
                <Textarea
                  id="testimony"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Share what God has done for you..."
                  className="mt-1.5 font-serif min-h-32"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif gap-2"
              >
                <Send className="w-4 h-4" />
                {submitMutation.isPending ? 'Submitting...' : 'Submit Testimony'}
              </Button>
            </form>
          </div>

          {/* Testimonies list */}
          <h2 className="font-display text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6" /> Testimonies of God's Faithfulness
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
            </div>
          ) : testimonies?.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquareQuote className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-serif text-muted-foreground">No testimonies yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {testimonies!.map((t) => (
                <div key={t.id} className="bg-card rounded-xl border border-border shadow-card p-6 hover:shadow-blue transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">{t.author_name}</p>
                      <p className="text-xs text-muted-foreground font-serif">
                        {new Date(t.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="h-0.5 bg-gradient-gold mb-4 opacity-40" />
                  <p className="text-sm font-serif text-foreground/80 leading-relaxed line-clamp-6">{t.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonies;
