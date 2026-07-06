import { Link } from 'react-router-dom';
import { Radio, Tv, MapPin, Users } from 'lucide-react';

const links = [
  {
    icon: Radio,
    label: 'Online Radio',
    desc: '24/7 gospel music & preaching',
    to: '/online-radio',
    color: 'text-church-red',
    bg: 'bg-church-red/10',
  },
  {
    icon: Tv,
    label: 'Watch Us Live',
    desc: 'Stream our services online',
    to: '/watch-live',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: MapPin,
    label: 'Our Locations',
    desc: 'Find a branch near you',
    to: '/locations',
    color: 'text-church-gold-dark',
    bg: 'bg-accent/15',
  },
  {
    icon: Users,
    label: 'Youth Ministry',
    desc: 'For the next generation',
    to: '/youth-ministry',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

export function QuickLinks() {
  return (
    <section className="py-10 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {links.map(({ icon: Icon, label, desc, to, color, bg }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col items-center text-center rounded-xl p-5 bg-primary-foreground/5 hover:bg-primary-foreground/15 border border-primary-foreground/10 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <p className="font-display font-semibold text-primary-foreground text-sm mb-1">
                {label}
              </p>
              <p className="text-primary-foreground/60 text-xs font-serif leading-snug">
                {desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
