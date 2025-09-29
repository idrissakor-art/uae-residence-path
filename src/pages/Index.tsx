import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Features from "@/components/Features";
import EligibilitySimulator from "@/components/EligibilitySimulator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhyChooseUs />
      <EligibilitySimulator />
      <Features />
    </div>
  );
};

export default Index;
