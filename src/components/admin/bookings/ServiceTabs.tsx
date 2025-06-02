
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Service, Booking } from './types';
import { getIcon } from './utils';
import BookingServiceContent from './BookingServiceContent';

interface ServiceTabsProps {
  services: Service[];
  bookings: Booking[];
  activeService: string;
  setActiveService: (serviceId: string) => void;
  currentWeek: Date;
  setCurrentWeek: (week: Date) => void;
}

const ServiceTabs = ({ 
  services, 
  bookings, 
  activeService, 
  setActiveService, 
  currentWeek, 
  setCurrentWeek 
}: ServiceTabsProps) => {
  // Add "All Services" as the first tab
  const allServicesTab = {
    id: 'all',
    title: 'All Services',
    icon_name: 'Package'
  };

  const tabsWithAll = [allServicesTab, ...services];

  return (
    <Tabs value={activeService} onValueChange={setActiveService}>
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabsWithAll.length}, minmax(0, 1fr))` }}>
        {tabsWithAll.map((service) => (
          <TabsTrigger key={service.id} value={service.id} className="flex items-center gap-2">
            {getIcon(service.icon_name)}
            <span className="hidden sm:inline">{service.title}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent key="all" value="all" className="mt-6">
        <BookingServiceContent
          service={allServicesTab}
          bookings={bookings}
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
        />
      </TabsContent>

      {services.map((service) => (
        <TabsContent key={service.id} value={service.id} className="mt-6">
          <BookingServiceContent
            service={service}
            bookings={bookings}
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ServiceTabs;
