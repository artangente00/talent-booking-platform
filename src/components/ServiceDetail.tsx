
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BookingForm from '@/components/BookingForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceDetailProps {
  title: string;
  description: string;
  pricing: {
    label: string;
    price: string;
  }[];
  conditions: string[];
  icon: React.ReactNode;
  image: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  title,
  description,
  pricing,
  conditions,
  icon,
  image
}) => {
  const { t } = useLanguage();

  // Map service titles to service keys for translations
  const getServiceKey = (title: string) => {
    const serviceKeyMapping: Record<string, string> = {
      'Cleaning Services': 'cleaning',
      'Driver Services': 'drivers',
      'Baby Sitter/Yaya': 'babysitting',
      'Elderly Sitter': 'elderly',
      'Laundry Services': 'laundry'
    };
    return serviceKeyMapping[title] || 'cleaning';
  };

  const getTranslatedPricing = (serviceKey: string, pricing: any[]) => {
    return pricing.map((item, index) => {
      const pricingKey = index === 0 
        ? (serviceKey === 'laundry' ? 'minimum' : '12h')
        : (serviceKey === 'laundry' ? 'additional' : '24h');
      
      return {
        label: t(`service.detail.${serviceKey}.pricing.${pricingKey}`, item.label),
        price: item.price
      };
    });
  };

  const getTranslatedConditions = (serviceKey: string, conditions: string[]) => {
    return conditions.map((condition, index) => 
      t(`service.detail.${serviceKey}.condition.${index + 1}`, condition)
    );
  };

  const serviceKey = getServiceKey(title);
  const translatedTitle = t(`service.${serviceKey}.title`, title);
  const translatedDescription = t(`service.${serviceKey}.description`, description);
  const translatedPricing = getTranslatedPricing(serviceKey, pricing);
  const translatedConditions = getTranslatedConditions(serviceKey, conditions);

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img
            src={image}
            alt={translatedTitle}
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="md:w-2/3 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-kwikie-yellow/20 text-kwikie-orange">
              {icon}
            </div>
            <h3 className="text-2xl font-bold">{translatedTitle}</h3>
          </div>
          
          <p className="text-gray-600 mb-6">{translatedDescription}</p>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">
              {t('service.detail.pricing', 'Pricing')}
            </h4>
            <div className="space-y-2">
              {translatedPricing.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-bold text-kwikie-orange">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">
              {t('service.detail.conditions', 'Conditions')}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {translatedConditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </div>
          
          <BookingForm preselectedService={translatedTitle}>
            <Button className="bg-kwikie-orange hover:bg-kwikie-red w-full md:w-auto">
              {t('service.book_now', 'Book Now')}
            </Button>
          </BookingForm>
        </CardContent>
      </div>
    </Card>
  );
};

export default ServiceDetail;
