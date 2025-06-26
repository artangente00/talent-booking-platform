
import { useState, useEffect } from 'react';

interface TranslationMap {
  [key: string]: string;
}

// Basic Bisaya translations for common UI elements
const bisayaTranslations: TranslationMap = {
  // Navigation
  'Home': 'Balay',
  'Services': 'Serbisyo',
  'How It Works': 'Unsa ang Paagi',
  'About': 'Mahitungod',
  'Contact': 'Kontak',
  'Dashboard': 'Dashboard',
  
  // Hero Section
  'Professional Home Services': 'Professional nga Serbisyo sa Balay',
  'at Your Fingertips': 'sa Imong Tudlo',
  'Book trusted professionals for cleaning, driving, babysitting, elderly care, and laundry services in your area.': 'Mag-book ug kasaligan nga mga propesyonal para sa paglimpyo, pagmaneho, pag-atiman sa bata, pag-atiman sa tigulang, ug serbisyo sa paglaba sa imong lugar.',
  'Book a Service': 'Mag-book ug Serbisyo',
  'Learn More': 'Mahibal-an pa',
  
  // Services Section
  'Our Services': 'Atong mga Serbisyo',
  'Choose from our range of professional home services': 'Pilia gikan sa atong mga professional nga serbisyo sa balay',
  'Cleaning Services': 'Serbisyo sa Paglimpyo',
  'Professional cleaning for your home': 'Professional nga paglimpyo para sa imong balay',
  'Driver Services': 'Serbisyo sa Driver',
  'Reliable drivers for your transportation needs': 'Kasaligan nga mga driver para sa imong transportasyon',
  'Babysitting': 'Pag-atiman sa Bata',
  'Trusted caregivers for your children': 'Kasaligan nga mga nag-atiman para sa imong mga anak',
  'Elderly Care': 'Pag-atiman sa Tigulang',
  'Compassionate care for senior family members': 'Maluloy-on nga pag-atiman para sa mga tigulang nga pamilya',
  
  // CTA Section
  'Ready to Get Started?': 'Andam na ba ka Magsugod?',
  'Join thousands of satisfied customers who trust Kwikie for their home service needs.': 'Apil sa liboan ka mga nasayod nga mga kostumer nga nagsalig sa Kwikie para sa ilang panginahanglan sa serbisyo sa balay.',
  'Get Started Today': 'Magsugod Karon',
  
  // Footer
  'Quick Links': 'Dali nga mga Link',
  'Contact Info': 'Impormasyon sa Kontak',
  'Follow Us': 'Sunda Kami',
  'All rights reserved': 'Tanang katungod gitago',
  
  // Common
  'Loading...': 'Nag-load...',
  'Book Now': 'Mag-book Karon',
  'View Details': 'Tan-awa ang mga Detalye',
  'Contact Us': 'Kontak Namo',
};

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ceb'>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const translateText = (text: string): string => {
    if (currentLanguage === 'en') return text;
    
    // First check for exact matches
    if (bisayaTranslations[text]) {
      return bisayaTranslations[text];
    }
    
    // Check for partial matches (for longer text)
    for (const [english, bisaya] of Object.entries(bisayaTranslations)) {
      if (text.includes(english)) {
        return text.replace(english, bisaya);
      }
    }
    
    return text; // Return original if no translation found
  };

  const toggleLanguage = async () => {
    setIsTranslating(true);
    
    // Simulate translation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCurrentLanguage(prev => prev === 'en' ? 'ceb' : 'en');
    setIsTranslating(false);
  };

  return {
    currentLanguage,
    translateText,
    toggleLanguage,
    isTranslating,
    t: translateText // Shorthand for translateText
  };
};
