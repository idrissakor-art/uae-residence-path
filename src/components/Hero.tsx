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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      <div className="container relative z-10 mx-auto px-4 py-20">
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
            <Button variant="premium" size="hero" className="shadow-luxury">
              {t('hero.cta')}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/70">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{t('hero.trust.cases')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>{t('hero.trust.multilingual')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>{t('hero.trust.secure')}</span>
            </div>
          </div>

          {/* Money-back Guarantee */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-3 text-white">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">{t('hero.guarantee')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;