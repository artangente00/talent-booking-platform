
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useBookingsData } from './bookings/hooks/useBookingsData';
import ServiceTabs from './bookings/ServiceTabs';

const BookingsManagement = () => {
  const { services, bookings, loading } = useBookingsData();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeService, setActiveService] = useState<string>('');

  // Set active service when services are loaded
  React.useEffect(() => {
    if (services.length > 0 && !activeService) {
      setActiveService(services[0].id);
    }
  }, [services, activeService]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Bookings Management
        </CardTitle>
        <CardDescription>
          Monitor talent assignments and bookings by service category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ServiceTabs
          services={services}
          bookings={bookings}
          activeService={activeService}
          setActiveService={setActiveService}
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
        />
      </CardContent>
    </Card>
  );
};

export default BookingsManagement;
