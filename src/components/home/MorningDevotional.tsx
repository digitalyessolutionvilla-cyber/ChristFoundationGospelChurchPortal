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
  date: 'FRIDAY, SEPTEMBER 18, 2026',
  title: 'NEGATIVE OR POSITIVE HELP?',
  text_reference: '2 CHRONICLES 20:23-24',
  key_text: '“For the children of Ammon and Moab stood up against the inhabitants of mount Seir, utterly to slay and destroy them: and when they had made an end…every one helped to destroy another.” (2 CHRONICLES 20:23, KJV)',
  body: `What a barbaric and devastating situation it was to see that the overwhelming spiritual death and destruction among the saints can be caused by the destructive division that exists among us. What was once merely an identity division between Paul and Apollos has, in some cases, turned into a situation of slaying and destruction.\n\nThe slaying and destruction of others are common among sinners and the ungodly. Their natural tendency is to kill, steal, and destroy. They are of the stock of the children of wrath, who have no regard for God in their thoughts. For this reason, they slay one another, whether by words or deeds. They are eager to destroy and, sadly, can help one another in destroying themselves.\n\nHowever, finding such ungodly behavior among many believers is surprising and deeply concerning. The children of peace have sometimes balkanized themselves and turned against one another, becoming like the children of Ammon, Moab, and Mount Seir, helping to destroy one another.\n\nBeloved, let us examine ourselves today. How much of your words, attitude, and behavior have you used in destroying your fellow brethren? Do you speak ungodly, untruthful, and unedifying words? Do you backbite and wound others with your words? Do your actions discourage, weaken, or destroy the faith of others?\n\nOh, let us repent today! The ministry we have received from Christ is the ministry of reconciliation. Let us show that we are responsible Christians, committed to the works and life of Jesus Christ. Rather than helping one another to destroy ourselves, God will be pleased to see us helping one another toward edification and healing through prayer, love, encouragement, and edifying words.\n\nLet our words build rather than break. Let our attitudes heal rather than wound. Let our actions strengthen rather than weaken. May we become instruments through which God brings encouragement, restoration, and spiritual growth to His people.`,
  reflection: 'Is your help edifying or killing? God will be pleased if all that we do helps others to grow.',
  song: 'Is Your Life a Channel of Blessing (SFHB 479)',
  prayer: 'Lord Jesus, give me a heart of love, unity, reconciliation, and compassion. Help me to speak words that edify and pray for those who are weak. Make me an instrument of healing and spiritual growth in the body of Christ. In Jesus’ name, Amen.',
  bible_in_one_year: 'EZRA 1–3',
  footer: 'CHRIST, Our Sure Foundation.',
  series_yo: 'ÌPÌLẸ̀ OJOOJUMỌ',
  date_yo: 'ỌJỌ́ ẸTÌ, ỌJỌ KEJIDINLOGUN OṢÙ KẸSÁN, ỌDÚN 2026',
  title_yo: 'ÌRÀNLỌ́WỌ́ RERE TABI EYITI N PANI LARA NI BI?',
  text_reference_yo: '2 KRONIKA 20:23-24',
  key_text_yo: '“Awọn ọmọ Ammoni ati Moabu si dide si awọn ti ngbe òke Seiri, lati pa, ati lati run wọn tũtu: nigbati nwọn si pa awọn ti ngbe òke Seiri run tan, ẹnikini nṣe iranlọwọ lati run ẹnikeji.” (2 KRONIKA 20:23)',
  body_yo: `Ohun tó burú tí ó sì ń bani nínú jẹ́ gidi ni láti rí i pé ikú àti ìparun ti ẹ̀mí tó gbilẹ̀ laarín àwọn ènìyàn mimọ lè jẹ́ àbájáde ìpínyà oniparun tí ó wà laarín wa. Ohun tí ó bẹ̀rẹ̀ gẹ́gẹ́ bí ipinya níti ìdánimọ̀ laarín Paulù àti Apollo ti di, ní àwọn ọ̀ràn kan, ipò iṣekupani ati iparun ara wọn.\n\niṣekupani àti ṣiṣe ìparun àwọn ẹlòmíràn jẹ́ ohun tí ó wọ́pọ̀ laarín àwọn ẹlẹ́ṣẹ̀ àti àwọn alaiwa-bi-Ọlọ́run. Ìtẹ̀sí inú wọn ni láti pa, lati jale, àti láti parun. Wọ́n jẹ́ lára àwọn ọmọ ìbínú, tí kò ka Ọlọ́run sí nínú èrò wọn. Nítorí èyí, wọ́n ń pa ara wọn, yálà nípa ọ̀rọ̀ tàbí nípa ìṣe. Wọ́n ń yára láti ṣe iparun ara wọn, ó sì bani nínú jẹ́ pé wọ́n lè ran ara wọn lọ́wọ́ láti pa ara wọn run.\n\nAmọ, ó jẹ́ ohun ìyàlẹ́nu àti ohun ti ko dun mọni ninu láti rí irú ìwà aiwa-bi-Ọlọ́run bẹ́ẹ̀ laarín ọ̀pọ̀ àwọn onígbàgbọ́. Awọn ọmọ àlàáfíà ti pín ara wọn sí ẹgbẹ́ẹgbẹ́, wọ́n sì di ọta ara wọn, tí wọ́n si dà bí àwọn ọmọ Ammoni, Moabu àti òkè Seiri, tí wọ́n ṣe iranwọ láti pa ara wọn run.\n\nOlùfẹ́, ẹ jẹ́ ki a yẹ ara wa wò lónìí. Mélo nínú àwọn ọ̀rọ̀, ìwà àti ìṣesi rẹ ni o ti lò láti ba àwọn arákùnrin àti arábìnrin rẹ jẹ́? Njẹ o ń sọ àwọn ọ̀rọ̀ aiwa-bi-Ọlọ́run, tí ko jẹ́ òtítọ́, ti ko si gbé ènìyàn ró bi? Njẹ o ń sọ̀rọ̀ ẹ̀yìn, tí o sì ń fi ọ̀rọ̀ rẹ̀ ṣe ọgbẹ fun ẹlomiran bi? Njẹ àwọn ìṣesi rẹ ń mú kí ìgbàgbọ́ àwọn ẹlòmíràn rẹ̀wẹ̀sì, kí ó di aláìlera, tàbí kí ó parun bi?\n\nẸ jẹ́ ki á ronúpìwàdà lónìí! Iṣẹ́ ìránṣẹ́ tí a ti gba láti ọ̀dọ̀ Kristi ni iṣẹ́ iranṣẹ ti ìlàjà. Ẹ jẹ́ ki a fihàn pé a jẹ́ Kristẹni tí ó ní ojúṣe, tí o fi ara rẹ jin fun iṣẹ àti ìgbésí ayé Jésù Kristi. Dípò kí a máa ṣe iranwọ láti pa ara wa run, Ọlọ́run yóò dùnnu láti rí wa tí a ń ran ara wa lọ́wọ́ sí igbeniro àti ìmúláradá nípasẹ̀ àdúrà, ìfẹ́, ọrọ iwuri àti àwọn ọ̀rọ̀ tí ń gbé ènìyàn ró.\n\nẸ jẹ́ kí àwọn ọ̀rọ̀ wa gbe ènìyàn ró dípò kí o wó wọn lulẹ̀. Ẹ jẹ́ kí ìwà wa ṣe ìmúláradá dípò kí ó ṣe ọgbẹ́. Ẹ jẹ́ kí àwọn ìṣesi wa fún àwọn ẹlòmíràn ní okun dípò kí wọ́n sọ wọn di alailera. Kí a lè di àwọn ohun èlò tí Ọlọ́run ń lò láti mú iwuri, ìmúpadàbọ̀sípò àti ìdàgbàsókè ti ẹ̀mí wá fun àwọn ènìyàn Rẹ̀.`,
  reflection_yo: 'Njẹ ìrànlọ́wọ́ rẹ ń gbé ènìyàn ró tàbí ó ń pa wọ́n bi? Inu Ọlọ́run yóò dùn bí gbogbo ohun tí a bá ń ṣe bá ń ran àwọn ẹlòmíràn lọ́wọ́ láti dàgbà.',
  song_yo: "O Ha J'ohun Elo Ibukun (SFHB 479)",
  prayer_yo: 'Jesu Olúwa, fún mi ní ọkàn ìfẹ́, ìṣọ̀kan, ìlàjà àti ìyọ́nú. Ràn mí lọ́wọ́ láti máa sọ àwọn ọ̀rọ̀ tí ń gbé ènìyàn ró, kí n sì máa gbàdúrà fún àwọn tí ó jẹ alailera. Ṣe mí ní ohun èlò ìmúláradá àti ìdàgbàsókè ti ẹ̀mí nínú ara Kristi. Ní orúkọ Jésù. Àmín.',
  bible_in_one_year_yo: 'ẸSRA 1–3',
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