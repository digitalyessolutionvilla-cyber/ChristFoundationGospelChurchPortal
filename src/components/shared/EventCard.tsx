import { Calendar, MapPin, Clock } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  is_featured: boolean;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const date = parseISO(event.event_date);
  const past = isPast(date);

  return (
    <div className={`bg-card rounded-xl border transition-all duration-200 overflow-hidden ${
      past
        ? 'border-border opacity-80'
        : 'border-primary/20 shadow-card hover:shadow-blue hover:border-primary/40'
    }`}>
      {/* Color strip */}
      <div className={`h-1.5 w-full ${past ? 'bg-muted' : 'bg-gradient-gold'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-semibold text-foreground text-base leading-snug">
            {event.title}
          </h3>
          {event.is_featured && !past && (
            <Badge className="shrink-0 bg-church-red text-primary-foreground text-xs">
              Featured
            </Badge>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-muted-foreground font-serif leading-relaxed mb-4 line-clamp-3">
            {event.description}
          </p>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span className={`font-serif ${past ? 'text-muted-foreground' : 'text-foreground'}`}>
              {format(date, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-church-red shrink-0" />
              <span className="font-serif text-muted-foreground">{event.location}</span>
            </div>
          )}
          {!past && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-church-gold-dark shrink-0" />
              <span className="font-serif text-church-gold-dark font-medium">Upcoming</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
