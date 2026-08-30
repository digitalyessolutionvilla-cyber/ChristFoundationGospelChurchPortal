import { useQuery } from '@tanstack/react-query';
import { BookOpenText, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SundaySchoolLessonData {
  date: string;
  topic_en: string;
  memory_verse_en: string;
  topic_yo: string;
  memory_verse_yo: string;
}

const DEFAULT_LESSON: SundaySchoolLessonData = {
  date: 'SUNDAY, AUGUST 30, 2026',
  topic_en: 'THE PRICE HE MUST PAY',
  memory_verse_en: 'IF ANY MAN WILL COME AFTER ME, LET HIM DENY HIMSELF AND TAKE UP HIS CROSS AND FOLLOW ME (MATTHEW 16:24)',
  topic_yo: 'OHUN TI YOO GBA WA',
  memory_verse_yo: 'BI ENIKAN BA NFE LATI TO MI LEHIN, KI O SE ARA RE, KI O SI GBE AGBELEBU RE, KI O SI MAA TO MI LEHIN (MATTEU 16:24)',
};

function parseLesson(raw: string | null): SundaySchoolLessonData {
  if (!raw) return DEFAULT_LESSON;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { ...DEFAULT_LESSON, ...parsed };
    }
  } catch {
    // Ignore malformed JSON and fall back to the default lesson data.
  }

  return DEFAULT_LESSON;
}

export function SundaySchoolLesson() {
  const { data: lesson = DEFAULT_LESSON, isLoading } = useQuery({
    queryKey: ['sunday_school_lesson'],
    queryFn: async () => {
      const { data } = await supabase
        .from('cms_content')
        .select('value')
        .eq('key', 'sunday_school_lesson')
        .maybeSingle();

      return parseLesson(data?.value ?? null);
    },
    staleTime: 60 * 1000,
  });

  return (
    <section className="py-14 md:py-20 bg-gradient-section">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-church-red font-serif text-sm uppercase tracking-[0.24em] font-semibold mb-3">
              Sunday School Lesson
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
              Lesson of the Week
            </h2>
            <div className="mt-4 flex items-center justify-center gap-3 text-sm md:text-base text-primary/80 font-serif uppercase tracking-[0.18em]">
              <span className="h-px w-10 bg-primary/30" />
              <span>{isLoading ? 'Loading...' : lesson.date}</span>
              <span className="h-px w-10 bg-primary/30" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-church-red font-serif text-sm uppercase tracking-[0.18em] mb-5">
                <BookOpenText className="h-4 w-4" />
                English
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Topic</p>
                  <h3 className="font-display text-2xl md:text-3xl text-primary leading-tight">
                    {lesson.topic_en}
                  </h3>
                </div>

                <div className="rounded-2xl border-l-4 border-accent bg-secondary/40 p-4">
                  <div className="flex items-center gap-2 text-accent font-serif text-xs uppercase tracking-[0.22em] mb-3">
                    <Quote className="h-3.5 w-3.5" />
                    Memory Verse
                  </div>
                  <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                    {lesson.memory_verse_en}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-church-red font-serif text-sm uppercase tracking-[0.18em] mb-5">
                <BookOpenText className="h-4 w-4" />
                Yoruba
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Ori Eko</p>
                  <h3 className="font-display text-2xl md:text-3xl text-primary leading-tight">
                    {lesson.topic_yo}
                  </h3>
                </div>

                <div className="rounded-2xl border-l-4 border-accent bg-secondary/40 p-4">
                  <div className="flex items-center gap-2 text-accent font-serif text-xs uppercase tracking-[0.22em] mb-3">
                    <Quote className="h-3.5 w-3.5" />
                    Akosori
                  </div>
                  <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                    {lesson.memory_verse_yo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
