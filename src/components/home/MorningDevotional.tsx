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
  date: 'WEDNESDAY, SEPTEMBER 9, 2026',
  title: 'REDEMPTION FROM OPPRESSION I',
  text_reference: 'JEREMIAH 50:33 - 35',
  key_text: '”Their Redeemer is strong; the LORD of hosts is his name: he shall throughly plead their cause, that he may give rest to the land, and disquiet the inhabitants of Babylon.” (JEREMIAH 50:34, KJV)',
  body: 'God is always interested in His people, and His care for them is beyond human comprehension. As he did in Egypt, God takes notice of his people\'s bondage in Babylon. Israel and Judah were oppressed together, and He has surely seen it and heard their cry.\n\nThe people of God became weak and powerless as those, the Babylonians, who took them captives held them fast, and were much too hard for them. However, this is their comfort in distress, that, though they are weak, their Redeemer is strong! The Lord, who is their Avenger, has a right to them, will claim his right and make good his claim.\n\nThe Lord is stronger than the enemy that holds fast to His people. He can overpower all the forces that are against them and put strength into His people. His name is the Lord of hosts, and He will answer to it, and make it known that He is what his people call Him, and He will be to them what His people call Him.\n\nTherefore, it is a great comfort for us, as believers, that, though we have host against us, we have the Lord of host for us and He shall thoroughly plead our cause, pleading He shall plead it, plead it jealously, effectually, plead and carry it, that he may give rest to our land, rest from all our enemies round about.',
  reflection: 'The Lord shall plead our cause, and He shall plead it jealously and effectually till we have rest to our land.',
  song: 'The Lord’s Our Rock in Him We Hide (SFHB 571)',
  prayer: 'Almighty God, our great Redeemer and Avenger, hear us today and redeem us from all oppressors. Give rest to our land, and we shall continue to praise forever in Jesus\' name. Amen',
  bible_in_one_year: 'EZEKIEL 40-41',
  footer: 'CHRIST, Our Sure Foundation.',
  series_yo: 'IPILẸ OJOOJUMỌ́',
  date_yo: 'ỌJỌRU, ỌJỌ KẸSAN OṢU KẸSAN, ỌDUN 2026',
  title_yo: 'IRAPADA KURO LỌWỌ INILARA (APA KINNI)',
  text_reference_yo: 'JEREMIAH 50:33 - 35',
  key_text_yo: '”Ṣugbọn Olurapada wọn lagbara; Oluwa awọn ọmọ-ogun li orukọ rẹ̀: ni jijà yio gba ijà wọn jà! ki o le mu ilẹ na simi, ki o si mu awọn olugbe Babeli wariri.” (JEREMIAH 50:34)',
  body_yo: 'Ọlọrun nifẹ si awọn eniyan Rẹ nigbagbogbo ati pe itọju Rẹ lori wọn kọja oye eniyan. Gẹ́gẹ́ bí O ti ṣe ní Egipti, Ọlọ́run kíyè sí ìgbèkùn àwọn ènìyàn rẹ̀ ní Bábílónì. Israeli ati Juda ni a nilara papọ, Oun si ti ri i dajudaju, O si gbọ igbe wọn.\n\nÀwọn ènìyàn Ọlọ́run di aláìlera àti aláìlágbára bí àwọn ará Bábílónì, tí wọ́n kó wọn nígbèkùn ti de wọn ṣinṣin, tí wọ́n sì le jù fún wọn. Sibẹsibẹ, eyi ni itunu wọn ninu ipọnju, pe, botilẹjẹpe wọn jẹ alailera, Olurapada wọn lagbara! Olúwa tí í ṣe Olùgbẹ̀san wọn, ní ẹ̀tọ́ sí wọn, yóò gba ẹ̀tọ́ rẹ̀, yóò sì mú ẹ̀tọ́ rẹ̀ ṣe.\n\nOluwa l’agbara ju ota ti o di eniyan Re mu lọ. O le bori gbogbo ipa ti o lodi si wọn, ki O si fi agbara sinu awọn eniyan Rẹ. Orúkọ rẹ̀ ni Olúwa àwọn ọmọ-ogun, Òun yóò sì dá a lóhùn, yóò sì jẹ́ kí ó di mimọ̀ pé Oun ni ohun tí àwọn ènìyàn rẹ̀ ń pè E, Oun yóò sì jẹ́ ohun tí àwọn ènìyàn Rẹ̀ ń pè é fún.\n\nNitorina, itunu nla ni fun wa, gege bi onigbagbo, pe, bi a tilẹ ni awọn ọmọ-ogun to dide lodi si wa, Oluwa awọn ọmọ-ogun wa fun wa, yio si gba ija wa ja daadaa, yio gba a ro, yio fi owu gba a ro, lododo, yio gba a ro, yio si gbé e, kí O lè fún ilẹ wa ní ìsinmi, isinmi lọwọ gbogbo àwọn ọ̀tá wa kaakiri.',
  reflection_yo: 'Oluwa yio gba ẹjọ wa ro, yio si fi owú ati ododo gba a ro titi awa o fi ni isimi ni ilẹ wa.',
  song_yo: 'Oluwa Li Apata Wa (SFHB 571)',
  prayer_yo: 'Ọlọrun Olodumare, Olurapada ati Olugbẹsan wa agba, fetisi wa loni ki O si rà wa pada lọwọ gbogbo awọn aninilara. Fun ilẹ wa ni isimi, a o si maa yin Ọ titi lae ni orukọ Jesu. Amin',
  bible_in_one_year_yo: 'ESIỌKIẸLI 40-41',
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