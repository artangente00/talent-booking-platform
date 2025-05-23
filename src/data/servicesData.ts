
import { Home, Car, Baby, Heart, ScrollText } from 'lucide-react';

export const servicesData = [
  {
    id: 'cleaning',
    title: 'Cleaning Services',
    description: 'Our professional cleaning services ensure your home is spotless and sanitized. We use eco-friendly products and pay attention to every detail.',
    pricing: [
      { label: 'Basic Cleaning (3 hours)', price: '₱350' },
      { label: 'Deep Cleaning (5 hours)', price: '₱650' },
      { label: 'Move-in/Move-out Cleaning', price: '₱1,200' }
    ],
    conditions: [
      'Cleaning supplies provided by the professional',
      'Additional fee for homes larger than 100 sq meters',
      'Minimum booking: 3 hours',
      'Cancellation requires 24-hour notice'
    ],
    icon: Home,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'drivers',
    title: 'Driver Services',
    description: 'Our experienced drivers provide safe and reliable transportation. All drivers are licensed, background-checked, and have extensive driving experience.',
    pricing: [
      { label: '12-hour service', price: '₱500' },
      { label: '24-hour service', price: '₱1,000' },
      { label: 'Weekly contract', price: '₱5,000' }
    ],
    conditions: [
      'Fuel costs not included',
      'Drivers are available 24/7',
      'Advance booking recommended',
      'Multi-day discounts available'
    ],
    icon: Car,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'babysitting',
    title: 'Babysitting',
    description: 'Our professional babysitters provide attentive care for your children in the comfort of your home. All sitters are experienced, background-checked, and trained in first aid.',
    pricing: [
      { label: '4-hour minimum', price: '₱400' },
      { label: '8-hour service', price: '₱750' },
      { label: 'Overnight (12 hours)', price: '₱1,100' }
    ],
    conditions: [
      'Maximum 3 children per sitter',
      'Light meal preparation included',
      'Educational activities provided',
      'Minimum 3-hour advance booking'
    ],
    icon: Baby,
    image: 'https://images.unsplash.com/photo-1595118216221-63caa91a5c68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'elderly-care',
    title: 'Elderly Care',
    description: 'Our compassionate caregivers provide personalized care for seniors. Services include companionship, meal preparation, medication reminders, and assistance with daily activities.',
    pricing: [
      { label: '4-hour visit', price: '₱600' },
      { label: '8-hour service', price: '₱1,100' },
      { label: '24-hour care', price: '₱2,500' }
    ],
    conditions: [
      'All caregivers are trained in elder care',
      'Medication management available',
      'Light housekeeping included',
      'Regular care plans available at discounted rates'
    ],
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1577896851674-61d1dd733277?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'laundry',
    title: 'Laundry Services',
    description: 'Our laundry service takes care of your washing, drying, and folding needs with professional care. We ensure your clothes are cleaned properly and returned neatly folded.',
    pricing: [
      { label: 'Wash & Fold (per kg)', price: '₱70' },
      { label: 'Wash, Dry & Iron (per kg)', price: '₱120' },
      { label: 'Dry Cleaning (per item)', price: 'From ₱200' }
    ],
    conditions: [
      'Same-day service available for orders before 10am',
      'Free pickup and delivery for orders over ₱500',
      'Eco-friendly detergents used',
      'Special care for delicate fabrics'
    ],
    icon: ScrollText,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  }
];
