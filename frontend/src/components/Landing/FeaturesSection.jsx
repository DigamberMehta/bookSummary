import React from 'react';
import { Bolt, Clock, Sliders } from 'lucide-react';

const features = [
  {
    title: "Summaries in Seconds",
    description: "Our AI-powered engine processes entire books and provides concise summaries instantly.",
    icon: <Bolt size={32} className="text-indigo-600" />,
  },
  {
    title: "Save Time & Effort",
    description: "Gain valuable insights quickly without reading through hundreds of pages.",
    icon: <Clock size={32} className="text-indigo-600" />,
  },
  {
    title: "Customize Focus",
    description: "Highlight the sections that matter to you or dive deeper into specific chapters.",
    icon: <Sliders size={32} className="text-indigo-600" />,
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-50 to-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-10">
          Why Choose Us?
        </h2>
        <p className="text-lg text-gray-700 mb-12">
          Unlock the power of AI-driven book summaries with seamless user experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
