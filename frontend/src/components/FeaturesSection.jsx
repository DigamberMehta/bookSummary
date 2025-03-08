import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-100 p-6 rounded shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Summaries in Seconds</h3>
            <p className="text-gray-600">
              Our AI-powered engine processes entire books and gives you concise summaries in seconds.
            </p>
          </div>
          <div className="bg-indigo-100 p-6 rounded shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Save Time & Effort</h3>
            <p className="text-gray-600">
              Gain valuable insights quickly without needing to read through hundreds of pages.
            </p>
          </div>
          <div className="bg-indigo-100 p-6 rounded shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Customize Focus</h3>
            <p className="text-gray-600">
              Highlight the sections you care about or dive deeper into chapters that interest you most.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
