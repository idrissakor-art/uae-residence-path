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
          <h2 className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </h2>

          {/* CTA Buttons */}
          <div className="flex justify-center">
            <Button variant="premium" size="hero" className="shadow-luxury">
              {t('hero.cta')}
            </Button>
          </div>

          {/* Trust Indicators - 3 pillars */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;