import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Mohammed Al-Rashid",
    country: "Maroc",
    visaType: "Golden Visa 10 ans",
    text: "Service exceptionnel ! Mon Golden Visa a été obtenu en moins de 48h. L'équipe m'a accompagné à chaque étape avec un professionnalisme remarquable.",
    initials: "MR",
    color: "bg-primary",
  },
  {
    name: "Sophie Dubois",
    country: "France",
    visaType: "Golden Visa 10 ans",
    text: "Processus fluide et transparent. J'ai pu soumettre tous mes documents en ligne et suivre mon dossier en temps réel. Je recommande vivement.",
    initials: "SD",
    color: "bg-success",
  },
  {
    name: "Ahmed Hassan",
    country: "Égypte",
    visaType: "Golden Visa 10 ans",
    text: "La garantie satisfait ou remboursé m'a convaincu. Résultat : visa obtenu sans aucun problème. Une plateforme sérieuse et fiable.",
    initials: "AH",
    color: "bg-accent",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ce que disent nos clients Golden Visa Dubai
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les témoignages de ceux qui nous ont fait confiance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, index) => (
            <Card key={index} className="shadow-card hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 border-0">
              <CardContent className="pt-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.country} · {t.visaType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
