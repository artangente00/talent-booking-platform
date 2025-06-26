
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Become a Talent CTA Section */}
        <div className="bg-gradient-to-r from-kwikie-yellow/20 to-kwikie-orange/20 rounded-lg p-6 mb-12 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            {t('footer.earn_money_title', 'Want to earn money providing services?')}
          </h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            {t('footer.earn_money_description', 'Join our network of trusted professionals and start earning by offering your skills to customers in your area.')}
          </p>
          <Link to="/talent-application">
            <Button
              variant="outline"
              className="border-kwikie-orange text-kwikie-orange hover:bg-kwikie-orange hover:text-white h-11 px-6"
            >
              {t('footer.become_freelancer', 'Become a Freelancer')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-brand-600">TalentHub</h3>
            <p className="text-gray-600 max-w-xs">
              {t('footer.company_description', 'Connecting you with trusted professionals for all your home service needs.')}
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
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-4">
              {t('footer.services_title', 'Services')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services/cleaning" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.cleaning_services', 'Cleaning Services')}
                </Link>
              </li>
              <li>
                <Link to="/services/drivers" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.driver_services', 'Driver Services')}
                </Link>
              </li>
              <li>
                <Link to="/services/babysitting" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.babysitting', 'Babysitting')}
                </Link>
              </li>
              <li>
                <Link to="/services/elderly-care" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.elderly_care', 'Elderly Care')}
                </Link>
              </li>
              <li>
                <Link to="/services/laundry" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.laundry_services', 'Laundry Services')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-4">
              {t('footer.company_title', 'Company')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.about_us', 'About Us')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.how_it_works', 'How It Works')}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.careers', 'Careers')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.blog', 'Blog')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.contact_us', 'Contact Us')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-4">
              {t('footer.legal_title', 'Legal')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.terms_of_service', 'Terms of Service')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.privacy_policy', 'Privacy Policy')}
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.refund_policy', 'Refund Policy')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-brand-600 transition-colors">
                  {t('footer.faq', 'FAQ')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-gray-500 text-center text-sm">
            © {new Date().getFullYear()} {t('footer.all_rights_reserved', 'TalentHub. All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
