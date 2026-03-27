import { FileCheck, Lock, Shield } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect, useRef, useState } from "react";

const AnimatedNumber = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
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

  return <span ref={ref}>+{count.toLocaleString()}</span>;
};

const WhyChooseUs = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const features = [
    {
      icon: <FileCheck className="w-8 h-8 text-primary-foreground" />,
      bgGradient: "bg-gradient-to-br from-primary to-primary/80",
      titleKey: 'whyChooseUs.features.cases.title',
      descKey: 'whyChooseUs.features.cases.description',
      hasCounter: true,
    },
    {
      icon: <Lock className="w-8 h-8 text-primary-foreground" />,
      bgGradient: "bg-gradient-to-br from-success to-success/80",
      titleKey: 'whyChooseUs.features.secure.title',
      descKey: 'whyChooseUs.features.secure.description',
      hasCounter: false,
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-foreground" />,
      bgGradient: "bg-gradient-to-br from-accent to-accent/80",
      titleKey: 'whyChooseUs.features.guarantee.title',
      descKey: 'whyChooseUs.features.guarantee.description',
      hasCounter: false,
    },
  ];

  return (
    <section className="py-16 bg-muted/30 border-b">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 ${isRTL ? 'rtl' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pourquoi choisir UAE-VisaServices pour votre Golden Visa
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('whyChooseUs.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-card rounded-xl p-6 shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 border border-border"
            >
              <div className={`w-14 h-14 mb-5 ${feature.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-lg">
                {feature.hasCounter ? (
                  <><AnimatedNumber target={1000} /> {t(feature.titleKey).replace(/^\+?\d[\d\s,.]*/,'')}</>
                ) : (
                  t(feature.titleKey)
                )}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-success to-success/80 rounded-xl p-5 text-center shadow-lg">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-6 h-6 text-success-foreground" />
            <p className="text-success-foreground font-semibold text-lg">
              {t('whyChooseUs.guaranteeBanner')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
