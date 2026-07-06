import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface CMSTextProps {
  contentKey: string;
  className?: string;
  /** If true, renders each paragraph as a <p> element */
  multiParagraph?: boolean;
}

export function CMSText({ contentKey, className = '', multiParagraph = true }: CMSTextProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['cms_content', contentKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_content')
        .select('value')
        .eq('key', contentKey)
        .maybeSingle();
      if (error) throw error;
      return data?.value ?? '';
    },
  });

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    );
  }

  if (!multiParagraph) {
    return <span className={className}>{data}</span>;
  }

  const paragraphs = (data ?? '').split('\n\n').filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((para, i) => {
        // Detect bold markdown **text**
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}
