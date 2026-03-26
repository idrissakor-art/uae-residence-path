import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, FileCheck, CreditCard, Headphones, Clock, Globe,
  CheckCircle, Crown, Users, FileText, Wallet, Home
} from "lucide-react";

const Features = () => {
  const features = [
    { icon: <Shield className="w-8 h-8 text-primary" />, title: "Plateforme Sécurisée", description: "Données chiffrées et conformité RGPD. Vos informations personnelles sont protégées selon les standards bancaires.", badge: "Certifié" },
    { icon: <FileCheck className="w-8 h-8 text-success" />, title: "Upload Simplifié", description: "Interface intuitive pour télécharger tous vos documents. Validation automatique et feedback instantané.", badge: "Simple" },
    { icon: <CreditCard className="w-8 h-8 text-accent" />, title: "Paiement Intégré", description: "Règlement sécurisé par carte bancaire. Pas de paiement avant validation de votre éligibilité.", badge: "Sécurisé" },
    { icon: <Headphones className="w-8 h-8 text-primary" />, title: "Support Expert", description: "Conseillers spécialisés disponibles en français, anglais et arabe. Accompagnement personnalisé.", badge: "24/7" },
    { icon: <Clock className="w-8 h-8 text-success" />, title: "Suivi en Temps Réel", description: "Dashboard personnel pour suivre l'avancement de votre dossier étape par étape.", badge: "Live" },
    { icon: <Globe className="w-8 h-8 text-accent" />, title: "Multilingue", description: "Interface et support dans votre langue. Documentation officielle traduite et certifiée.", badge: "Global" },
  ];

  const visaTypes = [
    {
      icon: <Clock className="w-12 h-12 text-primary" />,
      title: "Résidence Investisseur", duration: "2 ans", threshold: "≥ AED 750,000",
      features: ["Renouvelable", "Droits de propriétaire", "Accès aux services", "Sponsor famille possible"],
      recommended: false,
    },
    {
      icon: <Crown className="w-12 h-12 text-accent" />,
      title: "Golden Visa", duration: "10 ans", threshold: "≥ AED 2,000,000",
      features: ["Résidence longue durée", "Avantages étendus", "Facilités bancaires", "Éducation enfants"],
      recommended: true,
    }
  ];

  const steps = [
    { num: 1, icon: <FileText className="w-6 h-6" />, title: "Simulez", desc: "Testez votre éligibilité en 2 minutes" },
    { num: 2, icon: <FileCheck className="w-6 h-6" />, title: "Soumettez votre dossier", desc: "Uploadez vos documents en ligne" },
    { num: 3, icon: <Wallet className="w-6 h-6" />, title: "Paiement sécurisé", desc: "Payez uniquement si éligible" },
    { num: 4, icon: <Home className="w-6 h-6" />, title: "Obtenez votre résidence", desc: "Recevez votre visa sous 48h" },
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Visa Types */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Crown className="w-4 h-4 mr-2" />
              Types de Résidence
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Deux options de résidence disponibles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez la formule adaptée à votre investissement immobilier
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {visaTypes.map((visa, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden shadow-card hover:shadow-luxury hover:-translate-y-2 transition-all duration-300 ${
                  visa.recommended ? 'border-2 border-accent ring-1 ring-accent/20' : ''
                }`}
              >
                {visa.recommended && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-accent text-accent-foreground font-bold px-3 py-1 text-xs uppercase tracking-wider shadow-glow">
                      ⭐ Recommandé
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">{visa.icon}</div>
                  <CardTitle className="text-2xl mb-2">{visa.title}</CardTitle>
                  <div className="text-4xl font-bold text-primary mb-2">{visa.duration}</div>
                  <Badge variant="secondary" className="mb-4">{visa.threshold}</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {visa.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span>{feature}</span>
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
            <Badge variant="outline" className="mb-4">Processus</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              4 étapes simples
            </h2>
            <p className="text-lg text-muted-foreground">
              De la simulation à l'obtention de votre résidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold">{step.num}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
                {index < steps.length - 1 && (
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
              Pourquoi Nous Choisir
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Plateforme complète et sécurisée
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              De la simulation à l'obtention de votre résidence, 
              nous vous accompagnons à chaque étape du processus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 border-0">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    {feature.icon}
                    <Badge variant="outline">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
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
