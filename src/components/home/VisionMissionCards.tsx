import { Link } from 'react-router-dom';
import { CMSText } from '@/components/shared/CMSText';
import { Eye, Target, BookOpen } from 'lucide-react';

const cards = [
  {
    icon: Eye,
    title: 'Our Vision',
    key: 'vision_text',
    to: '/vision',
    color: 'text-primary',
    bg: 'bg-secondary',
    border: 'border-primary/20',
  },
  {
    icon: Target,
    title: 'Our Mission',
    key: 'mission_text',
    to: '/mission',
    color: 'text-church-red',
    bg: 'bg-church-red/5',
    border: 'border-church-red/20',
  },
  {
    icon: BookOpen,
    title: 'Our Motto',
    key: 'motto_text',
    to: '/about',
    color: 'text-church-gold-dark',
    bg: 'bg-accent/10',
    border: 'border-accent/30',
  },
];

export function VisionMissionCards() {
  return (
    <section className="py-14 md:py-20 bg-gradient-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-church-red font-serif text-sm uppercase tracking-widest mb-2 font-semibold">
            Our Identity
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
            What We Stand For
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map(({ icon: Icon, title, key, to, color, bg, border }) => (
            <Link
              key={key}
              to={to}
              className={`group rounded-2xl ${bg} border ${border} p-7 shadow-card hover:shadow-blue transition-all duration-200 hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4 shadow-sm`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className={`font-display font-bold text-xl mb-3 ${color}`}>{title}</h3>
              <CMSText
                contentKey={key}
                className={`text-sm font-serif text-foreground/80 line-clamp-4`}
                multiParagraph={false}
              />
              <p className={`mt-4 text-xs font-serif ${color} font-semibold opacity-0 group-hover:opacity-100 transition-opacity`}>
                Read more →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
