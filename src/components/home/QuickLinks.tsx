import { Link } from 'react-router-dom';
import { Radio, Tv, MapPin, Users } from 'lucide-react';

const links = [
  {
    icon: Radio,
    label: 'Online Radio',
    desc: '24/7 gospel music & preaching',
    to: '/online-radio',
    color: 'text-red-400',
    bg: 'bg-red-400/25',
  },
  {
    icon: Tv,
    label: 'Watch Us Live',
    desc: 'Stream our services online',
    to: '/watch-live',
    color: 'text-white',
    bg: 'bg-white/20',
  },
  {
    icon: MapPin,
    label: 'Our Locations',
    desc: 'Find a branch near you',
    to: '/locations',
    color: 'text-amber-400',
    bg: 'bg-amber-400/25',
  },
  {
    icon: Users,
    label: 'Youth Ministry',
    desc: 'For the next generation',
    to: '/youth-ministry',
    color: 'text-sky-300',
    bg: 'bg-sky-300/20',
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
              className="group flex flex-col items-center text-center rounded-xl p-5 bg-white/5 hover:bg-white/15 border border-white/15 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <p className="font-display font-semibold text-white text-sm mb-1">
                {label}
              </p>
              <p className="text-white/60 text-xs font-serif leading-snug">
                {desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

