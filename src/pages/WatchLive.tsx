import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tv } from 'lucide-react';

const WatchLive = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Watch Us Live"
          subtitle="Join our services from anywhere in the world"
        />

        <section className="py-20 md:py-32 bg-card">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <div className="w-24 h-24 rounded-full bg-church-red/10 flex items-center justify-center mx-auto mb-8">
              <Tv className="w-12 h-12 text-church-red" />
            </div>

            <div className="h-1 w-24 bg-gradient-gold mx-auto mb-8" />

            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
              Live Stream Coming Soon
            </h2>
            <p className="font-serif text-foreground/70 text-lg mb-3 leading-relaxed">
              We are preparing to bring our services to you online.
            </p>
            <p className="font-serif text-muted-foreground text-sm leading-relaxed mb-8">
              Soon you will be able to watch our Sunday services, camp meetings, and special programs live from wherever you are. Check our social media for updates.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-primary text-primary-foreground font-serif font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Follow on Facebook
              </a>
              <a
                href="https://twitter.com/cfgcglobal"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-secondary text-secondary-foreground font-serif font-semibold px-6 py-3 rounded-lg hover:bg-secondary/80 transition-colors border border-border"
              >
                Follow @cfgcglobal
              </a>
            </div>

            <div className="scripture-quote text-left">
              <p className="font-serif text-foreground/80 italic">
                "Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another: and so much the more, as ye see the day approaching."
              </p>
              <cite className="block mt-2 text-accent font-serif text-sm not-italic font-semibold">
                — Hebrews 10:25
              </cite>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WatchLive;
