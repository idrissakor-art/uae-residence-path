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
          {/* Main Headline - Split into 2 lines */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <div className="text-white">
              {t('hero.title.line1')}
            </div>
            <div className="text-white/80 font-medium">
              {t('hero.title.line2')}
            </div>
          </h1>

          {/* Subtitle - Shorter and punchy */}
          <h2 className="text-xl md:text-2xl mb-4 text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </h2>

          {/* Benefits - In translucent container */}
          <div className="mt-4 mb-10">
            <div className="bg-white/14 backdrop-blur-sm rounded-lg shadow-lg py-3 px-5 inline-block">
              <div className="flex flex-wrap justify-center items-center gap-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm md:text-base">{t('hero.benefits.residence2')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm md:text-base">{t('hero.benefits.golden10')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm md:text-base">{t('hero.benefits.support')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center">
            <Button variant="premium" size="hero" className="shadow-luxury">
              {t('hero.cta')}
            </Button>
          </div>

          {/* Trust Indicators - 4 pillars including guarantee */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center text-white/70">
              <Users className="w-5 h-5 mx-auto mb-2" />
              <div className="text-sm font-medium">{t('hero.trust.cases')}</div>
            </div>
            <div className="text-center text-white/70">
              <Globe className="w-5 h-5 mx-auto mb-2" />
              <div className="text-sm font-medium">{t('hero.trust.multilingual')}</div>
            </div>
            <div className="text-center text-white/70">
              <Shield className="w-5 h-5 mx-auto mb-2" />
              <div className="text-sm font-medium">{t('hero.trust.secure')}</div>
            </div>
            <div className="text-center text-white/70">
              <Shield className="w-5 h-5 mx-auto mb-2 text-accent" />
              <div className="text-sm font-medium">{t('hero.trust.guarantee.title')}</div>
              <div className="text-xs text-white/60 mt-1">{t('hero.trust.guarantee.subtitle')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;