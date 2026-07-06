import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { LocationCard } from '@/components/shared/LocationCard';
import { headquarters, nationalCampGround, districts } from '@/lib/locations';
import { MapPin } from 'lucide-react';

const Locations = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Our Church Locations"
          subtitle="Find a CFGC branch closest to you — serving communities across Nigeria"
        />

        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Headquarters & National Camp Ground */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-5 h-5 text-church-red" />
              <h2 className="font-display text-xl font-bold text-primary">
                Headquarters & National Camp Ground
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LocationCard branch={headquarters} />
              <LocationCard branch={nationalCampGround} />
            </div>
          </div>

          {/* Districts */}
          {districts.map((district) => (
            <div key={district.name}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-border" />
                <h2 className="font-display text-lg font-bold text-primary whitespace-nowrap">
                  {district.name}
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {district.branches.map((branch) => (
                  <LocationCard key={branch.name} branch={branch} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Locations;
