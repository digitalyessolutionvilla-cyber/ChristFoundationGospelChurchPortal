import { useQuery } from '@tanstack/react-query';
import { BookHeart, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShareActions } from '@/components/shared/ShareActions';
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
  image_url: string;
}

const DEFAULT_DEVOTIONAL: MorningDevotionalData = {
  series: 'DAILY FOUNDATION',
  date: 'THURSDAY, SEPTEMBER 17, 2026',
  title: 'LET TRIAL BLESS',
  text_reference: 'ROMANS 5:3',
  key_text: '“Knowing that tribulation worketh patience.” (ROMANS 5:3, KJV)',
  body: `This verse offers a promise in essence, even if not in form. We are in constant need of patience, and this text shows us how to gain it. We learn patience through enduring trials, just as someone learns to swim by actually swimming—not by staying on dry land. In the same way, we can't learn patience without experiencing trouble. Isn't it worth the suffering to gain that beautiful state of mind which calmly accepts all of God's will?\n\nBut the verse points out a surprising fact that goes beyond natural understanding—tribulation, by itself, usually brings out irritation, unbelief, and rebellion. Only through the sacred work of grace does it produce patience. Just like no one would thrash wheat just to raise dust, so tribulation often seems like a harsh tool; yet it works to calm our spirit. We don’t toss a person about to give them rest, but that’s how the Lord deals with His children. This is not the way of man, but it showcases the wisdom of our all-knowing God.\n\nOh, for the grace to let my trials bless me! Why should I want to stop the gracious work they are doing? Lord, I ask You to remove my affliction, but I ask even more that You remove my impatience. Precious Lord Jesus, with Your cross, engrave the image of Your patience on my heart.\n\n(Culled from the Faith Checkbook by C.H. Spurgeon)`,
  reflection: 'Trials are often for a divine cause and purpose that can only be seen through Christ and through our patience.',
  song: 'Oh Weary Heart There Is A Home (SFHB 519)',
  prayer: 'Almighty God, thank you for every trial we have endured. We ask for your grace to be patient and to allow your blessings, beauty, and praise to be revealed in our moments of testing and trials. In Jesus’ name, Amen.',
  bible_in_one_year: 'DANIEL 10 - 12',
  footer: 'CHRIST, Our Sure Foundation.',
  series_yo: 'IPILẸ OJOOJUMỌ',
  date_yo: 'ỌJỌBỌ, ỌJỌ KẸTADINLOGUN OṢU KẸSAN, ỌDỌN 2026',
  title_yo: 'JẸ KI IYIRIWO MU IBUKUN WA',
  text_reference_yo: 'ROMU 5:3',
  key_text_yo: '“Bi a ti mọ̀ pe wahalà nṣiṣẹ sũru.” (ROMU 5:3)',
  body_yo: `Ẹsẹ Iwe mimọ yii nfunni ni ileri kan ni pato, koda bi ko tilẹ si ni irisi ti a ro. A nílò sùúrù nígbà gbogbo, ẹsẹ Ìwé Mímọ́ yìí sì jẹ́ ki á mọ bi a ṣe lè ni i. A ń kọ sùúrù nípasẹ̀ fifaradà àwọn iyiriwo, gẹ́gẹ́ bí ẹnì kan ti nkọ́ láti lúwẹ̀ẹ́ nípa lilúwẹ̀ẹ́ nitootọ—kì í ṣe nípa dídúró sórí ilẹ̀ gbígbẹ. Lọ́nà kan náà, a kò lè kọ́ sùúrù láìsí iriri ìdààmú. Njẹ ijiya naa ko ha niyelori lati le jere ipo ọkan to rẹwa naa ti nfi pẹlẹpẹlẹ gba gbogbo ifẹ Ọlọrun bi?\n\nṢùgbọ́n ẹsẹ Iwe Mimọ naa tọ́ka sí òtítọ́ kan tó yani lẹ́nu tí ó kọjá òye ẹda—ìpọ́njú niti rẹ̀, máa ń mú ìbínú, aigbàgbọ́, àti ìṣọ̀tẹ̀ jáde. Nipasẹ iṣẹ mimọ ti oore-ọfẹ nikan ni o fi nmu sũru jade. Gẹ́gẹbí kò ṣe si ẹ́ni ti yio máa fọ́ àlìkámà láti ri erukuru lasan, bẹ́ẹ̀ gẹgẹ ni ìpọ́njú sábà máa ń dàbí ohun èlò tó le; sibẹsibẹ o nṣiṣẹ lati ṣe itunu fun ẹmi wa. A ki i ju eniyan kan siwa sẹhin lati fun wọn ni isinmi, ṣugbọn bayi ni Oluwa ṣe nṣe pẹlu awọn ọmọ Rẹ. Èyí kì í ṣe ọ̀nà ènìyàn, ṣùgbọ́n ó nfi ọgbọ́n Ọlọ́run wa tí ó mọ ohun gbogbo hàn.\n\nAh, emi iba ni oore-ọfẹ lati jẹ ki awọn iyiriwo mi bukun mi! Kini eredi ti mo ṣe fẹ lati da iṣẹ oore-ọfẹ ti wọn nṣe duro? Oluwa, mo bere lowo Rẹ pe ki O mu ipọnju mi kuro, ṣugbon mo tun bere julọ pe ki O mu aini suuru mi kuro. Jesu Oluwa ọwọn, pẹlu agbelebu Rẹ, Ya aworan suuru Rẹ sinu ọkan mi.\n\n(A mu u jade lati inu Iwe Ayẹwo Igbagbọ lati ọwọ C.H. Spurgeon)`,
  reflection_yo: 'Awọn iyiriwo wa fun eredi ati ipinnu atọrunwa nigba gbogbo ti a le ri nipasẹ Kristi nikan ati nipasẹ sũru wa.',
  song_yo: 'Ọkan Arẹ Ile Kan Mbẹ (SFHB 519)',
  prayer_yo: 'Ọlọrun Olodumare, O ṣeun fun gbogbo iyiriwo ti a ti farada. A beere fun oore-ọfẹ Rẹ lati ni suuru ati lati jẹ ki awọn ibukun, ẹwa, ati iyin Rẹ han ni awọn akoko idanwo ati iyiriwo wa ni orukọ Jesu, Amin.',
  bible_in_one_year_yo: 'DANIẸLI 10 - 12',
  footer_yo: 'KRISTI, Ipilẹ Wa ti O daju.',
  image_url: '',
};

function parseDevotional(raw: string | null): MorningDevotionalData {
  if (!raw) return DEFAULT_DEVOTIONAL;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      if (
        'scripture' in parsed ||
        'content' in parsed ||
        parsed.date === 'SUNDAY, SEPTEMBER 6, 2026' ||
        parsed.date === 'MONDAY, SEPTEMBER 7, 2026' ||
        parsed.title === 'PARCHED LANDS INTO SPRINGS'
      ) return DEFAULT_DEVOTIONAL;
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
              {devotional.series}
            </div>
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

          {devotional.image_url && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-muted">
              <img src={devotional.image_url} alt={`${devotional.title} devotional graphic`} className="max-h-[28rem] w-full object-cover" />
            </div>
          )}

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
          <ShareActions
            className="mt-4"
            title={`${devotional.series}: ${devotional.title}`}
            text={`${devotional.date}\n\n${devotional.key_text}\n\n${devotional.body}\n\nReflection: ${devotional.reflection}\nSong: ${devotional.song}\nPrayer: ${devotional.prayer}\nBible in One Year: ${devotional.bible_in_one_year}`}
          />
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