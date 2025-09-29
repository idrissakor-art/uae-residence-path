import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import EligibilitySimulator from "@/components/EligibilitySimulator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <EligibilitySimulator />
      <Features />
    </div>
  );
};

export default Index;
