import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import Features from "@/components/Features";
import TypeformStyleSimulator from "@/components/TypeformStyleSimulator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhyChooseUs />
      <TypeformStyleSimulator />
      <Features />
    </div>
  );
};

export default Index;
