
import { Home, Car, Baby, Heart, ScrollText } from 'lucide-react';

export const servicesData = [
  {
    id: 'cleaning',
    title: 'Cleaning Services',
    description: 'Our professional cleaning services ensure your home is spotless and sanitized. We use eco-friendly products and pay attention to every detail.',
    pricing: [
      { label: '12 hours (7am - 7pm)', price: '₱315' },
      { label: '24 hours', price: '₱420' }
    ],
    conditions: [
      'Free lunch and dinner for 12-hour service',
      'Free lunch, dinner and breakfast for 24-hour service',
      'Talent should be entitled to rest (24-hour service)',
      'Service agreement required',
      'Service area covered: Basay, Bayawan and Sta. Catalina',
      'Penalty of 24 hours for service provider'
    ],
    icon: Home,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'drivers',
    title: 'Driver Services',
    description: 'Our experienced drivers provide safe and reliable transportation. All drivers are licensed, background-checked, and have extensive driving experience.',
    pricing: [
      { label: '12 hours', price: '₱525' },
      { label: '24 hours', price: '₱1,050' }
    ],
    conditions: [
      'Free meal included',
      'Free meal + accommodation for 24-hour service',
      'Service area covered: Basay, Bayawan and Sta. Catalina',
      'Penalty of 24 hours for service provider'
    ],
    icon: Car,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'babysitting',
    title: 'Baby Sitter/Yaya',
    description: 'Our professional babysitters provide attentive care for your children in the comfort of your home. All sitters are experienced, background-checked, and trained in first aid.',
    pricing: [
      { label: '12 hours (7am - 7pm)', price: '₱315' },
      { label: '24 hours', price: '₱420' }
    ],
    conditions: [
      'Free lunch and dinner for 12-hour service',
      'Free lunch, dinner and breakfast for 24-hour service',
      'Talent should be entitled to rest (24-hour service)',
      'Service agreement required',
      '1 yaya: 1 child ratio',
      'Additional ₱50 if no service is available for a particular area',
      'Service area covered: Basay, Bayawan and Sta. Catalina',
      'Penalty of 24 hours for service provider'
    ],
    icon: Baby,
    image: 'https://images.unsplash.com/photo-1544776527-0cbac41c8e51?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'elderly-care',
    title: 'Elderly Sitter',
    description: 'Our compassionate caregivers provide personalized care for seniors. Services include companionship, meal preparation, medication reminders, and assistance with daily activities.',
    pricing: [
      { label: '12 hours (7am - 7pm)', price: '₱420' },
      { label: '24 hours', price: '₱525' }
    ],
    conditions: [
      'Free lunch and dinner for 12-hour service',
      'Free lunch, dinner and breakfast for 24-hour service',
      'Talent should be entitled to rest (24-hour service)',
      'Service agreement required',
      '1 elderly: 1 talent ratio',
      'Service area covered: Basay, Bayawan and Sta. Catalina',
      'Penalty of 24 hours for service provider'
    ],
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'laundry',
    title: 'Laundry Services',
    description: 'Our laundry service takes care of your washing, drying, and folding needs with professional care. We ensure your clothes are cleaned properly and returned neatly folded.',
    pricing: [
      { label: 'Minimum 11 kilos', price: '₱315' },
      { label: 'Additional per kilo (above 11kg)', price: '₱28' }
    ],
    conditions: [
      'Detergent soap should be shouldered by the client',
      'Free meal included',
      'Service area covered: Basay, Bayawan and Sta. Catalina',
      'Penalty of 24 hours for service provider'
    ],
    icon: ScrollText,
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  }
];
