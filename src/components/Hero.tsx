import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Users, Globe } from "lucide-react";
import heroImage from "@/assets/dubai-hero.jpg";

const Hero = () => {
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
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Obtenez votre résidence aux EAU par investissement immobilier
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Vérifiez votre éligibilité en 2 minutes, chargez vos documents et obtenez votre résidence.
          </p>

          {/* Benefits in translucent white card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-10 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-3 text-white">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-lg">🏠</span>
                </div>
                <span className="font-medium">≥ AED 750k → Résidence 2 ans</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-lg">🏙️</span>
                </div>
                <span className="font-medium">≥ AED 2M → Golden Visa 10 ans</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-lg">📄</span>
                </div>
                <span className="font-medium">Accompagnement complet</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center items-center mb-8">
            <Button variant="premium" size="hero" className="bg-accent text-primary font-semibold px-8 py-4 text-lg shadow-luxury hover:bg-accent/90 transition-all duration-300">
              ⚡ Simuler mon éligibilité
            </Button>
          </div>

          {/* Quick Input Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-white/20">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Valeur de votre bien (AED)"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <Button variant="premium" className="bg-accent text-primary font-semibold px-6 py-3 hover:bg-accent/90">
                Vérifier
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/70">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>+1,000 dossiers traités</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Support multilingue</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;