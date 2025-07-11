
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ServicesHero = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-kwikie-yellow to-kwikie-orange py-16">
      <div className="container mx-auto px-4 text-center text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {t('services.hero.title', 'Our Services')}
        </h1>
        <p className="text-xl max-w-2xl mx-auto">
          {t('services.hero.description', 'Discover our range of professional home services tailored to your needs.')}
        </p>
      </div>
    </section>
  );
};

export default ServicesHero;
