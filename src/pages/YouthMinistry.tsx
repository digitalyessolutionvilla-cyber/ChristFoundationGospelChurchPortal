import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { CMSText } from '@/components/shared/CMSText';
import { Users, BookOpen, Heart, Music } from 'lucide-react';

const activities = [
  { icon: BookOpen, label: 'Bible Study & Prayer Meetings' },
  { icon: Users, label: 'Weekly Youth Fellowships' },
  { icon: Music, label: 'Youth Choir & Music Ministry' },
  { icon: Heart, label: 'Community Service Projects' },
];

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
