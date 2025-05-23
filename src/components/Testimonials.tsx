
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Santos",
      role: "Busy Parent",
      content: "The babysitting service was exceptional. Our sitter was so good with our children, and we felt completely at ease leaving them in her care.",
      avatar: "https://i.pravatar.cc/150?img=32"
    },
    {
      name: "Juan Reyes",
      role: "Business Professional",
      content: "I regularly use their driver service for my business trips. Always punctual, professional, and they know the city well. Highly recommended!",
      avatar: "https://i.pravatar.cc/150?img=68"
    },
    {
      name: "Anna Lee",
      role: "Homeowner",
      content: "The cleaning service exceeded my expectations. My home has never looked better, and they pay attention to every detail.",
      avatar: "https://i.pravatar.cc/150?img=45"
    },
    {
      name: "Carlos Mendoza",
      role: "Family Caregiver",
      content: "Finding reliable elderly care was challenging until I discovered this platform. The caregiver they provided was compassionate and professional.",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar>
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="rounded-full"
                    />
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="relative">
                  <svg 
                    className="absolute -top-2 -left-2 w-8 h-8 text-brand-200 transform -rotate-180" 
                    fill="currentColor" 
                    viewBox="0 0 32 32"
                  >
                    <path d="M10 8V0H8v8H0v2h8v8h2v-8h8v-2h-8zm24 16V16h-8v-8h-2v8h-8v2h8v8h2v-8h8z"></path>
                  </svg>
                  <p className="text-gray-600 relative z-10 pl-4">
                    {testimonial.content}
                  </p>
                </div>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className="w-5 h-5 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
