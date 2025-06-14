
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Users,
      title: 'User-Centric',
      description: 'We put our users first, designing tools that are intuitive and powerful.'
    },
    {
      icon: Target,
      title: 'Precision',
      description: 'Every conversion is handled with the highest level of accuracy and quality.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our platform and service.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about solving real problems with elegant solutions.'
    }
  ];

  return (
    <Layout>
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About ZipConvert
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to simplify digital file management for everyone, 
              making professional-grade tools accessible to users worldwide.
            </p>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Our Story
              </h2>
              <div className="prose prose-lg mx-auto text-gray-600">
                <p className="mb-6">
                  ZipConvert was born from a simple frustration: why was it so difficult to convert, 
                  compress, and manipulate digital files? Our founders, a team of engineers and designers, 
                  found themselves constantly switching between different tools and websites just to 
                  complete basic file operations.
                </p>
                <p className="mb-6">
                  In 2023, we decided to build the solution we wished existed - a comprehensive, 
                  fast, and secure platform that could handle any file conversion or manipulation task. 
                  What started as a simple PDF converter has grown into a complete digital toolkit 
                  trusted by millions of users worldwide.
                </p>
                <p>
                  Today, ZipConvert processes over 500 million files annually, helping students, 
                  professionals, and businesses streamline their workflows and focus on what matters most.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Chen',
                  role: 'CEO & Co-Founder',
                  image: '/placeholder.svg',
                  bio: 'Former Google engineer with 10+ years in developer tools and platform engineering.'
                },
                {
                  name: 'Mike Rodriguez',
                  role: 'CTO & Co-Founder',
                  image: '/placeholder.svg',
                  bio: 'AI/ML expert and former Spotify architect, passionate about scalable systems.'
                },
                {
                  name: 'Emily Johnson',
                  role: 'Head of Design',
                  image: '/placeholder.svg',
                  bio: 'Award-winning UX designer who previously led design at Airbnb and Figma.'
                }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              ZipConvert by the Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '10M+', label: 'Users Worldwide' },
                { number: '500M+', label: 'Files Processed' },
                { number: '150+', label: 'Tools Available' },
                { number: '99.9%', label: 'Uptime' }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
