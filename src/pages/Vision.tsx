import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { CMSText } from '@/components/shared/CMSText';
import { Eye } from 'lucide-react';

const Vision = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Our Vision"
          subtitle="The God-given direction that guides Christ Foundation Gospel Church"
        />

        <section className="py-14 md:py-24 bg-card">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <Eye className="w-8 h-8 text-primary" />
            </div>

            <div className="scripture-quote text-left mb-10">
              <p className="font-serif text-foreground/80 italic text-lg">
                "Where there is no vision, the people perish: but he that keepeth the law, happy is he."
              </p>
              <cite className="block mt-2 text-accent font-serif text-sm not-italic font-semibold">
                — Proverbs 29:18
              </cite>
            </div>

            <div className="bg-secondary/60 rounded-2xl p-8 md:p-12 border border-border shadow-card">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-6">
                Our Vision
              </h2>
              <div className="text-xl md:text-2xl font-display font-semibold text-foreground/90 leading-relaxed">
                <CMSText contentKey="vision_text" multiParagraph={false} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Vision;
