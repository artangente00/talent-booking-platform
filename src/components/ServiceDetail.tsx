
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BookingForm from '@/components/BookingForm';

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
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="md:w-2/3 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-kwikie-yellow/20 text-kwikie-orange">
              {icon}
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          
          <p className="text-gray-600 mb-6">{description}</p>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Pricing</h4>
            <div className="space-y-2">
              {pricing.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-bold text-kwikie-orange">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Conditions</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {conditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </div>
          
          <BookingForm preselectedService={title}>
            <Button className="bg-kwikie-orange hover:bg-kwikie-red w-full md:w-auto">
              Book Now
            </Button>
          </BookingForm>
        </CardContent>
      </div>
    </Card>
  );
};

export default ServiceDetail;
