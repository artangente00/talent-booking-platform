
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, User, Calendar, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import BookingForm from './BookingForm';

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if we're on admin pages
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCustomerData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCustomerData(session.user.id);
      } else {
        setCustomer(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCustomerData = async (userId: string) => {
    try {
      const { data: customerData, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching customer data:', error);
        return;
      }

      setCustomer(customerData);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="container flex items-center justify-between h-16 mx-auto px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/10e0a28a-d484-497f-94c4-631bf3eb2452.png" 
            alt="Kwikie Services" 
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation - Hide on admin pages */}
        {!isAdminPage && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-kwikie-orange transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-kwikie-orange transition-colors">
              Our Services
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-kwikie-orange transition-colors">
              How It Works
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-kwikie-orange transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-kwikie-orange transition-colors">
              Contact
            </Link>
          </nav>
        )}

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600 flex items-center space-x-1">
                <User size={16} />
                <span>Welcome, {customer?.full_name || 'Customer'}!</span>
              </span>
              {!isAdminPage && (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" className="border-kwikie-orange text-kwikie-orange hover:bg-kwikie-yellow/10 flex items-center gap-1">
                      <Calendar size={16} />
                      My Bookings
                    </Button>
                  </Link>
                  <BookingForm>
                    <Button className="bg-kwikie-orange hover:bg-kwikie-red">
                      Book Now
                    </Button>
                  </BookingForm>
                </>
              )}
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" className="border-kwikie-orange text-kwikie-orange hover:bg-kwikie-yellow/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-kwikie-orange hover:bg-kwikie-red">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - Hide navigation links on admin pages */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {!isAdminPage && (
                <>
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-kwikie-orange py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/services" 
                    className="text-gray-700 hover:text-kwikie-orange py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Our Services
                  </Link>
                  <Link 
                    to="/how-it-works" 
                    className="text-gray-700 hover:text-kwikie-orange py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-gray-700 hover:text-kwikie-orange py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    to="/contact" 
                    className="text-gray-700 hover:text-kwikie-orange py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </>
              )}
              
              <div className="flex flex-col space-y-2 pt-2">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600 flex items-center space-x-1 py-2">
                      <User size={16} />
                      <span>Welcome, {customer?.full_name || 'Customer'}!</span>
                    </span>
                    {!isAdminPage && (
                      <>
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="border-kwikie-orange text-kwikie-orange w-full flex items-center gap-1">
                            <Calendar size={16} />
                            My Bookings
                          </Button>
                        </Link>
                        <BookingForm>
                          <Button className="bg-kwikie-orange hover:bg-kwikie-red w-full">
                            Book Now
                          </Button>
                        </BookingForm>
                      </>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="border-kwikie-orange text-kwikie-orange w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button className="bg-kwikie-orange hover:bg-kwikie-red w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
