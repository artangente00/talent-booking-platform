
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  route: string;
  color: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  price,
  route,
  color
}) => {
  return (
    <div className={`service-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 ${color}`}>
      <div className="p-6">
        <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4" style={{ backgroundColor: `rgba(var(--${color}-rgb), 0.1)` }}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Starting at</p>
            <p className="text-lg font-bold">{price}</p>
          </div>
          <Link to={route}>
            <Button className="bg-brand-600 hover:bg-brand-700">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
