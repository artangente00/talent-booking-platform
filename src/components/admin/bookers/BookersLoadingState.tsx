
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BookersLoadingState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookers Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kwikie-orange"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookersLoadingState;
