import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fallbackSlides = [
  {
    title: '"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."',
    subtitle: 'John 3:16',
    cta_text: 'Learn More',
    cta_url: '/about',
    image_url: '',
  },
  {
    title: '"Christ, the Sure Foundation"',
    subtitle: '1 Corinthians 3:11 — Our Motto',
    cta_text: 'Our Vision',
    cta_url: '/vision',
    image_url: '',
  },
  {
    title: '"Thy word is a lamp unto my feet, and a light unto my path."',
    subtitle: 'Psalm 119:105',
    cta_text: 'Watch Us Live',
    cta_url: '/watch-live',
    image_url: '',
  },
];

const gradients = [
  'from-[hsl(224,65%,18%)] to-[hsl(224,71%,30%)]',
  'from-[hsl(224,65%,15%)] to-[hsl(210,60%,32%)]',
  'from-[hsl(220,65%,16%)] to-[hsl(224,60%,28%)]',
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const { data: dbSlides } = useQuery({
    queryKey: ['home_slider'],
    queryFn: async () => {
      const { data } = await supabase.from('home_slider_items').select('*').eq('is_active', true).order('display_order');
      return data ?? [];
    },
  });

  const slides = dbSlides && dbSlides.length > 0 ? dbSlides : fallbackSlides;

  const go = useCallback((dir: 1 | -1) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => (c + dir + slides.length) % slides.length);
      setAnimating(false);
    }, 250);
  }, [animating, slides.length]);

  useEffect(() => {
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [go]);

  const slide = slides[current] as Record<string, string>;
  const gradient = gradients[current % gradients.length];

  return (
    <section
      className={`relative min-h-[480px] md:min-h-[560px] flex flex-col items-center justify-center bg-gradient-to-br ${gradient} overflow-hidden transition-all duration-700`}
      style={slide.image_url ? { backgroundImage: `url(${slide.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {/* Overlay when background image */}
      {slide.image_url && <div className="absolute inset-0 bg-black/55" />}

      {/* Cross pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cross-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <line x1="30" y1="10" x2="30" y2="50" stroke="white" strokeWidth="2" />
              <line x1="10" y1="30" x2="50" y2="30" stroke="white" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cross-pattern)" />
        </svg>
      </div>

      {/* Logo watermark */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 hidden md:block pointer-events-none">
        <img
          src="https://cdn.enter.pro/resources/uid_100066245/29b71ed7-ea27-47.png"
          alt=""
          className="w-64 h-64"
          crossOrigin="anonymous"
        />
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center px-6 md:px-16 max-w-3xl mx-auto transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100 animate-fade-slide-in'}`}>
        {/* Gold decorative line */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-gradient-gold" />
          <div className="w-2 h-2 rounded-full bg-accent" />
          <div className="h-px w-12 bg-gradient-gold" />
        </div>

        <blockquote className="font-display text-2xl md:text-4xl text-primary-foreground font-medium leading-relaxed italic mb-4">
          {slide.title || slide.verse}
        </blockquote>
        <cite className="block text-accent font-serif text-base md:text-lg not-italic mb-8">
          — {slide.subtitle || slide.reference}
        </cite>

        {(slide.cta_text || slide.cta?.label) && (
          <Link
            to={slide.cta_url || slide.cta?.to || '/'}
            className="inline-block bg-gradient-gold text-accent-foreground font-serif font-semibold px-7 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-gold"
          >
            {slide.cta_text || slide.cta?.label}
          </Link>
        )}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary-foreground/10 hover:bg-primary-foreground/25 text-primary-foreground rounded-full p-2 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary-foreground/10 hover:bg-primary-foreground/25 text-primary-foreground rounded-full p-2 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-2.5 bg-accent' : 'w-2.5 h-2.5 bg-primary-foreground/40'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom gold border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-gold" />
    </section>
  );
}
