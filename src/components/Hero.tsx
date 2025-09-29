import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Users, Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import heroImage from "@/assets/dubai-hero.jpg";

const Hero = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className="relative min-h-[60vh] md:min-h-[65vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
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

      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className={`max-w-4xl mx-auto text-center text-white ${isRTL ? 'rtl' : ''}`}>
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title').split(' ').map((word, index, array) => {
              // Highlight key terms in each language
              const highlightWords = {
                fr: ['résidence', 'EAU'],
                en: ['residency', 'UAE'],
                ar: ['إقامتك', 'الإمارات']
              };
              
              const currentLang = t('header.brand').includes('UAE') ? 'fr' : 
                               t('header.brand').includes('UAE') ? 'en' : 'ar';
              
              const shouldHighlight = word.includes('résidence') || word.includes('EAU') ||
                                    word.includes('residency') || word.includes('UAE') ||
                                    word.includes('إقامتك') || word.includes('الإمارات');
              
              return shouldHighlight ? (
                <span key={index} className="text-accent">{word} </span>
              ) : (
                <span key={index}>{word} </span>
              );
            })}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>{t('hero.benefits.residence2')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>{t('hero.benefits.golden10')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>{t('hero.benefits.support')}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center">
            <div className="relative">
              <Button variant="premium" size="hero" className="shadow-luxury">
                {t('hero.cta')}
              </Button>
              
              {/* Discrete Guarantee Badge */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs text-white/90 flex items-center space-x-1">
                  <span>🛡️ Garantie satisfait ou remboursé - Remboursement intégral en cas de refus de visa</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;