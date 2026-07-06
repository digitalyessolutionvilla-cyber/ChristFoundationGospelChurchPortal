import { MapPin, Phone } from 'lucide-react';
import type { Branch } from '@/lib/locations';

interface LocationCardProps {
  branch: Branch;
}

export function LocationCard({ branch }: LocationCardProps) {
  return (
    <div className="bg-card rounded-lg p-5 shadow-card border border-border hover:shadow-blue hover:border-primary/30 transition-all duration-200">
      <h3 className="font-display font-semibold text-primary text-base leading-snug mb-3">
        {branch.name}
        {branch.isHq && (
          <span className="ml-2 text-xs font-sans font-medium bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
            HQ
          </span>
        )}
      </h3>
      <div className="space-y-2">
        <div className="flex gap-2.5">
          <MapPin className="w-4 h-4 text-church-red mt-0.5 shrink-0" />
          <div className="text-sm text-foreground/80 font-serif leading-snug">
            <p>{branch.address}</p>
            {branch.poBox && <p className="text-muted-foreground text-xs mt-1">{branch.poBox}</p>}
          </div>
        </div>
        {branch.phones.length > 0 && (
          <div className="flex gap-2.5">
            <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="text-sm font-serif">
              {branch.phones.map((phone, i) => (
                <a
                  key={i}
                  href={`tel:${phone}`}
                  className="block text-primary hover:text-church-gold-dark transition-colors"
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
