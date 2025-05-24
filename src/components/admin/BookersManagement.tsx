
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BookerSearch from './bookers/BookerSearch';
import AddBookerDialog from './bookers/AddBookerDialog';
import BookersTable from './bookers/BookersTable';
import BookersLoadingState from './bookers/BookersLoadingState';

interface Booker {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const BookersManagement = () => {
  const [bookers, setBookers] = useState<Booker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchBookers = async () => {
    try {
      const { data, error } = await supabase
        .from('bookers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookers(data || []);
    } catch (error) {
      console.error('Error fetching bookers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookers();
  }, []);

  if (loading) {
    return <BookersLoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bookers Management</CardTitle>
              <CardDescription>
                Manage users who handle booking appointments
              </CardDescription>
            </div>
            <AddBookerDialog onBookerAdded={fetchBookers} />
          </div>
        </CardHeader>
        <CardContent>
          <BookerSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <BookersTable 
            bookers={bookers} 
            searchTerm={searchTerm} 
            onBookerUpdated={fetchBookers} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BookersManagement;
