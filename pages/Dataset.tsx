import React, { useState, useEffect } from 'react';
import { loadData } from '../services/dataService';
import { ElectricityRecord } from '../types';
import { Download } from 'lucide-react';
import { CSV_DATA } from '../constants';

const Dataset: React.FC = () => {
  const [data, setData] = useState<ElectricityRecord[]>([]);
  const [displayData, setDisplayData] = useState<ElectricityRecord[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadData().then(d => {
      setData(d);
      setDisplayData(d);
    });
  }, []);

  const downloadCSV = () => {
    const blob = new Blob([CSV_DATA], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'electricity_india_2018_2024.csv';
    a.click();
  };

  const paginatedData = displayData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dataset</h1>
          <p className="text-slate-400 text-sm mt-1">Raw electricity consumption records.</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={18} /> Download CSV
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-300 uppercase bg-slate-900">
              <tr>
                <th className="px-6 py-3">Year</th>
                <th className="px-6 py-3">State</th>
                <th className="px-6 py-3">District</th>
                <th className="px-6 py-3">Cons. (GWh)</th>
                <th className="px-6 py-3">Per Capita (kWh)</th>
                <th className="px-6 py-3">Household %</th>
                <th className="px-6 py-3">Renewable %</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="px-6 py-4">{row.Year}</td>
                  <td className="px-6 py-4 font-medium text-white">{row.State_UT}</td>
                  <td className="px-6 py-4">{row.District}</td>
                  <td className="px-6 py-4">{row.Total_Consumption_GWh}</td>
                  <td className="px-6 py-4">{row.Per_Capita_kWh}</td>
                  <td className="px-6 py-4">{row.Household_Consumption_pct}%</td>
                  <td className="px-6 py-4 text-emerald-400">{row.Renewable_Share_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, displayData.length)} of {displayData.length}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50"
            >
              Prev
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={page * itemsPerPage >= displayData.length}
              className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dataset;