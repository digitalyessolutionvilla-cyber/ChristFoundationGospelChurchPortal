import { useQuery } from '@tanstack/react-query';
import { BookHeart, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface MorningDevotionalData {
  date: string;
  series: string;
  title: string;
  text_reference: string;
  key_text: string;
  body: string;
  reflection: string;
  song: string;
  prayer: string;
  bible_in_one_year: string;
  footer: string;
  series_yo: string;
  date_yo: string;
  title_yo: string;
  text_reference_yo: string;
  key_text_yo: string;
  body_yo: string;
  reflection_yo: string;
  song_yo: string;
  prayer_yo: string;
  bible_in_one_year_yo: string;
  footer_yo: string;
}

const DEFAULT_DEVOTIONAL: MorningDevotionalData = {
  series: 'DAILY FOUNDATION',
  date: 'SUNDAY, SEPTEMBER 6, 2026',
  title: 'PARCHED LANDS INTO SPRINGS',
  text_reference: 'PSALM 107:35',
  key_text: '“He turneth the wilderness into a standing water, and dry ground into watersprings.” (PSALM 107:35, KJV)',
  body: 'What a confirmation do we have from the Lord, that He is turning every dry ground into water springs, and for many, whose ground is facing dryness, here is a word of consolation.\n\nThere are some believers whose grounds are facing dryness. The land upon which they ought to be yielding abundant fruit of labour is yielding less or nothing: it has become patches.\n\nThese grounds could be their fellowship time, personal prayer life, Bible study, singing of spiritual songs, etc., but, alas, they have become patches. They have become moribund.\n\nHowever, today, the Lord is changing every dry ground where there is no water into a water spring. He has said, “Out of thy belly shall flow, rivers of living waters.”\n\nBeloved, whatever may have become patches in our lives, perhaps, parched communion, consecration, and consistent Christian life; parched love for Christ and neighbors; parched faith, fervency, and finances, we have an assurance that Christ will make a turnaround of them all and make us a fountain of abundant blessings.',
  reflection: 'Our patches are becoming a fountain of river.',
  song: 'There Shall Be Showers of Blessing (SFHB 201)',
  prayer: 'Almighty God, that which You have spoken, fulfill it, Lord. Every of our ground that has become patches, give us a water spring in Jesus’ name. Amen',
  bible_in_one_year: 'EZEKIEL 32-34',
  footer: 'CHRIST, Our Sure Foundation.',
  series_yo: 'IPILẸ OJOOJUMỌ',
  date_yo: 'ỌJỌ AIKU, ỌJỌ KEFA OṢU KẸSAN, ỌDUN 2026',
  title_yo: 'ILẸ GBIGBẸ SI ORISUN OMI',
  text_reference_yo: 'ORIN DAFIDI 107:35',
  key_text_yo: '“O sọ aginju di adagun omi, ati ilẹ gbigbẹ di orisun omi.” (ORIN DAFIDI 107:35)',
  body_yo: 'Ẹ wo irú idaniloju tí a ní láti ọ̀dọ̀ Olúwa, pé Ó ń sọ gbogbo ilẹ̀ gbígbẹ di orisun omi, àti fún ọ̀pọ̀lọpọ̀ ènìyàn tí ilẹ̀ wọn ndojú kọ gbigbẹ, èyí ni ọ̀rọ̀ ìtùnú.\n\nAwọn onigbagbọ kan wa ti ilẹ wọn ndojukọ ọgbẹlẹ. Ilẹ̀ tí ó yẹ kí wọ́n máa so ọ̀pọ̀lọpọ èso ti iṣẹ́ àṣekára ń so èso díẹ̀ tàbí ofo: ó ti di ilẹ gbigbẹ.\n\nAwọn ilẹ wọnyi le jẹ akoko isin idapo wọn, igbesi aye adura ti ara-ẹni, ikẹkọọ Bibeli, kikọ awọn orin ẹmi, ati bẹẹbẹẹ lọ, ṣugbọn, o ṣe, wọn ti di ilẹ gbigbẹ. Wọ́n ti di ahoro.\n\nAmọ, lónìí, Olúwa nyí gbogbo ilẹ̀ gbígbẹ nibití kò sí omi padà di orísun omi. Ó ti sọ pé: “Láti inú rẹ ni odò omi ìyè yóò ti máa ṣàn jáde.”\n\nOlufẹ, ohunkohun ti o le ti di ọgbẹlẹ ninu igbesi aye wa, boya, ọgbẹlẹ niti idapọ, iyara-ẹni-sọtọ, ati igbesi aye Kristeni to ṣe deede; Ìfẹ́ to ti gbẹ fún Kristi àti àwọn aládùgbò; ọgbẹlẹ igbagbọ, ìtara, àti eto iṣuna, a ní ìdánilójú pé Kristi yóò yí gbogbo wọn padà, yóò sì sọ wá di orísun ìbùkún yanturu.',
  reflection_yo: 'Awon ilẹ gbigbẹ wa ndi orisun odo.',
  song_yo: 'Ojo Ibukun Yoo Si Rọ (SFHB 201)',
  prayer_yo: 'Ọlọrun Olodumare, ṣe imuṣẹ ohun ti O ti sọ, Oluwa. Gbogbo ilẹ wa ti o ti di gbigbẹ, fun wa ni orisun omi ni oruko Jesu. Amin',
  bible_in_one_year_yo: 'EZEKIEL 32 - 34',
  footer_yo: 'KRISTI, Ipilẹ wa ti O daju.',
};

function parseDevotional(raw: string | null): MorningDevotionalData {
  if (!raw) return DEFAULT_DEVOTIONAL;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      if ('scripture' in parsed || 'content' in parsed) return DEFAULT_DEVOTIONAL;
      return { ...DEFAULT_DEVOTIONAL, ...parsed };
    }
  } catch {
    // Ignore malformed JSON and fall back to the default devotional.
  }

  return DEFAULT_DEVOTIONAL;
}

