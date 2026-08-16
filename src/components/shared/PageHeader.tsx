import { ReactNode } from 'react';
import { Cross } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-hero overflow-hidden">
      {/* Decorative cross watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Cross className="w-96 h-96 text-primary-foreground" />
      </div>

      {/* Gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-gold" />

      <div className="container relative z-10 text-center">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3 drop-shadow-sm">
          {title}
        </h1>
        {subtitle && (
          <p className="text-primary-foreground/80 font-serif text-base md:text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
