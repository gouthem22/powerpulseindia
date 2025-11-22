import React, { useState, useEffect } from 'react';
import { loadData, getAllStates } from '../services/dataService';
import { ElectricityRecord } from '../types';
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';

const States: React.FC = () => {
  const [data, setData] = useState<ElectricityRecord[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadData().then(d => {
      setData(d);
      setStates(getAllStates(d));
    });
  }, []);

  const filteredStates = states.filter(s => s.toLowerCase().includes(filter.toLowerCase()));

  const getStateMetrics = (stateName: string) => {
    const rec = data.find(d => d.State_UT === stateName && d.District === 'ALL' && d.Year === 2024);
    return rec;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">State Explorer</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search states..." 
            className="bg-slate-800 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStates.map(state => {
          const metrics = getStateMetrics(state);
          const isTN = state === 'Tamil Nadu';
          
          return (
            <Link 
              key={state} 
              to={`/states/${state}`}
              className={`block p-5 rounded-xl border transition-all hover:-translate-y-1 ${
                isTN 
                  ? 'bg-slate-800/80 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className={`text-lg font-semibold ${isTN ? 'text-orange-400' : 'text-slate-200'}`}>{state}</h3>
                <ChevronRight size={20} className="text-slate-500" />
              </div>
              
              {metrics ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Consumption</span>
                    <span className="text-slate-200 font-mono">{metrics.Total_Consumption_GWh.toLocaleString()} GWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Peak Demand</span>
                    <span className="text-slate-200 font-mono">{metrics.Peak_Demand_MW.toLocaleString()} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Renewable</span>
                    <span className={`font-mono ${metrics.Renewable_Share_pct > 20 ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {metrics.Renewable_Share_pct}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-sm italic">Data loading...</div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default States;