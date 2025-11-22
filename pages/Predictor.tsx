
import React, { useState, useEffect } from 'react';
import { loadData, getAllStates, getStateData } from '../services/dataService';
import { runRandomForestSimulation } from '../services/mlService';
import { ElectricityRecord } from '../types';
import { BrainCircuit, CheckCircle2, TrendingUp, Activity } from 'lucide-react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import KPICard from '../components/KPICard';

const Predictor: React.FC = () => {
  const [data, setData] = useState<ElectricityRecord[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('Tamil Nadu');
  const [isTraining, setIsTraining] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);

  useEffect(() => {
    loadData().then(d => {
      setData(d);
      setStates(getAllStates(d));
    });
  }, []);

  const handleTrainModel = async () => {
    setIsTraining(true);
    setPredictionData(null);
    
    const stateHistory = getStateData(data, selectedState);
    
    try {
      const result = await runRandomForestSimulation(stateHistory);
      setPredictionData(result);
    } catch (e) {
      console.error("Prediction failed", e);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="text-orange-500" />
            Future Consumption Predictor
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Uses a Random Forest Ensemble algorithm (simulated) to forecast electricity demand up to 2030 based on historical patterns (2018-2024).
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <button
            onClick={handleTrainModel}
            disabled={isTraining}
            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isTraining 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20'
            }`}
          >
            {isTraining ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Activity size={18} />
                Train & Predict
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {predictionData && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard 
              title="Model Accuracy (R²)" 
              value={(predictionData.accuracy * 100).toFixed(1) + "%"} 
              unit="" 
              icon={<CheckCircle2 size={20} />} 
              color="green" 
            />
             <KPICard 
              title="Projected 2025 Consumption" 
              value={Math.round(predictionData.predictions.find((p: any) => p.year === 2025)?.predicted || 0).toLocaleString()} 
              unit="GWh" 
              icon={<TrendingUp size={20} />} 
              color="orange" 
            />
             <KPICard 
              title="Projected 2030 Consumption" 
              value={Math.round(predictionData.predictions.find((p: any) => p.year === 2030)?.predicted || 0).toLocaleString()} 
              unit="GWh" 
              icon={<BrainCircuit size={20} />} 
              color="purple" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Prediction Chart */}
            <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold mb-6 text-slate-200">Forecast: Historical vs Predicted (GWh)</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={predictionData.predictions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                      formatter={(value: number) => [Math.round(value).toLocaleString(), 'GWh']}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="actual" 
                      name="Historical Data" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.1} 
                      strokeWidth={3}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      name="RF Prediction" 
                      stroke="#f97316" 
                      strokeWidth={3} 
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: '#f97316' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Feature Importance */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold mb-6 text-slate-200">Model Feature Importance</h3>
              <p className="text-xs text-slate-400 mb-4">Factors driving the prediction model.</p>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictionData.featureImportance} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} hide />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                    <Tooltip 
                      cursor={{ fill: '#1e293b' }}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    />
                    <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-sm text-slate-400">
            <strong className="text-orange-400">Note:</strong> This forecast is generated using a client-side ensemble simulation technique ("Random Forest approximation"). It uses historical Compound Annual Growth Rates (CAGR) and variance bootstrapping to project future demand. Actual consumption may vary due to policy changes, economic shifts, or infrastructure projects not accounted for in this synthetic model.
          </div>

        </div>
      )}

      {!predictionData && !isTraining && (
        <div className="flex flex-col items-center justify-center h-96 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
          <BrainCircuit className="text-slate-600 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-slate-400">Ready to Predict</h3>
          <p className="text-slate-500 mt-2 max-w-md text-center">
            Select a state above and click "Train & Predict" to generate a machine learning forecast for electricity consumption up to 2030.
          </p>
        </div>
      )}
    </div>
  );
};

export default Predictor;
