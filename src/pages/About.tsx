
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Shield, Clock, Star } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Shield className="w-8 h-8 text-kwikie-orange" />,
      title: 'Trust & Safety',
      description: 'All our professionals are thoroughly vetted, background-checked, and verified to ensure your peace of mind.'
    },
    {
      icon: <Clock className="w-8 h-8 text-kwikie-orange" />,
      title: 'Reliability',
      description: 'We guarantee punctual service delivery with professionals who respect your time and commitments.'
    },
    {
      icon: <Star className="w-8 h-8 text-kwikie-orange" />,
      title: 'Quality Service',
      description: 'Our talent network consists of skilled professionals dedicated to delivering exceptional service every time.'
    },
    {
      icon: <Users className="w-8 h-8 text-kwikie-orange" />,
      title: 'Community Focus',
      description: 'We believe in building strong communities by connecting local talent with families who need support.'
    }
  ];

  const team = [
    {
      name: 'Maria Santos',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Former corporate executive who founded Kwikie to help Filipino families access quality home services.'
    },
    {
      name: 'Juan Cruz',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Operations expert with 10+ years experience in service delivery and quality management.'
    },
    {
      name: 'Ana Reyes',
      role: 'Head of Talent Relations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Dedicated to building relationships with our talent network and ensuring their success.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-kwikie-yellow to-kwikie-orange py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About Kwikie Services</h1>
            <p className="text-xl max-w-3xl mx-auto">
              We're on a mission to make quality home services accessible to every Filipino family
              while empowering talented individuals to build sustainable careers.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Kwikie Services was founded with a simple belief: every family deserves access to 
                  reliable, professional home services, and every skilled individual deserves the 
                  opportunity to build a thriving career.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  We connect verified professionals with families across the Philippines, providing 
                  services ranging from cleaning and laundry to elderly care and childcare. Our 
                  platform ensures fair compensation for talent while delivering exceptional value 
                  to our clients.
                </p>
                <Link to="/services">
                  <Button className="bg-kwikie-orange hover:bg-kwikie-red">
                    Explore Our Services
                  </Button>
                </Link>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Team collaboration"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These core values guide everything we do at Kwikie Services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind Kwikie Services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-kwikie-orange font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-kwikie-yellow to-kwikie-orange">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Kwikie?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied families who trust Kwikie for their home service needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <Button variant="outline" className="bg-white text-kwikie-orange border-white hover:bg-gray-100">
                  Book a Service
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-kwikie-orange">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
