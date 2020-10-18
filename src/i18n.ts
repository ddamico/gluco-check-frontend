import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
//   .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: process.env.REACT_APP_I18N_FALLBACK_LANGUAGE || 'en',
    debug: process.env.REACT_APP_I18N_DEBUG === 'true' || false,
    interpolation: {
      escapeValue: false,
    }
  });


export default i18n;