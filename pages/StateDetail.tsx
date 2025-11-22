import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadData, getStateData, getDistrictsForState } from '../services/dataService';
import { ElectricityRecord } from '../types';
import { SimpleLineChart, StackedAreaChart, SimpleBarChart } from '../components/Charts';
import KPICard from '../components/KPICard';
import AiInsight from '../components/AiInsight';
import { Zap, Wind, Factory, Home } from 'lucide-react';

const StateDetail: React.FC = () => {
  const { stateName } = useParams<{ stateName: string }>();
  const [stateData, setStateData] = useState<ElectricityRecord[]>([]);
  const [districts, setDistricts] = useState<ElectricityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stateName) {
      loadData().then((d) => {
        setStateData(getStateData(d, stateName));
        setDistricts(getDistrictsForState(d, stateName, 2024));
        setLoading(false);
      });
    }
  }, [stateName]);

  if (loading || !stateData.length) return <div className="p-8 text-center text-slate-400">Loading State Data...</div>;

  const latest = stateData[stateData.length - 1];
  const isTN = stateName === 'Tamil Nadu';

  // Top districts
  const topDistricts = [...districts].sort((a, b) => b.Total_Consumption_GWh - a.Total_Consumption_GWh).slice(0, 5);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-3xl font-bold ${isTN ? 'text-orange-500' : 'text-white'}`}>{stateName}</h1>
            {isTN && <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded border border-orange-500/30">Focus State</span>}
          </div>
          <p className="text-slate-400 mt-1">Energy Profile & Analysis (2018-2024)</p>
        </div>
        <div className="flex gap-2">
           <span className="text-2xl font-bold text-slate-200 font-mono">{latest.Population_millions}M</span>
           <span className="text-sm text-slate-500 self-end mb-1">Population</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Consumption (2024)" value={latest.Total_Consumption_GWh.toLocaleString()} unit="GWh" icon={<Zap size={18}/>} color="orange" />
        <KPICard title="Per Capita" value={latest.Per_Capita_kWh} unit="kWh" icon={<UsersIcon />} color="blue" />
        <KPICard title="Renewable" value={latest.Renewable_Share_pct} unit="%" icon={<Wind size={18}/>} color="green" />
        <KPICard title="Peak Demand" value={latest.Peak_Demand_MW.toLocaleString()} unit="MW" icon={<Factory size={18}/>} color="purple" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Consumption Growth</h3>
          <SimpleLineChart data={stateData} dataKeyX="Year" dataKeysY={[{ key: 'Total_Consumption_GWh', color: '#f97316', name: 'GWh' }]} />
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Sector Breakdown</h3>
          <StackedAreaChart 
            data={stateData} 
            dataKeyX="Year" 
            dataKeysY={[
              { key: 'Household_Consumption_pct', color: '#3b82f6', name: 'Household %' },
              { key: 'Industrial_Consumption_pct', color: '#6366f1', name: 'Industrial %' }
            ]} 
          />
        </div>
      </div>

      {/* District Analysis (if available) */}
      {districts.length > 0 && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Top 5 Districts by Consumption (2024)</h3>
          <div className="h-[300px]">
            <SimpleBarChart 
              data={topDistricts} 
              dataKeyX="District" 
              dataKeysY={[{ key: 'Total_Consumption_GWh', color: '#10b981', name: 'Consumption GWh' }]} 
            />
          </div>
        </div>
      )}

      {/* AI Insight */}
      <AiInsight 
        contextData={`Analysis for ${stateName}. 
        2024 Metrics: Consumption ${latest.Total_Consumption_GWh} GWh, 
        Renewable Share ${latest.Renewable_Share_pct}%, 
        Industrial Share ${latest.Industrial_Consumption_pct}%.
        Growth Trend: ${((latest.Total_Consumption_GWh - stateData[0].Total_Consumption_GWh)/stateData[0].Total_Consumption_GWh * 100).toFixed(1)}% increase since 2018.
        ${isTN ? "Tamil Nadu is a key industrial state with high renewable integration." : ""}
        `}
        title={`AI Assessment: ${stateName}`}
      />
    </div>
  );
};

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export default StateDetail;