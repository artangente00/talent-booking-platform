
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.services': 'Services',
    'nav.how_it_works': 'How It Works',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.sign_in': 'Sign In',
    'nav.sign_up': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    
    // Hero Section
    'hero.title': 'Find Trusted Talent for Your Home Services',
    'hero.subtitle': 'Easily book trusted professionals for cleaning, driving, childcare, elder care, laundry, and a wide range of other services—all in just a few clicks.',
    'hero.browse_services': 'Browse Services',
    'hero.how_it_works': 'How It Works',
    'hero.verified_professionals': 'Verified Professionals',
    'hero.fixed_rates': 'Fixed Rates',
    'hero.satisfaction_guaranteed': 'Satisfaction Guaranteed',
    
    // Services Section
    'services.title': 'Our Services',
    'services.description': 'We provide a wide range of professional home services with fixed rates and verified talent.',
    'services.view_all': 'View all services',
    
    // CTA Section
    'cta.title': 'Ready to Book a Service?',
    'cta.description': 'Our professional team is ready to help with your home service needs. Book now and experience the difference.',
    'cta.book_service': 'Book a Service',
    'cta.contact_us': 'Contact Us',
  },
  tl: {
    // Navigation
    'nav.services': 'Mga Serbisyo',
    'nav.how_it_works': 'Paano Gumagana',
    'nav.about': 'Tungkol',
    'nav.contact': 'Makipag-ugnayan',
    'nav.sign_in': 'Mag-sign In',
    'nav.sign_up': 'Mag-sign Up',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Mag-logout',
    
    // Hero Section
    'hero.title': 'Maghanap ng Pinagkakatiwalaang Talento para sa Inyong Home Services',
    'hero.subtitle': 'Madaling mag-book ng mga pinagkakatiwalaang propesyonal para sa paglilinis, pagmamaneho, pag-aalaga ng bata, pag-aalaga ng matatanda, paglalaba, at maraming iba pang serbisyo—lahat sa ilang clicks lang.',
    'hero.browse_services': 'Tingnan ang mga Serbisyo',
    'hero.how_it_works': 'Paano Gumagana',
    'hero.verified_professionals': 'Verified na mga Propesyonal',
    'hero.fixed_rates': 'Fixed na mga Rate',
    'hero.satisfaction_guaranteed': 'Guaranteed na Kasiyahan',
    
    // Services Section
    'services.title': 'Aming mga Serbisyo',
    'services.description': 'Nagbibigay kami ng malawak na hanay ng propesyonal na home services na may fixed rates at verified talent.',
    'services.view_all': 'Tingnan ang lahat ng serbisyo',
    
    // CTA Section
    'cta.title': 'Handa na bang Mag-book ng Serbisyo?',
    'cta.description': 'Ang aming propesyonal na team ay handang tumulong sa inyong home service needs. Mag-book na ngayon at maranasan ang pagkakaiba.',
    'cta.book_service': 'Mag-book ng Serbisyo',
    'cta.contact_us': 'Makipag-ugnayan',
  },
  ceb: {
    // Navigation
    'nav.services': 'Mga Serbisyo',
    'nav.how_it_works': 'Unsaon Paglihok',
    'nav.about': 'Mahitungod',
    'nav.contact': 'Kontak',
    'nav.sign_in': 'Pag-sign In',
    'nav.sign_up': 'Pag-sign Up',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Pag-logout',
    
    // Hero Section
    'hero.title': 'Pangitaa ang Kasaligan nga Talento para sa Inyong Home Services',
    'hero.subtitle': 'Sayon nga pag-book sa mga kasaligan nga propesyonal para sa paglimpyo, pagmaneho, pag-atiman sa mga bata, pag-atiman sa mga tigulang, paglaba, ug uban pang mga serbisyo—tanan sa pipila ka clicks lang.',
    'hero.browse_services': 'Tan-awa ang mga Serbisyo',
    'hero.how_it_works': 'Unsaon Paglihok',
    'hero.verified_professionals': 'Verified nga mga Propesyonal',
    'hero.fixed_rates': 'Fixed nga mga Rate',
    'hero.satisfaction_guaranteed': 'Garantisadong Katagbawan',
    
    // Services Section
    'services.title': 'Aming mga Serbisyo',
    'services.description': 'Naghatag kami og daghan nga propesyonal nga home services nga adunay fixed rates ug verified talent.',
    'services.view_all': 'Tan-awa ang tanan nga serbisyo',
    
    // CTA Section
    'cta.title': 'Andam na ba mo nga Mag-book og Serbisyo?',
    'cta.description': 'Ang among propesyonal nga team andam na nga motabang sa inyong home service needs. Mag-book na karon ug masinati ang kalainan.',
    'cta.book_service': 'Mag-book og Serbisyo',
    'cta.contact_us': 'Kontak Namo',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>('en');

  const t = (key: string, defaultValue?: string) => {
    const langTranslations = translations[language as keyof typeof translations];
    return langTranslations?.[key as keyof typeof langTranslations] || defaultValue || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
