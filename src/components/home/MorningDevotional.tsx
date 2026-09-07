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
  date: 'MONDAY, SEPTEMBER 7, 2026',
  title: 'DEFILE NOT YOURSELVES',
  text_reference: 'EZEKIEL 20:7',
  key_text: '“…cast ye away the abomination of his eyes, and defile not yourselves with the idols of Egypt…” (EZEKIEL 20:7, KJV)',
  body: 'The period before us calls for spiritual caution and consecration. The coming of the Lord is at hand, and the devil, knowing this, is doing all in his power to hinder sinners from coming to Christ and saints from making it to heaven. However, the Lord will not fail to warn us against the evil works of the devil, which manifest themselves through the abominations of this world and the idols of “Egypt.”\n\nThe world is full of sin and all its evil works. The mystery of iniquity is already at work, and to win the battle, we have a duty to ensure that we do not accommodate the abominations of this world or defile ourselves with the idols of Egypt. We must remain watchful, separated, and consecrated unto the Lord.\n\nThe story of Daniel and the three Hebrew men is an example of men who refused to defile themselves with the abominations of Babylon and its idols. Even when hatred, persecution, and the fiery furnace stood before them, they stood their ground and remained faithful to the Lord. Joseph, while in Egypt, also refused to allow the immorality of the Egyptian woman to defile him or lead him into sin. The Lord eventually honored, blessed, and promoted them all.\n\nThe “abomination of his eyes” represents the sinful attractions and influences that seek to draw the heart away from God. These include the lust of the eyes, the lust of the flesh, and the pride of life. They manifest in the immorality, lewdness, lasciviousness, and every work of darkness that characterize the world.\n\nO reader, are there any abominations in your heart? Have you given yourself to the idols of Egypt—to the worldliness and unrighteousness of this present world? The Lord admonishes us to put away these abominations and the idols of the land. Let us cast away from us all our transgressions and make for ourselves a new heart and a new spirit before the Lord. Let us set our eyes on Jesus. He can save us, preserve us, and bless us with the everlasting blessings of heaven and eternal life.',
  reflection: 'The abominations and idols of this world only bring wretchedness and sorrow. Defile not yourselves with them.',
  song: 'Take Time to Be Holy (SFHB 462)',
  prayer: 'Lord, help me to remain pure and consecrated unto You. Deliver me from every abomination and every idol of this world. Help me to keep my eyes fixed on Jesus and remain faithful unto the end. In Jesus’ name. Amen.',
  bible_in_one_year: 'EZEKIEL 35-37',
  footer: 'CHRIST, Our Sure Foundation.',
  series_yo: 'IPILẸ OJOOJUMỌ́',
  date_yo: 'ỌJỌ́ AJÉ, ỌJỌ KEJE OṢU KẸSAN, ỌDUN 2026',
  title_yo: 'MÁṢE BA ARA RẸ JẸ',
  text_reference_yo: 'ESEKIẸLI 20:7',
  key_text_yo: '“…ki olukuluku ninu nyin gbe irira oju rẹ̀ junù, ẹ má si ṣe fi oriṣa Egipti sọ ara nyin di aimọ́.…” (ESEKIẸLI 20:7)',
  body_yo: 'Àkókò tí a wà yìí ń pe fún ìṣọ́ra àti iyara-ẹni-sọtọ ti ẹmi. Ipadabọ Olúwa ti sún mọ́lé, eṣu sì mọ èyí; nítorí náà, ó ń lo gbogbo agbára rẹ̀ láti dí àwọn ẹlẹ́ṣẹ̀ lọ́wọ́ kí wọn má bàa wá sí ọ̀dọ̀ Kristi, àti láti dí àwọn ènìyàn mímọ́ lọ́wọ́ kí wọn má bàa dé ọ̀run. Amọ, Olúwa kì yóò kùnà láti kìlọ̀ fún wa nípa àwọn iṣẹ́ búburú ti eṣu, èyí tí ń farahàn nínú àwọn ohun ìríra ayé yìí àti àwọn òrìṣà “Egipti.”\n\nAyé kún fún ẹ̀ṣẹ̀ àti gbogbo iṣẹ́ búburú rẹ̀. Ohun ijinlẹ ẹṣẹ ti ń ṣiṣẹ́ naa, láti borí ogun yìí, a ni ojúṣe láti rí i dájú pé a kò gba àwọn ohun ìríra ayé yìí laaye ninu ìgbésí ayé wa, tàbí kí a fi àwọn òrìṣà Egipti ba ara wa jẹ́. A gbọ́dọ̀ wà lójúfò, ki a ya ara wa sọ́tọ̀, kí a sì ya ara wa sí mímọ́ fún Olúwa.\n\nÌtàn Dáníẹ́lì àti àwọn ọmọkùnrin Heberu mẹ́ta jẹ́ àpẹẹrẹ àwọn ènìyàn tí wọ́n kọ̀ láti fi àwọn ohun ìríra àti àwọn òrìṣà Bábílónì ba ara wọn jẹ́. Kódà nígbà tí ìkórìíra, inúnibíni àti iná ìléru dúró níwájú wọn, wọ́n dúró ṣinṣin, wọ́n sì jẹ́ olootọ́ sí Olúwa sibẹ. Jósẹ́fù pẹlu, nígbà tí ó wà ní Egipti, o kọ̀ láti jẹ́ kí iwa ifẹkufẹ obìnrin ara Egipti náà ba ara rẹ̀ jẹ́ tàbí mú un dẹṣẹ̀. Nígbẹ̀yìngbẹ́yín, Olúwa bu ọlá fún gbogbo wọn, Ó bùkún wọn, Ó sì gbé wọn ga.\n\n“Iríra oju rẹ̀” dúró fún àwọn ohun tó ń fa ìfẹ́kúfẹ̀ẹ́ ẹ̀ṣẹ̀ àti àwọn ipa búburú tí ń gbìyànjú láti fa ọkàn ènìyàn kúrò lọ́dọ̀ Ọlọ́run. Àwọn wọ̀nyí ni ìfẹ́kúfẹ̀ẹ́ ojú, ìfẹ́kúfẹ̀ẹ́ ara àti irera aiye. Wọ́n ń farahàn nínú ifẹkufẹ, iwa àìtọ́, iwa wọbia àti gbogbo iṣẹ́ òkùnkùn tí o kun inu ayé yìí.\n\nOlùkàwé, njẹ àwọn ohun ìríra kan wà nínú ọkàn rẹ bi? Njẹ o ti fi ara rẹ fún àwọn òrìṣà Egipti—ìyẹn, sí aṣa ayé àti àìṣòdodo ayé ìsinsìnyí? Olúwa ń gba wa níyànjú pé kí a mú àwọn ohun ìríra wọ̀nyí àti àwọn òrìṣà ilẹ̀ náà kúrò. Ẹ jẹ́ kí a mu gbogbo àwọn ìrékọjá wa kuro, kí a sì ṣe ọkàn titun àti ẹ̀mí titun fún ara wa níwájú Olúwa. Ẹ jẹ́ kí a gbé ojú wa sara Jesu. Ó lè gbà wá là, Ó lè pa wá mọ́, Ó sì lè fi àwọn ìbùkún ayérayé ọ̀run àti ìyè àìnípẹ̀kun bùkún wa.',
  reflection_yo: 'Àwọn ohun ìríra àti àwọn òrìṣà ayé yìí kì í mú nǹkan mìíràn wá bíkòṣe ìbànújẹ́, ìṣòro àti ìrora. Máṣe fi wọn ba ara rẹ jẹ́.',
  song_yo: 'Fẹ Lati Jẹ Mimọ (SFHB 462)',
  prayer_yo: 'Olúwa, ràn mí lọ́wọ́ kí n lè wà ní mímọ́ àti ìyàsímímọ́ fun Ọ. Gba mí lọwọ gbogbo irira ayé yìí ati gbogbo oriṣa aiye yii. Ràn mí lọ́wọ́ kí n máa fi ojú mi wò Jesu nígbà gbogbo, kí n sì dúró pẹlu ijolootọ títí dé òpin. Ní orúkọ Jesu. Àmín.',
  bible_in_one_year_yo: 'ESEKIẸLI 35–37',
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