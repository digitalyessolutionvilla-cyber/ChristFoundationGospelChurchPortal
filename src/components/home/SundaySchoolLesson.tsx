import { useQuery } from '@tanstack/react-query';
import { BookOpenText, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ShareActions } from '@/components/shared/ShareActions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SundaySchoolLessonData {
  date: string;
  lesson_number: string;
  reference: string;
  topic_en: string;
  memory_verse_en: string;
  reference_yo: string;
  topic_yo: string;
  memory_verse_yo: string;
  full_lesson_en: string;
  full_lesson_yo: string;
  image_url: string;
}

const DEFAULT_LESSON: SundaySchoolLessonData = {
  date: 'SUNDAY, SEPTEMBER 20, 2026',
  lesson_number: 'LESSON 152 - SENIOR',
  reference: 'NUMBERS 27:15-23; DEUTERONOMY 34:9; JOSHUA 1:1-18',
  topic_en: "JOSHUA'S APPOINTMENT AS LEADER OF ISRAEL",
  memory_verse_en: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest (Joshua 1:9).',
  reference_yo: 'Numeri 27:15-23; Deuteronomi 34:9; Joṣua 1:1-18',
  topic_yo: 'A YAN JOṢUA NI ALAKOSO ISRAẸLI',
  memory_verse_yo: 'Emi kò ha paṣẹ fun ọ bi? Ṣe giri ki o si mu àiya le; máṣe bẹru, bẹẹni ki àiya ki o máṣe fò ọ: nitoripe OLUWA Ọlọrun rẹ wà pẹlu rẹ nibikibi ti iwọ ba nlọ (Joṣua 1:9).',
  full_lesson_en: `For English

[NUM:27:15-23]; [DEU:34:9]; [JOS:1:1-18].

Lesson 152 - Senior

Memory Verse

"Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest" (Joshua 1:9).

Cross References

I Joshua's Promotion to Leadership

1. Moses was not permitted to go into the Promised Land, [NUM:27:15-17]; [DEU:31:14].

2. God directed Moses to give Joshua the commission of leadership, [NUM:27:18-19]; [DEU:31:7], [DEU:31:23].

3. A greater measure of the Spirit of God, wisdom, and honour came to Joshua, and the Children of Israel hearkened unto him, [NUM:27:20-23]; [DEU:34:9]; [ACT:6:6]; [1TM:4:14].

II God's Promises to Joshua

1. After Moses' death, the Lord commanded Joshua to lead the people over Jordan into the Promised Land, [JOS:1:1-2].

2. God promised to give the Children of Israel every place that the sole of their foot should tread upon, [JOS:1:3-4]; [JOS:14:9]; [DEU:11:24].

3. Joshua was encouraged to be strong and of good courage, [JOS:1:5-6]; [ROM:8:31], [ROM:8:37]; [HEB:13:5].

4. Joshua's prosperous way and good success came as he kept God's law and meditated therein, [JOS:1:7-9]; [DEU:29:9]; [PS:1:1-3].

III The Preparation to Cross Jordan

1. Within three days after Joshua received God's instructions, the Children of Israel were prepared for Jordan's crossing, [JOS:1:10-11]; [JOS:3:2].

2. The Reubenites, Gadites, and the half tribe of Manasseh were reminded of their pledge, [JOS:1:12-15]; [NUM:32:20-22].

3. These tribes subscribed the same loyalty to Joshua as to Moses, [JOS:1:16-18]; [ROM:13:1-5].

Notes

As we read the final chapter of Moses' life, the Bible gives us one more glimpse of the spiritual greatness of that man of God. Moses knew that Israel would soon go into the Promised Land and that he could not go with them. As a true shepherd of the people, Moses' last concern was that God would set a man over the congregation, "Which may go out before them, and which may go in before them, and which may lead them out, and which may bring them in; that the congregation of the LORD be not as sheep which have no shepherd" (Numbers 27:17). The thought of Israel wandering about with no one to lead and instruct them was more than Moses could bear.

God's Choice

To lead the Children of Israel and to conquer Canaan were both difficult tasks; therefore a man was needed to replace Moses, a man who knew God and who would follow His directions absolutely. There was such a man in the camp: Joshua had shown courage in the war with Amalek, humility as a ministering servant to Moses, and spiritual fidelity in opposing the evil report of the ten spies. Approximately forty years of teaching and training enabled Joshua to lead Israel after Moses' death. He was humble enough to do the lowliest service, yet had the heart and spirit to carry through great assignments. Therefore, when God's people needed a new leader, Joshua was God's choice.

Joshua's Appointment

As soon as God's will was made known, Moses placed Joshua before Eleazar the priest and the whole congregation of Israel. Moses placed his hands upon Joshua and gave him the commission to govern the people. The Lord said, "And thou shalt put some of thine honour upon him." Joshua already had the Spirit of God, and now some of Moses' honour and the honour of leading God's people was added. Moses publicly proclaimed Joshua as his successor, and the people recognised the appointment.

Joshua in Command

"Moses my servant is dead." Moses' death was a severe loss to Israel, but God, the Master of all creation and work, was not dead. He lives forever and takes note of His people's needs. When the Lord told Joshua to take Israel over Jordan, He did not want them to mourn forever. God's plan would not be terminated because of one man's death. There was still much work to do, and the Gospel must go onward until Jesus comes.

Good Success

God promised Joshua clear and continued success on one condition: "Only be thou strong and very courageous, that thou mayest observe to do according to all the law, which Moses my servant commanded thee" (Joshua 1:7). To have good success in the Christian life, we must believe and follow the whole Word of God. Joshua was told to meditate on the Book of the Law day and night. It is not enough to read the Word, hear it, or speak well of it; we must be doers of the Word. "Whoso looketh into the perfect law of liberty, and continueth therein, he being not a forgetful hearer, but a doer of the work, this man shall be blessed in his deed" (James 1:25).

A Winning Warfare

Joshua was called to take the offensive against his enemies, spiritually as well as physically. The Christian must take the offensive toward spiritual enemies: "Be strong in the Lord, and in the power of his might. Put on the whole armour of God" (Ephesians 6:10-11). "Resist the devil, and he will flee from you" (James 4:7). The better time to resist the devil is when he first comes, not after he has become established in our thoughts.

Type of Christ

Joshua is a wonderful type of Christ. Joshua served Moses before being promoted to the leadership of Israel, while Jesus "made himself of no reputation, and took upon him the form of a servant" (Philippians 2:7). The name Joshua means "He shall save." Joshua saved God's people from their enemies; Jesus saves His people from their sins. Jesus is the Captain of our salvation and will give us spiritual Canaan and the rest that Joshua could not give because of unbelief (Hebrews 4:1, 6, 8-9).

Questions

1. Why was Moses concerned about who should govern Israel after his death?
2. Name some of the things that fitted Joshua to be Israel's next governor.
3. How did the people feel about Joshua? Had he ever led them out before in battle?
4. God gave Joshua some very wonderful promises. Name several of them.
5. How was Joshua to be guided in this new phase of his life?
6. How soon after Joshua took command were the people ready for Jordan's crossing?
7. Which tribes of Israel were already settled in their possessions, and what did Joshua say to them?
8. What was their answer?`,
  full_lesson_yo: `Ekun rere Eko

Numeri 27:15-23; Deuteronomi 34:9; Joṣua 1:1-18

Lesson 152 - Senior

Memory Verse

“Emi kò ha paṣẹ fun ọ bi? Ṣe giri ki o si mu àiya le; máṣe bẹru, bẹẹni ki àiya ki o máṣe fò ọ: nitoripe OLUWA Ọlọrun rẹ wà pẹlu rẹ nibikibi ti iwọ ba nlọ” (Joṣua 1:9).

Cross References

I Igbega Joṣua si Ipo Alakoso

1. A kò yọnda fun Mose lati wọ Ilẹ Ileri, Numeri 27:15-17; Deuteronomi 31:14.

2. Ọlọrun paṣẹ fun Mose pe ki o yan Joṣua ni alakoso, Numeri 27:18-19; Deuteronomi 31:7, 23.

3. Ẹmi Ọlọrun ti o tayọ, ọgbọn ati ọlá ni a fi fun Joṣua, awọn Ọmọ Israẹli si gbà ohùn rẹ gbọ, Numeri 27:20-23; Deuteronomi 34:9; Iṣẹ Awọn Apọsteli 6:6; 1 Timoteu 4:14.

II Awọn Ileri Ọlọrun fun Joṣua

1. Lẹyin iku Mose, Oluwa paṣẹ fun Joṣua ki o mu awọn eniyan rekọja Jọrdani si Ilẹ Ileri, Joṣua 1:1-2.

2. Ọlọrun ṣeleri lati fi gbogbo ibi ti atẹlẹsẹ awọn Ọmọ Israẹli ba tẹ fun wọn, Joṣua 1:3-4; 14:9; Deuteronomi 11:24.

3. A ki Joṣua láyà pe ki o jẹ akọni ki o si ni igboya, Joṣua 1:5-6; Romu 8:31, 37; Heberu 13:5.

4. Ọna Joṣua gbogbo ni o n dara, o si n ṣe aṣeyọri bi o ti n pa Ofin Ọlọrun mọ ti o si n ṣe aṣaro ninu rẹ, Joṣua 1:7-9; Deuteronomi 29:9; Orin Dafidi 1:1-3.

III Imurasilẹ lati Rekọja Odo Jọrdani

1. Laaarin ọjọ mẹta lẹyin ti Joṣua ti gba gbogbo aṣẹ Ọlọrun, awọn Ọmọ Israẹli ti mura silẹ tan lati goke Jọrdani, Joṣua 1:10-11; 3:2.

2. A rán awọn ẹya Reubẹni, ati Gadi ati aabọ ẹya Manasse leti nipa ẹjẹ wọn, Joṣua 1:12-15; Numeri 32:20-22.

3. Awọn ẹya wọnyii si jẹ oloootọ si Joṣua gẹgẹ bi wọn ti ṣe si Mose, Joṣua 1:16-18; Romu 13:1-5.

Notes

ALAYE

Bi a ti n kà nipa igbẹyin igbesi ayé Mose, Iwe Mimọ tun fun ni ni anfaani lati mọ ohun kan si i nipa bi eniyan Ọlọrun yii ti jẹ alagbara to ninu ẹmi. Mose mọ pe awọn Ọmọ Israẹli kò ni pẹ de Ilẹ Ileri ati pe oun ki yoo ba wọn lọ. Gẹgẹ bi oluṣọ-agutan rere fun awọn eniyan naa, ohun ti o jẹ Mose lọkàn ju lọ ni pe ki Ọlọrun gbe ẹni kan dide fun ijọ eniyan, “Ti yio ma ṣaju wọn jade lọ, ti yio si ma ṣaju wọn wọle wá, ti yio si ma sin wọn lọ, ti yio si ma mú wọn bọ; ki ijọ enia OLUWA ki o máṣe dabi agutan ti kò li oluṣọ” (Numeri 27:17). Ọkàn Mose kò gba pe ki awọn Ọmọ Israẹli maa rin kiri lai si ẹni kan ti yoo ṣe aṣiwaju wọn, ti yoo si maa tọ wọn.

Ẹni ti Ọlọrun Yàn

Iṣẹ ti o ṣoro ni lati jẹ alakoso Israẹli ati lati ṣẹgun awọn ara Kenaani; nitori naa ẹni kan ni lati wà ti yoo rọpọ Mose, ẹni ti o mọ Ọlọrun ti yoo si maa tẹle itọni Rẹ kinnikinni. Iru ẹni bayii wà ni ibudo: Joṣua ti fi igboya rẹ hàn ni akoko ogun Amaleki, o fi iwa irẹlẹ rẹ hàn gẹgẹ bi iranṣẹ Mose, o si fi iwà otitọ rẹ hàn nigba ti o tako iroyin buburu awọn ami mẹwaa wọnni. Ẹkọ ati itọni fun nnkan bi ogoji ọdun jẹ iranwọ ti o fun Joṣua ni agbara lati le jẹ alakoso awọn Ọmọ Israẹli lẹyin iku Mose. O gba awọn oyẹ ti o ga ju lọ ni ile-ẹkọ iriri nitori o ni irẹlẹ to bẹẹ ti o le ṣe iṣẹ ti o rẹlẹ ju lọ, sibẹ o ni ọkàn ati ẹmi lati ṣe aṣeyọri awọn iṣẹ ribiribi. Nitori naa Joṣua ni ẹni ti Ọlọrun yàn.

Yíyan Joṣua

Gẹrẹ ti Mose mọ inu Ọlọrun nipa ọrọ naa, Mose bẹrẹ si ṣe ohun ti Ọlọrun sọ fun un. A mu Joṣua wa siwaju Eleasari alufaa ati gbogbo ijọ eniyan Israẹli. Nibẹ ni Mose gbe ọwọ rẹ le Joṣua ti o si fun un ni aṣẹ lati maa ṣe akoso awọn eniyan naa. Oluwa wi fun Mose pe, “Ki iwọ ki o si fi ninu ọlá rẹ si i lara.” Joṣua ti ni Ẹmi Ọlọrun tẹlẹ, ati nisisiyii, a fun un ni diẹ ninu ọlá Mose, ati ọlá lati jẹ alakoso awọn eniyan Ọlọrun. Mose fi Joṣua hàn ni gbangba bi ẹni ti yoo rọpo rẹ, awọn eniyan gbọ, wọn si fara mọ ẹni ti a yàn yii.

Joṣua di Alakoso

“Mose iranṣẹ mi kú.” Iku Mose ni lati dun awọn Ọmọ Israẹli pupọ. Ṣugbọn itunu yii wa fun ni pe bi a tilẹ mu awọn ti o jafáfá ninu Ijọ lọ sile, sibẹ Ọlọrun ṣi ni Olupilẹṣẹ ati Eleto iṣẹ Rẹ. Mose, iranṣẹ Oluwa le kú, ṣugbọn Ọlọrun, Ọba aṣẹda, ti O gbe iṣẹ Rẹ kalẹ, kò kú. O wa laaye titi lae, O si n kiyesi aini awọn eniyan Rẹ. Ọgbọn ọjọ ti wọn fi ṣọfọ fun Mose fẹrẹ dopin nigba ti Ọlọrun kọ si Joṣua ti O si wi fun un pe ki o kó awọn Ọmọ Israẹli la Jọrdani já. Ọlọrun kò fẹ ki awọn Ọmọ Israẹli ṣọfọ Mose titi aye. Iṣẹ pupọ ni o wà lati ṣe sibẹ. “Ẹniti nfi ẹkun rin lọ, ti o si gbé irugbin lọwọ, lõtọ, yio fi ayọ pada wá, yio si rù iti rẹ” (Orin Dafidi 126:6).

Aṣeyọri Rere

Nigba ti Ọlọrun paṣẹ fun awọn Ọmọ Israẹli lati tẹ siwaju, Ọlọrun ṣeleri fun Joṣua pe yoo ni iṣegun ti o daju nigba gbogbo, lori adehun kan ṣoṣo: “Sá ṣe giri ki o si mu àiya le gidigidi, ki iwọ ki o le kiyesi ati ṣe gẹgẹ bi gbogbo ofin ti Mose iranṣẹ mi ti palaṣẹ fun ọ” (Joṣua 1:7). Eyi ni ọna iyanu ti ẹnikẹni ti i ṣe ọmọ Ọlọrun le gbà ṣe aṣeyọri. A ni lati gba gbogbo Ọrọ Ọlọrun gbọ, ki a si maa tẹle E. A ni lati ṣe ohun gbogbo ti a kọ sinu Ọrọ Ọlọrun bi a ba fẹ ri ibukun gbà. “Ṣugbọn ẹniti o ba nwo inu ofin pipé, ofin ominira ni, ti o si duro ninu rẹ, ti on kò jẹ olugbọ ti ngbagbé; bikoṣe oluṣe iṣẹ, oluwarẹ yio jẹ alabukun ninu iṣẹ rẹ” (Jakọbu 1:25).

Ajaṣẹgun

Lati le ṣẹgun ẹgbẹ ọmọ-ogun ni lati doju ija kọ ọta; eyi ni Ọlọrun fẹ ki Joṣua ṣe, lati doju ija kọ ọta ẹmi rẹ. “Ẹ jẹ alagbara ninu Oluwa, ati ninu agbara ipá rẹ. Ẹ gbe gbogbo ihamọra Ọlọrun wọ” (Efesu 6:10, 11). “Ẹ kọ oju ija si Èṣu, on ó si sá kuro lọdọ nyin” (Jakọbu 4:7). Akoko ti o dara ju lọ lati kọ oju ija si eṣu ni igba ti o ba kọkọ fara hàn.

Apẹẹrẹ Kristi

A le ri agbayanu apẹẹrẹ Kristi ninu igbesi aye Joṣua. Joṣua ti fara mọ Mose gẹgẹ bi iranṣẹ rẹ fun ọjọ pipẹ ṣiwaju igba ti a gbe e ga si ipo alakoso Israẹli. Jesu Oluwa wa, “bọ ogo rẹ silẹ, o si mu awọ iranṣẹ” (Filippi 2:7). Joṣua jẹ olorukọ Olugbala wa. A tumọ “Joṣua” ni ede Heberu si “Jesu” ni ede Griki, eyi ti o tumọ si “Oun ni yoo gbala.” Joṣua gba awọn eniyan rẹ là kuro lọwọ awọn ọta wọn: Jesu gbà awọn eniyan Rẹ là kuro ninu ẹṣẹ wọn. Jesu ni Balogun igbala wa, yoo si fun wa ni Kenaani ti ẹmi, ati isinmi ti Joṣua kò le fun awọn Ọmọ Israẹli nitori aigbagbọ wọn (Heberu 4:1, 6, 8, 9).

AWỌN IBEERE

Ki ni ṣe ti Mose fi n ṣaniyan nipa ẹni ti yoo ṣe alakoso Israẹli lẹyin ikú rẹ?

Darukọ awọn nnkan diẹ ti o mu ki Joṣua yẹ ni alakoso Israẹli nipo Mose?

Ki ni ero awọn eniyan nipa Joṣua? O ha ti ṣe aṣiwaju wọn lọ si ogun ri?

Ọlọrun fun Joṣua ni awọn ileri iyanu pupọ. Darukọ pupọ ninu wọn.

Bawo ni a o ṣe maa dari Joṣua ninu iṣẹ ti o gbà yii?

Bawo ni o ti pẹ to ti Joṣua ti di alakoso Israẹli ki awọn eniyan wọnyii to mura tan lati ré odo Jọrdani kọja?

Awọn ẹya Israẹli wo ni ipin wọn ti tẹ lọwọ? Ki ni Joṣua si wi fun wọn?

Ki ni idahun wọn?`,
  image_url: '',
};

