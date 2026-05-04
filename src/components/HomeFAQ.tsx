import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  {
    q: "Who is eligible for the Dubai Golden Visa through real estate?",
    a: "Any foreign national who owns one or more properties in Dubai with a total purchase value of AED 2,000,000 or more qualifies for a 10-year renewable Golden Visa. Mortgaged properties are accepted if purchased through a UAE bank.",
  },
  {
    q: "Can Indian, British or Chinese nationals apply for the Golden Visa?",
    a: "Yes. The Dubai Golden Visa is open to all nationalities. Indian nationals represent 22% of Dubai property buyers, followed by British (17%) and Chinese (14%) investors — all eligible for the 10-year Golden Visa with a qualifying property.",
  },
  {
    q: "How long does the Golden Visa application process take?",
    a: "The process typically takes 7–10 working days once all documents are submitted. You must be physically present in Dubai during processing for medical and biometric checks.",
  },
  {
    q: "What is the minimum property investment required?",
    a: "The minimum threshold is AED 2,000,000 (approx. USD 545,000). The property can be off-plan or ready, freehold, and held individually or jointly with a spouse.",
  },
  {
    q: "Can I sponsor my family with the Golden Visa?",
    a: "Yes. Golden Visa holders can sponsor their spouse, children (no age limit for unmarried daughters), and parents under the same 10-year residency, with no UAE salary requirement.",
  },
  {
    q: "How much does your full assistance service cost?",
    a: "Our all-inclusive service fee is AED 3,500. It covers eligibility check, document review, official submission, and personal follow-up until visa stamping. Full refund if the application is refused.",
  },
  {
    q: "Do I need to live in the UAE to keep the Golden Visa?",
    a: "No. Unlike standard residency visas, the 10-year Golden Visa does not require continuous residence in the UAE. You only need to visit once every 6 months to keep it active.",
  },
  {
    q: "What happens if my Golden Visa application is refused?",
    a: "We offer a 100% refund guarantee on our AED 3,500 service fee in the rare event of a refusal. Government fees paid to UAE authorities are non-refundable as per official regulations.",
  },
];

const HomeFAQ = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "home-faq-jsonld";
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      document.getElementById("home-faq-jsonld")?.remove();
    };
  }, []);

  return (
    <section className="py-16 bg-muted/30" aria-label="Dubai Golden Visa FAQ">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dubai Golden Visa — Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything international investors need to know about the 10-year UAE Golden Visa through real estate.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default HomeFAQ;