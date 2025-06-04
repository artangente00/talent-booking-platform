
import React from 'react';
import { servicesData } from '@/data/servicesData';

interface ServicePricingProps {
  selectedService: string;
}

const ServicePricing: React.FC<ServicePricingProps> = ({ selectedService }) => {
  const serviceData = servicesData.find(service => service.title === selectedService);

  if (!serviceData) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Service Rates</h4>
      <div className="space-y-2">
        {serviceData.pricing.map((pricing, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{pricing.label}</span>
            <span className="font-semibold text-kwikie-orange">{pricing.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePricing;
