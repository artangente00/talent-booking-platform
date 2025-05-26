import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  service_type: string;
  service_address: string;
  booking_date: string;
  booking_time: string;
  duration: string | null;
  special_instructions: string | null;
  status: BookingStatus;
  created_at: string;
  ratings: {
    id: string;
    rating: number;
    review: string | null;
  }[] | null;
}

interface Customer {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  contact_number: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingStates, setRatingStates] = useState<Record<string, { rating: number; review: string; submitting: boolean }>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      fetchCustomerData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      fetchCustomerData(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchCustomerData = async (userId: string) => {
    try {
      // Fetch customer data
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (customerError) throw customerError;

      setCustomer(customerData);

      // Fetch bookings with ratings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          ratings (
            id,
            rating,
            review
          )
        `)
        .eq('customer_id', customerData.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Type assertion to ensure status is properly typed and handle ratings array
      const typedBookings = (bookingsData || []).map(booking => ({
        ...booking,
        status: booking.status as BookingStatus,
        ratings: Array.isArray(booking.ratings) ? booking.ratings : (booking.ratings ? [booking.ratings] : [])
      }));

      setBookings(typedBookings);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (bookingId: string, rating: number) => {
    setRatingStates(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        rating
      }
    }));
  };

  const handleReviewChange = (bookingId: string, review: string) => {
    setRatingStates(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        review
      }
    }));
  };

  const submitRating = async (bookingId: string) => {
    if (!customer) return;

    const ratingState = ratingStates[bookingId];
    if (!ratingState || ratingState.rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setRatingStates(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], submitting: true }
    }));

    try {
      const { error } = await supabase
        .from('ratings')
        .insert({
          booking_id: bookingId,
          customer_id: customer.id,
          rating: ratingState.rating,
          review: ratingState.review || null
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your rating has been submitted. Thank you for your feedback!",
      });

      // Refresh bookings to show the new rating
      fetchCustomerData(user!.id);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit your rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRatingStates(prev => ({
        ...prev,
        [bookingId]: { ...prev[bookingId], submitting: false }
      }));
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCustomerDisplayName = (customer: Customer) => {
    return `${customer.first_name || ''} ${customer.middle_name || ''} ${customer.last_name || ''}`.trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-kwikie-orange mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {customer ? getCustomerDisplayName(customer) : 'Customer'}!
            </h1>
            <p className="text-gray-600">Manage your bookings and track service history.</p>
          </div>

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6">You haven't made any service bookings yet.</p>
                <Button 
                  onClick={() => navigate('/services')}
                  className="bg-kwikie-orange hover:bg-kwikie-red"
                >
                  Book Your First Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const hasRating = booking.ratings && booking.ratings.length > 0;
                const ratingState = ratingStates[booking.id] || { rating: 0, review: '', submitting: false };

                return (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{booking.service_type}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(booking.booking_date)} at {booking.booking_time}
                          </CardDescription>
                        </div>
                        <Badge className={`${getStatusColor(booking.status)} border-0`}>
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                          <div>
                            <p className="font-medium">Service Address</p>
                            <p className="text-gray-600">{booking.service_address}</p>
                          </div>
                        </div>
                        {booking.duration && (
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-gray-500 mt-1" />
                            <div>
                              <p className="font-medium">Duration</p>
                              <p className="text-gray-600">{booking.duration}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {booking.special_instructions && (
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-500 mt-1" />
                          <div>
                            <p className="font-medium">Special Instructions</p>
                            <p className="text-gray-600">{booking.special_instructions}</p>
                          </div>
                        </div>
                      )}

                      {/* Rating Section */}
                      {booking.status === 'completed' && (
                        <div className="border-t pt-4">
                          {hasRating ? (
                            <div>
                              <h4 className="font-medium mb-2">Your Rating</h4>
                              <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                      star <= booking.ratings![0].rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                  {booking.ratings![0].rating}/5
                                </span>
                              </div>
                              {booking.ratings![0].review && (
                                <p className="text-gray-600 italic">"{booking.ratings![0].review}"</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <h4 className="font-medium mb-3">Rate this service</h4>
                              <div className="space-y-3">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => handleRatingChange(booking.id, star)}
                                      className="focus:outline-none"
                                    >
                                      <Star
                                        className={`w-6 h-6 transition-colors ${
                                          star <= ratingState.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300 hover:text-yellow-200'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                  {ratingState.rating > 0 && (
                                    <span className="ml-2 text-sm text-gray-600">
                                      {ratingState.rating}/5
                                    </span>
                                  )}
                                </div>
                                <Textarea
                                  placeholder="Share your experience (optional)"
                                  value={ratingState.review}
                                  onChange={(e) => handleReviewChange(booking.id, e.target.value)}
                                  rows={3}
                                />
                                <Button
                                  onClick={() => submitRating(booking.id)}
                                  disabled={ratingState.rating === 0 || ratingState.submitting}
                                  className="bg-kwikie-orange hover:bg-kwikie-red"
                                >
                                  {ratingState.submitting ? 'Submitting...' : 'Submit Rating'}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
