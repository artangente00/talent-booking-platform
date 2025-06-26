
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

const CTASection = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

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

  const handleBookServiceClick = () => {
    if (!user) {
      navigate('/auth?tab=signup');
    } else {
      navigate('/services');
    }
  };

  return (
    <section className="py-16 bg-kwikie-orange text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Book a Service?</h2>
        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
          Our professional team is ready to help with your home service needs.
          Book now and experience the difference.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={handleBookServiceClick}
            className="bg-white text-kwikie-orange hover:bg-gray-50 text-lg h-12 px-8"
          >
            Book a Service
          </Button>
          <Link to="/contact">
            <Button variant="outline" className="border-white text-kwikie-orange hover:bg-kwikie-red text-lg h-12 px-8">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
