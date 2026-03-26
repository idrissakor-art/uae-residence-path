import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Features from "@/components/Features";
import TypeformStyleSimulator from "@/components/TypeformStyleSimulator";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhyChooseUs />
      <Testimonials />
      <TypeformStyleSimulator />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
