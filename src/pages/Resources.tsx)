// src/pages/Resources.tsx
import React from 'react';
import ParaGuide from '../components/ParaGuide';

const Resources: React.FC = () => {
  const articles = [
    {
      title: "Parasites in Tropical Australia",
      description: "Common parasites in North Queensland and the Northern Territory, risk factors, and prevention tips.",
      readTime: "8 min read",
    },
    {
      title: "AI vs Traditional Lab Testing",
      description: "How AI photo analysis compares to conventional microscopy — speed, accuracy, and accessibility.",
      readTime: "6 min read",
    },
    {
      title: "When to Worry About Parasites",
      description: "Understanding symptoms, red flags, and when it's important to see your GP.",
      readTime: "5 min read",
    },
    {
      title: "Pet Parasites: What Owners Should Know",
      description: "Common intestinal parasites in dogs and cats, and how our tool can help.",
      readTime: "7 min read",
    },
    {
      title: "Travel Health & Parasite Risks",
      description: "What to watch for when travelling to high-risk areas and how to prepare.",
      readTime: "6 min read",
    },
    {
      title: "Understanding Your Report",
      description: "A simple guide to reading your AI analysis results and confidence scores.",
      readTime: "4 min read",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-semibold text-navy">Resources & Guides</h1>
        <p className="mt-4 text-xl text-slate-600">Helpful information to support your health journey</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <div 
            key={index} 
            className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all group"
          >
            <div className="h-2 bg-teal-600 rounded-t-3xl w-12 mb-6"></div>
            
            <h3 className="text-2xl font-semibold text-navy group-hover:text-teal transition-colors">
              {article.title}
            </h3>
            
            <p className="mt-4 text-slate-600 leading-relaxed">
              {article.description}
            </p>
            
            <div className="mt-8 flex justify-between items-center">
              <span className="text-sm text-slate-500">{article.readTime}</span>
              <button className="text-teal-600 font-medium group-hover:underline">Read more →</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <ParaGuide 
          variant="inline" 
          message="These guides are written to help you feel more informed and confident." 
        />
      </div>
    </div>
  );
};

export default Resources;
