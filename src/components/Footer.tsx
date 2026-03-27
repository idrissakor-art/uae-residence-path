import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <footer className="bg-primary text-primary-foreground" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div 
              className="text-2xl font-bold mb-3 cursor-pointer text-accent" 
              onClick={() => navigate('/')}
              role="link"
              tabIndex={0}
              aria-label="Retour à l'accueil Golden Visa UAE"
              onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            >
              {t('header.brand')}
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Votre partenaire de confiance pour l'obtention du Golden Visa UAE 10 ans par investissement immobilier.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation pied de page">
            <h3 className="font-semibold mb-4 text-accent">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#simulator" className="text-primary-foreground/70 hover:text-accent transition-colors">Simulateur Golden Visa</a></li>
              <li><a href="#features" className="text-primary-foreground/70 hover:text-accent transition-colors">Services</a></li>
              <li><a href="/faq" className="text-primary-foreground/70 hover:text-accent transition-colors">FAQ Golden Visa</a></li>
              <li><a onClick={() => navigate('/application')} className="text-primary-foreground/70 hover:text-accent transition-colors cursor-pointer" role="link" tabIndex={0}>Déposer un dossier</a></li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-accent">Contact</h3>
            <address className="not-italic space-y-2 text-sm text-primary-foreground/70">
              <p><a href="mailto:contact@uae-visaservices.com" className="hover:text-accent transition-colors">📧 contact@uae-visaservices.com</a></p>
              <p><a href="https://wa.me/971000000000" className="hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">📱 WhatsApp: +971 XX XXX XXXX</a></p>
              <p>📍 Dubai, Émirats Arabes Unis</p>
            </address>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="text-primary-foreground/50 text-xs">
            © {new Date().getFullYear()} UAE Visa Services — Golden Visa UAE. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
