import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { CMSText } from '@/components/shared/CMSText';
import { BookOpen, Scroll } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="About CFGC"
          subtitle="Rooted in faith since 1969 — serving God's people across Nigeria and beyond"
        />

        {/* Brief History */}
        <section id="history" className="py-14 md:py-20 bg-card">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Scroll className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-church-red font-serif text-xs uppercase tracking-widest font-semibold">
                  Our Story
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">
                  Brief History of the Church
                </h2>
              </div>
            </div>
            <div className="h-0.5 w-full bg-gradient-gold mb-8 opacity-50" />
            <CMSText contentKey="history_text" className="text-foreground/85 font-serif" />
          </div>
        </section>

        {/* Doctrines and Beliefs */}
        <section id="doctrines" className="py-14 md:py-20 bg-gradient-section">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-church-red/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-church-red" />
              </div>
              <div>
                <p className="text-church-red font-serif text-xs uppercase tracking-widest font-semibold">
                  Our Beliefs
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">
                  Doctrines and Beliefs
                </h2>
              </div>
            </div>
            <div className="h-0.5 w-full bg-gradient-gold mb-8 opacity-50" />
            <div className="bg-card rounded-2xl p-6 md:p-10 shadow-card border border-border">
              <CMSText contentKey="doctrines_text" className="text-foreground/85 font-serif" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
