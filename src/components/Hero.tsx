import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useRef, useState } from "react";
import heroImage from "@/assets/dubai-hero.jpg";

const AnimatedCounter = ({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-accent">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};

const Hero = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const scrollToSimulator = () => {
    const el = document.getElementById('simulator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden" aria-label="Golden Visa UAE - Présentation">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        role="img"
        aria-label="Skyline de Dubai - Golden Visa Dubai investissement immobilier Visa Or UAE"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        <div className="hero-pattern absolute inset-0" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className={`max-w-4xl mx-auto text-center text-white ${isRTL ? 'rtl' : ''}`}>
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" id="hero-title">
            Obtenez votre <span className="text-accent">Golden Visa Dubai</span> en 10 ans
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>≥ AED 2M → Golden Visa 10 ans</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>12 catégories éligibles</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Accompagnement complet</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center space-y-4 mb-12">
            <Button 
              variant="premium" 
              size="hero" 
              className="shadow-luxury"
              onClick={scrollToSimulator}
            >
              {t('hero.cta')}
            </Button>
            
            {/* Elegant Guarantee Badge */}
            <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 max-w-md">
              <div className="flex items-center space-x-2 text-white/90">
                <span className="text-orange-400">🛡️</span>
                <span className="text-sm font-medium">
                  Garantie satisfait ou remboursé - Remboursement intégral en cas de refus de visa
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <AnimatedCounter target={1000} prefix="+" />
                <p className="text-white/70 text-sm mt-1">Dossiers traités</p>
              </div>
              <div className="text-center md:border-x md:border-white/10">
                <AnimatedCounter target={98} suffix="%" />
                <p className="text-white/70 text-sm mt-1">De satisfaction</p>
              </div>
              <div className="text-center">
                <AnimatedCounter target={48} suffix="h" />
                <p className="text-white/70 text-sm mt-1">De traitement</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
