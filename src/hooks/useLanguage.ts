import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    // Optionnel: ajuster la direction du texte pour l'arabe
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  };
  
  return {
    currentLanguage: i18n.language,
    changeLanguage,
    isRTL: i18n.language === 'ar'
  };
};