export function MorningDevotional() {
  const { data: devotional = DEFAULT_DEVOTIONAL, isLoading } = useQuery({
    queryKey: ['morning_devotional'],
    queryFn: async () => {
      const { data } = await supabase
        .from('cms_content')
        .select('value')
        .eq('key', 'morning_devotional')
        .maybeSingle();

      return parseDevotional(data?.value ?? null);
    },
    staleTime: 60 * 1000,
  });

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto rounded-3xl border border-border bg-card p-6 md:p-10 shadow-card">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-church-red font-serif text-sm uppercase tracking-[0.24em] font-semibold mb-3">
              <BookHeart className="h-4 w-4" />
              Morning Devotional
            </div>
            <p className="font-serif text-sm uppercase tracking-[0.24em] text-primary/70">
              {devotional.series}
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-primary">
              {devotional.title}
            </h2>
            <p className="mt-4 text-sm md:text-base text-primary/80 font-serif uppercase tracking-[0.18em]">
              {isLoading ? 'Loading...' : devotional.date}
            </p>
          </div>

          <div className="rounded-2xl border-l-4 border-accent bg-secondary/40 p-5">
            <div className="flex items-center gap-2 text-accent font-serif text-xs uppercase tracking-[0.22em] mb-3">
              <Quote className="h-3.5 w-3.5" />
              Text: {devotional.text_reference}
            </div>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">
              {devotional.key_text}
            </p>
          </div>

          <p className="mt-6 text-base leading-8 text-foreground/90 line-clamp-3">
            {devotional.body.split('\n\n')[0]}
          </p>

          <div className="mt-6 flex justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-serif">
                  Read More
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-5 md:p-8">
                <DialogHeader className="pr-8">
                  <DialogTitle className="font-display text-2xl md:text-3xl text-primary">
                    {devotional.title}
                  </DialogTitle>
                  <DialogDescription className="font-serif uppercase tracking-[0.16em]">
                    {devotional.series} · {devotional.date}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="english" className="mt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="english">English</TabsTrigger>
                    <TabsTrigger value="yoruba">Yorùbá</TabsTrigger>
                  </TabsList>

                  <TabsContent value="english" className="space-y-6">
                    <DevotionalLanguageContent
                      series={devotional.series}
                      date={devotional.date}
                      title={devotional.title}
                      textReference={devotional.text_reference}
                      keyText={devotional.key_text}
                      body={devotional.body}
                      reflectionLabel="Reflection for the Day"
                      reflection={devotional.reflection}
                      song={devotional.song}
                      prayer={devotional.prayer}
                      bibleLabel="Bible in One Year"
                      bibleInOneYear={devotional.bible_in_one_year}
                      footer={devotional.footer}
                    />
                  </TabsContent>

                  <TabsContent value="yoruba" className="space-y-6">
                    <DevotionalLanguageContent
                      series={devotional.series_yo}
                      date={devotional.date_yo}
                      title={devotional.title_yo}
                      textReference={devotional.text_reference_yo}
                      keyText={devotional.key_text_yo}
                      body={devotional.body_yo}
                      reflectionLabel="AKIYESI FUN ỌJỌ ONI"
                      reflection={devotional.reflection_yo}
                      song={devotional.song_yo}
                      prayer={devotional.prayer_yo}
                      bibleLabel="BÍBÉLÌ NI ỌDÚN KAN"
                      bibleInOneYear={devotional.bible_in_one_year_yo}
                      footer={devotional.footer_yo}
                    />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
}

interface DevotionalLanguageContentProps {
  series: string;
  date: string;
  title: string;
  textReference: string;
  keyText: string;
  body: string;
  reflectionLabel: string;
  reflection: string;
  song: string;
  prayer: string;
  bibleLabel: string;
  bibleInOneYear: string;
  footer: string;
}

function DevotionalLanguageContent({
  series,
  date,
  title,
  textReference,
  keyText,
  body,
  reflectionLabel,
  reflection,
  song,
  prayer,
  bibleLabel,
  bibleInOneYear,
  footer,
}: DevotionalLanguageContentProps) {
  return (
    <div className="pt-4">
      <div className="mb-6 text-center">
        <p className="font-serif text-xs uppercase tracking-[0.22em] text-primary/70">{series}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{date}</p>
        <h3 className="mt-3 font-display text-2xl font-bold text-primary">{title}</h3>
      </div>

      <div className="rounded-2xl border-l-4 border-accent bg-secondary/40 p-5">
        <p className="font-serif text-xs uppercase tracking-[0.2em] text-accent mb-3">
          Text: {textReference}
        </p>
        <p className="text-base leading-relaxed text-foreground/90">{keyText}</p>
      </div>

      <div className="mt-6 text-base leading-8 text-foreground/90 whitespace-pre-line text-justify">
        {body}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <DetailItem label={reflectionLabel} value={reflection} />
        <DetailItem label="Song" value={song} />
        <DetailItem label="Prayer" value={prayer} />
        <DetailItem label={bibleLabel} value={bibleInOneYear} />
      </div>

      <p className="mt-8 text-center font-serif text-sm uppercase tracking-[0.16em] text-primary/80">
        {footer}
      </p>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="font-serif text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">{label}</p>
      <p className="leading-relaxed text-foreground/90">{value}</p>
    </div>
  );
}