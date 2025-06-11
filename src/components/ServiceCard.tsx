
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import BookingForm from './BookingForm';

interface SpecialPricing {
  duration: string;
  price: string;
}

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  route: string;
  color: string;
  hasSpecialPricing?: boolean;
  specialPricing?: SpecialPricing[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  price,
  route,
  color,
  hasSpecialPricing = false,
  specialPricing = []
}) => {
  const renderPricing = () => {
    if (hasSpecialPricing && specialPricing.length > 0) {
      // Find min and max prices for range display
      const prices = specialPricing.map(p => {
        const numericPrice = parseFloat(p.price.replace(/[₱,]/g, ''));
        return numericPrice;
      }).filter(p => !isNaN(p));
      
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        if (minPrice === maxPrice) {
          return `₱${minPrice}`;
        } else {
          return `₱${minPrice} - ₱${maxPrice}`;
        }
      }
    }
    
    return price;
  };

  return (
    <div className={`service-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-kwikie-orange/30`}>
      <div className="p-6">
        <div className="w-12 h-12 bg-kwikie-yellow/20 flex items-center justify-center rounded-full mb-4 text-kwikie-orange">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Starting at</p>
            <p className="text-lg font-bold text-kwikie-orange">{renderPricing()}</p>
          </div>
          <BookingForm preselectedService={title}>
            <Button className="bg-kwikie-orange hover:bg-kwikie-red">
              Book Now
            </Button>
          </BookingForm>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
