import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">
            UAE-VisaServices.com
          </div>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Investor Visa Platform
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#simulator" className="transition-colors hover:text-primary">
            Simulateur
          </a>
          <a href="#eligibility" className="transition-colors hover:text-primary">
            Éligibilité  
          </a>
          <a href="#faq" className="transition-colors hover:text-primary">
            FAQ
          </a>
          <a href="#contact" className="transition-colors hover:text-primary">
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-2">
          <select className="text-sm bg-transparent border-none focus:outline-none">
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>  
            <option value="ar">🇦🇪 AR</option>
          </select>
          <Button variant="hero" size="sm" className="ml-4">
            Commencer
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;