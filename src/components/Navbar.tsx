
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="container flex items-center justify-between h-16 mx-auto px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-brand-600">TalentHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/services" className="text-gray-700 hover:text-brand-600 transition-colors">
            Our Services
          </Link>
          <Link to="/how-it-works" className="text-gray-700 hover:text-brand-600 transition-colors">
            How It Works
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-brand-600 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-brand-600 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="border-brand-500 text-brand-600 hover:bg-brand-50">
            Login
          </Button>
          <Button className="bg-brand-600 hover:bg-brand-700">
            Book Now
          </Button>
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
                to="/services" 
                className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Services
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" className="border-brand-500 text-brand-600 w-full">
                  Login
                </Button>
                <Button className="bg-brand-600 hover:bg-brand-700 w-full">
                  Book Now
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
