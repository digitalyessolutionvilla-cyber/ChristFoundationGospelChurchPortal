import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/shared/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/hooks/useAdminProfile';
import { Save, Info } from 'lucide-react';

const keyLabels: Record<string, string> = {
  welcome_message: 'Welcome Message',
  sunday_school_lesson: 'Sunday School Lesson',
  history_text: 'Brief History of the Church',
  vision_text: 'Our Vision',
  mission_text: 'Our Mission',
  motto_text: 'Our Motto',
  doctrines_text: 'Doctrines and Beliefs',
  youth_ministry_text: 'Youth Ministry',
};

function EditContentInner() {
  const { key } = useParams<{ key: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [value, setValue] = useState<string | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['cms_content', key],
    queryFn: async () => {
      const { data } = await supabase.from('cms_content').select('value').eq('key', key!).maybeSingle();
      const v = data?.value ?? '';
      setValue(v);
      return v;
    },
    enabled: !!key,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('cms_content').upsert({ key: key!, value: value ?? '' }, { onConflict: 'key' });
      if (error) throw error;
      await logActivity('Updated content', keyLabels[key ?? ''] ?? key ?? '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms_content', key] });
      toast({ title: 'Content saved successfully!' });
    },
    onError: () => toast({ title: 'Failed to save', variant: 'destructive' }),
  });

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Edit: {keyLabels[key ?? ''] ?? key}
        </h1>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <div className="flex items-start gap-2 bg-secondary/60 rounded-lg p-3 mb-4 text-xs font-serif text-muted-foreground">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          {key === 'sunday_school_lesson'
            ? 'Use valid JSON with keys: date, topic_en, memory_verse_en, topic_yo, memory_verse_yo.'
            : 'Use double line breaks (Enter twice) to separate paragraphs. Use **text** for bold formatting.'}
        </div>

        {isLoading || value === null ? (
          <Skeleton className="h-72 w-full rounded-lg" />
        ) : (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="font-serif min-h-72 text-sm leading-relaxed"
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
    </div>
  );
}

const EditContent = () => (
  <AdminGuard>
    <AdminLayout>
      <EditContentInner />
    </AdminLayout>
  </AdminGuard>
);

export default EditContent;
