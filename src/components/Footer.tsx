import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Join as Talent CTA Section */}
        <div className="bg-gradient-to-r from-kwikie-orange to-kwikie-red rounded-lg p-6 mb-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Want to Offer Your Services?
          </h3>
          <p className="text-white/90 mb-4">
            Join our network of trusted professionals and start earning by providing quality services
          </p>
          <Button 
            asChild
            className="bg-white text-kwikie-orange hover:bg-gray-100 font-semibold"
          >
            <Link to="/auth" className="inline-flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Join as Talent
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-brand-600">TalentHub</h3>
            <p className="text-gray-600 max-w-xs">
              Connecting you with trusted professionals for all your home service needs.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-500 hover:text-brand-600" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services/cleaning" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Cleaning Services
                </Link>
              </li>
              <li>
                <Link to="/services/drivers" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Driver Services
                </Link>
              </li>
              <li>
                <Link to="/services/babysitting" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Babysitting
                </Link>
              </li>
              <li>
                <Link to="/services/elderly-care" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Elderly Care
                </Link>
              </li>
              <li>
                <Link to="/services/laundry" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Laundry Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-brand-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-brand-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-brand-600 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-gray-500 text-center text-sm">
            © {new Date().getFullYear()} TalentHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
