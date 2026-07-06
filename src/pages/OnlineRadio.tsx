import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Radio } from 'lucide-react';

const OnlineRadio = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Online Radio"
          subtitle="Listen to gospel music, sermons, and worship 24 hours a day"
        />

        <section className="py-20 md:py-32 bg-card">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 shadow-blue">
              <Radio className="w-12 h-12 text-primary" />
            </div>

            <div className="h-1 w-24 bg-gradient-gold mx-auto mb-8" />

            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
              CFGC Online Radio
            </h2>
            <p className="font-serif text-foreground/70 text-lg mb-3 leading-relaxed">
              Our online radio stream is coming soon.
            </p>
            <p className="font-serif text-muted-foreground text-sm leading-relaxed mb-8">
              We are working to bring you 24/7 gospel music, powerful sermons, and uplifting worship. Please check back soon.
            </p>

            <div className="scripture-quote text-left">
              <p className="font-serif text-foreground/80 italic">
                "Speaking to yourselves in psalms and hymns and spiritual songs, singing and making melody in your heart to the Lord."
              </p>
              <cite className="block mt-2 text-accent font-serif text-sm not-italic font-semibold">
                — Ephesians 5:19
              </cite>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OnlineRadio;
