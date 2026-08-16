import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LiveNowBanner } from '@/components/home/LiveNowBanner';
import { HeroSlider } from '@/components/home/HeroSlider';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { VisionMissionCards } from '@/components/home/VisionMissionCards';
import { UpcomingEvents } from '@/components/home/UpcomingEvents';
import { QuickLinks } from '@/components/home/QuickLinks';

interface HomeSection {
  id: string;
  section_key: string;
  label: string;
  display_order: number;
  is_visible: boolean;
}

const SECTION_MAP: Record<string, React.ComponentType> = {
  hero_slider: HeroSlider,
  quick_links: QuickLinks,
  welcome: WelcomeSection,
  vision_mission: VisionMissionCards,
  events: UpcomingEvents,
};

const Index = () => {
  const { data: sections } = useQuery({
    queryKey: ['home_sections'],
    queryFn: async () => {
      const { data } = await supabase
        .from('home_sections')
        .select('*')
        .eq('is_visible', true)
        .order('display_order');
      return (data ?? []) as HomeSection[];
    },
  });

  // Fallback to default order if DB not loaded yet
  const visibleSections = sections ?? [
    { id: '1', section_key: 'hero_slider', label: 'Hero Slider', display_order: 1, is_visible: true },
    { id: '2', section_key: 'quick_links', label: 'Quick Links', display_order: 2, is_visible: true },
    { id: '3', section_key: 'welcome', label: 'Welcome', display_order: 3, is_visible: true },
    { id: '4', section_key: 'vision_mission', label: 'Vision & Mission', display_order: 4, is_visible: true },
    { id: '5', section_key: 'events', label: 'Events', display_order: 5, is_visible: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <LiveNowBanner />
      <main className="flex-1">
        {visibleSections.map(section => {
          const Component = SECTION_MAP[section.section_key];
          if (!Component) return null;
          return <Component key={section.id} />;
        })}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
