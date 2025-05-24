
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CustomersLoadingState = () => {
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
};

export default CustomersLoadingState;
