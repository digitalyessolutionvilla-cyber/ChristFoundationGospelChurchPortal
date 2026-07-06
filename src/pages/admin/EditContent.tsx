import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const LOGO_URL = 'https://cdn.enter.pro/resources/uid_100066245/29b71ed7-ea27-47.png';

const keyLabels: Record<string, string> = {
  welcome_message: 'Welcome Message',
  history_text: 'Brief History of the Church',
  vision_text: 'Our Vision',
  mission_text: 'Our Mission',
  motto_text: 'Our Motto',
  doctrines_text: 'Doctrines and Beliefs',
  youth_ministry_text: 'Youth Ministry',
};

function EditContentInner() {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [value, setValue] = useState<string | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['cms_content', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_content')
        .select('value')
        .eq('key', key!)
        .maybeSingle();
      if (error) throw error;
      const v = data?.value ?? '';
      setValue(v);
      return v;
    },
    enabled: !!key,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('cms_content')
        .upsert({ key: key!, value: value ?? '' }, { onConflict: 'key' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms_content', key] });
      toast({ title: 'Content saved successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to save content', variant: 'destructive' });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary shadow-blue sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <img src={LOGO_URL} alt="CFGC" className="h-8 w-8 rounded-full bg-white/10" crossOrigin="anonymous" />
          <span className="font-display font-bold text-primary-foreground text-sm">CFGC Admin</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5 font-serif text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-display font-bold text-xl text-foreground">
            Edit: {keyLabels[key ?? ''] ?? key}
          </h1>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-card p-6">
          <p className="text-xs text-muted-foreground font-serif mb-4">
            Use double line breaks to separate paragraphs. Use **bold text** for bold formatting.
          </p>

          {isLoading || value === null ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : (
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="font-serif min-h-64 text-sm leading-relaxed"
              placeholder="Enter content here..."
            />
          )}

          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || value === null}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif gap-2"
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

const EditContent = () => (
  <AdminGuard>
    <EditContentInner />
  </AdminGuard>
);

export default EditContent;
