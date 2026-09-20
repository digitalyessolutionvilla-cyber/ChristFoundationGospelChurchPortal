import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { CMSText } from '@/components/shared/CMSText';
import { RegistrationDialog } from '@/components/shared/RegistrationDialog';
import { Users, BookOpen, Heart, Music, CalendarDays, Clock3, MapPin, Phone, ExternalLink } from 'lucide-react';

const activities = [
  { icon: BookOpen, label: 'Bible Study & Prayer Meetings' },
  { icon: Users, label: 'Weekly Youth Fellowships' },
  { icon: Music, label: 'Youth Choir & Music Ministry' },
  { icon: Heart, label: 'Community Service Projects' },
];

const rallyFeatures = ['Word Exposition', 'Symposia', 'Prevailing Prayer', 'Teens Presentations', 'Youth Concert', 'Drama', 'Entrepreneurial Workshop'];

const YouthMinistry = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Youth Ministry"
          subtitle="Raising a generation rooted in the Word of God and filled with the Holy Spirit"
        />

        <section className="py-14 md:py-20 bg-card">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-10">
              <div className="scripture-quote mb-8">
                <p className="font-serif text-foreground/80 italic">
                  "Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity."
                </p>
                <cite className="block mt-2 text-accent font-serif text-sm not-italic font-semibold">
                  — 1 Timothy 4:12
                </cite>
              </div>

              <CMSText contentKey="youth_ministry_text" className="text-foreground/85 font-serif" />
            </div>

            <div className="mb-12 overflow-hidden rounded-3xl border border-border bg-muted shadow-card">
              <img
                src="/youth-rally-2026.png"
                alt="2026 National Youth Rally flyer: Fight the Good Fight of Faith"
                className="mx-auto block h-auto max-h-[52rem] w-full object-contain"
              />
            </div>

            <section className="mb-12 overflow-hidden rounded-3xl border border-primary/20 bg-primary text-primary-foreground shadow-blue">
              <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative flex min-h-[28rem] flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_70%_20%,hsl(35_96%_54%/.9),transparent_34%),linear-gradient(145deg,hsl(224_65%_15%),hsl(0_76%_42%))] p-7 md:p-9">
                  <div className="absolute -right-16 top-16 h-64 w-64 rotate-12 border-[28px] border-white/10" />
                  <div className="relative">
                    <p className="font-serif text-xs uppercase tracking-[0.28em] text-accent">The Covenant Youths Present</p>
                    <p className="mt-8 font-display text-5xl font-black uppercase leading-[0.86] tracking-tight text-white sm:text-6xl">Fight the<br />Good Fight<br /><span className="text-accent">of Faith</span></p>
                    <p className="mt-5 font-serif text-lg text-white/90">1 Timothy 6:12</p>
                  </div>
                  <div className="relative border-t border-white/25 pt-5 font-serif text-sm text-white/80">
                    <p className="font-semibold uppercase tracking-[0.2em] text-white">2026 National Youth Rally</p>
                    <p className="mt-2">Come, be blessed and empowered.</p>
                  </div>
                </div>

                <div className="bg-card p-7 text-foreground md:p-9">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-church-red">Youth Programme</p>
                      <h2 className="mt-2 font-display text-2xl font-bold text-primary">2026 National Youth Rally</h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-church-red px-3 py-1 text-xs font-semibold text-white">Featured</span>
                  </div>

                  <p className="mb-6 font-serif text-sm leading-7 text-muted-foreground">
                    A three-day gathering to inspire, equip and empower young people through the Word of God, prayer, fellowship and practical activities.
                  </p>

                  <div className="grid gap-4 border-y border-border py-5 font-serif text-sm">
                    <div className="flex gap-3"><CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-church-red" /><span><strong>Date</strong><br />Thursday, 29th – Saturday, 31st October 2026</span></div>
                    <div className="flex gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-church-red" /><span><strong>Time</strong><br />9:00 AM Daily</span></div>
                    <div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-church-red" /><span><strong>Venue</strong><br />5–13 Tijani Ayoola Street, Iroko Town via Ajegunle B/Stop, Sango-Ota, Ogun State.</span></div>
                  </div>

                  <div className="mt-6">
                    <p className="mb-3 font-display font-semibold text-primary">Featuring</p>
                    <div className="flex flex-wrap gap-2">
                      {rallyFeatures.map(feature => <span key={feature} className="rounded-full border border-primary/15 bg-secondary px-3 py-1.5 text-xs font-serif text-foreground/80">{feature}</span>)}
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-border pt-5 font-serif text-sm">
                    <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-church-red" />+234 703 974 9785</span>
                    <span>+234 703 333 75418</span>
                  </div>
                  <a href="/news" className="mt-6 inline-flex items-center gap-2 font-serif text-sm font-semibold text-primary hover:text-church-red">
                    Read full announcement <ExternalLink className="h-4 w-4" />
                  </a>
                  <RegistrationDialog className="mt-4 w-full sm:w-auto" />
                </div>
              </div>
            </section>

            {/* Activities grid */}
            <div>
              <h3 className="font-display text-xl font-bold text-primary mb-5">Our Activities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activities.map(({ icon: Icon, label }) => (
                  <div key={label} className="bg-secondary/60 rounded-xl p-5 border border-border text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-serif text-foreground/80 font-medium leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default YouthMinistry;
