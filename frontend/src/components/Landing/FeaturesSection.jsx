import React from 'react';
import { Bolt, Clock, Sliders } from 'lucide-react';

const features = [
  {
    title: "Summaries in Seconds",
    description: "Our AI-powered engine processes entire books and provides concise summaries instantly.",
    icon: Bolt,
  },
  {
    title: "Save Time & Effort",
    description: "Gain valuable insights quickly without reading through hundreds of pages.",
    icon: Clock,
  },
  {
    title: "Customize Focus",
    description: "Highlight the sections that matter to you or dive deeper into specific chapters.",
    icon: Sliders,
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-indigo-100 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-semibold text-gray-900 mb-4">
            Why Choose Bookwise?
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-gray-600 opacity-95 max-w-2xl mx-auto">
            Transform your reading experience with AI-powered insights and intelligent content curation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-6">
                  <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-indigo-100">
                    <Icon size={28} className="text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-pretty">
                  {feature.description}
                </p>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-50 rounded-xl transition-all duration-300 pointer-events-none" />
              </div>
            )}
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;