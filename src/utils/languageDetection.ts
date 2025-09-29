// Fonction pour détecter la langue basée sur l'adresse IP
export const detectLanguageFromIP = async (): Promise<string> => {
  try {
    // Utilisation de l'API ipapi.co pour obtenir les informations de géolocalisation
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Mapping des codes pays vers les langues supportées
    const countryToLanguage: Record<string, string> = {
      // Pays francophones
      'FR': 'fr', // France
      'BE': 'fr', // Belgique
      'CH': 'fr', // Suisse
      'CA': 'fr', // Canada
      'MA': 'fr', // Maroc
      'TN': 'fr', // Tunisie
      'DZ': 'fr', // Algérie
      'SN': 'fr', // Sénégal
      'CI': 'fr', // Côte d'Ivoire
      'ML': 'fr', // Mali
      'BF': 'fr', // Burkina Faso
      'NE': 'fr', // Niger
      'TD': 'fr', // Tchad
      'CM': 'fr', // Cameroun
      'CG': 'fr', // Congo
      'CD': 'fr', // République démocratique du Congo
      'GA': 'fr', // Gabon
      'CF': 'fr', // République centrafricaine
      'MG': 'fr', // Madagascar
      'KM': 'fr', // Comores
      'DJ': 'fr', // Djibouti
      'SC': 'fr', // Seychelles
      'PF': 'fr', // Polynésie française
      'NC': 'fr', // Nouvelle-Calédonie
      'WF': 'fr', // Wallis-et-Futuna
      'MQ': 'fr', // Martinique
      'GP': 'fr', // Guadeloupe
      'GF': 'fr', // Guyane française
      'RE': 'fr', // La Réunion
      'YT': 'fr', // Mayotte
      'PM': 'fr', // Saint-Pierre-et-Miquelon
      'BL': 'fr', // Saint-Barthélemy
      'MF': 'fr', // Saint-Martin
      
      // Pays arabophones
      'AE': 'ar', // Émirats Arabes Unis
      'SA': 'ar', // Arabie Saoudite
      'QA': 'ar', // Qatar
      'KW': 'ar', // Koweït
      'BH': 'ar', // Bahreïn
      'OM': 'ar', // Oman
      'JO': 'ar', // Jordanie
      'LB': 'ar', // Liban
      'SY': 'ar', // Syrie
      'IQ': 'ar', // Irak
      'YE': 'ar', // Yémen
      'EG': 'ar', // Égypte
      'LY': 'ar', // Libye
      'SD': 'ar', // Soudan
      'PS': 'ar', // Palestine
      'IL': 'ar', // Israël (population arabe)
      'MR': 'ar', // Mauritanie
      
      // Pays anglophones par défaut
      'US': 'en', // États-Unis
      'GB': 'en', // Royaume-Uni
      'AU': 'en', // Australie
      'NZ': 'en', // Nouvelle-Zélande
      'IE': 'en', // Irlande
      'ZA': 'en', // Afrique du Sud
      'NG': 'en', // Nigeria
      'KE': 'en', // Kenya
      'UG': 'en', // Ouganda
      'TZ': 'en', // Tanzanie
      'ZW': 'en', // Zimbabwe
      'BW': 'en', // Botswana
      'ZM': 'en', // Zambie
      'MW': 'en', // Malawi
      'SZ': 'en', // Eswatini
      'LS': 'en', // Lesotho
      'NA': 'en', // Namibie
      'GH': 'en', // Ghana
      'SL': 'en', // Sierra Leone
      'LR': 'en', // Liberia
      'GM': 'en', // Gambie
      'MT': 'en', // Malte
      'CY': 'en', // Chypre
      'FJ': 'en', // Fidji
      'PG': 'en', // Papouasie-Nouvelle-Guinée
      'SB': 'en', // Îles Salomon
      'TO': 'en', // Tonga
      'WS': 'en', // Samoa
      'TV': 'en', // Tuvalu
      'KI': 'en', // Kiribati
      'NR': 'en', // Nauru
      'PW': 'en', // Palaos
      'MH': 'en', // Îles Marshall
      'FM': 'en', // États fédérés de Micronésie
      'GU': 'en', // Guam
      'AS': 'en', // Samoa américaines
      'VI': 'en', // Îles Vierges américaines
      'PR': 'en', // Porto Rico
      'MP': 'en', // Îles Mariannes du Nord
      'UM': 'en', // Îles mineures éloignées des États-Unis
    };
    
    const countryCode = data.country_code;
    const detectedLanguage = countryToLanguage[countryCode];
    
    console.log(`IP Detection: Country ${countryCode} -> Language ${detectedLanguage || 'fr (default)'}`);
    
    // Retourner la langue détectée ou français par défaut
    return detectedLanguage || 'fr';
  } catch (error) {
    console.error('Erreur lors de la détection de la langue via IP:', error);
    // En cas d'erreur, retourner français par défaut
    return 'fr';
  }
};

// Fonction pour initialiser la langue au démarrage de l'app
export const initializeLanguageFromIP = async (i18n: any) => {
  // Vérifier si une langue est déjà stockée en localStorage
  const storedLanguage = localStorage.getItem('i18nextLng');
  
  if (!storedLanguage || storedLanguage === 'fr') {
    // Si aucune langue n'est stockée ou si c'est français par défaut,
    // tenter la détection par IP
    const detectedLanguage = await detectLanguageFromIP();
    
    if (detectedLanguage !== 'fr') {
      // Changer la langue seulement si ce n'est pas français
      i18n.changeLanguage(detectedLanguage);
      // Ajuster la direction du texte pour l'arabe
      document.documentElement.dir = detectedLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  } else {
    // Si une langue est déjà stockée, l'utiliser
    document.documentElement.dir = storedLanguage === 'ar' ? 'rtl' : 'ltr';
  }
};