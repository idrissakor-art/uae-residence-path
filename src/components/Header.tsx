import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "#simulator", label: t('header.nav.simulator') },
    { href: "#eligibility", label: t('header.nav.eligibility') },
    { href: "#faq", label: t('header.nav.faq') },
    { href: "#contact", label: t('header.nav.contact') },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="container flex h-16 items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="text-2xl font-bold gradient-text">
            {t('header.brand')}
          </div>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {t('header.tagline')}
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <select 
            className="text-sm bg-transparent border-none focus:outline-none cursor-pointer"
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>  
            <option value="ar">🇦🇪 AR</option>
          </select>
          <Button 
            variant="hero" 
            size="sm" 
            className="ml-4 hidden sm:inline-flex"
            onClick={() => navigate('/application')}
          >
            {t('header.cta')}
          </Button>

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-8">
                <div className="text-xl font-bold gradient-text">
                  {t('header.brand')}
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a 
                      key={link.href} 
                      href={link.href} 
                      className="text-lg font-medium transition-colors hover:text-primary py-2 border-b border-border"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <Button 
                  variant="hero" 
                  className="w-full mt-4"
                  onClick={() => navigate('/application')}
                >
                  {t('header.cta')}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
