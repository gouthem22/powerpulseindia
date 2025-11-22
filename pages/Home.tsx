import React, { useEffect, useState } from 'react';
import { loadData, getNationalAggregates } from '../services/dataService';
import { ElectricityRecord } from '../types';
import KPICard from '../components/KPICard';
import { SimpleLineChart, StackedAreaChart, SimpleBarChart } from '../components/Charts';
import AiInsight from '../components/AiInsight';
import ErrorBoundary from '../components/ErrorBoundary';
import { Zap, Users, TrendingUp, Leaf } from 'lucide-react';

const Home: React.FC = () => {
  const [data, setData] = useState<ElectricityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96 text-orange-500 animate-pulse">Loading Power Data...</div>;

  const nationalData = getNationalAggregates(data);
  
  if (!nationalData || nationalData.length === 0) {
    return <div className="p-8 text-center text-red-400">No data available to display.</div>;
  }

  const latestYear = nationalData[nationalData.length - 1];
  const prevYear = nationalData.length > 1 ? nationalData[nationalData.length - 2] : latestYear;

  // Calculate trends
  const consumptionTrend = prevYear.Total_Consumption_GWh ? ((latestYear.Total_Consumption_GWh - prevYear.Total_Consumption_GWh) / prevYear.Total_Consumption_GWh) * 100 : 0;
  const renewableTrend = prevYear.Renewable_Share_pct ? ((latestYear.Renewable_Share_pct - prevYear.Renewable_Share_pct) / prevYear.Renewable_Share_pct) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Consumption (2024)" 
          value={(latestYear.Total_Consumption_GWh / 1000).toFixed(1) + "k"} 
          unit="GWh" 
          trend={consumptionTrend}
          icon={<Zap size={20} />}
          color="orange"
        />
        <KPICard 
          title="Avg Per Capita" 
          value={latestYear.Per_Capita_kWh.toFixed(0)} 
          unit="kWh" 
          icon={<Users size={20} />}
          color="blue"
        />
        <KPICard 
          title="Peak Demand" 
          value={(latestYear.Peak_Demand_MW / 1000).toFixed(1) + "k"} 
          unit="MW" 
          icon={<TrendingUp size={20} />}
          color="purple"
        />
        <KPICard 
          title="Renewable Share" 
          value={latestYear.Renewable_Share_pct.toFixed(1)} 
          unit="%" 
          trend={renewableTrend}
          icon={<Leaf size={20} />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">National Consumption Trend</h2>
            <ErrorBoundary>
              <SimpleLineChart 
                data={nationalData} 
                dataKeyX="Year" 
                dataKeysY={[{ key: 'Total_Consumption_GWh', color: '#f97316', name: 'Consumption (GWh)' }]} 
              />
            </ErrorBoundary>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Consumption Composition</h2>
            <ErrorBoundary>
              <StackedAreaChart 
                data={nationalData} 
                dataKeyX="Year" 
                dataKeysY={[
                  { key: 'Household_Consumption_pct', color: '#3b82f6', name: 'Household %' },
                  { key: 'Industrial_Consumption_pct', color: '#6366f1', name: 'Industrial %' }
                ]} 
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          <AiInsight 
            contextData={`National Electricity Data India 2018-2024. 
              Total Consumption 2024: ${latestYear.Total_Consumption_GWh} GWh. 
              Renewable Share: ${latestYear.Renewable_Share_pct}%. 
              Peak Demand: ${latestYear.Peak_Demand_MW} MW.
              Per Capita: ${latestYear.Per_Capita_kWh} kWh.
              Trend from 2018: Consumption increased from ${nationalData[0].Total_Consumption_GWh} to ${latestYear.Total_Consumption_GWh}.`} 
          />
          
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <h2 className="text-lg font-semibold mb-4 text-slate-200">Renewable Progress</h2>
             <ErrorBoundary>
               <SimpleBarChart 
                 data={nationalData}
                 dataKeyX="Year"
                 dataKeysY={[{ key: 'Renewable_Share_pct', color: '#10b981', name: 'Renewable %' }]}
                 height={200}
               />
             </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;