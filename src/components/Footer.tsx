import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div 
              className="text-2xl font-bold mb-3 cursor-pointer text-accent" 
              onClick={() => navigate('/')}
            >
              {t('header.brand')}
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {t('header.tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-accent">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#simulator" className="text-primary-foreground/70 hover:text-accent transition-colors">Simulateur</a></li>
              <li><a href="#features" className="text-primary-foreground/70 hover:text-accent transition-colors">Services</a></li>
              <li><a href="#faq" className="text-primary-foreground/70 hover:text-accent transition-colors">FAQ</a></li>
              <li><a onClick={() => navigate('/application')} className="text-primary-foreground/70 hover:text-accent transition-colors cursor-pointer">Application</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-accent">Contact</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>📧 contact@uae-visaservices.com</li>
              <li>📱 WhatsApp: +971 XX XXX XXXX</li>
              <li>📍 Dubai, Émirats Arabes Unis</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="text-primary-foreground/50 text-xs">
            © {new Date().getFullYear()} UAE Visa Services. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
