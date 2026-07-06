import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSlider } from '@/components/home/HeroSlider';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { VisionMissionCards } from '@/components/home/VisionMissionCards';
import { UpcomingEvents } from '@/components/home/UpcomingEvents';
import { QuickLinks } from '@/components/home/QuickLinks';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        <QuickLinks />
        <WelcomeSection />
        <VisionMissionCards />
        <UpcomingEvents />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
