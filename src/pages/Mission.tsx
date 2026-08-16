import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { CMSText } from '@/components/shared/CMSText';
import { Target } from 'lucide-react';

const Mission = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Our Mission"
          subtitle="Preaching Christ as the Sure Foundation for victorious Christian Living"
        />

        <section className="py-14 md:py-24 bg-card">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="w-16 h-16 rounded-full bg-church-red/10 flex items-center justify-center mx-auto mb-8">
              <Target className="w-8 h-8 text-church-red" />
            </div>

            <div className="scripture-quote text-left mb-10">
              <p className="font-serif text-foreground/80 italic text-lg">
                "For other foundation can no man lay than that is laid, which is Jesus Christ."
              </p>
              <cite className="block mt-2 text-accent font-serif text-sm not-italic font-semibold">
                — 1 Corinthians 3:11
              </cite>
            </div>

            <div className="bg-church-red/5 rounded-2xl p-8 md:p-12 border border-church-red/20 shadow-card">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-church-red mb-6">
                Our Mission
              </h2>
              <div className="text-xl md:text-2xl font-display font-semibold text-foreground/90 leading-relaxed">
                <CMSText contentKey="mission_text" multiParagraph={false} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Mission;
