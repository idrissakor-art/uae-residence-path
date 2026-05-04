import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Features from "@/components/Features";
import TypeformStyleSimulator from "@/components/TypeformStyleSimulator";
import HomeFAQ from "@/components/HomeFAQ";
import Footer from "@/components/Footer";

const Index = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", t('meta.description'));
    }
  }, [t]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <WhyChooseUs />
        <Testimonials />
        <section id="simulator" aria-label={t('simulator.badge')}>
          <TypeformStyleSimulator />
        </section>
        <Features />
        <HomeFAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
