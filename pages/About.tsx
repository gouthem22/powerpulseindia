import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-6">About PowerPulse India</h1>
        
        <div className="prose prose-invert">
          <p className="text-slate-300 mb-4">
            PowerPulse India is a data visualization dashboard designed to explore electricity consumption patterns across Indian states and districts from 2018 to 2024. The project aims to provide analysts and policymakers with accessible insights into energy trends, specifically focusing on the state of Tamil Nadu.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">Methodology</h3>
          <p className="text-slate-400 mb-4">
            The dataset used in this application is synthetic, generated to reflect realistic trends in Indian power consumption. It includes metrics such as total consumption, per capita usage, sector-wise breakdown (Household vs Industrial), and renewable energy adoption rates.
          </p>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">Tech Stack</h3>
          <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
            <li><strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS</li>
            <li><strong>Visualization:</strong> Recharts, React Simple Maps</li>
            <li><strong>Data Processing:</strong> PapaParse</li>
            <li><strong>AI Integration:</strong> Google Gemini API (via @google/genai)</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mt-6 mb-3">AI Insights</h3>
          <p className="text-slate-400">
            The platform leverages Google's Gemini 2.5 Flash model to generate real-time textual analysis of the data charts. By analyzing the raw data context, the AI identifies key growth areas, anomalies, and sustainability trends that might be missed at first glance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;