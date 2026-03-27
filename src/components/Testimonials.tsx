import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    { key: 'c1', initials: 'MR', color: 'bg-primary' },
    { key: 'c2', initials: 'SD', color: 'bg-success' },
    { key: 'c3', initials: 'AH', color: 'bg-accent' },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((item, index) => {
            const name = t(`testimonials.clients.${item.key}.name`);
            const country = t(`testimonials.clients.${item.key}.country`);
            const visaType = t(`testimonials.clients.${item.key}.visaType`);
            const text = t(`testimonials.clients.${item.key}.text`);

            return (
              <Card key={index} className="shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 border-0">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-sm`} role="img" aria-label={`Avatar de ${name} - client Golden Visa Dubai`}>
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">{country} · {visaType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