function parseLesson(raw: string | null): SundaySchoolLessonData {
  if (!raw) return DEFAULT_LESSON;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      if (
        !parsed.lesson_number ||
        parsed.date === 'SUNDAY, AUGUST 30, 2026' ||
        parsed.date === 'SUNDAY, SEPTEMBER 6, 2026' ||
        parsed.topic_en === 'THE PRICE HE MUST PAY'
      ) return DEFAULT_LESSON;
      return { ...DEFAULT_LESSON, ...parsed };
    }
  } catch {
    // Ignore malformed JSON and fall back to the default lesson data.
  }

  return DEFAULT_LESSON;
}

function FullLessonDialog({ title, triggerLabel, content }: { title: string; triggerLabel: string; content: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-serif">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary">{title}</DialogTitle>
        </DialogHeader>
        <div className="whitespace-pre-wrap text-base leading-8 text-foreground/90 font-serif">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
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
              <span>{isLoading ? 'Loading...' : `${lesson.date} · ${lesson.lesson_number}`}</span>
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
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{lesson.reference}</p>
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

                <FullLessonDialog
                  title={lesson.topic_en}
                  triggerLabel="Read More"
                  content={lesson.full_lesson_en}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-church-red font-serif text-sm uppercase tracking-[0.18em] mb-5">
                <BookOpenText className="h-4 w-4" />
                Yoruba
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{lesson.reference_yo}</p>
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

                <FullLessonDialog
                  title={lesson.topic_yo}
                  triggerLabel="Kà síi"
                  content={lesson.full_lesson_yo}
                />
              </div>
            </div>
          </div>
          {lesson.image_url && (
            <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              <img src={lesson.image_url} alt={`${lesson.topic_en} lesson graphic`} className="max-h-[28rem] w-full object-cover" />
            </div>
          )}
          <ShareActions
            className="mt-8"
            title={`Sunday School: ${lesson.topic_en}`}
            text={`${lesson.lesson_number}\n${lesson.reference}\n\nMemory Verse: ${lesson.memory_verse_en}\n\nYoruba: ${lesson.topic_yo}\n${lesson.reference_yo}\n\n${lesson.memory_verse_yo}`}
          />
        </div>
      </div>
    </section>
  );
}
