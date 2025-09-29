import { CheckCircle, Shield } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';

const WhyChooseUs = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className={`max-w-6xl mx-auto ${isRTL ? 'rtl' : ''}`}>
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {t('whyChooseUs.title')}
          </h2>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {t('whyChooseUs.residence.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whyChooseUs.residence.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {t('whyChooseUs.golden.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whyChooseUs.golden.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {t('whyChooseUs.support.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whyChooseUs.support.description')}
              </p>
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
            <p className="text-success-foreground font-medium">
              {t('whyChooseUs.guarantee')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;