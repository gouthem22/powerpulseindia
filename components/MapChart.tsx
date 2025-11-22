import React from 'react';

interface MapChartProps {
  data: { state: string; value: number }[];
  onStateClick?: (stateName: string) => void;
}

const MapChart: React.FC<MapChartProps> = ({ data, onStateClick }) => {
  return (
    <div className="w-full h-[400px] bg-slate-800 rounded-xl overflow-hidden relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
      <div className="p-6 rounded-full bg-slate-700/30 mb-4 animate-pulse">
        <svg 
          className="w-16 h-16 text-slate-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          ></path>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-400 mb-2">Map Module Disabled</h3>
      <p className="text-slate-500 text-sm text-center max-w-xs px-4">
        The interactive map component has been removed from the system. 
        State-level data remains accessible via the States explorer.
      </p>
    </div>
  );
};

export default MapChart;