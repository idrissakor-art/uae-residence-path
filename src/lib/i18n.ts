import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { initializeLanguageFromIP } from '@/utils/languageDetection';

import fr from '@/locales/fr.json';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import ru from '@/locales/ru.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  ar: { translation: ar },
  ru: { translation: ru }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // langue par défaut
    fallbackLng: 'fr',
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    // Détection automatique de la langue
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })
  .then(() => {
    // Initialiser la détection de langue par IP après l'initialisation d'i18n
    initializeLanguageFromIP(i18n);
  });

export default i18n;