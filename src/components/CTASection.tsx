
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslationContext } from '@/contexts/TranslationContext';

const CTASection = () => {
  const { t } = useTranslationContext();

  return (
    <section className="py-20 bg-gradient-to-r from-kwikie-yellow to-kwikie-orange">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {t('Ready to Get Started?')}
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {t('Join thousands of satisfied customers who trust Kwikie for their home service needs.')}
        </p>
        <Link to="/services">
          <Button 
            size="lg" 
            className="bg-white text-kwikie-orange hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t('Get Started Today')}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
