
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
    'nav.home': 'Home',
    'nav.services': 'Our Services',
    'nav.how_it_works': 'How It Works',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.sign_in': 'Sign In',
    'nav.sign_up': 'Sign Up',
    'nav.dashboard': 'My Bookings',
    'nav.logout': 'Sign Out',
    
    // Authentication
    'auth.welcome_title': 'Welcome to Kwikie Services',
    'auth.welcome_subtitle': 'Your trusted partner for home services',
    'auth.get_started': 'Get Started',
    'auth.get_started_description': 'Create an account or sign in to book services',
    'auth.sign_up': 'Sign Up',
    'auth.sign_in': 'Sign In',
    'auth.back_to_home': '← Back to Home',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.first_name': 'First Name',
    'auth.middle_name': 'Middle Name',
    'auth.last_name': 'Last Name',
    'auth.contact_number': 'Contact Number',
    'auth.birthdate': 'Birthdate',
    'auth.birthplace': 'Birthplace',
    'auth.current_address': 'Current Address',
    'auth.city_municipality': 'City or Municipality',
    'auth.street_barangay': 'Street and Barangay',
    'auth.valid_government_id': 'Valid Government ID',
    'auth.id_photo': 'ID Photo',
    'auth.creating_account': 'Creating Account...',
    'auth.create_account': 'Create Account',
    'auth.signing_in': 'Signing In...',
    'auth.required_field': '*',
    'auth.show_password': 'Show password',
    'auth.hide_password': 'Hide password',
    
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
    'services.hero.title': 'Our Services',
    'services.hero.description': 'Discover our range of professional home services tailored to your needs.',
    
    // Service Cards
    'service.cleaning.title': 'Cleaning Services',
    'service.cleaning.description': 'Professional house cleaners to keep your home spotless',
    'service.driver.title': 'Driver Services', 
    'service.driver.description': 'Experienced drivers available for 12h or 24h periods',
    'service.babysitting.title': 'Babysitting',
    'service.babysitting.description': 'Loving and attentive care for your children',
    'service.elderly.title': 'Elderly Care',
    'service.elderly.description': 'Compassionate caregivers for your loved ones',
    'service.laundry.title': 'Laundry Services',
    'service.laundry.description': 'Efficient laundry services with attention to detail',
    'service.book_now': 'Book Now',
    'service.starting_at': 'Starting at',
    
    // Service Tabs
    'service.tab.cleaning': 'Cleaning',
    'service.tab.drivers': 'Drivers',
    'service.tab.babysitting': 'Babysitting',
    'service.tab.elderly_care': 'Elderly Care',
    'service.tab.laundry': 'Laundry',
    
    // CTA Section
    'cta.title': 'Ready to Book a Service?',
    'cta.description': 'Our professional team is ready to help with your home service needs. Book now and experience the difference.',
    'cta.book_service': 'Book a Service',
    'cta.contact_us': 'Contact Us',
    
    // Footer
    'footer.earn_money_title': 'Want to earn money providing services?',
    'footer.earn_money_description': 'Join our network of trusted professionals and start earning by offering your skills to customers in your area.',
    'footer.become_freelancer': 'Become a Freelancer',
    'footer.company_description': 'Connecting you with trusted professionals for all your home service needs.',
    'footer.services_title': 'Services',
    'footer.company_title': 'Company',
    'footer.legal_title': 'Legal',
    'footer.cleaning_services': 'Cleaning Services',
    'footer.driver_services': 'Driver Services',
    'footer.babysitting': 'Babysitting',
    'footer.elderly_care': 'Elderly Care',
    'footer.laundry_services': 'Laundry Services',
    'footer.about_us': 'About Us',
    'footer.how_it_works': 'How It Works',
    'footer.careers': 'Careers',
    'footer.blog': 'Blog',
    'footer.contact_us': 'Contact Us',
    'footer.terms_of_service': 'Terms of Service',
    'footer.privacy_policy': 'Privacy Policy',
    'footer.refund_policy': 'Refund Policy',
    'footer.faq': 'FAQ',
    'footer.all_rights_reserved': 'TalentHub. All rights reserved.',
  },
  tl: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Mga Serbisyo',
    'nav.how_it_works': 'Paano Gumagana',
    'nav.about': 'Tungkol',
    'nav.contact': 'Makipag-ugnayan',
    'nav.sign_in': 'Mag-sign In',
    'nav.sign_up': 'Mag-sign Up',
    'nav.dashboard': 'Mga Booking Ko',
    'nav.logout': 'Mag-logout',
    
    // Authentication
    'auth.welcome_title': 'Maligayang pagdating sa Kwikie Services',
    'auth.welcome_subtitle': 'Ang inyong pinagkakatiwalaang kasosyo para sa home services',
    'auth.get_started': 'Magsimula',
    'auth.get_started_description': 'Gumawa ng account o mag-sign in para mag-book ng mga serbisyo',
    'auth.sign_up': 'Mag-sign Up',
    'auth.sign_in': 'Mag-sign In',
    'auth.back_to_home': '← Balik sa Home',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Kumpirmahin ang Password',
    'auth.first_name': 'Unang Pangalan',
    'auth.middle_name': 'Gitnang Pangalan',
    'auth.last_name': 'Apelyido',
    'auth.contact_number': 'Contact Number',
    'auth.birthdate': 'Petsa ng Kapanganakan',
    'auth.birthplace': 'Lugar ng Kapanganakan',
    'auth.current_address': 'Kasalukuyang Address',
    'auth.city_municipality': 'Lungsod o Munisipalidad',
    'auth.street_barangay': 'Kalye at Barangay',
    'auth.valid_government_id': 'Valid na Government ID',
    'auth.id_photo': 'Larawan ng ID',
    'auth.creating_account': 'Ginagawa ang Account...',
    'auth.create_account': 'Gumawa ng Account',
    'auth.signing_in': 'Nag-sign In...',
    'auth.required_field': '*',
    'auth.show_password': 'Ipakita ang password',
    'auth.hide_password': 'Itago ang password',
    
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
    'services.hero.title': 'Aming mga Serbisyo',
    'services.hero.description': 'Tuklasin ang aming hanay ng propesyonal na home services na inilaan para sa inyong mga pangangailangan.',
    
    // Service Cards
    'service.cleaning.title': 'Mga Serbisyong Paglilinis',
    'service.cleaning.description': 'Mga propesyonal na house cleaner para mapanatiling malinis ang inyong tahanan',
    'service.driver.title': 'Mga Serbisyong Driver',
    'service.driver.description': 'Mga nakakaranasang driver na available para sa 12h o 24h na panahon',
    'service.babysitting.title': 'Babysitting',
    'service.babysitting.description': 'Mahabagin at masuyong pag-aalaga para sa inyong mga anak',
    'service.elderly.title': 'Pag-aalaga sa Matatanda',
    'service.elderly.description': 'Mga mahabagin na caregiver para sa inyong mga mahal sa buhay',
    'service.laundry.title': 'Mga Serbisyong Paglalaba',
    'service.laundry.description': 'Mga epektibong serbisyong paglalaba na may pansin sa detalye',
    'service.book_now': 'Mag-book Ngayon',
    'service.starting_at': 'Nagsisimula sa',
    
    // Service Tabs
    'service.tab.cleaning': 'Paglilinis',
    'service.tab.drivers': 'Mga Driver',
    'service.tab.babysitting': 'Babysitting',
    'service.tab.elderly_care': 'Pag-aalaga sa Matatanda',
    'service.tab.laundry': 'Paglalaba',
    
    // CTA Section
    'cta.title': 'Handa na bang Mag-book ng Serbisyo?',
    'cta.description': 'Ang aming propesyonal na team ay handang tumulong sa inyong home service needs. Mag-book na ngayon at maranasan ang pagkakaiba.',
    'cta.book_service': 'Mag-book ng Serbisyo',
    'cta.contact_us': 'Makipag-ugnayan',
    
    // Footer
    'footer.earn_money_title': 'Gusto ba ninyong kumita sa pagbibigay ng mga serbisyo?',
    'footer.earn_money_description': 'Sumali sa aming network ng mga pinagkakatiwalaang propesyonal at magsimulang kumita sa pag-aalok ng inyong mga skills sa mga customer sa inyong lugar.',
    'footer.become_freelancer': 'Maging Freelancer',
    'footer.company_description': 'Nagkokonekta sa inyo ng mga pinagkakatiwalaang propesyonal para sa lahat ng inyong home service needs.',
    'footer.services_title': 'Mga Serbisyo',
    'footer.company_title': 'Kumpanya',
    'footer.legal_title': 'Legal',
    'footer.cleaning_services': 'Mga Serbisyong Paglilinis',
    'footer.driver_services': 'Mga Serbisyong Driver',
    'footer.babysitting': 'Babysitting',
    'footer.elderly_care': 'Pag-aalaga sa Matatanda',
    'footer.laundry_services': 'Mga Serbisyong Paglalaba',
    'footer.about_us': 'Tungkol sa Amin',
    'footer.how_it_works': 'Paano Ito Gumagana',
    'footer.careers': 'Mga Trabaho',
    'footer.blog': 'Blog',
    'footer.contact_us': 'Makipag-ugnayan sa Amin',
    'footer.terms_of_service': 'Mga Tuntunin ng Serbisyo',
    'footer.privacy_policy': 'Privacy Policy',
    'footer.refund_policy': 'Refund Policy',
    'footer.faq': 'FAQ',
    'footer.all_rights_reserved': 'TalentHub. Lahat ng karapatan ay nakalaan.',
  },
  ceb: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Mga Serbisyo',
    'nav.how_it_works': 'Unsaon Paglihok',
    'nav.about': 'Mahitungod',
    'nav.contact': 'Kontak',
    'nav.sign_in': 'Pag-sign In',
    'nav.sign_up': 'Pag-sign Up',
    'nav.dashboard': 'Akong mga Booking',
    'nav.logout': 'Pag-logout',
    
    // Authentication
    'auth.welcome_title': 'Maayong pag-abot sa Kwikie Services',
    'auth.welcome_subtitle': 'Ang inyong kasaligang kauban para sa home services',
    'auth.get_started': 'Magsugod',
    'auth.get_started_description': 'Paghimo og account o pag-sign in para mag-book og mga serbisyo',
    'auth.sign_up': 'Pag-sign Up',
    'auth.sign_in': 'Pag-sign In',
    'auth.back_to_home': '← Balik sa Home',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Kumpirmaha ang Password',
    'auth.first_name': 'Una nga Ngalan',
    'auth.middle_name': 'Tunga nga Ngalan',
    'auth.last_name': 'Apelyido',
    'auth.contact_number': 'Contact Number',
    'auth.birthdate': 'Petsa sa Pagkatawo',
    'auth.birthplace': 'Lugar sa Pagkatawo',
    'auth.current_address': 'Karon nga Address',
    'auth.city_municipality': 'Dakbayan o Munisipalidad',
    'auth.street_barangay': 'Dalan ug Barangay',
    'auth.valid_government_id': 'Valid nga Government ID',
    'auth.id_photo': 'Hulagway sa ID',
    'auth.creating_account': 'Naghimo og Account...',
    'auth.create_account': 'Paghimo og Account',
    'auth.signing_in': 'Nag-sign In...',
    'auth.required_field': '*',
    'auth.show_password': 'Ipakita ang password',
    'auth.hide_password': 'Tagoa ang password',
    
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
    'services.hero.title': 'Aming mga Serbisyo',
    'services.hero.description': 'Diskubreha ang aming hanay sa propesyonal nga home services nga giandam para sa inyong mga kinahanglan.',
    
    // Service Cards
    'service.cleaning.title': 'Mga Serbisyong Paglimpyo',
    'service.cleaning.description': 'Mga propesyonal nga house cleaner aron mapreserba ang inyong balay nga limpyo',
    'service.driver.title': 'Mga Serbisyong Driver',
    'service.driver.description': 'Mga eksperto nga driver nga available para sa 12h o 24h nga panahon',
    'service.babysitting.title': 'Babysitting',
    'service.babysitting.description': 'Mahigugmaon ug mabinantayon nga pag-atiman para sa inyong mga anak',
    'service.elderly.title': 'Pag-atiman sa mga Tigulang',
    'service.elderly.description': 'Mga maloloy-on nga caregiver para sa inyong mga hinigugma',
    'service.laundry.title': 'Mga Serbisyong Paglaba',
    'service.laundry.description': 'Mga epektibo nga serbisyong paglaba nga adunay atensyon sa detalye',
    'service.book_now': 'Pag-book Karon',
    'service.starting_at': 'Nagsugod sa',
    
    // Service Tabs
    'service.tab.cleaning': 'Paglimpyo',
    'service.tab.drivers': 'Mga Driver',
    'service.tab.babysitting': 'Babysitting',
    'service.tab.elderly_care': 'Pag-atiman sa mga Tigulang',
    'service.tab.laundry': 'Paglaba',
    
    // CTA Section
    'cta.title': 'Andam na ba mo nga Mag-book og Serbisyo?',
    'cta.description': 'Ang among propesyonal nga team andam na nga motabang sa inyong home service needs. Mag-book na karon ug masinati ang kalainan.',
    'cta.book_service': 'Mag-book og Serbisyo',
    'cta.contact_us': 'Kontak Namo',
    
    // Footer
    'footer.earn_money_title': 'Gusto ba mo nga mangita og kwarta sa paghatag og mga serbisyo?',
    'footer.earn_money_description': 'Apil sa among network sa mga kasaligan nga propesyonal ug magsugod og pangita pinaagi sa pag-offer sa inyong mga skills sa mga customer sa inyong lugar.',
    'footer.become_freelancer': 'Mahimong Freelancer',
    'footer.company_description': 'Nagkonekta kaninyong tanan sa mga kasaligan nga propesyonal para sa tanan ninyong home service needs.',
    'footer.services_title': 'Mga Serbisyo',
    'footer.company_title': 'Kompanya',
    'footer.legal_title': 'Legal',
    'footer.cleaning_services': 'Mga Serbisyong Paglimpyo',
    'footer.driver_services': 'Mga Serbisyong Driver',
    'footer.babysitting': 'Babysitting',
    'footer.elderly_care': 'Pag-atiman sa mga Tigulang',
    'footer.laundry_services': 'Mga Serbisyong Paglaba',
    'footer.about_us': 'Mahitungod Kanamo',
    'footer.how_it_works': 'Unsaon Kini Paglihok',
    'footer.careers': 'Mga Trabaho',
    'footer.blog': 'Blog',
    'footer.contact_us': 'Kontak Namo',
    'footer.terms_of_service': 'Mga Termino sa Serbisyo',
    'footer.privacy_policy': 'Privacy Policy',
    'footer.refund_policy': 'Refund Policy',
    'footer.faq': 'FAQ',
    'footer.all_rights_reserved': 'TalentHub. Tanang katungod gireserba.',
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
