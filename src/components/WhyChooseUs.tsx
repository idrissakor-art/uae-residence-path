import { FileCheck, Lock, Shield, Users } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';

const WhyChooseUs = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className="py-16 bg-muted/30 border-b">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 ${isRTL ? 'rtl' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('whyChooseUs.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('whyChooseUs.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <FileCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {t('whyChooseUs.features.cases.title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('whyChooseUs.features.cases.description')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {t('whyChooseUs.features.secure.title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('whyChooseUs.features.secure.description')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {t('whyChooseUs.features.guarantee.title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('whyChooseUs.features.guarantee.description')}
            </p>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">
            ✅ {t('whyChooseUs.guaranteeBanner')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;