import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Features from "@/components/Features";
import TypeformStyleSimulator from "@/components/TypeformStyleSimulator";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "Golden Visa UAE | Obtenez votre Visa Or Dubai 10 ans";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Obtenez votre Golden Visa UAE 10 ans par investissement immobilier (≥2M AED). Simulateur d'éligibilité gratuit, accompagnement complet. +1000 dossiers traités.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <WhyChooseUs />
        <Testimonials />
        <section id="simulator" aria-label="Simulateur d'éligibilité Golden Visa">
          <TypeformStyleSimulator />
        </section>
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
