import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold gradient-text">
            {t('header.brand')}
          </div>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {t('header.tagline')}
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#simulator" className="transition-colors hover:text-primary">
            {t('header.nav.simulator')}
          </a>
          <a href="#eligibility" className="transition-colors hover:text-primary">
            {t('header.nav.eligibility')}
          </a>
          <a href="#faq" className="transition-colors hover:text-primary">
            {t('header.nav.faq')}
          </a>
          <a href="#contact" className="transition-colors hover:text-primary">
            {t('header.nav.contact')}
          </a>
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
            className="ml-4"
            onClick={() => navigate('/application')}
          >
            {t('header.cta')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;