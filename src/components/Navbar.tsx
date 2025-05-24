
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import BookingForm from './BookingForm';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Button variant="outline" className="border-kwikie-orange text-kwikie-orange hover:bg-kwikie-yellow/10">
            Sign Up
          </Button>
          <BookingForm>
            <Button className="bg-kwikie-orange hover:bg-kwikie-red">
              Book Now
            </Button>
          </BookingForm>
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
                <Button variant="outline" className="border-kwikie-orange text-kwikie-orange w-full">
                  Sign Up
                </Button>
                <BookingForm>
                  <Button className="bg-kwikie-orange hover:bg-kwikie-red w-full">
                    Book Now
                  </Button>
                </BookingForm>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
