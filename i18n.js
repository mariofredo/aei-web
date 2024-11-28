'use client';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import enUS from './locales/en-EN/common.json';
import idID from './locales/id-ID/common.json';

i18n.use(initReactI18next).init({
  resources: {
    enUS: {translation: enUS},
    idID: {translation: idID},
  },
  lng: 'enUS', // Default bahasa
  fallbackLng: 'enUS', // Jika terjemahan tidak ditemukan
  interpolation: {
    escapeValue: false, // React sudah aman dari XSS
  },
});

export default i18n;
