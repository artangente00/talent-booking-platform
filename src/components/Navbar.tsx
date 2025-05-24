
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import BookingForm from './BookingForm';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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

        {/* Desktop Navigation */}
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

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600 flex items-center space-x-1">
                <User size={16} />
                <span>Welcome back!</span>
              </span>
              <BookingForm>
                <Button className="bg-kwikie-orange hover:bg-kwikie-red">
                  Book Now
                </Button>
              </BookingForm>
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
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
              
              <div className="flex flex-col space-y-2 pt-2">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600 flex items-center space-x-1 py-2">
                      <User size={16} />
                      <span>Welcome back!</span>
                    </span>
                    <BookingForm>
                      <Button className="bg-kwikie-orange hover:bg-kwikie-red w-full">
                        Book Now
                      </Button>
                    </BookingForm>
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
