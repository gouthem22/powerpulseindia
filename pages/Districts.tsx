import React, { useState, useEffect } from 'react';
import { loadData, getDistrictsForState } from '../services/dataService';
import { ElectricityRecord } from '../types';
import { SimpleBarChart } from '../components/Charts';

const Districts: React.FC = () => {
  const [allData, setAllData] = useState<ElectricityRecord[]>([]);
  const [districtData, setDistrictData] = useState<ElectricityRecord[]>([]);

  useEffect(() => {
    loadData().then(d => {
      setAllData(d);
    });
  }, []);

  useEffect(() => {
    if (allData.length > 0) {
      // Hardcoded to Tamil Nadu as per requirement
      const dData = getDistrictsForState(allData, 'Tamil Nadu', 2024);
      setDistrictData(dData);
    }
  }, [allData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h1 className="text-xl font-bold text-white">Tamil Nadu District-Level Analysis (2024)</h1>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
           <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full border border-orange-500/30">
             Focus State View
           </span>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-6 text-slate-200">District Comparison: Total Consumption (GWh)</h3>
        <div className="min-w-[800px]">
          <SimpleBarChart 
            data={districtData} 
            dataKeyX="District" 
            dataKeysY={[{ key: 'Total_Consumption_GWh', color: '#3b82f6', name: 'Consumption' }]} 
            height={400}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">District Per Capita (kWh)</h3>
          <SimpleBarChart 
            data={districtData} 
            dataKeyX="District" 
            dataKeysY={[{ key: 'Per_Capita_kWh', color: '#f59e0b', name: 'Per Capita' }]} 
          />
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Renewable Share (%)</h3>
          <SimpleBarChart 
            data={districtData} 
            dataKeyX="District" 
            dataKeysY={[{ key: 'Renewable_Share_pct', color: '#10b981', name: 'Renewable %' }]} 
          />
        </div>
      </div>

      {/* Table View */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="font-semibold text-slate-200">Detailed District Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-300 uppercase bg-slate-900">
              <tr>
                <th className="px-6 py-3">District</th>
                <th className="px-6 py-3">Population (M)</th>
                <th className="px-6 py-3">Consumption (GWh)</th>
                <th className="px-6 py-3">Industrial %</th>
                <th className="px-6 py-3">Peak Demand (MW)</th>
              </tr>
            </thead>
            <tbody>
              {districtData.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-medium text-white">{row.District}</td>
                  <td className="px-6 py-4">{row.Population_millions}</td>
                  <td className="px-6 py-4">{row.Total_Consumption_GWh}</td>
                  <td className="px-6 py-4">{row.Industrial_Consumption_pct}%</td>
                  <td className="px-6 py-4">{row.Peak_Demand_MW}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Districts;