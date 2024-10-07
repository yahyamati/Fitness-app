// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define the translations
const resources = {
  en: {
    translation: {
      "Planfit Exercises Guide": "Planfit Exercises Guide",
      "Sign In":"Sign In"
    },
  },
  fr: {
    translation: {
      "Planfit Exercises Guide": "Guide des exercices Planfit",
      "Sign In":"registration"
    },
  },
  
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en', // fallback language if translation is not available
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

// Export the i18n instance
export default i18n;
