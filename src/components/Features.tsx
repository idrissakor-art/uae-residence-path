import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { 
  Shield, FileCheck, CreditCard, Headphones, Clock, Globe,
  CheckCircle, Crown, Users, FileText, Wallet, Home,
  Building, Briefcase, GraduationCap
} from "lucide-react";

const Features = () => {
  const { t } = useTranslation();

  const featureKeys = ['secure', 'upload', 'payment', 'support', 'tracking', 'multilingual'];
  const featureIcons: Record<string, React.ReactNode> = {
    secure: <Shield className="w-8 h-8 text-primary" />,
    upload: <FileCheck className="w-8 h-8 text-success" />,
    payment: <CreditCard className="w-8 h-8 text-accent" />,
    support: <Headphones className="w-8 h-8 text-primary" />,
    tracking: <Clock className="w-8 h-8 text-success" />,
    multilingual: <Globe className="w-8 h-8 text-accent" />,
  };

  const categoryKeys = ['investor'];
  const categoryIcons: Record<string, React.ReactNode> = {
    investor: <Building className="w-10 h-10 text-accent" />,
    entrepreneur: <Briefcase className="w-10 h-10 text-accent" />,
    professional: <Crown className="w-10 h-10 text-accent" />,
    academic: <GraduationCap className="w-10 h-10 text-accent" />,
  };

  const stepIcons = [
    <FileText className="w-6 h-6" />,
    <FileCheck className="w-6 h-6" />,
    <Wallet className="w-6 h-6" />,
    <Home className="w-6 h-6" />,
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Golden Visa Categories */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Crown className="w-4 h-4 mr-2" />
              {t('features.goldenVisa.badge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('features.goldenVisa.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('features.goldenVisa.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
            {categoryKeys.map((key, index) => (
              <Card 
                key={key} 
                className="relative overflow-hidden shadow-card hover:shadow-luxury hover:-translate-y-2 transition-all duration-300 border-2 border-accent/20 hover:border-accent/50"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                      {categoryIcons[key]}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{t(`features.goldenVisa.categories.${key}.title`)}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{t(`features.goldenVisa.categories.${key}.threshold`)}</Badge>
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {t(`features.goldenVisa.categories.${key}.description`)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(t(`features.goldenVisa.categories.${key}.features`, { returnObjects: true }) as string[]).map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">{t('features.process.badge')}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('features.process.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('features.process.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['s1', 's2', 's3', 's4'].map((key, index) => (
              <div key={key} className="relative text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{t(`features.process.steps.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground">{t(`features.process.steps.${key}.desc`)}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Platform Features */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Users className="w-4 h-4 mr-2" />
              {t('features.platform.badge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('features.platform.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('features.platform.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureKeys.map((key) => (
              <Card key={key} className="shadow-card hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 border-0">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    {featureIcons[key]}
                    <Badge variant="outline">{t(`features.platform.items.${key}.badge`)}</Badge>
                  </div>
                  <CardTitle className="text-xl">{t(`features.platform.items.${key}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {t(`features.platform.items.${key}.description`)}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
